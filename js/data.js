/* Datos de QuímicaEduc: elementos, áreas temáticas, catálogo de aplicaciones y moléculas del visor.
   Para agregar una aplicación basta con añadir un objeto a QE.apps. */
'use strict';

window.QE = {};

/* Elementos: símbolo|nombre|masa atómica estándar (IUPAC, redondeada).
   Los elementos sin isótopos estables llevan la masa del isótopo más estable (se muestra entre corchetes). */
QE.elements = `H|Hidrógeno|1.008;He|Helio|4.0026;Li|Litio|6.94;Be|Berilio|9.0122;B|Boro|10.81;C|Carbono|12.011;N|Nitrógeno|14.007;O|Oxígeno|15.999;F|Flúor|18.998;Ne|Neón|20.180;
Na|Sodio|22.990;Mg|Magnesio|24.305;Al|Aluminio|26.982;Si|Silicio|28.085;P|Fósforo|30.974;S|Azufre|32.06;Cl|Cloro|35.45;Ar|Argón|39.948;K|Potasio|39.098;Ca|Calcio|40.078;
Sc|Escandio|44.956;Ti|Titanio|47.867;V|Vanadio|50.942;Cr|Cromo|51.996;Mn|Manganeso|54.938;Fe|Hierro|55.845;Co|Cobalto|58.933;Ni|Níquel|58.693;Cu|Cobre|63.546;Zn|Zinc|65.38;
Ga|Galio|69.723;Ge|Germanio|72.630;As|Arsénico|74.922;Se|Selenio|78.971;Br|Bromo|79.904;Kr|Kriptón|83.798;Rb|Rubidio|85.468;Sr|Estroncio|87.62;Y|Itrio|88.906;Zr|Circonio|91.224;
Nb|Niobio|92.906;Mo|Molibdeno|95.95;Tc|Tecnecio|[98];Ru|Rutenio|101.07;Rh|Rodio|102.91;Pd|Paladio|106.42;Ag|Plata|107.87;Cd|Cadmio|112.41;In|Indio|114.82;Sn|Estaño|118.71;
Sb|Antimonio|121.76;Te|Telurio|127.60;I|Yodo|126.90;Xe|Xenón|131.29;Cs|Cesio|132.91;Ba|Bario|137.33;La|Lantano|138.91;Ce|Cerio|140.12;Pr|Praseodimio|140.91;Nd|Neodimio|144.24;
Pm|Prometio|[145];Sm|Samario|150.36;Eu|Europio|151.96;Gd|Gadolinio|157.25;Tb|Terbio|158.93;Dy|Disprosio|162.50;Ho|Holmio|164.93;Er|Erbio|167.26;Tm|Tulio|168.93;Yb|Iterbio|173.05;
Lu|Lutecio|174.97;Hf|Hafnio|178.49;Ta|Tantalio|180.95;W|Wolframio|183.84;Re|Renio|186.21;Os|Osmio|190.23;Ir|Iridio|192.22;Pt|Platino|195.08;Au|Oro|196.97;Hg|Mercurio|200.59;
Tl|Talio|204.38;Pb|Plomo|207.2;Bi|Bismuto|208.98;Po|Polonio|[209];At|Astato|[210];Rn|Radón|[222];Fr|Francio|[223];Ra|Radio|[226];Ac|Actinio|[227];Th|Torio|232.04;
Pa|Protactinio|231.04;U|Uranio|238.03;Np|Neptunio|[237];Pu|Plutonio|[244];Am|Americio|[243];Cm|Curio|[247];Bk|Berkelio|[247];Cf|Californio|[251];Es|Einstenio|[252];Fm|Fermio|[257];
Md|Mendelevio|[258];No|Nobelio|[259];Lr|Lawrencio|[266];Rf|Rutherfordio|[267];Db|Dubnio|[268];Sg|Seaborgio|[269];Bh|Bohrio|[270];Hs|Hasio|[269];Mt|Meitnerio|[278];Ds|Darmstatio|[281];
Rg|Roentgenio|[282];Cn|Copernicio|[285];Nh|Nihonio|[286];Fl|Flerovio|[289];Mc|Moscovio|[290];Lv|Livermorio|[293];Ts|Teneso|[294];Og|Oganesón|[294]`
  .split(';')
  .map((s, i) => {
    const [sym, name, m] = s.trim().split('|');
    const unstable = m.startsWith('[');
    return { z: i + 1, sym, name, mass: parseFloat(m.replace(/[[\]]/g, '')), unstable };
  });

/* Familias (tono HSL de cada una; el color final depende del tema) */
QE.categories = {
  alcalino: { name: 'Metales alcalinos', h: 4 },
  alcalinoterreo: { name: 'Metales alcalinotérreos', h: 28 },
  transicion: { name: 'Metales de transición', h: 210 },
  postransicion: { name: 'Otros metales', h: 190 },
  metaloide: { name: 'Metaloides', h: 160 },
  nometal: { name: 'No metales', h: 95 },
  halogeno: { name: 'Halógenos', h: 50 },
  noble: { name: 'Gases nobles', h: 275 },
  lantanido: { name: 'Lantánidos', h: 330 },
  actinido: { name: 'Actínidos', h: 305 },
};

QE.categoryOf = (z) => {
  const inList = (l) => l.includes(z);
  if (inList([3, 11, 19, 37, 55, 87])) return 'alcalino';
  if (inList([4, 12, 20, 38, 56, 88])) return 'alcalinoterreo';
  if (inList([2, 10, 18, 36, 54, 86, 118])) return 'noble';
  if (inList([9, 17, 35, 53, 85, 117])) return 'halogeno';
  if (inList([5, 14, 32, 33, 51, 52])) return 'metaloide';
  if (inList([1, 6, 7, 8, 15, 16, 34])) return 'nometal';
  if (z >= 57 && z <= 71) return 'lantanido';
  if (z >= 89 && z <= 103) return 'actinido';
  if ((z >= 21 && z <= 30) || (z >= 39 && z <= 48) || (z >= 72 && z <= 80) || (z >= 104 && z <= 112)) return 'transicion';
  return 'postransicion';
};

/* Áreas temáticas: símbolo de dos letras, nombre, tono y descripción breve */
QE.areas = [
  { id: 'general', sym: 'Qg', name: 'Química general', h: 205, text: 'Estructura atómica, estequiometría, enlaces y disoluciones.' },
  { id: 'inorganica', sym: 'In', name: 'Inorgánica', h: 18, text: 'Periodicidad, compuestos de coordinación y sólidos.' },
  { id: 'organica', sym: 'Or', name: 'Orgánica', h: 140, text: 'Grupos funcionales, nomenclatura, estereoquímica y mecanismos.' },
  { id: 'analitica', sym: 'An', name: 'Analítica', h: 330, text: 'Equilibrios, titulaciones, calibración y tratamiento de datos.' },
  { id: 'fisicoquimica', sym: 'Fq', name: 'Fisicoquímica', h: 265, text: 'Gases, termodinámica, cinética y electroquímica.' },
  { id: 'bioquimica', sym: 'Bq', name: 'Bioquímica', h: 100, text: 'Biomoléculas, enzimas y metabolismo.' },
  { id: 'espectroscopia', sym: 'Es', name: 'Espectroscopía', h: 45, text: 'RMN, IR, UV-Vis y espectrometría de masas.' },
  { id: 'ambiental', sym: 'Am', name: 'Ambiental', h: 172, text: 'Agua, aire, suelos y ciclos biogeoquímicos.' },
  { id: 'computacional', sym: 'Cp', name: 'Computacional', h: 240, text: 'Modelado molecular, orbitales y simulación.' },
];

/* Catálogo. status: 'disponible' (con url) o 'pronto'. levels: colegio y/o universidad. */
QE.apps = [
  {
    name: 'Analizador de RMN ¹H y ¹³C',
    areas: ['espectroscopia', 'organica'],
    levels: ['universidad'],
    text: 'Dibuja una molécula y obtén sus espectros de RMN predichos, o carga un espectro (JCAMP-DX o tabla de picos) y encuentra estructuras compatibles.',
    status: 'disponible',
    url: 'https://nmr.vipcursos.cloud',
    tags: ['RMN', 'JCAMP-DX', 'acoplamiento J'],
  },
  {
    name: 'Tabla periódica interactiva',
    areas: ['general', 'inorganica'],
    levels: ['colegio', 'universidad'],
    text: 'Masa atómica, familia y configuración electrónica de los 118 elementos.',
    status: 'disponible',
    url: '#tabla',
    tags: ['elementos', 'configuración electrónica'],
  },
  {
    name: 'Calculadora de masa molar',
    areas: ['general'],
    levels: ['colegio', 'universidad'],
    text: 'Masa molar y composición porcentual de cualquier fórmula, con paréntesis e hidratos.',
    status: 'disponible',
    url: '#lab',
    tags: ['estequiometría', 'g/mol'],
  },
  {
    name: 'Indicador universal de pH',
    areas: ['analitica', 'general'],
    levels: ['colegio'],
    text: 'Relaciona el color del indicador con el pH, la concentración de H₃O⁺ y la de OH⁻.',
    status: 'disponible',
    url: '#lab',
    tags: ['ácidos y bases', 'pH'],
  },
  {
    name: 'Visor molecular 3D',
    areas: ['organica', 'general', 'computacional'],
    levels: ['colegio', 'universidad'],
    text: 'Gira moléculas en tres dimensiones y compara su geometría y sus ángulos de enlace.',
    status: 'disponible',
    url: '#inicio',
    tags: ['VSEPR', 'geometría'],
  },
  {
    name: 'Balanceador de ecuaciones',
    areas: ['general'],
    levels: ['colegio'],
    text: 'Ajusta ecuaciones químicas paso a paso y comprueba la conservación de la masa.',
    status: 'pronto',
    tags: ['estequiometría'],
  },
  {
    name: 'Simulador de titulación ácido-base',
    areas: ['analitica'],
    levels: ['colegio', 'universidad'],
    text: 'Curvas de titulación de ácidos fuertes y débiles, punto de equivalencia e indicadores.',
    status: 'pronto',
    tags: ['volumetría', 'pKa'],
  },
  {
    name: 'Leyes de los gases',
    areas: ['fisicoquimica', 'general'],
    levels: ['colegio'],
    text: 'Cambia presión, volumen y temperatura y observa las partículas de un gas ideal.',
    status: 'pronto',
    tags: ['PV = nRT'],
  },
  {
    name: 'Cinética química',
    areas: ['fisicoquimica'],
    levels: ['universidad'],
    text: 'Órdenes de reacción, vida media y ecuación de Arrhenius con datos simulados.',
    status: 'pronto',
    tags: ['velocidad', 'Arrhenius'],
  },
  {
    name: 'Estereoquímica R/S',
    areas: ['organica'],
    levels: ['universidad'],
    text: 'Asigna configuraciones R y S con las reglas de prioridad de Cahn-Ingold-Prelog.',
    status: 'pronto',
    tags: ['quiralidad', 'CIP'],
  },
  {
    name: 'Nomenclatura orgánica IUPAC',
    areas: ['organica'],
    levels: ['colegio', 'universidad'],
    text: 'Practica nombres y estructuras de alcanos, alquenos, alcoholes y compuestos carbonílicos.',
    status: 'pronto',
    tags: ['IUPAC'],
  },
  {
    name: 'Campo cristalino',
    areas: ['inorganica'],
    levels: ['universidad'],
    text: 'Desdoblamiento de los orbitales d, alto y bajo espín y color de los complejos.',
    status: 'pronto',
    tags: ['complejos', 'orbitales d'],
  },
  {
    name: 'Cinética enzimática',
    areas: ['bioquimica'],
    levels: ['universidad'],
    text: 'Michaelis-Menten, Lineweaver-Burk e inhibición competitiva y no competitiva.',
    status: 'pronto',
    tags: ['Km', 'Vmax'],
  },
  {
    name: 'Espectroscopía IR',
    areas: ['espectroscopia', 'organica'],
    levels: ['universidad'],
    text: 'Identifica grupos funcionales por sus bandas de absorción en el infrarrojo.',
    status: 'pronto',
    tags: ['cm⁻¹', 'grupos funcionales'],
  },
  {
    name: 'Calidad del agua',
    areas: ['ambiental', 'analitica'],
    levels: ['colegio', 'universidad'],
    text: 'Dureza, oxígeno disuelto y DBO con muestras simuladas de ríos y lagos.',
    status: 'pronto',
    tags: ['dureza', 'DBO'],
  },
  {
    name: 'Orbitales moleculares',
    areas: ['computacional', 'fisicoquimica'],
    levels: ['universidad'],
    text: 'Diagramas de OM de moléculas diatómicas, orden de enlace y magnetismo.',
    status: 'pronto',
    tags: ['OM', 'HOMO-LUMO'],
  },
];

/* Moléculas del visor (coordenadas aproximadas en Å; enlaces [i, j, orden]) */
(() => {
  const benzene = () => {
    const atoms = [];
    const bonds = [];
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k;
      atoms.push(['C', 1.39 * Math.cos(a), 1.39 * Math.sin(a), 0]);
    }
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k;
      atoms.push(['H', 2.48 * Math.cos(a), 2.48 * Math.sin(a), 0]);
      bonds.push([k, (k + 1) % 6, k % 2 ? 1 : 2], [k, k + 6, 1]);
    }
    return { atoms, bonds };
  };
  const ammonia = () => {
    const atoms = [['N', 0, 0, 0.12]];
    const bonds = [];
    for (let k = 0; k < 3; k++) {
      const a = ((2 * Math.PI) / 3) * k;
      atoms.push(['H', 0.94 * Math.cos(a), 0.94 * Math.sin(a), -0.27]);
      bonds.push([0, k + 1, 1]);
    }
    return { atoms, bonds };
  };
  const t = 0.629;
  QE.molecules = [
    {
      id: 'agua', name: 'Agua', formula: 'H2O', geom: 'Angular', angle: '104.5°',
      atoms: [['O', 0, -0.12, 0], ['H', 0.757, 0.47, 0], ['H', -0.757, 0.47, 0]],
      bonds: [[0, 1, 1], [0, 2, 1]],
    },
    {
      id: 'metano', name: 'Metano', formula: 'CH4', geom: 'Tetraédrica', angle: '109.5°',
      atoms: [['C', 0, 0, 0], ['H', t, t, t], ['H', -t, -t, t], ['H', -t, t, -t], ['H', t, -t, -t]],
      bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
    },
    { id: 'amoniaco', name: 'Amoníaco', formula: 'NH3', geom: 'Piramidal trigonal', angle: '107°', ...ammonia() },
    {
      id: 'co2', name: 'Dióxido de carbono', formula: 'CO2', geom: 'Lineal', angle: '180°',
      atoms: [['C', 0, 0, 0], ['O', 1.16, 0, 0], ['O', -1.16, 0, 0]],
      bonds: [[0, 1, 2], [0, 2, 2]],
    },
    {
      id: 'etanol', name: 'Etanol', formula: 'C2H6O', display: 'CH₃CH₂OH', geom: 'Tetraédrica en C y O', angle: '≈109°',
      atoms: [
        ['C', -1.17, -0.4, 0], ['C', 0.08, 0.47, 0], ['O', 1.23, -0.37, 0], ['H', 2.0, 0.2, 0],
        ['H', -2.07, 0.22, 0], ['H', -1.18, -1.04, 0.89], ['H', -1.18, -1.04, -0.89],
        ['H', 0.08, 1.11, 0.89], ['H', 0.08, 1.11, -0.89],
      ],
      bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 4, 1], [0, 5, 1], [0, 6, 1], [1, 7, 1], [1, 8, 1]],
    },
    { id: 'benceno', name: 'Benceno', formula: 'C6H6', geom: 'Plana hexagonal', angle: '120°', ...benzene() },
  ];
})();

/* Ejemplos de pH (valores típicos) */
QE.phExamples = [
  [1.5, 'jugo gástrico'],
  [2.2, 'jugo de limón'],
  [2.9, 'vinagre'],
  [4.2, 'jugo de tomate'],
  [5.0, 'café'],
  [5.6, 'lluvia limpia'],
  [6.6, 'leche'],
  [7.0, 'agua pura'],
  [7.4, 'sangre'],
  [8.1, 'agua de mar'],
  [8.3, 'bicarbonato de sodio'],
  [10.0, 'jabón'],
  [11.6, 'amoníaco doméstico'],
  [12.6, 'lejía (hipoclorito)'],
  [13.5, 'limpiador de hornos'],
];
