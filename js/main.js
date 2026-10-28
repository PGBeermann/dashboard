/* QuímicaEduc — interacción de la página */
'use strict';

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bySym = Object.fromEntries(QE.elements.map((e) => [e.sym, e]));
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sub = (d) => String(d).replace(/\d/g, (c) => SUB[c]);
  const sup = (d) => String(d).replace(/[-\d]/g, (c) => SUP[c]);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fmt = (n, d) => n.toLocaleString('es-PA', { minimumFractionDigits: d, maximumFractionDigits: d });
  const storage = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {
        /* sin almacenamiento: no pasa nada */
      }
    },
  };

  /* ---------- Tema claro / oscuro ---------- */
  const root = document.documentElement;
  const saved = storage.get('qe-theme');
  if (saved === 'dark' || saved === 'light') root.dataset.theme = saved;
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  const themeBtn = $('#themeToggle');
  const paintThemeIcon = () => {
    themeBtn.innerHTML = isDark()
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/></svg>';
  };
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    storage.set('qe-theme', root.dataset.theme);
    paintThemeIcon();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', paintThemeIcon);
  paintThemeIcon();

  /* ---------- Navegación ---------- */
  const topbar = $('#topbar');
  const nav = $('#nav');
  const menuBtn = $('#menuBtn');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar el menú' : 'Abrir el menú');
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
  const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // Enlace activo según la sección visible
  const links = new Map($$('a', nav).map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          links.forEach((a) => a.classList.remove('is-active'));
          links.get(en.target.id)?.classList.add('is-active');
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    links.forEach((_, id) => {
      const s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  /* ---------- Cinta de constantes físicas ---------- */
  const constants = [
    ['N<sub>A</sub>', '6.022 × 10²³ mol⁻¹', 'constante de Avogadro'],
    ['R', '8.314 J·mol⁻¹·K⁻¹', 'constante de los gases'],
    ['h', '6.626 × 10⁻³⁴ J·s', 'constante de Planck'],
    ['F', '96 485 C·mol⁻¹', 'constante de Faraday'],
    ['c', '2.998 × 10⁸ m·s⁻¹', 'velocidad de la luz'],
    ['k<sub>B</sub>', '1.381 × 10⁻²³ J·K⁻¹', 'constante de Boltzmann'],
    ['e', '1.602 × 10⁻¹⁹ C', 'carga elemental'],
    ['K<sub>w</sub>', '1.0 × 10⁻¹⁴', 'producto iónico del agua (25 °C)'],
    ['V<sub>m</sub>', '22.414 L·mol⁻¹', 'volumen molar (0 °C, 1 atm)'],
  ];
  const tick = constants.map(([s, v, n]) => `<span><b>${s} = ${v}</b> · ${n}</span>`).join('');
  $('#ticker').innerHTML = tick + tick;

  /* ---------- Masa molar (compartida por el visor y la calculadora) ---------- */
  function parseFormula(input) {
    const s = String(input).replace(/\s+/g, '').replace(/[₀-₉]/g, (c) => SUB.indexOf(c));
    if (!s) throw new Error('Escribe una fórmula, por ejemplo H2SO4.');
    const total = new Map();
    for (const part of s.split(/[·•*.]/)) {
      if (!part) throw new Error('Falta la fórmula a un lado del punto del hidrato.');
      const m = /^(\d+)(.+)$/.exec(part);
      const mult = m ? Number(m[1]) : 1;
      for (const [el, n] of parseGroup(m ? m[2] : part)) total.set(el, (total.get(el) || 0) + n * mult);
    }
    return total;
  }
  function parseGroup(s) {
    const stack = [new Map()];
    let i = 0;
    const readNum = () => {
      let n = '';
      while (/\d/.test(s[i] || '')) n += s[i++];
      return n ? Number(n) : 1;
    };
    while (i < s.length) {
      const c = s[i];
      if ('([{'.includes(c)) {
        stack.push(new Map());
        i++;
      } else if (')]}'.includes(c)) {
        if (stack.length < 2) throw new Error('Hay un paréntesis que se cierra sin haberse abierto.');
        const g = stack.pop();
        i++;
        const k = readNum();
        const top = stack[stack.length - 1];
        for (const [el, n] of g) top.set(el, (top.get(el) || 0) + n * k);
      } else if (/[A-Z]/.test(c)) {
        let sym = c;
        i++;
        if (/[a-z]/.test(s[i] || '') && bySym[sym + s[i]]) sym += s[i++];
        else if (/[a-z]/.test(s[i] || '')) throw new Error(`«${sym}${s[i]}» no es el símbolo de un elemento.`);
        if (!bySym[sym]) throw new Error(`«${sym}» no es el símbolo de un elemento.`);
        const top = stack[stack.length - 1];
        top.set(sym, (top.get(sym) || 0) + readNum());
      } else if (/[a-z]/.test(c)) {
        throw new Error(`Los símbolos empiezan con mayúscula: escribe «${c.toUpperCase()}» en lugar de «${c}».`);
      } else {
        throw new Error(`El carácter «${c}» no se puede usar en una fórmula.`);
      }
    }
    if (stack.length > 1) throw new Error('Falta cerrar un paréntesis.');
    return stack[0];
  }
  const molarMass = (counts) => [...counts].reduce((a, [el, n]) => a + bySym[el].mass * n, 0);
  const prettyFormula = (s) =>
    String(s)
      .replace(/[*.•]/g, '·')
      .replace(/([A-Za-z)\]}])(\d+)/g, (m, a, d) => a + sub(d));

  /* ---------- Visor molecular 3D ---------- */
  (function viewer() {
    const canvas = $('#molCanvas');
    const ctx = canvas.getContext('2d');
    const hint = $('#molHint');
    const picker = $('#molPicker');
    const STYLE = {
      H: { r: 0.3, c: ['#ffffff', '#c9d2de'] },
      C: { r: 0.46, c: ['#8d97a6', '#3b4350'] },
      N: { r: 0.44, c: ['#7aa2ff', '#2747c4'] },
      O: { r: 0.43, c: ['#ff8080', '#c41e2a'] },
    };
    let mol = null;
    let atoms = [];
    let ax = 0.45;
    let ay = 0.6;
    let vx = 0;
    let vy = reduceMotion ? 0 : 0.006;
    let dragging = false;
    let grow = 1;
    let visible = true;
    let W = 0;
    let H = 0;
    let dpr = 1;

    function load(m) {
      mol = m;
      const n = m.atoms.length;
      const c = [0, 1, 2].map((k) => m.atoms.reduce((a, at) => a + at[k + 1], 0) / n);
      atoms = m.atoms.map(([el, x, y, z]) => ({ el, x: x - c[0], y: y - c[1], z: z - c[2] }));
      grow = reduceMotion ? 1 : 0.55;
      $('#molName').textContent = m.name;
      $('#molFormula').textContent = m.display || prettyFormula(m.formula);
      $('#molMass').textContent = `${fmt(molarMass(parseFormula(m.formula)), 3)} g/mol`;
      $('#molGeom').textContent = m.geom;
      $('#molAngle').textContent = m.angle;
      $$('button', picker).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === m.id)));
      if (reduceMotion) draw();
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      draw();
    }

    function draw() {
      if (!mol || !W) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const extent = Math.max(1.9, Math.max(...atoms.map((a) => Math.hypot(a.x, a.y, a.z))) + 0.55);
      const scale = (Math.min(W, H) / (2 * extent)) * 0.86 * grow;
      const D = 9;
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      const P = atoms.map((a) => {
        const x1 = a.x * cy + a.z * sy;
        const z1 = -a.x * sy + a.z * cy;
        const y2 = a.y * cx - z1 * sx;
        const z2 = a.y * sx + z1 * cx;
        const p = D / (D - z2);
        return { el: a.el, X: W / 2 + x1 * scale * p, Y: H / 2 - y2 * scale * p, z: z2, p };
      });
      const items = [
        ...P.map((a, i) => ({ kind: 'atom', z: a.z, i })),
        ...mol.bonds.map(([i, j, o]) => ({ kind: 'bond', z: (P[i].z + P[j].z) / 2 - 0.01, i, j, o })),
      ].sort((a, b) => a.z - b.z);
      for (const it of items) {
        if (it.kind === 'bond') {
          const a = P[it.i];
          const b = P[it.j];
          const dx = b.X - a.X;
          const dy = b.Y - a.Y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;
          const w = 0.12 * scale * ((a.p + b.p) / 2);
          const offs = it.o === 2 ? [-1.1, 1.1] : [0];
          ctx.lineCap = 'round';
          for (const o of offs) {
            const ox = nx * o * w;
            const oy = ny * o * w;
            const mx = (a.X + b.X) / 2 + ox;
            const my = (a.Y + b.Y) / 2 + oy;
            ctx.lineWidth = it.o === 2 ? w * 0.85 : w;
            ctx.strokeStyle = STYLE[a.el].c[1];
            ctx.beginPath();
            ctx.moveTo(a.X + ox, a.Y + oy);
            ctx.lineTo(mx, my);
            ctx.stroke();
            ctx.strokeStyle = STYLE[b.el].c[1];
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(b.X + ox, b.Y + oy);
            ctx.stroke();
          }
        } else {
          const a = P[it.i];
          const st = STYLE[a.el];
          const r = st.r * scale * a.p;
          const g = ctx.createRadialGradient(a.X - r * 0.35, a.Y - r * 0.4, r * 0.1, a.X, a.Y, r);
          g.addColorStop(0, st.c[0]);
          g.addColorStop(1, st.c[1]);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(a.X, a.Y, r, 0, Math.PI * 2);
          ctx.fill();
          if (a.el !== 'H' && r > 11) {
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.font = `700 ${Math.round(r * 0.7)}px 'Bricolage Grotesque', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(a.el, a.X, a.Y + 1);
          }
        }
      }
    }

    function frame() {
      if (visible && !document.hidden) {
        if (!dragging) {
          ay += vy;
          ax += vx;
          // La inercia se apaga hasta volver al giro automático suave
          vx *= 0.94;
          vy = vy * 0.96 + (reduceMotion ? 0 : 0.006) * 0.04;
        }
        if (grow < 1) grow = Math.min(1, grow + (1 - grow) * 0.12 + 0.004);
        draw();
      }
      requestAnimationFrame(frame);
    }

    // Arrastre con ratón o dedo
    let last = null;
    canvas.addEventListener('pointerdown', (e) => {
      dragging = true;
      last = [e.clientX, e.clientY];
      canvas.setPointerCapture(e.pointerId);
      hint.classList.add('is-gone');
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - last[0];
      const dy = e.clientY - last[1];
      last = [e.clientX, e.clientY];
      vy = dx * 0.01;
      vx = dy * 0.01;
      ay += vy;
      ax += vx;
      if (reduceMotion) draw();
    });
    const stop = () => (dragging = false);
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    canvas.addEventListener('keydown', (e) => {
      const k = { ArrowLeft: [0, -0.15], ArrowRight: [0, 0.15], ArrowUp: [-0.15, 0], ArrowDown: [0.15, 0] }[e.key];
      if (!k) return;
      e.preventDefault();
      ax += k[0];
      ay += k[1];
      hint.classList.add('is-gone');
      draw();
    });

    picker.innerHTML = QE.molecules.map((m) => `<button type="button" data-id="${m.id}" aria-pressed="false">${esc(m.name)}</button>`).join('');
    picker.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      load(QE.molecules.find((m) => m.id === b.dataset.id));
      if (!reduceMotion) vy = 0.08; // pequeño giro al cambiar de molécula
    });

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(canvas);
    load(QE.molecules[0]);
    resize();
    if (!reduceMotion) requestAnimationFrame(frame);
  })();

  /* ---------- Áreas y catálogo ---------- */
  const areaById = Object.fromEntries(QE.areas.map((a) => [a.id, a]));
  const state = { area: null, level: 'todos', q: '' };
  const countFor = (id) => QE.apps.filter((a) => a.areas.includes(id)).length;

  const areaGrid = $('#areaGrid');
  areaGrid.innerHTML = QE.areas
    .map(
      (a) => `<button type="button" class="area reveal" style="--h:${a.h}" data-area="${a.id}" aria-label="${esc(a.name)}: ${countFor(a.id)} aplicaciones. Ver en el catálogo">
        <span class="area__orbit" aria-hidden="true"></span>
        <span class="area__top"><span class="area__count">${countFor(a.id)}</span><span>apps</span></span>
        <span class="area__sym">${a.sym}</span>
        <span class="area__name">${esc(a.name)}</span>
        <span class="area__text">${esc(a.text)}</span>
      </button>`,
    )
    .join('') +
    // Ficha vacía: el "elemento por descubrir" invita a proponer un área
    `<a class="area area--new reveal" href="#docentes" style="--h:220">
      <span class="area__top"><span class="area__count">?</span><span>apps</span></span>
      <span class="area__sym">+</span>
      <span class="area__name">Por descubrir</span>
      <span class="area__text">¿Falta un tema de tu curso? Propón una aplicación.</span>
    </a>`;
  // Inclinación 3D de las fichas al mover el cursor
  if (!reduceMotion) {
    $$('.area', areaGrid).forEach((t) => {
      t.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        t.style.setProperty('--ry', `${px * 12}deg`);
        t.style.setProperty('--rx', `${-py * 12}deg`);
      });
      t.addEventListener('pointerleave', () => {
        t.style.removeProperty('--rx');
        t.style.removeProperty('--ry');
      });
    });
  }
  areaGrid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-area]');
    if (!b) return;
    state.area = b.dataset.area;
    renderApps();
    $('#apps').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  const chips = $('#areaChips');
  chips.innerHTML =
    `<button type="button" class="chip" data-chip="" aria-pressed="true"><span class="chip__sym" style="--h:220">∗</span>Todas</button>` +
    QE.areas.map((a) => `<button type="button" class="chip" style="--h:${a.h}" data-chip="${a.id}" aria-pressed="false"><span class="chip__sym">${a.sym}</span>${esc(a.name)}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    state.area = b.dataset.chip || null;
    renderApps();
  });
  $$('.seg__btn').forEach((b) =>
    b.addEventListener('click', () => {
      state.level = b.dataset.level;
      $$('.seg__btn').forEach((x) => {
        x.classList.toggle('is-on', x === b);
        x.setAttribute('aria-pressed', String(x === b));
      });
      renderApps();
    }),
  );
  $('#appSearch').addEventListener('input', (e) => {
    state.q = e.target.value;
    renderApps();
  });

  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function renderApps() {
    $$('[data-chip]', chips).forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.chip || null) === state.area)));
    const q = norm(state.q.trim());
    const list = QE.apps
      .filter((a) => !state.area || a.areas.includes(state.area))
      .filter((a) => state.level === 'todos' || a.levels.includes(state.level))
      .filter((a) => !q || norm([a.name, a.text, ...a.tags, ...a.areas.map((x) => areaById[x].name)].join(' ')).includes(q))
      .sort((a, b) => (a.status === b.status ? 0 : a.status === 'disponible' ? -1 : 1));
    const live = list.filter((a) => a.status === 'disponible').length;
    $('#appCount').textContent = `${list.length} ${list.length === 1 ? 'aplicación' : 'aplicaciones'} · ${live} ${live === 1 ? 'disponible' : 'disponibles'}`;
    $('#appEmpty').hidden = list.length > 0;
    $('#appGrid').innerHTML = list
      .map((a, i) => {
        const external = /^https?:/.test(a.url || '');
        const foot =
          a.status === 'disponible'
            ? `<a class="app__open" href="${esc(a.url)}"${external ? ' target="_blank" rel="noopener"' : ''}>${external ? 'Abrir aplicación' : 'Probar aquí'} <span aria-hidden="true">→</span></a>`
            : '<span class="app__soon">Próximamente</span>';
        const art = a.art && QE.art && QE.art[a.art]
          ? `<div class="app__art" style="--h:${areaById[a.areas[0]].h}">${QE.art[a.art]}</div>`
          : '';
        return `<article class="app${a.status === 'disponible' ? ' app--live' : ''}" style="animation-delay:${Math.min(i, 8) * 40}ms">
          ${art}
          <div class="app__areas">${a.areas.map((x) => `<span class="chip__sym" style="--h:${areaById[x].h}" title="${esc(areaById[x].name)}">${areaById[x].sym}</span>`).join('')}
            ${a.status === 'disponible' ? '<span class="app__live">disponible</span>' : ''}</div>
          <h3>${esc(a.name)}</h3>
          <p class="app__text">${esc(a.text)}</p>
          <div class="app__tags">${a.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
          <div class="app__foot"><span class="app__levels">${a.levels.map((l) => (l === 'colegio' ? 'Colegio' : 'Universidad')).join(' · ')}</span>${foot}</div>
        </article>`;
      })
      .join('');
  }
  renderApps();

  /* ---------- Calculadora de masa molar ---------- */
  (function molarCalc() {
    const input = $('#mmInput');
    const examples = ['H2O', 'C6H12O6', 'Ca(OH)2', 'H2SO4', 'CuSO4·5H2O', 'K4[Fe(CN)6]', 'C8H10N4O2'];
    $('#mmExamples').innerHTML = examples.map((x) => `<button type="button" data-f="${x}">${prettyFormula(x)}</button>`).join('');
    $('#mmExamples').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      input.value = b.dataset.f;
      update();
    });
    let shown = 0;
    let anim = 0;
    function countTo(v) {
      cancelAnimationFrame(anim);
      if (reduceMotion) {
        $('#mmTotal').textContent = fmt(v, 2);
        shown = v;
        return;
      }
      const from = shown;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 450);
        const e = 1 - (1 - k) ** 3;
        shown = from + (v - from) * e;
        $('#mmTotal').textContent = fmt(shown, 2);
        if (k < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    }
    function update() {
      const err = $('#mmError');
      try {
        const counts = parseFormula(input.value);
        const total = molarMass(counts);
        err.hidden = true;
        $('#mmPretty').textContent = prettyFormula(input.value.replace(/\s+/g, ''));
        countTo(total);
        $('#mmBody').innerHTML = [...counts]
          .map(([el, n]) => {
            const m = bySym[el].mass * n;
            const pct = (m / total) * 100;
            return `<tr><td>${esc(bySym[el].name)} (${el})</td><td>${n}</td><td>${fmt(m, 3)}</td><td><span class="bar" style="width:${Math.max(2, pct * 0.6)}px"></span>${fmt(pct, 2)} %</td></tr>`;
          })
          .join('');
      } catch (e) {
        err.textContent = e.message;
        err.hidden = false;
      }
    }
    input.addEventListener('input', update);
    update();
  })();

  /* ---------- Indicador universal de pH ---------- */
  (function phTool() {
    const stops = [
      [0, [215, 38, 61]],
      [2, [244, 96, 54]],
      [4, [247, 179, 43]],
      [5.6, [233, 227, 74]],
      [7, [76, 185, 68]],
      [8.4, [46, 158, 143]],
      [10, [43, 108, 196]],
      [12, [61, 52, 139]],
      [14, [106, 27, 154]],
    ];
    const colorAt = (ph) => {
      for (let i = 1; i < stops.length; i++) {
        if (ph <= stops[i][0]) {
          const [p0, c0] = stops[i - 1];
          const [p1, c1] = stops[i];
          const t = (ph - p0) / (p1 - p0);
          return c0.map((v, k) => Math.round(v + (c1[k] - v) * t));
        }
      }
      return stops[stops.length - 1][1];
    };
    const sci = (exp10) => {
      const e = Math.floor(exp10);
      const m = 10 ** (exp10 - e);
      return `${fmt(m, 1)} × 10${sup(e)} mol/L`;
    };
    // Burbujas que suben dentro del matraz
    $('#phBubbles').innerHTML = Array.from({ length: 9 }, (_, i) => {
      const x = 46 + ((i * 37) % 70);
      const r = 2 + (i % 3);
      return `<circle cx="${x}" cy="${178 - (i % 4) * 6}" r="${r}" style="animation-delay:${(i * 0.37).toFixed(2)}s"></circle>`;
    }).join('');
    const slider = $('#phSlider');
    function update() {
      const ph = Number(slider.value);
      const [r, g, b] = colorAt(ph);
      $('#phLiquid').style.fill = `rgb(${r} ${g} ${b})`;
      $('#phWave').style.fill = `rgb(${Math.min(255, r + 35)} ${Math.min(255, g + 35)} ${Math.min(255, b + 35)})`;
      $('#phValue').textContent = fmt(ph, 1);
      const kind = ph < 7 ? (ph < 3 ? 'Muy ácida' : 'Ácida') : ph > 7 ? (ph > 11 ? 'Muy básica' : 'Básica') : 'Neutra';
      $('#phKind').textContent = kind;
      $('#phKind').style.color = `rgb(${r} ${g} ${b})`;
      $('#phH').textContent = sci(-ph);
      $('#phOH').textContent = sci(ph - 14);
      $('#phPOH').textContent = fmt(14 - ph, 1);
      const near = QE.phExamples.reduce((a, x) => (Math.abs(x[0] - ph) < Math.abs(a[0] - ph) ? x : a));
      $('#phExample').textContent = `Parecido a: ${near[1]} (pH ${fmt(near[0], 1)}) · valores a 25 °C`;
    }
    slider.addEventListener('input', update);
    update();
  })();

  /* ---------- Tabla periódica ---------- */
  (function periodicTable() {
    const grid = $('#ptGrid');
    grid.setAttribute('role', 'group');
    const pos = (z) => {
      if (z === 1) return [1, 1];
      if (z === 2) return [1, 18];
      if (z <= 4) return [2, z - 2];
      if (z <= 10) return [2, z + 8];
      if (z <= 12) return [3, z - 10];
      if (z <= 18) return [3, z];
      if (z <= 36) return [4, z - 18];
      if (z <= 54) return [5, z - 36];
      if (z <= 56) return [6, z - 54];
      if (z <= 71) return [9, z - 54];
      if (z <= 86) return [6, z - 68];
      if (z <= 88) return [7, z - 86];
      if (z <= 103) return [10, z - 86];
      return [7, z - 100];
    };
    const ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
    const CAP = { s: 2, p: 6, d: 10, f: 14 };
    const CORES = [[86, 'Rn'], [54, 'Xe'], [36, 'Kr'], [18, 'Ar'], [10, 'Ne'], [2, 'He']];
    // Excepciones a la regla de Madelung (capa de valencia tras el gas noble)
    const EXC = {
      24: '4s1 3d5', 29: '4s1 3d10', 41: '5s1 4d4', 42: '5s1 4d5', 44: '5s1 4d7', 45: '5s1 4d8', 46: '4d10', 47: '5s1 4d10',
      57: '6s2 5d1', 58: '6s2 4f1 5d1', 64: '6s2 4f7 5d1', 78: '6s1 4f14 5d9', 79: '6s1 4f14 5d10',
      89: '7s2 6d1', 90: '7s2 6d2', 91: '7s2 5f2 6d1', 92: '7s2 5f3 6d1', 93: '7s2 5f4 6d1', 96: '7s2 5f7 6d1', 103: '7s2 5f14 7p1',
    };
    const supCfg = (txt) => txt.replace(/([spdf])(\d+)/g, (m, l, n) => l + sup(n));
    function config(z) {
      const core = CORES.find(([n]) => n < z);
      let valence;
      if (EXC[z]) valence = EXC[z];
      else {
        let left = z;
        const parts = [];
        for (const sh of ORDER) {
          if (left <= 0) break;
          const n = Math.min(CAP[sh[1]], left);
          parts.push(sh + n);
          left -= n;
        }
        // Se quitan las subcapas del gas noble interno
        let coreLeft = core ? core[0] : 0;
        while (coreLeft > 0) coreLeft -= Number(parts.shift().slice(2));
        valence = parts.join(' ');
      }
      return `${core ? `[${core[1]}] ` : ''}${supCfg(valence)}${z >= 104 ? ' (predicha)' : ''}`;
    }
    const groupOf = (z) => {
      const [row, col] = pos(z);
      return row >= 9 ? 'f' : String(col);
    };
    const periodOf = (z) => {
      const [row] = pos(z);
      return row === 9 ? 6 : row === 10 ? 7 : row;
    };
    const massTxt = (e) => (e.unstable ? `[${e.mass}]` : String(e.mass));

    grid.innerHTML =
      QE.elements
        .map((e, i) => {
          const [row, col] = pos(e.z);
          const cat = QE.categoryOf(e.z);
          return `<button type="button" class="el" data-z="${e.z}" data-cat="${cat}" style="grid-row:${row};grid-column:${col};--h:${QE.categories[cat].h};--i:${i}" aria-label="${esc(e.name)}, número atómico ${e.z}">
            <span class="el__z">${e.z}</span><span class="el__s">${e.sym}</span></button>`;
        })
        .join('') +
      `<span class="pt__gap" style="grid-row:6;grid-column:3">57–71</span><span class="pt__gap" style="grid-row:7;grid-column:3">89–103</span>`;

    function select(z, animate = true) {
      const e = QE.elements[z - 1];
      const cat = QE.categoryOf(z);
      $$('.el.is-sel', grid).forEach((x) => x.classList.remove('is-sel'));
      $(`.el[data-z="${z}"]`, grid)?.classList.add('is-sel');
      const tile = $('#ptTile');
      tile.style.setProperty('--h', QE.categories[cat].h);
      if (animate && !reduceMotion) {
        tile.classList.remove('flip');
        void tile.offsetWidth;
        tile.classList.add('flip');
      }
      $('#ptZ').textContent = e.z;
      $('#ptSym').textContent = e.sym;
      $('#ptMass').textContent = massTxt(e);
      $('#ptName').textContent = e.name;
      $('#ptCat').textContent = QE.categories[cat].name;
      $('#ptZ2').textContent = e.z;
      $('#ptMass2').textContent = `${massTxt(e)} u${e.unstable ? ' (isótopo más estable)' : ''}`;
      $('#ptPos').textContent = `${periodOf(z)} · ${groupOf(z) === 'f' ? 'bloque f' : groupOf(z)}`;
      $('#ptConf').textContent = config(z);
    }
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('.el');
      if (b) select(Number(b.dataset.z));
    });
    select(6, false);

    // Leyenda: resalta una familia
    const legend = $('#ptLegend');
    legend.innerHTML = Object.entries(QE.categories)
      .map(([id, c]) => `<li tabindex="0" data-cat="${id}" style="--h:${c.h}">${esc(c.name)}</li>`)
      .join('');
    const highlight = (cat) => {
      grid.classList.toggle('is-dim', Boolean(cat));
      $$('.el', grid).forEach((x) => x.classList.toggle('is-match', x.dataset.cat === cat));
    };
    legend.addEventListener('pointerover', (e) => highlight(e.target.closest('li')?.dataset.cat || null));
    legend.addEventListener('pointerleave', () => highlight(null));
    legend.addEventListener('focusin', (e) => highlight(e.target.dataset.cat));
    legend.addEventListener('focusout', () => highlight(null));
  })();

  /* ---------- Copiar correo ---------- */
  $('#copyMail').addEventListener('click', async () => {
    const addr = $('#mailAddr').textContent.trim();
    const ok = $('#mailOk');
    try {
      await navigator.clipboard.writeText(addr);
      ok.textContent = 'Correo copiado. Pégalo en tu programa de correo.';
    } catch {
      const r = document.createRange();
      r.selectNodeContents($('#mailAddr'));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
      ok.textContent = 'Correo seleccionado: cópialo con Ctrl+C (o ⌘+C).';
    }
  });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Desplazamiento suave al entrar en pantalla ---------- */
  // El contenido siempre está visible; sólo lo que empieza fuera de la pantalla se desliza al aparecer.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    $$('.section__head, .tool, .step, .pt-layout, .docentes, .faq__list').forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.remove('is-below');
            io.unobserve(en.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    $$('.reveal').forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('is-below');
        io.observe(el);
      }
    });
  }
})();
