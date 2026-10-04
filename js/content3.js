// Contenido de 3° año: teoría + generadores de ejercicios.
import { R, Rnz, pick, shuffle, Q, num, sg, frac, mc, MINUS, svg, round, axes } from './util.js';
import { linEq, eqHTML, solveSteps } from './content2.js';

const M = MINUS;
const VF = (q, ok, explain) => mc(q, ok ? 'Verdadero' : 'Falso', [ok ? 'Falso' : 'Verdadero'], explain);
const PI = 3.14;
const tolPct = v => Math.max(0.05, Math.abs(v) * 0.012);

// ===================== BLOQUE I: RACIONALES =====================
const r1 = {
  id: 'r1', icon: '⚡', title: 'Operaciones y potencias en ℚ',
  theory: [
    { h: 'Operar con racionales con signo', html: `<p>Las reglas de los signos de ℤ valen igual para fracciones y decimales.</p><div class="ex">${frac(-2, 3)} · ${frac(9, 4, true)} = ${frac(-18, 12)} = ${frac(-3, 2)} &nbsp;·&nbsp; ${frac(1, 2)} ${M} ${frac(5, 6)} = ${frac(3, 6)} ${M} ${frac(5, 6)} = ${frac(-1, 3)}</div>` },
    { h: 'Potencias de fracciones', html: `<p>Se elevan numerador y denominador:</p><div class="ex">(${frac(2, 3)})³ = ${frac(8, 27)} &nbsp;·&nbsp; (${frac(-1, 2)})⁴ = ${frac(1, 16)} &nbsp;·&nbsp; (${frac(-1, 2)})³ = ${frac(-1, 8)}</div><ul><li>Todo número (≠ 0) elevado a la 0 da <b>1</b>.</li><li>Producto de igual base: se <b>suman</b> exponentes: a² · a³ = a⁵.</li><li>Cociente de igual base: se <b>restan</b>: a⁵ : a² = a³.</li><li>Potencia de potencia: se <b>multiplican</b>: (a²)³ = a⁶.</li></ul><div class="tip">¡La potencia NO es distributiva respecto de la suma! (2 + 3)² = 25, pero 2² + 3² = 13.</div>` },
  ],
  sim: { w: 'powers' },
  gen() {
    const k = R(0, 4);
    if (k === 0) { const a = Rnz(-4, 4), b = R(2, 5), e = R(2, 3); const base = new Q(a, b); if (base.d === 1) return this.gen(); const r = base.pow(e); return { type: 'num', q: `Calculá:<div class="big">(${base.html()})<sup>${e}</sup> =</div>`, answer: r, explain: `Se eleva numerador y denominador: ${r.html()}` }; }
    if (k === 1) { const A = new Q(Rnz(-6, 6), R(2, 6)), B = new Q(Rnz(-6, 6), R(2, 6)), C = new Q(Rnz(-5, 5), R(2, 5)); const r = A.add(B.mul(C)); return { type: 'num', q: `Calculá:<div class="big">${A.html()} + ${B.html(true)} · ${C.html(true)} =</div>`, answer: r, explain: `Primero el producto: ${B.mul(C).html()}. Luego la suma: ${r.html()}` }; }
    if (k === 2) { const m = R(2, 5), n = R(2, 5), a = new Q(R(1, 4), R(2, 5)); const t = R(0, 2); const exp = t === 0 ? m + n : t === 1 ? m * n : m; const q = t === 0 ? `(${a.html()})<sup>${m}</sup> · (${a.html()})<sup>${n}</sup>` : t === 1 ? `((${a.html()})<sup>${m}</sup>)<sup>${n}</sup>` : `(${a.html()})<sup>${m + n}</sup> : (${a.html()})<sup>${n}</sup>`; return mc(`¿A qué es igual?<div class="big sm">${q}</div>`, `(${a.html()})<sup>${exp}</sup>`, [...new Set([m * n, m + n, m, n, m + 2 * n].filter(x => x !== exp))].slice(0, 3).map(x => `(${a.html()})<sup>${x}</sup>`), t === 0 ? 'Igual base, producto: se suman los exponentes.' : t === 1 ? 'Potencia de potencia: se multiplican.' : 'Igual base, cociente: se restan.'); }
    if (k === 3) { const a = new Q(Rnz(-9, 9), R(2, 9)); return { type: 'num', q: `<div class="big">(${a.html()})<sup>0</sup> =</div>`, answer: 1, explain: 'Todo número distinto de 0 elevado a la 0 es 1.' }; }
    const d = R(1, 9) / 10, e = R(2, 3); return { type: 'num', q: `<div class="big">(${M}${num(d, 1)})<sup>${e}</sup> =</div>`, answer: round((-d) ** e, 6), dec: 4, explain: `${e % 2 ? 'Exponente impar: negativo' : 'Exponente par: positivo'}. ${num((-d) ** e, 4)}` };
  },
};

const r2 = {
  id: 'r2', icon: '√', title: 'Radicación en ℚ',
  theory: [
    { h: 'La raíz deshace la potencia', html: `<p>√a = b porque b² = a. &nbsp; ∛a = b porque b³ = a.</p><div class="ex">√(${frac(9, 16)}) = ${frac(3, 4)} porque (${frac(3, 4)})² = ${frac(9, 16)} &nbsp;·&nbsp; ∛(${frac(8, 27)}) = ${frac(2, 3)}</div><p>Raíz de una fracción: raíz del numerador sobre raíz del denominador.</p>` },
    { h: 'Decimales y cuidados', html: `<div class="ex">√0,25 = √(${frac(25, 100)}) = ${frac(5, 10)} = 0,5 &nbsp;·&nbsp; √0,09 = 0,3</div><div class="tip">La raíz NO es distributiva respecto de la suma: √(9 + 16) = √25 = 5, pero √9 + √16 = 7.</div><p>En geometría: el lado de un cuadrado de área A es √A; la arista de un cubo de volumen V es ∛V.</p>` },
  ],
  sim: { w: 'roots' },
  gen() {
    const k = R(0, 4);
    if (k === 0) { const a = R(1, 12), b = R(2, 12); const q = new Q(a, b); return { type: 'num', q: `<div class="big">√(${frac(a * a, b * b)}) =</div>`, answer: q.val(), explain: `√${a * a} = ${a} y √${b * b} = ${b} → ${frac(a, b)}` }; }
    if (k === 1) { const a = R(1, 5), b = R(2, 6); return { type: 'num', q: `<div class="big">∛(${frac(a ** 3, b ** 3)}) =</div>`, answer: a / b, explain: `${a}³ = ${a ** 3} y ${b}³ = ${b ** 3} → ${frac(a, b)}` }; }
    if (k === 2) { const d = pick([0.04, 0.09, 0.16, 0.25, 0.36, 0.49, 0.64, 0.81, 1.44, 1.21]); return { type: 'num', q: `<div class="big">√${num(d)} =</div>`, answer: round(Math.sqrt(d), 2), explain: `${num(Math.sqrt(d), 1)}² = ${num(d)}` }; }
    if (k === 3) { const l = R(2, 15), t = Math.random() < .5; return { type: 'num', q: t ? `Un cuadrado tiene ${l * l} cm² de área. ¿Cuánto mide su lado?` : `Un cubo tiene ${l ** 3} cm³ de volumen. ¿Cuánto mide su arista?`, answer: l, unit: 'cm', explain: t ? `√${l * l} = ${l} cm` : `∛${l ** 3} = ${l} cm` }; }
    const a = pick([[9, 16], [36, 64], [25, 144]]); return mc(`¿Cuánto vale √(${a[0]} + ${a[1]})?`, num(Math.sqrt(a[0] + a[1])), [num(Math.sqrt(a[0]) + Math.sqrt(a[1])), num(a[0] + a[1]), num(Math.sqrt(a[0]))], `Primero se suma: √${a[0] + a[1]} = ${Math.sqrt(a[0] + a[1])}. La raíz no se distribuye.`);
  },
};

// ===================== BLOQUE II: GEOMETRÍA =====================
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
const p1 = {
  id: 'p1', icon: '📐', title: 'Teorema de Pitágoras',
  theory: [
    { h: 'El teorema', html: `<p>En todo <b>triángulo rectángulo</b>, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos:</p><div class="ex big sm">h² = a² + b²</div><p>La <b>hipotenusa</b> es el lado opuesto al ángulo recto (el más largo); los <b>catetos</b> forman el ángulo recto.</p>` },
    { h: 'Cómo usarlo', html: `<ul><li><b>Hipotenusa</b>: h = √(a² + b²). Catetos 6 y 8 → h = √100 = 10.</li><li><b>Cateto</b>: a = √(h² ${M} b²). h = 13, b = 5 → a = √144 = 12.</li><li>¿Es rectángulo? Si 5² + 12² = 13², sí.</li></ul><div class="tip">Aparece en la vida real: la diagonal de la pantalla de una tele, la escalera apoyada en la pared, la distancia en un mapa.</div>` },
  ],
  sim: { w: 'pythagoras' },
  gen() {
    const [a, b, c] = pick(TRIPLES).map(x => x * pick([1, 1, 2])), k = R(0, 4);
    if (k === 0) return { type: 'num', q: `Los catetos de un triángulo rectángulo miden ${a} cm y ${b} cm. ¿Cuánto mide la hipotenusa?`, answer: c, unit: 'cm', explain: `h = √(${a}² + ${b}²) = √${a * a + b * b} = ${c} cm` };
    if (k === 1) return { type: 'num', q: `La hipotenusa de un triángulo rectángulo mide ${c} cm y un cateto ${a} cm. ¿Cuánto mide el otro cateto?`, answer: b, unit: 'cm', explain: `√(${c}² ${M} ${a}²) = √${c * c - a * a} = ${b} cm` };
    if (k === 2) return { type: 'num', q: `Una escalera de ${c} m está apoyada en una pared. Su pie está a ${a} m de la pared. ¿A qué altura llega?`, answer: b, unit: 'm', explain: `√(${c}² ${M} ${a}²) = ${b} m` };
    if (k === 3) { const x = R(2, 9), y = R(2, 9), h = Math.sqrt(x * x + y * y); return { type: 'num', q: `Un rectángulo mide ${x} cm por ${y} cm. ¿Cuánto mide su diagonal? (redondeá a un decimal)`, answer: round(h, 1), tol: 0.06, unit: 'cm', explain: `√(${x}² + ${y}²) = √${x * x + y * y} ≈ ${num(h, 1)} cm` }; }
    const ok = Math.random() < .5, cc = ok ? c : c + 1; return mc(`¿Un triángulo de lados ${a}, ${b} y ${cc} es rectángulo?`, ok ? 'Sí' : 'No', [ok ? 'No' : 'Sí'], `${a}² + ${b}² = ${a * a + b * b} y ${cc}² = ${cc * cc}: ${ok ? 'son iguales' : 'no son iguales'}.`);
  },
};

const p2 = {
  id: 'p2', icon: '📡', title: 'Trigonometría',
  theory: [
    { h: 'Seno, coseno y tangente', html: `<p>En un triángulo rectángulo, para un ángulo agudo α:</p><table class="tbl"><tr><td><b>sen α</b></td><td>cateto opuesto / hipotenusa</td></tr><tr><td><b>cos α</b></td><td>cateto adyacente / hipotenusa</td></tr><tr><td><b>tg α</b></td><td>cateto opuesto / cateto adyacente</td></tr></table><div class="tip">Regla mnemotécnica: <b>SOH CAH TOA</b> (Seno: Opuesto/Hipotenusa; Coseno: Adyacente/Hipotenusa; Tangente: Opuesto/Adyacente).</div>` },
    { h: 'Calcular lados y ángulos', html: `<div class="ex">Hipotenusa 10, α = 30° → opuesto = 10 · sen 30° = 10 · 0,5 = 5</div><div class="ex">Opuesto 3, adyacente 4 → tg α = 0,75 → α = tg⁻¹(0,75) ≈ 36,87°</div><p>Con la calculadora (en modo DEG) usás sin, cos, tan y sus inversas (SHIFT).</p>` },
  ],
  sim: { w: 'trig' },
  gen() {
    const k = R(0, 3);
    if (k === 0) { const pairs = [['sen α', 'cateto opuesto / hipotenusa'], ['cos α', 'cateto adyacente / hipotenusa'], ['tg α', 'cateto opuesto / cateto adyacente']]; const [n, d] = pick(pairs); return mc(`En un triángulo rectángulo, <b>${n}</b> es igual a…`, d, pairs.map(p => p[1]).filter(x => x !== d).concat(['hipotenusa / cateto opuesto']).slice(0, 3)); }
    if (k === 1) { const h = R(5, 20), a = pick([20, 25, 30, 35, 40, 45, 50, 60]), f = pick(['sen', 'cos']); const v = f === 'sen' ? h * Math.sin(a * Math.PI / 180) : h * Math.cos(a * Math.PI / 180); return { type: 'num', q: `La hipotenusa mide ${h} cm y el ángulo α = ${a}°. ¿Cuánto mide el cateto <b>${f === 'sen' ? 'opuesto' : 'adyacente'}</b> a α? (un decimal)`, answer: round(v, 1), tol: 0.12, unit: 'cm', explain: `${f === 'sen' ? 'opuesto = h · sen α' : 'adyacente = h · cos α'} = ${h} · ${f} ${a}° ≈ ${num(v, 1)} cm` }; }
    if (k === 2) { const o = R(2, 12), ad = R(2, 12), ang = Math.atan(o / ad) * 180 / Math.PI; return { type: 'num', q: `Los catetos miden: opuesto a α = ${o} cm, adyacente = ${ad} cm. ¿Cuánto mide α? (en grados, redondeado)`, answer: Math.round(ang), tol: 0.6, unit: '°', explain: `tg α = ${o}/${ad} → α = tg⁻¹(${num(o / ad, 3)}) ≈ ${num(ang, 1)}°` }; }
    const d = R(10, 40), a = pick([30, 35, 40, 45, 50, 60]), h = d * Math.tan(a * Math.PI / 180); return { type: 'num', q: `Desde ${d} m de la base de un edificio se ve su punta con un ángulo de elevación de ${a}°. ¿Qué altura tiene? (un decimal)`, answer: round(h, 1), tol: 0.15, unit: 'm', explain: `altura = ${d} · tg ${a}° ≈ ${num(h, 1)} m` };
  },
};

const p3 = {
  id: 'p3', icon: '📏', title: 'Teorema de Thales',
  theory: [
    { h: 'El teorema', html: `<p>Si varias <b>rectas paralelas</b> cortan a dos transversales, los segmentos que determinan en una son <b>proporcionales</b> a los de la otra:</p><div class="ex big sm">AB / BC = A'B' / B'C'</div>` },
    { h: '¿Cuándo se puede aplicar?', html: `<ul><li>Solo si las rectas que cortan son <b>paralelas</b>. Si no lo son, los segmentos no son proporcionales.</li><li>Sirve para medir alturas inaccesibles con sombras: el sol forma triángulos semejantes.</li></ul><div class="ex">Un palo de 2 m da una sombra de 3 m; un árbol da 12 m de sombra → altura = 2 · 12 / 3 = 8 m</div>` },
  ],
  sim: { w: 'thales' },
  gen() {
    const k = R(0, 2);
    if (k === 0) { const a = R(2, 8), b = R(2, 8), kk = pick([1.5, 2, 3, 0.5, 2.5]); const c = a * kk, x = b * kk; return { type: 'num', q: `Tres rectas paralelas cortan a dos transversales. En una quedan segmentos de ${a} cm y ${b} cm; en la otra, el segmento que corresponde al de ${a} cm mide ${num(c)} cm. ¿Cuánto mide el que corresponde al de ${b} cm?`, answer: x, unit: 'cm', explain: `${a} / ${b} = ${num(c)} / x → x = ${b} · ${num(c)} : ${a} = ${num(x)} cm` }; }
    if (k === 1) { const h = R(1, 3), s = R(1, 4), S = s * R(3, 8); return { type: 'num', q: `Un palo de ${h} m proyecta una sombra de ${s} m. A la misma hora, un árbol proyecta una sombra de ${S} m. ¿Cuánto mide el árbol?`, answer: h * S / s, unit: 'm', explain: `${h} / ${s} = x / ${S} → x = ${num(h * S / s)} m` }; }
    return pick([VF('El teorema de Thales se puede aplicar aunque las rectas que cortan a las transversales no sean paralelas.', false, 'Las rectas tienen que ser paralelas.'), VF('Si las rectas son paralelas, los segmentos que determinan en las transversales son proporcionales.', true, 'Eso dice el teorema.'), mc('¿Para qué sirve el método de las sombras?', 'Para medir alturas que no se pueden alcanzar', ['Para medir ángulos', 'Para calcular áreas', 'Para medir temperaturas'], 'Usa triángulos semejantes (Thales).')]);
  },
};

const SOLIDS = [
  ['Prisma', 'dos bases iguales y paralelas (polígonos) y caras laterales que son paralelogramos'],
  ['Pirámide', 'una base poligonal y caras laterales triangulares que se juntan en un vértice'],
  ['Cilindro', 'dos bases circulares iguales y paralelas, y una superficie lateral curva'],
  ['Cono', 'una base circular y una superficie curva que termina en un vértice'],
  ['Esfera', 'todos sus puntos a la misma distancia del centro'],
];
const p4 = {
  id: 'p4', icon: '🧊', title: 'Reconocer cuerpos',
  theory: [
    { h: 'Poliedros y cuerpos redondos', html: `<ul><li><b>Poliedros</b> (todas sus caras planas): <b>prismas</b> (dos bases iguales) y <b>pirámides</b> (una base y un vértice).</li><li><b>Cuerpos redondos</b> (tienen superficies curvas): <b>cilindro</b>, <b>cono</b> y <b>esfera</b>.</li></ul>` },
    { h: 'Caras, vértices y aristas', html: `<table class="tbl"><tr><th></th><th>Caras</th><th>Vértices</th><th>Aristas</th></tr><tr><th>Prisma de base n</th><td>n + 2</td><td>2n</td><td>3n</td></tr><tr><th>Pirámide de base n</th><td>n + 1</td><td>n + 1</td><td>2n</td></tr></table><div class="tip">Fórmula de Euler (para poliedros convexos): Caras + Vértices ${M} Aristas = 2.</div>` },
  ],
  sim: { w: 'solids', opts: { mode: 'id' } },
  gen() {
    const k = R(0, 2);
    if (k === 0) { const [n, d] = pick(SOLIDS); return mc(`Tiene ${d}. ¿Qué cuerpo es?`, n, SOLIDS.map(s => s[0]).filter(x => x !== n).slice(0, 3)); }
    if (k === 1) { const n = R(3, 8), b = { 3: 'triangular', 4: 'cuadrangular', 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octogonal' }[n], t = pick(['prisma', 'pirámide']), what = pick(['caras', 'vértices', 'aristas']); const v = t === 'prisma' ? { caras: n + 2, 'vértices': 2 * n, aristas: 3 * n }[what] : { caras: n + 1, 'vértices': n + 1, aristas: 2 * n }[what]; return { type: 'num', q: `¿Cuántas <b>${what}</b> tiene una ${t === 'prisma' ? 'prisma' : 'pirámide'} ${b}?`.replace('una prisma', 'un prisma'), answer: v, explain: `Base de ${n} lados. ${t === 'prisma' ? 'Prisma' : 'Pirámide'}: ${what} = ${v}. Euler: C + V ${M} A = 2 ✓` }; }
    return pick([mc('¿Cuál de estos es un cuerpo redondo?', 'Cono', ['Cubo', 'Pirámide', 'Prisma'], 'Tiene una superficie curva.'), mc('Un dado tiene forma de…', 'Cubo (prisma)', ['Pirámide', 'Cilindro', 'Esfera']), mc('Una lata de gaseosa tiene forma de…', 'Cilindro', ['Cono', 'Prisma', 'Esfera']), mc('Un cucurucho de helado tiene forma de…', 'Cono', ['Cilindro', 'Pirámide', 'Esfera'])]);
  },
};

function solidData() {
  const t = R(0, 5), a = R(2, 10), b = R(2, 10), h = R(2, 12), r = R(1, 8);
  if (t === 0) return { name: `un prisma rectangular (ortoedro) de ${a} cm × ${b} cm × ${h} cm`, A: 2 * (a * b + a * h + b * h), Al: 2 * (a + b) * h, V: a * b * h, fa: `2 · (${a}·${b} + ${a}·${h} + ${b}·${h})`, fv: `${a} · ${b} · ${h}` };
  if (t === 1) return { name: `un cubo de ${a} cm de arista`, A: 6 * a * a, Al: 4 * a * a, V: a ** 3, fa: `6 · ${a}²`, fv: `${a}³` };
  if (t === 2) return { name: `un cilindro de radio ${r} cm y altura ${h} cm`, A: 2 * PI * r * (h + r), Al: 2 * PI * r * h, V: PI * r * r * h, fa: `2 · π · ${r} · (${h} + ${r})`, fv: `π · ${r}² · ${h}` };
  if (t === 3) { const g = round(Math.sqrt(r * r + h * h), 2); return { name: `un cono de radio ${r} cm, altura ${h} cm y generatriz ${num(g)} cm`, A: PI * r * (g + r), Al: PI * r * g, V: PI * r * r * h / 3, fa: `π · ${r} · (${num(g)} + ${r})`, fv: `π · ${r}² · ${h} : 3` }; }
  if (t === 4) return { name: `una esfera de radio ${r} cm`, A: 4 * PI * r * r, Al: null, V: 4 / 3 * PI * r ** 3, fa: `4 · π · ${r}²`, fv: `4/3 · π · ${r}³` };
  const ap = R(3, 12); return { name: `una pirámide de base cuadrada de ${a} cm de lado, apotema lateral ${ap} cm y altura ${h} cm`, A: a * a + 4 * a * ap / 2, Al: 2 * a * ap, V: a * a * h / 3, fa: `${a}² + 4 · ${a} · ${ap} : 2`, fv: `${a}² · ${h} : 3` };
}
const p5 = {
  id: 'p5', icon: '🎁', title: 'Áreas de cuerpos',
  theory: [
    { h: 'Área lateral y total', html: `<p>El <b>área lateral</b> es la suma de las caras laterales (o la superficie curva). El <b>área total</b> suma también las bases. Imaginá el <b>desarrollo plano</b>: el cuerpo “abierto” sobre la mesa.</p>` },
    { h: 'Fórmulas (usá π ≈ 3,14)', html: `<table class="tbl"><tr><td>Prisma</td><td>A<sub>L</sub> = perímetro base · h ; A<sub>T</sub> = A<sub>L</sub> + 2 · A<sub>base</sub></td></tr><tr><td>Pirámide</td><td>A<sub>L</sub> = perímetro base · apotema : 2 ; A<sub>T</sub> = A<sub>L</sub> + A<sub>base</sub></td></tr><tr><td>Cilindro</td><td>A<sub>L</sub> = 2πr · h ; A<sub>T</sub> = 2πr · (h + r)</td></tr><tr><td>Cono</td><td>A<sub>L</sub> = π · r · g ; A<sub>T</sub> = π · r · (g + r)</td></tr><tr><td>Esfera</td><td>A = 4 · π · r²</td></tr></table><div class="tip">El área lateral del cilindro es un rectángulo: su base es el largo de la circunferencia (2πr).</div>` },
  ],
  sim: { w: 'solids', opts: { mode: 'area' } },
  gen() { const s = solidData(); return { type: 'num', q: `Calculá el <b>área total</b> de ${s.name}. (π ≈ 3,14; podés redondear)`, answer: round(s.A, 2), tol: tolPct(s.A), unit: 'cm²', explain: `A = ${s.fa} ≈ ${num(s.A, 2)} cm²` }; },
};

const p6 = {
  id: 'p6', icon: '🥤', title: 'Volúmenes de cuerpos',
  theory: [
    { h: 'Volumen: cuánto espacio ocupa', html: `<p>Se mide en unidades cúbicas (cm³, m³). Recordá: 1 dm³ = 1 litro.</p><table class="tbl"><tr><td>Prisma y cilindro</td><td>V = A<sub>base</sub> · h</td></tr><tr><td>Pirámide y cono</td><td>V = A<sub>base</sub> · h : 3</td></tr><tr><td>Esfera</td><td>V = 4/3 · π · r³</td></tr></table>` },
    { h: '¿Por qué dividido 3?', html: `<p>Una pirámide entra <b>exactamente 3 veces</b> en el prisma de igual base y altura. Lo mismo pasa con el cono y el cilindro: ¡se puede comprobar llenándolos con arena!</p><div class="ex">Cilindro r = 3, h = 10 → V = 3,14 · 9 · 10 = 282,6 cm³. Cono con la misma base y altura: 94,2 cm³.</div>` },
  ],
  sim: { w: 'solids', opts: { mode: 'vol' } },
  gen() { const s = solidData(); return { type: 'num', q: `Calculá el <b>volumen</b> de ${s.name}. (π ≈ 3,14; podés redondear)`, answer: round(s.V, 2), tol: tolPct(s.V), unit: 'cm³', explain: `V = ${s.fv} ≈ ${num(s.V, 2)} cm³` }; },
};

// ===================== BLOQUE III: FUNCIONES =====================
const f1 = {
  id: 'f1', icon: '🔁', title: 'Proporcionalidad directa e inversa',
  theory: [
    { h: 'Proporcionalidad directa', html: `<p>Si una cantidad se duplica, la otra también. El <b>cociente</b> y/x es constante (k).</p><div class="ex">Kilos de pan y precio: y = 1200 · x. Gráfico: recta que pasa por el origen.</div>` },
    { h: 'Proporcionalidad inversa', html: `<p>Si una cantidad se duplica, la otra se reduce a la mitad. El <b>producto</b> x · y es constante (k).</p><div class="ex">Pintores y días: 4 pintores tardan 6 días → x · y = 24 → 8 pintores tardan 3 días. Fórmula: y = k / x. Gráfico: hipérbola.</div><div class="tip">Ojo: “cuando una aumenta, la otra aumenta” no alcanza para que sea proporcional directa. ¡Tiene que mantenerse el cociente!</div>` },
  ],
  sim: { w: 'propo' },
  gen() {
    const k = R(0, 3), c = R(2, 9);
    if (k === 0) { const inv = Math.random() < .5, K = c * 12, xs = [1, 2, 3, 4, 6]; const ys = xs.map(x => inv ? K / x : c * x); return mc(`¿Qué relación muestra la tabla?<table class="tbl sm"><tr><th>x</th>${xs.map(x => `<td>${x}</td>`).join('')}</tr><tr><th>y</th>${ys.map(y => `<td>${num(y)}</td>`).join('')}</tr></table>`, inv ? 'Proporcionalidad inversa' : 'Proporcionalidad directa', [inv ? 'Proporcionalidad directa' : 'Proporcionalidad inversa', 'No es de proporcionalidad'], inv ? `x · y = ${K} siempre.` : `y / x = ${c} siempre.`); }
    if (k === 1) { const p = R(2, 6), d = R(2, 12), p2 = pick([1, 2, 3, 4, 6, 8, 12].filter(x => (p * d) % x === 0 && x !== p)); return { type: 'num', q: `${p} albañiles tardan ${d} días en hacer una obra. ¿Cuántos días tardarían ${p2} albañiles, trabajando al mismo ritmo?`, answer: p * d / p2, unit: 'días', explain: `Inversa: ${p} · ${d} = ${p * d} → ${p * d} : ${p2} = ${p * d / p2} días` }; }
    if (k === 2) { const pr = R(2, 9) * 100, kg = R(2, 6), kg2 = R(2, 9); return { type: 'num', q: `${kg} kg de manzanas cuestan $ ${pr * kg}. ¿Cuánto cuestan ${kg2} kg?`, answer: pr * kg2, unit: '$', explain: `Directa: $ ${pr} por kilo → ${kg2} · ${pr} = $ ${pr * kg2}` }; }
    const inv = Math.random() < .5; return { type: 'num', q: `En una proporcionalidad ${inv ? 'inversa' : 'directa'}, cuando x = 4, y = ${4 * c}. ¿Cuánto vale la constante?`, answer: inv ? 16 * c : c, explain: inv ? `k = x · y = 4 · ${4 * c} = ${16 * c}` : `k = y / x = ${4 * c} / 4 = ${c}` };
  },
};

// función lineal a trozos con vértices enteros (para análisis de gráficos)
export function randomGraph() {
  const xs = [-5, -3, -1, 1, 3, 5].slice(R(0, 1), R(5, 6));
  const ys = xs.map(() => R(-3, 4));
  for (let i = 1; i < ys.length; i++) if (ys[i] === ys[i - 1]) ys[i] += pick([-1, 1, 2]);
  const pts = xs.map((x, i) => [x, ys[i]]);
  const f = x => { for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; if (x >= x1 && x <= x2) return y1 + (y2 - y1) * (x - x1) / (x2 - x1); } return null; };
  const zeros = []; for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; if (y1 === 0 && !zeros.includes(x1)) zeros.push(x1); if (y1 * y2 < 0) zeros.push(round(x1 - y1 * (x2 - x1) / (y2 - y1), 2)); } const [lx, ly] = pts[pts.length - 1]; if (ly === 0) zeros.push(lx);
  const up = [], down = []; for (let i = 0; i < pts.length - 1; i++) { const s = pts[i + 1][1] - pts[i][1]; const tgt = s > 0 ? up : down; if (tgt.length && tgt[tgt.length - 1][1] === pts[i][0]) tgt[tgt.length - 1][1] = pts[i + 1][0]; else tgt.push([pts[i][0], pts[i + 1][0]]); }
  const iv = list => list.length ? list.map(([a, b]) => `(${num(a)}; ${num(b)})`).join(' ∪ ') : '∅';
  const ymin = Math.min(...ys), ymax = Math.max(...ys);
  const A = axes(-6, 6, -4, 5, { w: 400, h: 300 });
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${A.X(p[0])} ${A.Y(p[1])}`).join(' ');
  const g = A.g + `<path d="${path}" class="fn"/>` + `<circle cx="${A.X(pts[0][0])}" cy="${A.Y(pts[0][1])}" r="4" class="fnpt"/><circle cx="${A.X(lx)}" cy="${A.Y(ly)}" r="4" class="fnpt"/>`;
  return { pts, f, zeros, up: iv(up), down: iv(down), dom: `[${num(xs[0])}; ${num(lx)}]`, img: `[${num(ymin)}; ${num(ymax)}]`, svg: svg(400, 300, g, 'chart'), x0: xs[0], x1: lx };
}
const f2 = {
  id: 'f2', icon: '📈', title: 'Análisis de gráficos de funciones',
  theory: [
    { h: 'Qué leer en un gráfico', html: `<ul><li><b>Dominio</b>: los valores de x para los que hay gráfico.</li><li><b>Imagen</b>: los valores de y que toma la función.</li><li><b>Ceros (raíces)</b>: donde el gráfico corta al eje x (y = 0).</li><li><b>Ordenada al origen</b>: donde corta al eje y (el valor de f(0)).</li></ul>` },
    { h: 'Comportamiento', html: `<ul><li><b>Crece</b> donde, al avanzar hacia la derecha, el gráfico sube; <b>decrece</b> donde baja.</li><li><b>Conjunto de positividad</b> (C⁺): los x donde el gráfico está por encima del eje x.</li><li><b>Conjunto de negatividad</b> (C⁻): donde está por debajo.</li></ul><div class="tip">Los intervalos se escriben con los valores de x: (1; 3) significa “entre 1 y 3”.</div>` },
  ],
  sim: { w: 'funcgraph' },
  gen() {
    const G = randomGraph(), k = R(0, 5);
    if (k === 0) { const x = pick(G.pts)[0]; return { type: 'num', q: `${G.svg}¿Cuánto vale <b>f(${num(x)})</b>?`, answer: G.f(x), explain: `Buscá x = ${num(x)} en el eje horizontal y subí hasta el gráfico: y = ${num(G.f(x))}.` }; }
    if (k === 1) { if (G.f(0) == null) return this.gen(); return { type: 'num', q: `${G.svg}¿Cuál es la <b>ordenada al origen</b>?`, answer: G.f(0), explain: `Es donde el gráfico corta al eje y: f(0) = ${num(G.f(0))}.` }; }
    if (k === 2) return mc(`${G.svg}¿Cuál es el <b>dominio</b>?`, G.dom, [G.img, `[${num(G.x0 - 1)}; ${num(G.x1 + 1)}]`, 'ℝ'], 'Los valores de x desde el primer punto hasta el último.');
    if (k === 3) return mc(`${G.svg}¿Cuál es la <b>imagen</b>?`, G.img, [G.dom, `[0; ${num(Math.max(...G.pts.map(p => p[1])))}]`, 'ℝ'].filter(x => x !== G.img).slice(0, 3), 'Los valores de y desde el más bajo hasta el más alto.');
    if (k === 4) { if (G.up === '∅' || G.down === '∅') return this.gen(); return mc(`${G.svg}¿En qué intervalo(s) la función <b>crece</b>?`, G.up, [G.down, G.dom, '∅'], 'Donde el gráfico sube al avanzar hacia la derecha.'); }
    if (!G.zeros.length) return this.gen();
    const z = `{${G.zeros.map(x => num(x)).join(' ; ')}}`; return mc(`${G.svg}¿Cuáles son los <b>ceros</b> de la función?`, z, [`{${num(G.f(0) ?? 1)}}`, `{${G.zeros.map(x => num(-x)).join(' ; ')}}`, '∅'].filter(x => x !== z).slice(0, 3), 'Donde el gráfico corta al eje x.');
  },
};

const lin = (a, b) => `y = ${a === 1 ? '' : a === -1 ? M : num(a)}x${b === 0 ? '' : b > 0 ? ' + ' + num(b) : ' ' + M + ' ' + num(-b)}`;
export { lin };
function lineSVG(a, b) { const A = axes(-6, 6, -6, 6, { w: 260, h: 260, pad: 18 }); const x1 = -6, x2 = 6; return svg(260, 260, A.g + `<line x1="${A.X(x1)}" y1="${A.Y(a * x1 + b)}" x2="${A.X(x2)}" y2="${A.Y(a * x2 + b)}" class="fn"/>`, 'chart sm'); }
const f3 = {
  id: 'f3', icon: '🎚️', title: 'Parámetros de y = ax + b',
  theory: [
    { h: 'Pendiente y ordenada', html: `<p>En la función lineal <b>y = a · x + b</b>:</p><ul><li><b>a</b> es la <b>pendiente</b>: cuánto cambia y cuando x aumenta 1. Si a &gt; 0 la recta crece; si a &lt; 0, decrece; si a = 0, es constante.</li><li><b>b</b> es la <b>ordenada al origen</b>: donde la recta corta al eje y.</li></ul><div class="ex">y = 2x ${M} 3: sube 2 por cada paso a la derecha y corta al eje y en ${M}3.</div>` },
    { h: 'Rectas paralelas', html: `<p>Dos rectas con la <b>misma pendiente</b> son paralelas: y = 2x + 1 e y = 2x ${M} 4.</p><p>Pendiente a partir de dos puntos: a = (y₂ ${M} y₁) / (x₂ ${M} x₁).</p>` },
  ],
  sim: { w: 'linear' },
  gen() {
    const a = Rnz(-4, 4), b = R(-5, 5), k = R(0, 3);
    if (k === 0) return { type: 'num', q: `En la función <b>${lin(a, b)}</b>, ¿cuál es la <b>pendiente</b>?`, answer: a, explain: `Es el número que multiplica a x: ${num(a)}.` };
    if (k === 1) return { type: 'num', q: `En la función <b>${lin(a, b)}</b>, ¿cuál es la <b>ordenada al origen</b>?`, answer: b, explain: `Es el término independiente: ${num(b)}.` };
    if (k === 2) { const x1 = R(-4, 2), x2 = x1 + R(1, 4); return { type: 'num', q: `Una recta pasa por (${num(x1)}; ${num(a * x1 + b)}) y (${num(x2)}; ${num(a * x2 + b)}). ¿Cuál es su pendiente?`, answer: a, explain: `(${num(a * x2 + b)} ${M} ${sg(a * x1 + b)}) / (${num(x2)} ${M} ${sg(x1)}) = ${num(a * (x2 - x1))} / ${x2 - x1} = ${num(a)}` }; }
    return mc(`¿Qué fórmula corresponde a esta recta?${lineSVG(a, b)}`, lin(a, b), [lin(-a, b), lin(a, -b || 2), lin(b || 1, a)].filter(x => x !== lin(a, b)), `Corta al eje y en ${num(b)} y ${a > 0 ? 'sube' : 'baja'} ${Math.abs(a)} por cada unidad.`);
  },
};

const f4 = {
  id: 'f4', icon: '🚕', title: 'Gráficos de variaciones lineales',
  theory: [
    { h: 'Graficar una recta', html: `<ol><li>Marcá la <b>ordenada al origen</b> (0; b).</li><li>Desde ahí, usá la <b>pendiente</b>: avanzá 1 a la derecha y subí (o bajá) a.</li><li>Uní los puntos.</li></ol><p>El <b>cero</b> (donde corta al eje x) se obtiene resolviendo a · x + b = 0 → x = ${M}b / a.</p>` },
    { h: 'Situaciones que son lineales', html: `<div class="ex">Un taxi cobra $ 900 la bajada de bandera y $ 400 por km: y = 400x + 900.<br>Un tanque de 200 L pierde 8 L por hora: y = ${M}8x + 200. Se vacía cuando y = 0 → x = 25 h.</div><div class="tip">Si la variación es constante (siempre suma o resta lo mismo por unidad), la relación es lineal.</div>` },
  ],
  sim: { w: 'linear', opts: { zero: true } },
  gen() {
    const k = R(0, 3);
    if (k === 0) { const a = Rnz(-5, 5), z = R(-5, 5), b = -a * z; return { type: 'num', q: `¿Cuál es el <b>cero</b> de <b>${lin(a, b)}</b>?`, answer: z, explain: `${num(a)}x ${b >= 0 ? '+' : M} ${Math.abs(b)} = 0 → x = ${num(z)}` }; }
    if (k === 1) { const c = R(5, 12) * 100, p = R(2, 6) * 100, km = R(2, 15); return { type: 'num', q: `Un taxi cobra $ ${c} la bajada de bandera y $ ${p} por kilómetro. ¿Cuánto cuesta un viaje de ${km} km?`, answer: c + p * km, unit: '$', explain: `y = ${p}x + ${c} → ${p} · ${km} + ${c} = $ ${c + p * km}` }; }
    if (k === 2) { const r = R(2, 10), h = R(5, 30), V = r * h; return { type: 'num', q: `Un tanque tiene ${V} litros y pierde ${r} litros por hora. ¿En cuántas horas se vacía?`, answer: h, unit: 'h', explain: `y = ${M}${r}x + ${V}; ${M}${r}x + ${V} = 0 → x = ${h} h` }; }
    const a = Rnz(-3, 3), b = R(-4, 4), x = R(-3, 3); return { type: 'num', q: `El punto (${num(x)}; y) pertenece a la recta <b>${lin(a, b)}</b>. ¿Cuánto vale y?`, answer: a * x + b, explain: `y = ${num(a)} · ${sg(x)} + ${sg(b)} = ${num(a * x + b)}` };
  },
};

const f5 = {
  id: 'f5', icon: '✍️', title: 'Producir fórmulas lineales',
  theory: [
    { h: 'De la tabla a la fórmula', html: `<ol><li>Fijate cuánto aumenta y cuando x aumenta 1: esa es la <b>pendiente a</b>.</li><li>Buscá el valor de y cuando x = 0: esa es la <b>ordenada b</b>.</li><li>Escribí y = ax + b y <b>verificá</b> con otro punto de la tabla.</li></ol><div class="ex">x: 0, 1, 2, 3 → y: 5, 8, 11, 14. Aumenta 3 y empieza en 5 → y = 3x + 5</div>` },
    { h: 'Justificar que una fórmula es válida', html: `<p>No alcanza con que funcione para un punto: hay que comprobar que la variación es constante y que la fórmula da bien en todos los datos (o explicar con el problema de dónde sale cada número).</p><div class="tip">En un texto, la cantidad fija suele ser b y lo que cambia “por cada…” es a.</div>` },
  ],
  sim: { w: 'linear', opts: { points: true } },
  gen() {
    const a = Rnz(-4, 5), b = R(-6, 9), k = R(0, 2);
    if (k === 0) { const xs = [0, 1, 2, 3, 4]; return mc(`¿Qué fórmula corresponde a la tabla?<table class="tbl sm"><tr><th>x</th>${xs.map(x => `<td>${x}</td>`).join('')}</tr><tr><th>y</th>${xs.map(x => `<td>${num(a * x + b)}</td>`).join('')}</tr></table>`, lin(a, b), [lin(b || 1, a), lin(a, b + a), lin(-a, b)].filter(x => x !== lin(a, b)), `Aumenta ${num(a)} por cada unidad y en x = 0 vale ${num(b)}.`); }
    if (k === 1) { const fx = R(2, 9) * 50, pv = R(2, 8) * 10; return mc(`Un gimnasio cobra $ ${fx} de inscripción y $ ${pv} por cada clase. ¿Qué fórmula da el costo total y según la cantidad de clases x?`, lin(pv, fx), [lin(fx, pv), lin(pv + fx, 0), lin(pv, -fx)], `Lo fijo es la ordenada (${fx}) y lo que se paga por cada clase es la pendiente (${pv}).`); }
    const ok = Math.random() < .5, x1 = R(1, 3), x2 = x1 + R(1, 3), bb = ok ? b : b + 1; return mc(`¿La fórmula <b>${lin(a, bb)}</b> corresponde a una recta que pasa por (${x1}; ${num(a * x1 + b)}) y (${x2}; ${num(a * x2 + b)})?`, ok ? 'Sí, verifica los dos puntos' : 'No, no verifica los puntos', [ok ? 'No, no verifica los puntos' : 'Sí, verifica los dos puntos'], `Reemplazando x = ${x1}: ${num(a)} · ${x1} + ${sg(bb)} = ${num(a * x1 + bb)} ${a * x1 + bb === a * x1 + b ? '✓' : `≠ ${num(a * x1 + b)}`}`);
  },
};

const f6 = {
  id: 'f6', icon: '⚖️', title: 'Ecuaciones lineales',
  theory: [
    { h: 'Resolver ax + b = cx + d', html: `<p>Agrupá las x en un miembro y los números en el otro, haciendo la misma operación en ambos lados.</p><div class="ex">5x ${M} 7 = 2x + 8 → 5x ${M} 2x = 8 + 7 → 3x = 15 → <b>x = 5</b></div><p>La solución puede ser una fracción: 3x = 2 → x = ${frac(2, 3)}.</p>` },
    { h: 'Ecuaciones y funciones', html: `<p>Resolver a x + b = c x + d es encontrar dónde se <b>cortan</b> las rectas y = ax + b e y = cx + d.</p><ul><li>Pendientes distintas → se cortan en un punto: solución única.</li><li>Misma pendiente, distinta ordenada → paralelas: sin solución.</li><li>Misma recta → infinitas soluciones.</li></ul>` },
  ],
  sim: { w: 'balance' },
  gen() {
    if (Math.random() < .25) { const p1 = R(2, 6) * 100, a1 = R(1, 4) * 50, x = R(2, 12), a2 = a1 + R(1, 3) * 50, p2 = p1 + a1 * x - a2 * x; if (p2 <= 0) return this.gen(); return { type: 'num', q: `La empresa A cobra $ ${p1} fijos más $ ${a1} por hora; la empresa B cobra $ ${p2} fijos más $ ${a2} por hora. ¿Para cuántas horas cuestan lo mismo?`, answer: x, unit: 'h', explain: `${a1}x + ${p1} = ${a2}x + ${p2} → ${p1 - p2} = ${a2 - a1}x → x = ${x}` }; }
    const e = linEq(8, true); return { type: 'num', q: `Resolvé (si da fracción, escribila como fracción):<div class="big sm">${eqHTML(e)}</div>x =`, answer: e.x, explain: solveSteps(e) };
  },
};

export const YEAR3 = {
  id: 3, name: '3.er año', planets: [
    { id: 'p3-1', name: 'Planeta Potencia', subtitle: 'Bloque I · Números racionales', cuat: 1, color: ['#ffd36e', '#ff5c8a'], topics: [r1, r2] },
    { id: 'p3-2', name: 'Planeta Pitágoras', subtitle: 'Bloque II · Geometría', cuat: 1, color: ['#8fb3ff', '#3d6bff'], topics: [p1, p2, p3, p4, p5, p6] },
    { id: 'p3-3', name: 'Planeta Función', subtitle: 'Bloque III · Álgebra y funciones', cuat: 2, color: ['#7cf3c5', '#12a8c9'], topics: [f1, f2, f3, f4, f5, f6] },
  ],
};
