/* Ilustraciones del catálogo: un SVG por aplicación, alusivo a su tema.
   Se dibujan con clases (a-ln, a-ac, a-tx…) que toman los colores del tema y del área,
   así funcionan en modo claro y oscuro. Para una aplicación nueva: añada aquí una clave
   y póngala en el campo `art` de QE.apps (js/data.js). */
'use strict';

(function () {
  const S = (body) => `<svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${body}</svg>`;
  // punta de flecha reutilizable (id único por ilustración)
  const head = (id, cls = 'a-acf') => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="${cls}" d="M0 0 L10 5 L0 10 z"/></marker></defs>`;
  const axes = (x0, y0, x1, y1) => `<path class="a-ln" d="M${x0} ${y1} V${y0} H${x1}"/>`;
  // electrón: flecha con media punta (↑ o ↓)
  const spin = (x, y, up = true, cls = 'a-ac') => (up
    ? `<path class="${cls}" d="M${x} ${y + 10} V${y - 10} l5 6"/>`
    : `<path class="${cls}" d="M${x} ${y - 10} V${y + 10} l-5 -6"/>`);

  /* Tabla periódica: celdas ocupadas por periodo */
  function periodic() {
    const rows = [[1, 18], [1, 2, 13, 14, 15, 16, 17, 18], [1, 2, 13, 14, 15, 16, 17, 18]];
    const full = Array.from({ length: 18 }, (_, i) => i + 1);
    rows.push(full, full, full, full);
    let s = '';
    rows.forEach((cols, r) => cols.forEach((c) => {
      const x = 16 + (c - 1) * 16;
      const y = 14 + r * 16;
      const carbon = r === 1 && c === 14;
      const tm = c >= 3 && c <= 12;
      s += `<rect x="${x}" y="${y}" width="14" height="14" rx="2.5" class="${carbon ? 'a-acf' : tm ? 'a-soft' : 'a-cell'}"/>`;
    }));
    s += '<text x="231" y="41" class="a-tx" style="fill:var(--accent-ink);font-size:10px" text-anchor="middle">C</text>';
    return S(s);
  }

  /* Partículas del gas */
  function gas() {
    const pts = [[78, 70], [96, 98], [120, 64], [140, 104], [162, 78], [182, 96], [104, 82], [150, 60], [176, 66], [86, 110], [130, 86], [168, 112]];
    const dots = pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4" class="${i % 4 === 0 ? 'a-acf' : 'a-fl'}"/><path class="a-grid" d="M${x} ${y} l${(i % 3) * 6 - 6} ${(i % 2) * 8 - 4}"/>`).join('');
    return S(`${head('ah-gas')}
      <rect x="62" y="34" width="136" height="92" rx="4" class="a-ln"/>
      <rect x="64" y="40" width="132" height="10" rx="2" class="a-soft"/>
      <path class="a-ln" d="M130 40 V10"/>
      <path class="a-ac" d="M150 8 V30" marker-end="url(#ah-gas)"/>
      ${dots}
      <text x="214" y="70" class="a-tx" style="font-size:20px">PV</text>
      <text x="214" y="96" class="a-tx" style="font-size:20px">= nRT</text>
      <text x="214" y="118" class="a-tx">P · V · T</text>`);
  }

  window.QE = window.QE || {};
  QE.art = {
    /* ---------- RMN ---------- */
    rmn: S(`
      <path class="a-grid" d="M20 112 H300"/>
      <path class="a-ac a-dash" d="M40 92 C70 92 64 70 92 70 S118 50 150 50 S205 22 236 22 S270 14 296 14"/>
      <path class="a-ln" d="M20 112 H52 l2 -22 l2 22 l2 -62 l2 62 l2 -62 l2 62 l2 -22 l2 22 H118 l3 -36 l3 36 l3 -70 l3 70 l3 -36 l3 36 H218 l3 -88 l3 88 H262 l3 -28 l3 28 l3 -28 l3 28 H300"/>
      <text x="300" y="128" class="a-tx" text-anchor="end">δ (ppm)</text>
      <text x="58" y="128" class="a-tx" text-anchor="middle">4.1</text>
      <text x="130" y="128" class="a-tx" text-anchor="middle">2.3</text>
      <text x="221" y="128" class="a-tx" text-anchor="middle">1.2</text>
      <text x="24" y="22" class="a-tx" style="font-size:15px">¹H</text>`),

    /* ---------- Espectrometría de masas ---------- */
    masas: S(`
      <path class="a-ln" d="M30 116 H300"/>
      ${[[44, 22], [58, 38], [74, 14], [92, 54], [140, 30], [166, 46], [196, 16], [232, 62], [276, 28]]
        .map(([x, h]) => `<rect x="${x - 3}" y="${116 - h}" width="6" height="${h}" rx="1" class="a-fl"/>`).join('')}
      <rect x="114" y="18" width="7" height="98" rx="1" class="a-acf"/>
      <text x="117.5" y="130" class="a-tx" text-anchor="middle">43</text>
      <text x="276" y="80" class="a-tx" text-anchor="middle">M⁺·</text>
      <text x="300" y="130" class="a-tx" text-anchor="end">m/z</text>
      <text x="132" y="28" class="a-tx">pico base</text>`),

    /* ---------- Base de datos de espectros ---------- */
    msdatabase: S(`
      <ellipse cx="72" cy="30" rx="40" ry="12" class="a-soft"/>
      <path class="a-ln" d="M32 30 V106 A40 12 0 0 0 112 106 V30"/>
      <ellipse cx="72" cy="30" rx="40" ry="12" class="a-ln"/>
      <path class="a-ln" d="M32 56 A40 12 0 0 0 112 56 M32 82 A40 12 0 0 0 112 82"/>
      <rect x="136" y="14" width="160" height="32" rx="6" class="a-card"/>
      ${[150, 158, 166, 178, 190, 204, 222, 250, 276].map((x, i) => `<path class="a-ln" d="M${x} 40 V${40 - [8, 14, 6, 22, 10, 16, 4, 12, 7][i]}"/>`).join('')}
      <rect x="136" y="54" width="160" height="32" rx="6" class="a-card"/>
      <path class="a-ac" d="M146 60 H170 l3 16 l3 -16 H200 l2 8 l2 -8 H230 l3 20 l3 -20 H260 l2 10 l2 -10 H286"/>
      <rect x="136" y="94" width="160" height="32" rx="6" class="a-card"/>
      <path class="a-ln" d="M146 120 H178 l2 -14 l2 14 l2 -18 l2 18 H230 l2 -20 l2 20 H286"/>
      <text x="72" y="74" class="a-tx" text-anchor="middle">EM·IR·RMN</text>`),

    /* ---------- Mecanismos con flechas curvas ---------- */
    mecanismos: S(`${head('ah-mec')}
      <path class="a-ln" d="M196 78 L166 98 M196 78 L226 98"/>
      <path class="a-ln" d="M192 76 V44 M200 78 V44"/>
      <text x="196" y="36" class="a-tx" text-anchor="middle" style="font-size:16px">O</text>
      <circle cx="185" cy="26" r="1.8" class="a-fl"/><circle cx="185" cy="32" r="1.8" class="a-fl"/>
      <circle cx="207" cy="26" r="1.8" class="a-fl"/><circle cx="207" cy="32" r="1.8" class="a-fl"/>
      <text x="196" y="112" class="a-tx" text-anchor="middle">δ+</text>
      <text x="58" y="88" class="a-tx" style="font-size:18px">Nu</text>
      <text x="86" y="78" class="a-tx" style="font-size:12px">⁻</text>
      <circle cx="68" cy="68" r="1.8" class="a-fl"/><circle cx="76" cy="68" r="1.8" class="a-fl"/>
      <path class="a-ac" d="M76 62 C100 20 160 22 188 72" marker-end="url(#ah-mec)"/>
      <path class="a-ac" d="M204 60 C236 58 238 30 214 24" marker-end="url(#ah-mec)"/>
      <text x="262" y="122" class="a-tx" text-anchor="middle">adición</text>`),

    /* ---------- Tabla periódica ---------- */
    tabla: periodic(),

    /* ---------- Masa molar ---------- */
    masamolar: S(`
      <path class="a-ln" d="M160 30 V112 M132 116 H188 M160 30 L150 22 H170 Z"/>
      <path class="a-ln" d="M70 40 H250"/>
      <path class="a-ln" d="M84 40 L64 86 M84 40 L104 86 M236 40 L216 86 M236 40 L256 86"/>
      <path class="a-soft" d="M58 86 H110 Q84 104 58 86 Z"/>
      <path class="a-ln" d="M58 86 H110 Q84 104 58 86 Z M210 86 H262 Q236 104 210 86 Z"/>
      <circle cx="84" cy="72" r="8" class="a-acf"/>
      <circle cx="72" cy="80" r="5" class="a-card"/><circle cx="96" cy="80" r="5" class="a-card"/>
      <rect x="222" y="70" width="12" height="16" rx="2" class="a-fl"/><rect x="238" y="76" width="9" height="10" rx="2" class="a-fl"/>
      <text x="236" y="128" class="a-tx" text-anchor="middle">18.02 g/mol</text>
      <text x="84" y="128" class="a-tx" text-anchor="middle">H₂O</text>`),

    /* ---------- Indicador de pH ---------- */
    ph: S(`<defs><linearGradient id="g-ph" x1="0" x2="1">
        <stop offset="0" stop-color="#e5322d"/><stop offset=".2" stop-color="#f28c28"/><stop offset=".38" stop-color="#f4d03f"/>
        <stop offset=".52" stop-color="#3cb44b"/><stop offset=".72" stop-color="#2f6fd6"/><stop offset="1" stop-color="#6a3fb5"/></linearGradient></defs>
      <path class="a-ln" d="M150 10 V62 A10 10 0 0 0 170 62 V10"/>
      <path d="M152 38 V62 A8 8 0 0 0 168 62 V38 Z" fill="#3cb44b"/>
      <path class="a-ln" d="M146 10 H174"/>
      <rect x="30" y="92" width="260" height="16" rx="8" fill="url(#g-ph)"/>
      <path class="a-acf" d="M160 88 l-6 -9 h12 z"/>
      <text x="30" y="126" class="a-tx">0</text><text x="160" y="126" class="a-tx" text-anchor="middle">7</text><text x="290" y="126" class="a-tx" text-anchor="end">14</text>
      <text x="60" y="80" class="a-tx">ácido</text><text x="260" y="80" class="a-tx" text-anchor="end">básico</text>`),

    /* ---------- Visor molecular 3D ---------- */
    visor3d: S(`${head('ah-3d')}
      <path d="M276 84 A120 26 0 1 1 268 64" class="a-ac a-dash" marker-end="url(#ah-3d)"/>
      <path class="a-ln" style="stroke-width:5" d="M160 74 L160 24 M160 74 L112 100 M160 74 L210 102 M160 74 L188 58"/>
      <circle cx="188" cy="58" r="8" class="a-soft"/>
      <circle cx="160" cy="74" r="16" class="a-fl"/>
      <circle cx="160" cy="22" r="10" class="a-card"/><circle cx="110" cy="102" r="10" class="a-card"/><circle cx="212" cy="104" r="10" class="a-card"/>
      <text x="160" y="79" class="a-tx" text-anchor="middle" style="fill:var(--card)">C</text>
      <text x="60" y="30" class="a-tx">109.5°</text>`),

    /* ---------- Balanceador de ecuaciones ---------- */
    balanceador: S(`
      <text x="160" y="56" class="a-tx" text-anchor="middle" style="font-size:22px"><tspan style="fill:var(--accent)">2</tspan>H₂ + O₂ → <tspan style="fill:var(--accent)">2</tspan>H₂O</text>
      <path class="a-ln" d="M60 96 H260 M160 96 L146 122 H174 Z"/>
      <rect x="70" y="80" width="26" height="16" rx="3" class="a-soft"/><rect x="100" y="84" width="16" height="12" rx="3" class="a-soft"/>
      <rect x="214" y="80" width="26" height="16" rx="3" class="a-soft"/><rect x="198" y="84" width="16" height="12" rx="3" class="a-soft"/>
      <text x="160" y="22" class="a-tx" text-anchor="middle">masa conservada</text>`),

    /* ---------- Titulación ---------- */
    titulacion: S(`
      <rect x="54" y="8" width="12" height="70" rx="2" class="a-ln"/>
      <rect x="56" y="24" width="8" height="52" class="a-soft"/>
      <path class="a-ln" d="M60 78 V88 M52 84 H68"/>
      <path class="a-acf" d="M60 94 q-3 5 0 7 q3 -2 0 -7 z"/>
      <path class="a-ln" d="M52 104 V112 L36 130 H84 L68 112 V104"/>
      <path d="M42 124 L36 130 H84 L78 124 Z" fill="#d94a8c" opacity=".55"/>
      ${axes(130, 12, 300, 126)}
      <path class="a-ln" d="M136 114 C180 112 206 106 214 76 S232 28 296 24"/>
      <path class="a-ac a-dash" d="M214 126 V76"/><circle cx="214" cy="76" r="4" class="a-acf"/>
      <text x="138" y="22" class="a-tx">pH</text><text x="298" y="138" class="a-tx" text-anchor="end">V (mL)</text>`),

    /* ---------- Leyes de los gases ---------- */
    gases: gas(),

    /* ---------- Cinética química ---------- */
    cinetica: S(`
      ${axes(40, 14, 300, 120)}
      <path class="a-ln" d="M42 22 C90 92 160 112 296 116"/>
      <path class="a-ac" d="M42 118 C90 48 160 28 296 24"/>
      <path class="a-grid a-dash" d="M42 69 H86 V120"/>
      <text x="250" y="110" class="a-tx">[A]</text><text x="250" y="18" class="a-tx">[P]</text>
      <text x="86" y="134" class="a-tx" text-anchor="middle">t½</text><text x="300" y="134" class="a-tx" text-anchor="end">t</text>`),

    /* ---------- Estereoquímica R/S ---------- */
    estereo: S(`${head('ah-rs')}
      <path class="a-ln" d="M130 72 V26 M130 72 L84 84"/>
      <path class="a-fl" d="M130 72 L180 100 L174 108 Z"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<path class="a-ln" style="stroke-width:1.6" d="M${126 - i * 5} ${79 + i * 4} l${-4 - i * 1.2} ${2 + i * 0.4}"/>`).join('')}
      <text x="130" y="20" class="a-tx" text-anchor="middle">OH</text>
      <text x="72" y="90" class="a-tx" text-anchor="middle">CH₃</text>
      <text x="190" y="118" class="a-tx">C₂H₅</text>
      <text x="90" y="124" class="a-tx" text-anchor="middle">H</text>
      <circle cx="130" cy="72" r="3" class="a-fl"/>
      <path class="a-ac" d="M246 40 A30 30 0 1 1 222 54" marker-end="url(#ah-rs)"/>
      <text x="250" y="78" class="a-tx" text-anchor="middle" style="font-size:24px;fill:var(--accent)">R</text>`),

    /* ---------- Nomenclatura IUPAC ---------- */
    nomenclatura: S(`
      <path class="a-ln" d="M40 92 L80 68 L120 92 L160 68 L200 92 L240 68"/>
      <path class="a-ac" d="M80 68 V36"/>
      <text x="80" y="30" class="a-tx" text-anchor="middle" style="fill:var(--accent);font-size:13px">OH</text>
      ${[[40, 92], [80, 68], [120, 92], [160, 68], [200, 92], [240, 68]].map(([x, y], i) => `<circle cx="${x}" cy="${y + (i % 2 ? -12 : 14)}" r="8" class="a-soft"/><text x="${x}" y="${y + (i % 2 ? -8 : 18)}" class="a-tx" text-anchor="middle" style="font-size:10px">${i + 1}</text>`).join('')}
      <text x="296" y="128" class="a-tx" text-anchor="end" style="font-size:15px">hexan-<tspan style="fill:var(--accent)">2</tspan>-ol</text>`),

    /* ---------- Campo cristalino ---------- */
    campo: S(`${head('ah-cc')}
      ${[0, 1, 2, 3, 4].map((i) => `<path class="a-ln" d="M${24 + i * 18} 72 h14"/>`).join('')}
      <text x="64" y="94" class="a-tx" text-anchor="middle">d (ion libre)</text>
      <path class="a-grid a-dash" d="M114 72 L176 38 M114 72 L176 104"/>
      <path class="a-ln" d="M180 38 h20 M208 38 h20"/>
      <path class="a-ln" d="M172 104 h18 M196 104 h18 M220 104 h18"/>
      ${spin(181, 104)}${spin(205, 104)}${spin(229, 104)}
      <text x="244" y="42" class="a-tx">e<tspan dy="4" style="font-size:8px">g</tspan></text>
      <text x="244" y="108" class="a-tx">t<tspan dy="4" style="font-size:8px">2g</tspan></text>
      <path class="a-ac" d="M282 96 V46" marker-end="url(#ah-cc)" marker-start="url(#ah-cc)"/>
      <text x="290" y="76" class="a-tx" style="fill:var(--accent);font-size:14px">Δₒ</text>`),

    /* ---------- Cinética enzimática ---------- */
    enzimas: S(`
      ${axes(40, 12, 300, 120)}
      <path class="a-ac a-dash" d="M40 28 H300"/>
      <path class="a-ln" d="M42 118 C66 64 110 44 296 32"/>
      <path class="a-grid a-dash" d="M40 74 H78 V120"/>
      <text x="296" y="22" class="a-tx" text-anchor="end" style="fill:var(--accent)">Vmax</text>
      <text x="78" y="134" class="a-tx" text-anchor="middle">Km</text>
      <text x="26" y="20" class="a-tx">v</text><text x="300" y="134" class="a-tx" text-anchor="end">[S]</text>
      <text x="140" y="96" class="a-tx">E + S ⇌ ES → E + P</text>`),

    /* ---------- Espectroscopía IR ---------- */
    ir: S(`
      <path class="a-grid" d="M24 26 H300"/>
      <path class="a-ln" d="M24 28 H50 C58 28 58 64 70 64 S80 30 92 30 H118 l3 26 l3 -24 l3 20 l3 -22 H160 l3 10 l3 -10 H196 l4 70 l4 -70 H214 l3 30 l3 -28 H236 l3 46 l3 -44 H252 l3 18 l3 -18 l3 56 l3 -54 H282 l3 30 l3 -28 H300"/>
      <circle cx="200" cy="100" r="4" class="a-acf"/>
      <text x="206" y="116" class="a-tx" style="fill:var(--accent)">C=O 1715</text>
      <text x="64" y="84" class="a-tx" text-anchor="middle">O–H</text>
      <text x="124" y="70" class="a-tx" text-anchor="middle">C–H</text>
      <text x="24" y="134" class="a-tx">4000</text><text x="300" y="134" class="a-tx" text-anchor="end">400 cm⁻¹</text>`),

    /* ---------- Calidad del agua ---------- */
    agua: S(`
      <path class="a-soft" d="M84 14 C104 46 120 66 120 86 a36 36 0 0 1 -72 0 C48 66 64 46 84 14 Z"/>
      <path class="a-ln" d="M84 14 C104 46 120 66 120 86 a36 36 0 0 1 -72 0 C48 66 64 46 84 14 Z"/>
      <path class="a-ln" d="M64 92 a20 20 0 0 0 14 18"/>
      <text x="84" y="80" class="a-tx" text-anchor="middle">H₂O</text>
      <path class="a-ac" d="M150 112 q15 -10 30 0 t30 0 t30 0 t30 0"/>
      ${[['O₂', 62], ['pH', 44], ['DBO', 26]].map(([t, h], i) => `<rect x="${168 + i * 42}" y="${92 - h}" width="22" height="${h}" rx="3" class="${i === 0 ? 'a-acf' : 'a-fl'}"/><text x="${179 + i * 42}" y="${86 - h}" class="a-tx" text-anchor="middle">${t}</text>`).join('')}`),

    /* ---------- Orbitales moleculares ---------- */
    orbitales: S(`
      <path class="a-ln" d="M32 72 h40 M248 72 h40"/>
      <path class="a-ln" d="M140 32 h40 M140 112 h40"/>
      <path class="a-grid a-dash" d="M72 72 L140 32 M72 72 L140 112 M248 72 L180 32 M248 72 L180 112"/>
      ${spin(52, 72, true, 'a-ln')}${spin(268, 72, true, 'a-ln')}
      ${spin(150, 112)}${spin(170, 112, false)}
      <text x="160" y="24" class="a-tx" text-anchor="middle">σ*</text>
      <text x="160" y="132" class="a-tx" text-anchor="middle">σ</text>
      <text x="52" y="94" class="a-tx" text-anchor="middle">1s</text><text x="268" y="94" class="a-tx" text-anchor="middle">1s</text>
      <text x="300" y="132" class="a-tx" text-anchor="end">orden = 1</text>`),
  };
})();
