// Contenido de 2° año: teoría + generadores de ejercicios.
import { R, Rnz, pick, shuffle, gcd, Q, num, sg, frac, mc, MINUS, barChart, pieChart, svg, round } from './util.js';

const M = MINUS;
const VF = (q, ok, explain) => mc(q, ok ? 'Verdadero' : 'Falso', [ok ? 'Falso' : 'Verdadero'], explain);
const signo = (a, b) => (a < b ? '<' : a > b ? '>' : '=');

// ===================== BLOQUE I: ENTEROS =====================
const e1 = {
  id: 'e1', icon: '🌡️', title: 'Comparar y ubicar enteros',
  theory: [
    { h: '¿Qué son los números enteros?', html: `<p>Los <b>enteros</b> (ℤ) son los naturales, el cero y los negativos: … ${M}3, ${M}2, ${M}1, 0, 1, 2, 3 …</p><p>Los usamos cuando hay un <b>punto de referencia</b>: bajo cero, bajo el nivel del mar, deudas, pisos de un subsuelo, goles en contra.</p><div class="ex">🌡️ ${M}5 °C = 5 grados bajo cero &nbsp;·&nbsp; 🤿 ${M}12 m = 12 metros bajo el nivel del mar</div>` },
    { h: 'La recta numérica', html: `<p>En la recta, los números <b>aumentan hacia la derecha</b>. Por eso:</p><ul><li>Todo positivo es mayor que cualquier negativo: 1 &gt; ${M}100.</li><li>Entre dos negativos, es mayor el que está más cerca del cero: ${M}2 &gt; ${M}7.</li></ul><div class="tip">Truco: pensá en temperaturas. ¿Hace más frío a ${M}7 °C o a ${M}2 °C? A ${M}7, así que ${M}7 es menor.</div>` },
    { h: 'Opuesto y módulo', html: `<p>El <b>opuesto</b> de un número está a la misma distancia del cero, del otro lado: el opuesto de 4 es ${M}4, y el de ${M}9 es 9.</p><p>El <b>módulo</b> |a| es la distancia al cero (nunca es negativo): |${M}6| = 6 y |6| = 6.</p><div class="ex">Distancia entre ${M}3 y 5 en la recta: 5 ${M} (${M}3) = 8 lugares.</div>` },
  ],
  sim: { w: 'numline', opts: { mode: 'place' } },
  gen() {
    const k = R(0, 5);
    if (k === 0) { const a = R(-20, 20), b = pick([R(-20, 20), -a, a]); return mc(`¿Qué signo va en el lugar del cuadrado?<div class="big">${num(a)} &nbsp;□&nbsp; ${num(b)}</div>`, signo(a, b), ['<', '>', '='].filter(s => s !== signo(a, b)), `En la recta, ${num(Math.min(a, b))} está más a la izquierda${a === b ? ' (son iguales)' : ''}.`); }
    if (k === 1) { const t = R(-8, 6), d = Rnz(-10, 10); return { type: 'num', q: `A las 7 h el termómetro marcaba <b>${num(t)} °C</b>. Al mediodía la temperatura ${d > 0 ? 'subió' : 'bajó'} <b>${Math.abs(d)} °C</b>. ¿Qué temperatura marca ahora?`, answer: t + d, unit: '°C', explain: `${num(t)} ${d > 0 ? '+' : M} ${Math.abs(d)} = ${num(t + d)} °C` }; }
    if (k === 2) { const a = Rnz(-30, 30); return pick([{ type: 'num', q: `¿Cuál es el <b>opuesto</b> de ${num(a)}?`, answer: -a, explain: `El opuesto está a la misma distancia del 0, del otro lado: ${num(-a)}.` }, { type: 'num', q: `¿Cuánto vale <b>|${num(a)}|</b>?`, answer: Math.abs(a), explain: `El módulo es la distancia al cero: ${Math.abs(a)}.` }]); }
    if (k === 3) { const xs = shuffle([...new Set([R(-15, -1), R(-15, -1), R(0, 10), R(-5, 15), R(-20, 20)])]).slice(0, 4); while (xs.length < 4) xs.push(xs[0] + xs.length * 3); const m = pick(['menor', 'mayor']); const ans = m === 'menor' ? Math.min(...xs) : Math.max(...xs); return mc(`¿Cuál es el número <b>${m}</b>?`, num(ans), xs.filter(x => x !== ans).map(x => num(x)), `Ubicados en la recta: ${[...xs].sort((a, b) => a - b).map(x => num(x)).join(' &lt; ')}.`); }
    if (k === 4) { const s = pick([['Un buzo está a 15 m bajo el nivel del mar', -15], ['Un avión vuela a 900 m sobre el nivel del mar', 900], ['El ascensor está en el 3.er subsuelo', -3], ['Debo $ 250', -250], ['El equipo tiene 4 goles en contra más que a favor', -4]]); return mc(`${s[0]}. ¿Qué número lo representa?`, num(s[1]), [num(-s[1]), num(s[1] * 10), '0'].filter(x => x !== num(s[1])).slice(0, 3), 'Lo que está debajo del punto de referencia (o lo que se debe) es negativo.'); }
    const a = R(-15, 5), b = R(a + 1, 15); return { type: 'num', q: `¿Cuál es la <b>distancia</b> en la recta entre ${num(a)} y ${num(b)}?`, answer: b - a, explain: `${num(b)} ${M} ${sg(a)} = ${b - a}` };
  },
};

const e2 = {
  id: 'e2', icon: '➕', title: 'Operaciones en ℤ y propiedades',
  theory: [
    { h: 'Sumar y restar', html: `<p>Sumar un positivo es avanzar a la derecha; sumar un negativo es ir a la izquierda.</p><p><b>Restar es sumar el opuesto:</b> a ${M} b = a + (${M}b).</p><div class="ex">5 ${M} (${M}3) = 5 + 3 = 8 &nbsp;·&nbsp; ${M}4 ${M} 6 = ${M}4 + (${M}6) = ${M}10</div><div class="tip">En ℕ no siempre podías restar (3 ${M} 5 no tenía resultado). En ℤ la resta siempre se puede hacer.</div>` },
    { h: 'Multiplicar y dividir: regla de los signos', html: `<table class="tbl"><tr><th>×  ÷</th><th>+</th><th>${M}</th></tr><tr><th>+</th><td>+</td><td>${M}</td></tr><tr><th>${M}</th><td>${M}</td><td>+</td></tr></table><p>Signos iguales dan <b>positivo</b>; signos distintos dan <b>negativo</b>.</p><div class="ex">(${M}6) · (${M}4) = 24 &nbsp;·&nbsp; 18 : (${M}3) = ${M}6</div>` },
    { h: 'Propiedades (las mismas que en ℕ, y algunas más)', html: `<ul><li><b>Conmutativa</b> (suma y multiplicación): a + b = b + a.</li><li><b>Asociativa</b>: (a + b) + c = a + (b + c).</li><li><b>Distributiva</b>: a · (b + c) = a · b + a · c.</li><li><b>Elemento neutro</b>: a + 0 = a ; a · 1 = a.</li><li><b>Opuesto</b> (nueva en ℤ): a + (${M}a) = 0.</li></ul><div class="tip">La resta y la división NO son conmutativas: 7 ${M} 2 ≠ 2 ${M} 7.</div>` },
    { h: 'Potencias de enteros', html: `<p>Si la base es negativa: exponente <b>par</b> → positivo; exponente <b>impar</b> → negativo.</p><div class="ex">(${M}2)³ = ${M}8 &nbsp;·&nbsp; (${M}3)² = 9 &nbsp;·&nbsp; ojo: ${M}3² = ${M}9 (el signo no está elevado)</div>` },
  ],
  sim: { w: 'numline', opts: { mode: 'jumps' } },
  gen() {
    const k = R(0, 5);
    if (k === 0) { const a = Rnz(-15, 15), b = Rnz(-15, 15), op = pick(['+', M]); const r = op === '+' ? a + b : a - b; return { type: 'num', q: `<div class="big">${num(a)} ${op} ${sg(b)} =</div>`, answer: r, explain: op === M ? `Restar es sumar el opuesto: ${num(a)} + ${sg(-b)} = ${num(r)}` : `${num(a)} + ${sg(b)} = ${num(r)}` }; }
    if (k === 1) { const a = Rnz(-12, 12), b = Rnz(-9, 9); return { type: 'num', q: `<div class="big">${sg(a)} · ${sg(b)} =</div>`, answer: a * b, explain: `Signos ${(a > 0) === (b > 0) ? 'iguales → positivo' : 'distintos → negativo'}: ${num(a * b)}` }; }
    if (k === 2) { const b = Rnz(-9, 9), r = Rnz(-10, 10); return { type: 'num', q: `<div class="big">${num(b * r)} : ${sg(b)} =</div>`, answer: r, explain: `Porque ${sg(r)} · ${sg(b)} = ${num(b * r)}` }; }
    if (k === 3) {
      const a = Rnz(-9, 9), b = Rnz(-9, 9), c = Rnz(-9, 9);
      const props = [
        [`${sg(a)} + ${sg(b)} = ${sg(b)} + ${sg(a)}`, 'Conmutativa'], [`(${sg(a)} · ${sg(b)}) · ${sg(c)} = ${sg(a)} · (${sg(b)} · ${sg(c)})`, 'Asociativa'],
        [`${sg(a)} · (${sg(b)} + ${sg(c)}) = ${sg(a)} · ${sg(b)} + ${sg(a)} · ${sg(c)}`, 'Distributiva'], [`${sg(a)} + 0 = ${sg(a)}`, 'Elemento neutro'], [`${sg(a)} + ${sg(-a)} = 0`, 'Elemento opuesto'],
      ];
      const [e, p] = pick(props);
      return mc(`¿Qué propiedad se usa?<div class="big sm">${e}</div>`, p, ['Conmutativa', 'Asociativa', 'Distributiva', 'Elemento neutro', 'Elemento opuesto'].filter(x => x !== p).sort(() => Math.random() - .5).slice(0, 3));
    }
    if (k === 4) { const b = pick([-3, -2, 2, 3, -1]), e = R(2, 4); const neg = b < 0 && Math.random() < .3; const r = neg ? -(Math.abs(b) ** e) : b ** e; return { type: 'num', q: `<div class="big">${neg ? `${M}${Math.abs(b)}<sup>${e}</sup>` : `${sg(b)}<sup>${e}</sup>`} =</div>`, answer: r, explain: neg ? `Sin paréntesis, solo se eleva el ${Math.abs(b)}: ${M}(${Math.abs(b) ** e}) = ${num(r)}` : `${sg(b)} multiplicado ${e} veces = ${num(r)} (exponente ${e % 2 ? 'impar' : 'par'})` }; }
    return pick([
      VF(`En los números enteros, la resta siempre tiene resultado.`, true, 'Sí: en ℤ siempre podés restar (en ℕ no, por ejemplo 3 − 5).'),
      VF(`La resta es conmutativa: a ${M} b = b ${M} a.`, false, `Contraejemplo: 7 ${M} 2 = 5 pero 2 ${M} 7 = ${M}5.`),
      VF(`El producto de dos números negativos es negativo.`, false, 'Signos iguales dan positivo.'),
      VF(`Todo número entero tiene un opuesto que sumado da 0.`, true, 'a + (−a) = 0.'),
      VF(`(${M}1) elevado a un exponente impar da ${M}1.`, true, 'Exponente impar conserva el signo negativo.'),
    ]);
  },
};

function combo() {
  const t = R(0, 4);
  const a = Rnz(-9, 9), b = Rnz(-6, 6), c = Rnz(-6, 6), d = Rnz(-5, 5);
  if (t === 0) { const r = a + b * c; return { q: `${num(a)} + ${sg(b)} · ${sg(c)}`, r, steps: [`Primero la multiplicación: ${sg(b)} · ${sg(c)} = ${num(b * c)}`, `Después la suma: ${num(a)} + ${sg(b * c)} = ${num(r)}`] }; }
  if (t === 1) { const q = Rnz(-6, 6), r = a * b - q * d * 1 / 1; const dd = d; const cc = q * dd; const res = a * b - cc / dd; return { q: `${sg(a)} · ${sg(b)} ${M} ${sg(cc)} : ${sg(dd)}`, r: res, steps: [`Separamos en términos. ${sg(a)} · ${sg(b)} = ${num(a * b)}`, `${sg(cc)} : ${sg(dd)} = ${num(q)}`, `${num(a * b)} ${M} ${sg(q)} = ${num(res)}`] }; }
  if (t === 2) { const r = (a - b) * c + d; return { q: `(${num(a)} ${M} ${sg(b)}) · ${sg(c)} + ${sg(d)}`, r, steps: [`Primero el paréntesis: ${num(a)} ${M} ${sg(b)} = ${num(a - b)}`, `Multiplicamos: ${sg(a - b)} · ${sg(c)} = ${num((a - b) * c)}`, `Sumamos: ${num((a - b) * c)} + ${sg(d)} = ${num(r)}`] }; }
  if (t === 3) { const r = a - (b + c) * d; return { q: `${num(a)} ${M} (${num(b)} + ${sg(c)}) · ${sg(d)}`, r, steps: [`Paréntesis: ${num(b)} + ${sg(c)} = ${num(b + c)}`, `Multiplicación: ${sg(b + c)} · ${sg(d)} = ${num((b + c) * d)}`, `Resta: ${num(a)} ${M} ${sg((b + c) * d)} = ${num(r)}`] }; }
  const q = Rnz(-5, 5), dv = Rnz(-4, 4), e = Rnz(-4, 4); const top = q * dv; const r = q + c * (d - e);
  return { q: `${sg(top)} : ${sg(dv)} + ${sg(c)} · (${num(d)} ${M} ${sg(e)})`, r, steps: [`Paréntesis: ${num(d)} ${M} ${sg(e)} = ${num(d - e)}`, `División: ${sg(top)} : ${sg(dv)} = ${num(q)}; multiplicación: ${sg(c)} · ${sg(d - e)} = ${num(c * (d - e))}`, `Suma: ${num(q)} + ${sg(c * (d - e))} = ${num(r)}`] };
}
export { combo };

const e3 = {
  id: 'e3', icon: '🧮', title: 'Cálculos combinados con enteros',
  theory: [
    { h: 'El orden importa', html: `<ol><li><b>Paréntesis</b> (de adentro hacia afuera).</li><li><b>Potencias y raíces</b>.</li><li><b>Multiplicaciones y divisiones</b> (de izquierda a derecha).</li><li><b>Sumas y restas</b>.</li></ol><div class="tip">Separá en <b>términos</b>: los signos + y ${M} que están fuera de paréntesis separan términos. Resolvé cada término y al final sumá.</div>` },
    { h: 'Ejemplo resuelto', html: `<div class="ex">${M}8 + 3 · (${M}4) ${M} 12 : (${M}6)<br>= ${M}8 + (${M}12) ${M} (${M}2)<br>= ${M}8 ${M} 12 + 2<br>= <b>${M}18</b></div><p>Fijate que restar ${M}2 es lo mismo que sumar 2.</p>` },
  ],
  sim: { w: 'steps' },
  gen() { const c = combo(); return { type: 'num', q: `Resolvé:<div class="big sm">${c.q}</div>`, answer: c.r, explain: c.steps.join('<br>') }; },
};

// ===================== BLOQUE II: ÁLGEBRA =====================
const PATTERNS = [
  { name: 'cuadraditos hechos con fósforos en fila', a: 3, b: 1, unit: 'fósforos', fig: 'cuadrados' },
  { name: 'triángulos hechos con fósforos en fila', a: 2, b: 1, unit: 'fósforos', fig: 'triángulos' },
  { name: 'mesas cuadradas puestas en fila (en cada lado libre se sienta una persona)', a: 2, b: 2, unit: 'personas', fig: 'mesas' },
  { name: 'hexágonos hechos con palitos en fila', a: 5, b: 1, unit: 'palitos', fig: 'hexágonos' },
  { name: 'pentágonos hechos con palitos en fila', a: 4, b: 1, unit: 'palitos', fig: 'pentágonos' },
];
const a1 = {
  id: 'a1', icon: '🔥', title: 'Fórmulas para contar',
  theory: [
    { h: 'De la figura a la fórmula', html: `<p>Una <b>fórmula</b> permite calcular un resultado para cualquier número de pasos, sin dibujar todo.</p><div class="ex">Cuadraditos con fósforos: 1 cuadrado → 4 fósforos; 2 → 7; 3 → 10 …<br>Cada cuadrado nuevo agrega 3. Fórmula: <b>F = 3 · n + 1</b></div><p>La letra <b>n</b> (variable) representa la cantidad de figuras.</p>` },
    { h: 'Distintos razonamientos, misma fórmula', html: `<p>Ana piensa: “el primero tiene 4 y cada uno agrega 3” → 4 + 3 · (n ${M} 1).</p><p>Bruno piensa: “cada cuadrado tiene 3 propios, más 1 al principio” → 3 · n + 1.</p><p>¡Las dos fórmulas son <b>equivalentes</b>! Dan lo mismo para cualquier n.</p>` },
  ],
  sim: { w: 'pattern' },
  gen() {
    const p = pick(PATTERNS), k = R(0, 2), n = R(5, 40);
    const f = n2 => p.a * n2 + p.b;
    const table = `<table class="tbl sm"><tr><th>Figuras (n)</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>${p.unit}</th><td>${f(1)}</td><td>${f(2)}</td><td>${f(3)}</td><td>${f(4)}</td></tr></table>`;
    if (k === 0) return { type: 'num', q: `Se arman ${p.name}.${table}¿Cuántos ${p.unit} hacen falta para <b>${n}</b> figuras?`, answer: f(n), explain: `Cada figura nueva suma ${p.a}: ${p.a} · ${n} + ${p.b} = ${f(n)}` };
    if (k === 1) return mc(`Se arman ${p.name}.${table}¿Qué fórmula da la cantidad de ${p.unit} para n figuras?`, `${p.a} · n + ${p.b}`, [`${p.a + p.b} · n`, `${p.a} · n`, `n + ${p.a + p.b}`], `De una figura a la siguiente aumenta ${p.a}, y para n = 1 da ${f(1)}.`);
    return { type: 'num', q: `Se arman ${p.name}.${table}Con <b>${f(n)}</b> ${p.unit}, ¿cuántas figuras se arman?`, answer: n, explain: `${p.a} · n + ${p.b} = ${f(n)} → ${p.a} · n = ${f(n) - p.b} → n = ${n}` };
  },
};

const a2 = {
  id: 'a2', icon: '🟰', title: 'Fórmulas equivalentes',
  theory: [
    { h: '¿Cuándo dos fórmulas son equivalentes?', html: `<p>Cuando dan <b>el mismo resultado para cualquier valor</b> de la variable.</p><div class="ex">2 · (x + 3) y 2x + 6 son equivalentes por la propiedad distributiva.</div><div class="tip">Probar con algunos números ayuda a sospechar, pero para estar seguros hay que <b>justificar con propiedades</b>.</div>` },
    { h: 'Propiedades que transforman fórmulas', html: `<ul><li><b>Distributiva</b>: a · (b + c) = a · b + a · c</li><li><b>Sacar factor común</b>: 3x + 3 · 5 = 3 · (x + 5)</li><li><b>Agrupar términos semejantes</b>: 4x + 2x = 6x ; 5x ${M} x = 4x</li><li><b>Conmutativa / asociativa</b> para reordenar.</li></ul><div class="ex">3 · (x + 2) + x = 3x + 6 + x = <b>4x + 6</b></div>` },
  ],
  sim: { w: 'formulas' },
  gen() {
    const k = R(0, 3), a = R(2, 7), b = R(1, 9), c = R(1, 5);
    if (k === 0) return mc(`¿Qué expresión es equivalente a <b>${a} · (x + ${b})</b>?`, `${a}x + ${a * b}`, [`${a}x + ${b}`, `${a + b}x`, `${a}x + ${a + b}`], `Distributiva: ${a} · x + ${a} · ${b} = ${a}x + ${a * b}`);
    if (k === 1) return mc(`¿Qué expresión es equivalente a <b>${a}x + ${c}x ${M} ${b}</b>?`, `${a + c}x ${M} ${b}`, [`${a + c ** 2}x ${M} ${b}`, `${a + c - b}x`, `${a * c}x ${M} ${b}`], `Se agrupan los términos con x: ${a}x + ${c}x = ${a + c}x`);
    if (k === 2) { const x = R(-3, 6); const v = c * (x + b) - a; return { type: 'num', q: `Si <b>x = ${num(x)}</b>, ¿cuánto vale <b>${c} · (x + ${b}) ${M} ${a}</b>?`, answer: v, explain: `${c} · (${num(x)} + ${b}) ${M} ${a} = ${c} · ${sg(x + b)} ${M} ${a} = ${num(v)}` }; }
    const eq = Math.random() < .5;
    return mc(`¿Son equivalentes <b>${a} · (x + ${b}) + x</b> y <b>${eq ? `${a + 1}x + ${a * b}` : `${a + 1}x + ${b}`}</b>?`, eq ? 'Sí, siempre dan lo mismo' : 'No, para algunos x dan distinto', [eq ? 'No, para algunos x dan distinto' : 'Sí, siempre dan lo mismo'], `${a}(x + ${b}) + x = ${a}x + ${a * b} + x = ${a + 1}x + ${a * b}`);
  },
};

function linEq(range = 6, allowFrac = false) {
  let a, c; do { a = Rnz(-6, 9); c = Rnz(-6, 9); } while (a === c);
  let x0;
  if (allowFrac && Math.random() < .35) { const dd = a - c; const nn = Rnz(-9, 9); x0 = new Q(nn, dd); const b = R(-10, 10); const d = new Q(a).mul(x0).add(b).sub(new Q(c).mul(x0)); if (!d.isInt()) return linEq(range, allowFrac); return { a, b, c, d: d.n, x: x0 }; }
  x0 = R(-range, range); const b = R(-12, 12); const d = a * x0 + b - c * x0;
  return { a, b, c, d, x: new Q(x0) };
}
const termX = (a, first = true) => { const s = Math.abs(a) === 1 ? 'x' : `${Math.abs(a)}x`; return a < 0 ? `${M}${s}` : (first ? s : `+ ${s}`); };
const termN = n => (n === 0 ? '' : n < 0 ? ` ${M} ${Math.abs(n)}` : ` + ${n}`);
const side = (a, n) => (a === 0 ? num(n) : `${termX(a)}${termN(n)}`);
export const eqHTML = e => `${side(e.a, e.b)} = ${side(e.c, e.d)}`;
export function solveSteps(e) {
  const A = e.a - e.c, B = e.d - e.b;
  return [`Pasamos las x a un lado y los números al otro: ${termX(e.a)} ${e.c < 0 ? '+' : M} ${Math.abs(e.c) === 1 ? 'x' : Math.abs(e.c) + 'x'} = ${num(e.d)} ${e.b < 0 ? '+' : M} ${Math.abs(e.b)}`, `${num(A)}x = ${num(B)}`, `x = ${num(B)} : ${sg(A)} = ${e.x.text()}`].join('<br>');
}
export { linEq };

const a3 = {
  id: 'a3', icon: '⚖️', title: 'Ecuaciones ax + b = cx + d',
  theory: [
    { h: 'Una ecuación es una balanza', html: `<p>Una ecuación es una igualdad con una incógnita. Resolverla es encontrar el valor de x que la hace verdadera.</p><p>Como en una balanza: si hacés lo mismo <b>en los dos platos</b>, sigue equilibrada.</p><div class="ex">3x + 4 = x + 10<br>Restamos x en ambos lados: 2x + 4 = 10<br>Restamos 4: 2x = 6<br>Dividimos por 2: <b>x = 3</b></div>` },
    { h: 'Siempre verificá', html: `<p>Reemplazá la solución en la ecuación original:</p><div class="ex">3 · 3 + 4 = 13 &nbsp; y &nbsp; 3 + 10 = 13 ✓</div><div class="tip">“Pasar restando” es una forma corta de decir “resto lo mismo en los dos miembros”.</div>` },
  ],
  sim: { w: 'balance' },
  gen() { const e = linEq(); return { type: 'num', q: `Resolvé la ecuación:<div class="big sm">${eqHTML(e)}</div>x =`, answer: e.x.val(), explain: solveSteps(e) }; },
};

const a4 = {
  id: 'a4', icon: '🧩', title: 'Problemas con ecuaciones',
  theory: [
    { h: 'Del problema a la ecuación', html: `<ol><li>Leé y elegí qué representa <b>x</b>.</li><li>Escribí cada dato con x.</li><li>Armá la igualdad y resolvé.</li><li>Verificá que la respuesta tenga sentido.</li></ol><div class="ex">“Pensé un número, lo multipliqué por 3 y le sumé 5. Me dio lo mismo que sumarle 13.”<br>3x + 5 = x + 13 → 2x = 8 → <b>x = 4</b></div>` },
    { h: '¿Cuántas soluciones tiene?', html: `<ul><li><b>Solución única</b>: 2x + 1 = x + 4 → x = 3.</li><li><b>Infinitas soluciones</b>: 2(x + 3) = 2x + 6 → queda 6 = 6, verdadero para todo x.</li><li><b>Sin solución</b>: 2x + 1 = 2x + 5 → queda 1 = 5, falso siempre.</li></ul><div class="tip">Si al simplificar desaparece la x, mirá lo que queda: verdadero → infinitas; falso → ninguna.</div>` },
  ],
  sim: { w: 'eqgraph' },
  gen() {
    const k = R(0, 3);
    if (k === 0) {
      const a = R(2, 6), b = R(1, 9), t = R(0, 2);
      let lhs, rhs, ans;
      if (t === 0) { lhs = `${a}x + ${b}`; rhs = `x + ${b + R(1, 9) * (a - 1)}`; ans = 'Solución única'; }
      else if (t === 1) { lhs = `${a} · (x + ${b})`; rhs = `${a}x + ${a * b}`; ans = 'Infinitas soluciones'; }
      else { lhs = `${a} · (x + ${b})`; rhs = `${a}x + ${a * b + R(1, 5)}`; ans = 'No tiene solución'; }
      return mc(`¿Cuántas soluciones tiene?<div class="big sm">${lhs} = ${rhs}</div>`, ans, ['Solución única', 'Infinitas soluciones', 'No tiene solución'].filter(x => x !== ans), t === 0 ? 'Los coeficientes de x son distintos: hay un único valor.' : t === 1 ? `Al distribuir queda ${a}x + ${a * b} = ${a}x + ${a * b}: verdadero siempre.` : `Al distribuir, las x se cancelan y queda ${a * b} = un número distinto: falso siempre.`);
    }
    if (k === 1) { const x = R(2, 20), m = R(2, 5), s = R(1, 15), t2 = (m - 1) * x + s; return { type: 'num', q: `Pensé un número, lo multipliqué por ${m} y le sumé ${s}. Obtuve lo mismo que si al número le sumo ${t2}. ¿Qué número pensé?`, answer: x, explain: `${m}x + ${s} = x + ${t2} → ${m - 1}x = ${t2 - s} → x = ${x}` }; }
    if (k === 2) { const x = R(3, 30); return { type: 'num', q: `La suma de tres números consecutivos es ${3 * x + 3}. ¿Cuál es el menor?`, answer: x, explain: `x + (x + 1) + (x + 2) = ${3 * x + 3} → 3x + 3 = ${3 * x + 3} → x = ${x}` }; }
    const w = R(3, 15), d = R(2, 8); return { type: 'num', q: `El largo de un rectángulo mide ${d} cm más que el ancho y su perímetro es ${4 * w + 2 * d} cm. ¿Cuánto mide el ancho?`, answer: w, unit: 'cm', explain: `2x + 2(x + ${d}) = ${4 * w + 2 * d} → 4x + ${2 * d} = ${4 * w + 2 * d} → x = ${w}` };
  },
};

// ===================== BLOQUE III: RACIONALES =====================
const NICE = [2, 4, 5, 8, 10, 20, 25];
const q1 = {
  id: 'q1', icon: '🍕', title: 'Representaciones de un racional',
  theory: [
    { h: 'Un mismo número, muchas caras', html: `<p>Un número racional se puede escribir como <b>fracción</b>, como <b>decimal</b>, como <b>porcentaje</b> o como un <b>punto en la recta</b>.</p><div class="ex">${frac(3, 4)} = 0,75 = 75 % &nbsp;·&nbsp; ${frac(1, 2)} = 0,5 = 50 %</div>` },
    { h: 'Pasar de una a otra', html: `<ul><li><b>Fracción → decimal</b>: dividí numerador por denominador. ${frac(3, 8)} = 3 : 8 = 0,375</li><li><b>Decimal → fracción</b>: 0,35 = ${frac(35, 100)} = ${frac(7, 20)} (simplificando)</li><li><b>En la recta</b>: dividí cada unidad en tantas partes como indica el denominador y contá el numerador.</li></ul><div class="tip">Algunas fracciones dan decimales periódicos: ${frac(1, 3)} = 0,333… Elegí la representación más cómoda para cada problema.</div>` },
  ],
  sim: { w: 'fraction' },
  gen() {
    const k = R(0, 3);
    if (k === 0) { const d = pick(NICE), n = R(1, d * 2 - 1); return { type: 'num', q: `Escribí como número decimal:<div class="big">${frac(n, d)}</div>`, answer: n / d, explain: `${n} : ${d} = ${num(n / d, 4)}`, dec: 4 }; }
    if (k === 1) { const d = pick([2, 4, 5, 10, 20, 25]), n = R(1, d - 1), q = new Q(n, d); return mc(`¿Qué fracción es igual a <b>${num(n / d, 3)}</b>?`, q.html(), [new Q(n + 1, d).html(), frac(n, d * 10), frac(d, n)].filter(x => x !== q.html()), `${num(n / d, 3)} = ${frac(Math.round(n / d * 100), 100)} = ${q.html()}`); }
    if (k === 2) { const d = R(2, 8), n = R(1, 2 * d - 1); const W = 400, x0 = 30, u = 170; let g = `<line x1="10" x2="${W - 10}" y1="40" y2="40" class="axis"/>`; for (let i = 0; i <= 2 * d; i++) { const x = x0 + i * u / d; g += `<line x1="${x}" x2="${x}" y1="${i % d ? 34 : 28}" y2="${i % d ? 46 : 52}" class="axis"/>`; if (i % d === 0) g += `<text x="${x}" y="70" text-anchor="middle" class="tick">${i / d}</text>`; } g += `<circle cx="${x0 + n * u / d}" cy="40" r="7" class="pt"/>`; return { type: 'num', q: `¿Qué número marca el punto? (podés escribirlo como fracción)${svg(W, 80, g, 'nl')}`, answer: n / d, explain: `Cada unidad está dividida en ${d} partes y el punto está a ${n} partes del 0: ${frac(n, d)}.` }; }
    const p = pick([10, 20, 25, 50, 75, 40, 5]); return mc(`¿Qué decimal es igual a <b>${p} %</b>?`, num(p / 100), [num(p / 10), num(p), num(p / 1000, 3)], `${p} % = ${frac(p, 100)} = ${num(p / 100)}`);
  },
};

const q2 = {
  id: 'q2', icon: '🔍', title: 'Orden, discretitud y densidad',
  theory: [
    { h: 'Comparar racionales', html: `<p>Para comparar fracciones, llevalas a <b>igual denominador</b> o pasalas a decimal.</p><div class="ex">${frac(2, 3)} y ${frac(3, 4)} → ${frac(8, 12)} &lt; ${frac(9, 12)} → ${frac(2, 3)} &lt; ${frac(3, 4)}</div>` },
    { h: 'ℤ es discreto, ℚ es denso', html: `<ul><li>En los <b>enteros</b>, cada número tiene un <b>siguiente</b>: después del 4 viene el 5, y entre ellos no hay ningún entero. Por eso decimos que ℤ es <b>discreto</b>.</li><li>En los <b>racionales</b>, entre dos números cualesquiera <b>siempre hay infinitos</b> racionales. ℚ es <b>denso</b>: ningún racional tiene “siguiente”.</li></ul><div class="ex">Entre 0,1 y 0,2 están 0,15 ; 0,11 ; 0,101 ; 0,1001 … ¡nunca se terminan!</div><div class="tip">Truco para encontrar uno en el medio: sumá los dos y dividí por 2 (el promedio).</div>` },
  ],
  sim: { w: 'numline', opts: { mode: 'density' } },
  gen() {
    const k = R(0, 2);
    if (k === 0) { let a, b, c, d; do { b = R(2, 9); d = R(2, 9); a = R(1, 2 * b); c = R(1, 2 * d); } while (a * d === c * b && Math.random() < .7); const s = signo(a / b, c / d); return mc(`¿Qué signo va?<div class="big">${frac(a, b)} &nbsp;□&nbsp; ${frac(c, d)}</div>`, s, ['<', '>', '='].filter(x => x !== s), `${frac(a * d, b * d)} ${s === '<' ? '&lt;' : s === '>' ? '&gt;' : '='} ${frac(c * b, b * d)}`); }
    if (k === 1) { const a = R(1, 9) / 10, b = a + 0.1; const ok = round((a + b) / 2, 3); return mc(`¿Qué número está <b>entre</b> ${num(a, 1)} y ${num(b, 1)}?`, num(ok, 3), [num(b + 0.05, 3), num(a - 0.05, 3), num(a * 10, 1)], `El promedio: (${num(a, 1)} + ${num(b, 1)}) : 2 = ${num(ok, 3)}. ¡Y hay infinitos más!`); }
    return pick([
      VF('Entre 3 y 4 no hay ningún número entero.', true, 'ℤ es discreto: el siguiente de 3 es 4.'),
      VF(`Entre ${frac(1, 2)} y ${frac(3, 4)} hay infinitos números racionales.`, true, 'ℚ es denso.'),
      VF('Todo número entero tiene un siguiente.', true, 'El siguiente de n es n + 1.'),
      VF('El siguiente de 0,5 es 0,6.', false, 'Entre 0,5 y 0,6 está 0,55, y muchos más: en ℚ no hay siguiente.'),
      VF('Entre dos números racionales distintos siempre hay otro racional.', true, 'Por ejemplo, su promedio.'),
      mc('¿Cuántos números racionales hay entre 0,1 y 0,2?', 'Infinitos', ['Ninguno', '9', '10'], 'ℚ es denso.'),
    ]);
  },
};

function fracOp() {
  const b = R(2, 9), d = R(2, 9), a = Rnz(-8, 8), c = Rnz(-8, 8), op = pick(['+', M, '·', ':']);
  const A = new Q(a, b), C = new Q(c, d);
  const r = op === '+' ? A.add(C) : op === M ? A.sub(C) : op === '·' ? A.mul(C) : A.div(C);
  const how = op === '+' || op === M ? `Igual denominador: ${frac(a * d, b * d)} ${op} ${frac(c * b, b * d, true)} = ${frac(op === '+' ? a * d + c * b : a * d - c * b, b * d)}` : op === '·' ? `Numerador por numerador y denominador por denominador.` : `Multiplicamos por el inverso de ${C.html(true)}: ${A.html(true)} · ${new Q(C.d, C.n).html(true)}`;
  return { q: `${A.html(true)} ${op} ${C.html(true)}`, r, how };
}
export { fracOp };
const q3 = {
  id: 'q3', icon: '🧪', title: 'Operaciones y propiedades en ℚ',
  theory: [
    { h: 'Sumar y restar fracciones', html: `<p>Buscá un <b>denominador común</b> (el mínimo común múltiplo) y sumá los numeradores.</p><div class="ex">${frac(2, 3)} + ${frac(1, 4)} = ${frac(8, 12)} + ${frac(3, 12)} = ${frac(11, 12)}</div>` },
    { h: 'Multiplicar y dividir', html: `<p><b>Multiplicar</b>: numerador × numerador, denominador × denominador. Simplificá antes si podés.</p><p><b>Dividir</b>: multiplicá por el <b>inverso</b> del divisor.</p><div class="ex">${frac(3, 4)} · ${frac(2, 9)} = ${frac(6, 36)} = ${frac(1, 6)} &nbsp;·&nbsp; ${frac(2, 5)} : ${frac(4, 3)} = ${frac(2, 5)} · ${frac(3, 4)} = ${frac(3, 10)}</div>` },
    { h: 'Las propiedades siguen valiendo', html: `<p>Conmutativa, asociativa y distributiva funcionan igual que en ℤ, y aparece una nueva: todo racional distinto de 0 tiene <b>inverso multiplicativo</b>: ${frac(3, 5)} · ${frac(5, 3)} = 1.</p><div class="tip">Usá la distributiva para calcular mentalmente: ${frac(1, 2)} · (10 + ${frac(2, 3)}) = 5 + ${frac(1, 3)}.</div>` },
  ],
  sim: { w: 'fracops' },
  gen() {
    if (Math.random() < .8) { const f = fracOp(); return { type: 'num', q: `Calculá (escribí la fracción simplificada o el decimal exacto):<div class="big">${f.q} =</div>`, answer: f.r, explain: `${f.how}<br>Resultado: ${f.r.html()}` }; }
    return pick([
      mc(`¿Cuál es el inverso de ${frac(-3, 7)}?`, frac(-7, 3), [frac(7, 3), frac(3, 7), frac(-3, 7)], 'El inverso multiplicado da 1 (mantiene el signo).'),
      mc(`${frac(2, 3)} · (${frac(3, 4)} + ${frac(3, 2)}) es igual a…`, `${frac(2, 3)} · ${frac(3, 4)} + ${frac(2, 3)} · ${frac(3, 2)}`, [`${frac(2, 3)} · ${frac(3, 4)} + ${frac(3, 2)}`, `${frac(2, 3)} + ${frac(3, 4)} · ${frac(3, 2)}`], 'Propiedad distributiva.'),
    ]);
  },
};

const q4 = {
  id: 'q4', icon: '💡', title: 'Estrategias con decimales y fracciones',
  theory: [
    { h: 'Por qué funcionan los algoritmos', html: `<ul><li>Multiplicar por 10, 100, 1000 corre la coma a la <b>derecha</b>; dividir la corre a la <b>izquierda</b>.</li><li>Al multiplicar decimales, el resultado tiene tantas cifras decimales como los dos factores juntos: 0,3 · 0,2 = 0,06 porque ${frac(3, 10)} · ${frac(2, 10)} = ${frac(6, 100)}.</li></ul>` },
    { h: 'Atajos de cálculo mental', html: `<table class="tbl"><tr><td>× 0,5</td><td>es lo mismo que : 2</td></tr><tr><td>× 0,25</td><td>es lo mismo que : 4</td></tr><tr><td>× 0,1</td><td>es lo mismo que : 10</td></tr><tr><td>: 0,5</td><td>es lo mismo que × 2</td></tr><tr><td>: 0,1</td><td>es lo mismo que × 10</td></tr></table><div class="tip">Dividir por un número menor que 1 ¡agranda! 6 : 0,5 = 12.</div>` },
  ],
  sim: { w: 'decimal' },
  gen() {
    const k = R(0, 3);
    if (k === 0) { const x = R(2, 80) * pick([1, 2, 4]); const [f, t] = pick([[0.5, ': 2'], [0.25, ': 4'], [0.1, ': 10'], [10, '']]); return { type: 'num', q: `Calculá mentalmente:<div class="big">${num(x)} · ${num(f)} =</div>`, answer: x * f, explain: t ? `Multiplicar por ${num(f)} es lo mismo que dividir ${t.slice(2) ? 'por ' + t.slice(2) : ''}: ${num(x * f)}` : `Se corre la coma: ${num(x * f)}`, dec: 3 }; }
    if (k === 1) { const x = R(1, 30), f = pick([0.5, 0.1, 0.25, 0.2]); return { type: 'num', q: `<div class="big">${num(x)} : ${num(f)} =</div>`, answer: x / f, explain: `Dividir por ${num(f)} = multiplicar por ${num(1 / f)}: ${num(x / f)}` }; }
    if (k === 2) { const a = R(1, 9) / 10, b = R(1, 9) / 10; return { type: 'num', q: `<div class="big">${num(a, 1)} · ${num(b, 1)} =</div>`, answer: round(a * b, 4), explain: `${frac(Math.round(a * 10), 10)} · ${frac(Math.round(b * 10), 10)} = ${frac(Math.round(a * b * 100), 100)} = ${num(a * b, 2)}`, dec: 3 }; }
    return pick([
      mc('Multiplicar por 0,5 es lo mismo que…', 'Dividir por 2', ['Multiplicar por 5', 'Dividir por 5', 'Restar 0,5'], '0,5 = ½'),
      mc('Si dividís 8 por 0,25, el resultado es…', 'Mayor que 8', ['Menor que 8', 'Igual a 8', 'Negativo'], 'Dividir por un número entre 0 y 1 agranda: 8 : 0,25 = 32.'),
      mc(`Para dividir ${frac(3, 4)} : ${frac(1, 2)} se puede…`, `Multiplicar ${frac(3, 4)} por 2`, [`Multiplicar ${frac(3, 4)} por ${frac(1, 2)}`, 'Restar los numeradores', 'Dividir solo los numeradores'], 'Dividir por ½ es multiplicar por su inverso, 2.'),
    ]);
  },
};

// ===================== BLOQUE IV: GEOMETRÍA =====================
const QUADS = {
  'Cuadrado': '4 lados iguales y 4 ángulos rectos; diagonales iguales, perpendiculares y que se cortan en su punto medio',
  'Rectángulo': '4 ángulos rectos y lados opuestos iguales; diagonales iguales que se cortan en su punto medio',
  'Rombo': '4 lados iguales; diagonales perpendiculares que se cortan en su punto medio',
  'Paralelogramo': 'dos pares de lados paralelos; diagonales que se cortan en su punto medio',
  'Trapecio': 'un solo par de lados paralelos',
  'Romboide': 'dos pares de lados consecutivos iguales; diagonales perpendiculares, solo una corta a la otra en su punto medio',
};
const g1 = {
  id: 'g1', icon: '🔷', title: 'Clasificar cuadriláteros',
  theory: [
    { h: 'La familia de los cuadriláteros', html: `<ul><li><b>Paralelogramos</b> (dos pares de lados paralelos): paralelogramo común, rectángulo, rombo y cuadrado.</li><li><b>Trapecios</b> (un solo par de lados paralelos): isósceles, rectángulo, escaleno.</li><li><b>Romboide</b> (o deltoide): dos pares de lados consecutivos iguales, con forma de barrilete.</li></ul><div class="tip">Un cuadrado es a la vez rectángulo y rombo: cumple las propiedades de los dos.</div>` },
    { h: 'Sus diagonales los delatan', html: `<table class="tbl sm"><tr><th></th><th>Se cortan en el punto medio</th><th>Iguales</th><th>Perpendiculares</th></tr><tr><th>Paralelogramo</th><td>✔</td><td></td><td></td></tr><tr><th>Rectángulo</th><td>✔</td><td>✔</td><td></td></tr><tr><th>Rombo</th><td>✔</td><td></td><td>✔</td></tr><tr><th>Cuadrado</th><td>✔</td><td>✔</td><td>✔</td></tr><tr><th>Romboide</th><td>solo una</td><td></td><td>✔</td></tr><tr><th>Trapecio isósceles</th><td></td><td>✔</td><td></td></tr></table>` },
  ],
  sim: { w: 'quad' },
  gen() {
    const k = R(0, 2);
    if (k === 0) { const [n, p] = pick(Object.entries(QUADS)); return mc(`Tiene ${p}. ¿Qué cuadrilátero es?`, n, shuffle(Object.keys(QUADS).filter(x => x !== n)).slice(0, 3)); }
    if (k === 1) return pick([VF('Todo cuadrado es un rombo.', true, 'Tiene 4 lados iguales.'), VF('Todo rombo es un cuadrado.', false, 'Un rombo puede no tener ángulos rectos.'), VF('Todo rectángulo es un paralelogramo.', true, 'Tiene dos pares de lados paralelos.'), VF('Un trapecio puede tener sus dos pares de lados paralelos.', false, 'Si los tuviera sería un paralelogramo.'), VF('Las diagonales de un rectángulo son perpendiculares.', false, 'Son iguales, pero perpendiculares solo si es cuadrado.'), VF('Las diagonales de un rombo son perpendiculares.', true, 'Se cortan formando ángulos rectos.')]);
    const a = R(40, 140); return { type: 'num', q: `En un paralelogramo, un ángulo mide <b>${a}°</b>. ¿Cuánto mide un ángulo <b>consecutivo</b> a él?`, answer: 180 - a, unit: '°', explain: `En un paralelogramo los ángulos consecutivos suman 180°: 180° ${M} ${a}° = ${180 - a}°` };
  },
};

const g2 = {
  id: 'g2', icon: '🗣️', title: 'Argumentar con propiedades',
  theory: [
    { h: '¿Alcanza con esa condición?', html: `<p>Argumentar es explicar <b>por qué</b> algo es siempre cierto, usando propiedades, no solo un dibujo.</p><div class="ex">“Si las diagonales de un cuadrilátero se cortan en su punto medio, entonces es un paralelogramo.” ✔ Siempre vale.</div><div class="ex">“Si las diagonales son perpendiculares, es un rombo.” ✘ Un romboide también tiene diagonales perpendiculares. Eso es un <b>contraejemplo</b>.</div>` },
    { h: 'Ángulos que ayudan', html: `<ul><li>Los ángulos interiores de un cuadrilátero suman <b>360°</b>.</li><li>En un paralelogramo, los ángulos opuestos son iguales y los consecutivos suman 180°.</li><li>En un romboide, los ángulos entre los lados distintos son iguales.</li></ul>` },
  ],
  sim: { w: 'quad', opts: { challenge: true } },
  gen() {
    const k = R(0, 1);
    if (k === 0) return pick([
      VF('Si las diagonales de un cuadrilátero se cortan en su punto medio, es un paralelogramo.', true, 'Es una propiedad que caracteriza a los paralelogramos.'),
      VF('Si las diagonales son iguales, el cuadrilátero es un rectángulo.', false, 'Contraejemplo: el trapecio isósceles tiene diagonales iguales.'),
      VF('Si las diagonales son iguales y se cortan en su punto medio, es un rectángulo.', true, 'Paralelogramo con diagonales iguales = rectángulo.'),
      VF('Si las diagonales son perpendiculares, el cuadrilátero es un rombo.', false, 'Contraejemplo: el romboide.'),
      VF('Si las diagonales son perpendiculares y se cortan en su punto medio, es un rombo.', true, 'Paralelogramo con diagonales perpendiculares = rombo.'),
      VF('Con dos lados de 5 cm y dos de 3 cm siempre se arma un rectángulo.', false, 'También puede ser un paralelogramo no rectángulo o un romboide.'),
    ]);
    const a = R(50, 130), b = R(50, 130), c = R(40, 120); const d = 360 - a - b - c; if (d <= 10 || d >= 250) return this.gen();
    return { type: 'num', q: `Tres ángulos de un cuadrilátero miden ${a}°, ${b}° y ${c}°. ¿Cuánto mide el cuarto?`, answer: d, unit: '°', explain: `Suman 360°: 360° ${M} ${a}° ${M} ${b}° ${M} ${c}° = ${d}°` };
  },
};

const g3 = {
  id: 'g3', icon: '📐', title: 'Construir figuras con datos',
  theory: [
    { h: '¿Se puede construir?', html: `<p><b>Desigualdad triangular</b>: con tres segmentos se arma un triángulo solo si cada lado es <b>menor que la suma</b> de los otros dos.</p><div class="ex">3, 4 y 5 ✔ (5 &lt; 3 + 4) &nbsp;·&nbsp; 2, 3 y 7 ✘ (7 &gt; 2 + 3)</div><p>Los ángulos de un triángulo suman <b>180°</b>: con 100° y 90° no se puede.</p>` },
    { h: '¿Cuántas figuras distintas salen?', html: `<ul><li>Con los <b>3 lados</b> → un único triángulo.</li><li>Con <b>2 lados y el ángulo comprendido</b> → único.</li><li>Con <b>1 lado y sus 2 ángulos</b> → único.</li><li>Con los <b>3 ángulos</b> → infinitos (del mismo formato y distinto tamaño).</li></ul><div class="tip">Después de construir, controlá: ¿la figura cumple todos los datos?</div>` },
  ],
  sim: { w: 'triangle' },
  gen() {
    const k = R(0, 2);
    if (k === 0) { const a = R(2, 10), b = R(2, 10), c = R(2, 15); const ok = a < b + c && b < a + c && c < a + b; return mc(`¿Se puede construir un triángulo con lados de ${a} cm, ${b} cm y ${c} cm?`, ok ? 'Sí' : 'No', [ok ? 'No' : 'Sí'], ok ? 'Cada lado es menor que la suma de los otros dos.' : `El lado más largo (${Math.max(a, b, c)}) no es menor que la suma de los otros dos.`); }
    if (k === 1) { const a = R(20, 100), b = R(20, 150 - a); return { type: 'num', q: `Dos ángulos de un triángulo miden ${a}° y ${b}°. ¿Cuánto mide el tercero?`, answer: 180 - a - b, unit: '°', explain: `180° ${M} ${a}° ${M} ${b}° = ${180 - a - b}°` }; }
    return pick([mc('¿Cuántos triángulos distintos se pueden construir conociendo sus tres lados?', 'Uno solo', ['Dos', 'Infinitos', 'Ninguno'], 'Tres lados determinan un único triángulo.'), mc('¿Cuántos triángulos distintos hay con ángulos de 50°, 60° y 70°?', 'Infinitos', ['Uno solo', 'Tres', 'Ninguno'], 'Los ángulos fijan la forma pero no el tamaño.'), mc('Con ángulos de 100° y 95°, ¿se puede construir un triángulo?', 'No', ['Sí', 'Solo si es isósceles'], 'Ya suman más de 180°.')]);
  },
};

const g4 = {
  id: 'g4', icon: '🧭', title: 'Instrumentos y graficadores',
  theory: [
    { h: 'Cada instrumento tiene su función', html: `<table class="tbl"><tr><td>📏 Regla</td><td>trazar segmentos y medir longitudes</td></tr><tr><td>📐 Escuadra</td><td>trazar perpendiculares y, deslizando sobre la regla, paralelas</td></tr><tr><td>🧭 Compás</td><td>trazar circunferencias y <b>trasladar medidas</b></td></tr><tr><td>🔺 Transportador</td><td>medir y construir ángulos</td></tr></table>` },
    { h: 'Construir en un graficador', html: `<p>En un graficador (como GeoGebra) ubicamos puntos con coordenadas (x; y). En una cuadrícula, la distancia entre puntos con la misma y es la diferencia de las x.</p><div class="ex">A(1; 2) y B(6; 2): AB = 6 ${M} 1 = 5 unidades.</div><div class="tip">Una buena construcción <b>no se deforma</b> al mover los puntos: si es un cuadrado, sigue siéndolo.</div>` },
  ],
  sim: { w: 'quad', opts: { grid: true } },
  gen() {
    const k = R(0, 2);
    if (k === 0) { const x1 = R(0, 4), y1 = R(0, 4), w = R(2, 7), h = R(2, 6); const kind = pick(['perímetro', 'área']); return { type: 'num', q: `Un rectángulo tiene vértices A(${x1}; ${y1}), B(${x1 + w}; ${y1}), C(${x1 + w}; ${y1 + h}) y D(${x1}; ${y1 + h}). ¿Cuál es su <b>${kind}</b>?`, answer: kind === 'área' ? w * h : 2 * (w + h), explain: `Base = ${w}, altura = ${h}. ${kind === 'área' ? `Área = ${w} · ${h} = ${w * h}` : `Perímetro = 2 · (${w} + ${h}) = ${2 * (w + h)}`}` }; }
    if (k === 1) { const x1 = R(0, 3), y1 = R(0, 3), w = R(2, 6), s = R(1, 3), h = R(2, 5); const D = `(${x1 + s}; ${y1 + h})`; return mc(`A(${x1}; ${y1}), B(${x1 + w}; ${y1}) y C(${x1 + w + s}; ${y1 + h}) son tres vértices del paralelogramo ABCD. ¿Cuáles son las coordenadas de D?`, D, [`(${x1}; ${y1 + h})`, `(${x1 + w}; ${y1 + h})`, `(${x1 + s + 1}; ${y1 + h})`], `DC tiene que ser paralelo e igual a AB (${w} unidades): D = (${x1 + w + s} ${M} ${w}; ${y1 + h}).`); }
    return pick([mc('¿Qué instrumento usás para trasladar una medida sin medirla con números?', 'Compás', ['Transportador', 'Escuadra', 'Calculadora']), mc('Para trazar una recta paralela a otra se usan…', 'Regla y escuadra', ['Solo el compás', 'El transportador', 'Solo la regla']), mc('El transportador sirve para…', 'Medir y construir ángulos', ['Trazar circunferencias', 'Trazar paralelas', 'Medir áreas'])]);
  },
};

const g5 = {
  id: 'g5', icon: '⬢', title: 'Ángulos y diagonales de polígonos',
  theory: [
    { h: 'Suma de ángulos interiores', html: `<p>Desde un vértice, las diagonales dividen un polígono de <b>n lados</b> en <b>n ${M} 2 triángulos</b>. Cada triángulo suma 180°, entonces:</p><div class="ex big sm">S = (n ${M} 2) · 180°</div><p>Hexágono: (6 ${M} 2) · 180° = 720°. Si es <b>regular</b>, cada ángulo mide 720° : 6 = 120°.</p>` },
    { h: 'Cantidad de diagonales', html: `<p>Desde cada vértice salen <b>n ${M} 3</b> diagonales (no se une consigo mismo ni con sus dos vecinos). En total:</p><div class="ex big sm">D = n · (n ${M} 3) : 2</div><p>Se divide por 2 porque cada diagonal se cuenta desde sus dos extremos. Pentágono: 5 · 2 : 2 = 5 diagonales.</p><div class="tip">Los ángulos exteriores de cualquier polígono convexo suman siempre 360°.</div>` },
  ],
  sim: { w: 'polygon' },
  gen() {
    const n = R(5, 12), k = R(0, 4);
    const names = { 5: 'pentágono', 6: 'hexágono', 7: 'heptágono', 8: 'octógono', 9: 'eneágono', 10: 'decágono', 11: 'endecágono', 12: 'dodecágono' };
    if (k === 0) return { type: 'num', q: `¿Cuánto suman los ángulos interiores de un <b>${names[n]}</b>?`, answer: (n - 2) * 180, unit: '°', explain: `(${n} ${M} 2) · 180° = ${(n - 2) * 180}°` };
    if (k === 1) return { type: 'num', q: `¿Cuánto mide cada ángulo interior de un <b>${names[n]} regular</b>?`, answer: (n - 2) * 180 / n, unit: '°', dec: 2, tol: 0.05, explain: `${(n - 2) * 180}° : ${n} = ${num((n - 2) * 180 / n, 2)}°` };
    if (k === 2) return { type: 'num', q: `¿Cuántas diagonales tiene un <b>${names[n]}</b>?`, answer: n * (n - 3) / 2, explain: `${n} · (${n} ${M} 3) : 2 = ${n * (n - 3) / 2}` };
    if (k === 3) return { type: 'num', q: `Un polígono convexo tiene ángulos interiores que suman <b>${(n - 2) * 180}°</b>. ¿Cuántos lados tiene?`, answer: n, explain: `(n ${M} 2) · 180 = ${(n - 2) * 180} → n ${M} 2 = ${n - 2} → n = ${n}` };
    return { type: 'num', q: `¿Cuántas diagonales salen de <b>un solo vértice</b> de un ${names[n]}?`, answer: n - 3, explain: `n ${M} 3 = ${n - 3}` };
  },
};

const g6 = {
  id: 'g6', icon: '📏', title: 'Perímetros y áreas',
  theory: [
    { h: 'Perímetro y área', html: `<p>El <b>perímetro</b> es la longitud del borde (se suma). El <b>área</b> es la superficie que ocupa (se mide en unidades cuadradas: cm², m²).</p>` },
    { h: 'Fórmulas', html: `<table class="tbl"><tr><td>Rectángulo</td><td>b · h</td></tr><tr><td>Cuadrado</td><td>l²</td></tr><tr><td>Triángulo</td><td>b · h : 2</td></tr><tr><td>Paralelogramo</td><td>b · h</td></tr><tr><td>Rombo / romboide</td><td>D · d : 2</td></tr><tr><td>Trapecio</td><td>(B + b) · h : 2</td></tr><tr><td>Polígono regular</td><td>perímetro · apotema : 2</td></tr></table><div class="tip">Todas salen de la del rectángulo: un triángulo es la mitad de un paralelogramo.</div>` },
  ],
  sim: { w: 'areas' },
  gen() {
    const t = R(0, 6), b = R(3, 15), h = R(2, 12);
    if (t === 0) return { type: 'num', q: `Un rectángulo mide ${b} cm de base y ${h} cm de altura. ¿Cuál es su área?`, answer: b * h, unit: 'cm²', explain: `${b} · ${h} = ${b * h} cm²` };
    if (t === 1) return { type: 'num', q: `Un triángulo tiene base ${b} cm y altura ${h} cm. ¿Cuál es su área?`, answer: b * h / 2, unit: 'cm²', explain: `${b} · ${h} : 2 = ${num(b * h / 2)} cm²` };
    if (t === 2) { const B = b + R(2, 8); return { type: 'num', q: `Un trapecio tiene bases de ${B} cm y ${b} cm, y altura ${h} cm. ¿Cuál es su área?`, answer: (B + b) * h / 2, unit: 'cm²', explain: `(${B} + ${b}) · ${h} : 2 = ${num((B + b) * h / 2)} cm²` }; }
    if (t === 3) { const D = b + 2, d = h; return { type: 'num', q: `Las diagonales de un rombo miden ${D} cm y ${d} cm. ¿Cuál es su área?`, answer: D * d / 2, unit: 'cm²', explain: `${D} · ${d} : 2 = ${num(D * d / 2)} cm²` }; }
    if (t === 4) { const n = pick([5, 6, 8]), l = R(2, 10), ap = round(l / (2 * Math.tan(Math.PI / n)), 1); return { type: 'num', q: `Un polígono regular de ${n} lados mide ${l} cm de lado y su apotema mide ${num(ap, 1)} cm. ¿Cuál es su área?`, answer: n * l * ap / 2, unit: 'cm²', tol: 0.06, explain: `Perímetro = ${n} · ${l} = ${n * l} cm. Área = ${n * l} · ${num(ap, 1)} : 2 = ${num(n * l * ap / 2)} cm²` }; }
    if (t === 5) { const l = R(3, 20); return { type: 'num', q: `Un terreno cuadrado tiene ${4 * l} m de perímetro. ¿Cuál es su área?`, answer: l * l, unit: 'm²', explain: `Lado = ${4 * l} : 4 = ${l} m. Área = ${l}² = ${l * l} m²` }; }
    return { type: 'num', q: `Se quiere cercar un patio rectangular de ${b} m por ${h} m. ¿Cuántos metros de alambre hacen falta para una vuelta?`, answer: 2 * (b + h), unit: 'm', explain: `Perímetro = 2 · (${b} + ${h}) = ${2 * (b + h)} m` };
  },
};

// ===================== BLOQUE V: ESTADÍSTICA =====================
const COLORS = ['#7c5cff', '#ff5c8a', '#ffb84d', '#3ddc97', '#4dc9ff', '#ff7a45'];
const SURVEYS = [
  ['Deporte favorito', ['Fútbol', 'Vóley', 'Básquet', 'Hockey', 'Natación']],
  ['Mascota en casa', ['Perro', 'Gato', 'Pez', 'Ninguna']],
  ['Medio para venir a la escuela', ['A pie', 'Colectivo', 'Bici', 'Auto']],
  ['Música preferida', ['Cuarteto', 'Trap', 'Rock', 'Pop', 'Folclore']],
];
const s1 = {
  id: 's1', icon: '📊', title: 'Leer tablas y gráficos',
  theory: [
    { h: 'Leer antes de concluir', html: `<p>Antes de responder, mirá: el <b>título</b> (de qué trata), los <b>ejes</b> (qué se mide y en qué unidad) y la <b>escala</b>.</p><div class="tip">Un eje que no empieza en 0 puede hacer que diferencias chiquitas parezcan enormes. ¡Ojo con los gráficos engañosos!</div>` },
    { h: 'Qué gráfico conviene', html: `<table class="tbl"><tr><td>📊 Barras</td><td>comparar cantidades entre categorías</td></tr><tr><td>🥧 Circular</td><td>mostrar partes de un total (porcentajes)</td></tr><tr><td>📈 Líneas</td><td>ver cómo cambia algo en el tiempo</td></tr><tr><td>🔢 Tabla</td><td>conocer los valores exactos</td></tr></table>` },
  ],
  sim: { w: 'stats' },
  gen() {
    const [title, cats0] = pick(SURVEYS), cats = cats0.slice(0, R(3, cats0.length)), vals = cats.map(() => R(1, 12));
    const chart = barChart(cats, vals, { title, color: COLORS });
    const k = R(0, 3), i = R(0, cats.length - 1); let j = R(0, cats.length - 1); if (j === i) j = (i + 1) % cats.length;
    const tot = vals.reduce((a, b) => a + b, 0);
    if (k === 0) return { type: 'num', q: `${chart}¿Cuántas personas eligieron <b>${cats[i]}</b>?`, answer: vals[i], explain: `La barra de ${cats[i]} llega a ${vals[i]}.` };
    if (k === 1) return { type: 'num', q: `${chart}¿Cuántas personas respondieron la encuesta en total?`, answer: tot, explain: `${vals.join(' + ')} = ${tot}` };
    if (k === 2) return { type: 'num', q: `${chart}¿Cuántas personas más eligieron <b>${cats[vals[i] >= vals[j] ? i : j]}</b> que <b>${cats[vals[i] >= vals[j] ? j : i]}</b>?`, answer: Math.abs(vals[i] - vals[j]), explain: `${Math.max(vals[i], vals[j])} ${M} ${Math.min(vals[i], vals[j])} = ${Math.abs(vals[i] - vals[j])}` };
    const mx = Math.max(...vals), top = cats.filter((_, q) => vals[q] === mx);
    if (top.length > 1) return this.gen();
    return mc(`${chart}¿Cuál fue la opción más elegida?`, top[0], cats.filter(c => c !== top[0]).slice(0, 3), 'Es la barra más alta (la moda).');
  },
};

const s2 = {
  id: 's2', icon: '📝', title: 'Tablas de frecuencia',
  theory: [
    { h: 'Tipos de datos', html: `<ul><li><b>Cualitativos</b>: son cualidades (color preferido, deporte).</li><li><b>Cuantitativos discretos</b>: son números que se cuentan (cantidad de hermanos, goles).</li></ul>` },
    { h: 'Frecuencias', html: `<ul><li><b>Frecuencia absoluta (f)</b>: cuántas veces aparece cada valor.</li><li><b>Frecuencia relativa (fr)</b>: f dividido el total. Siempre entre 0 y 1; todas suman 1.</li><li><b>Porcentaje</b>: fr · 100.</li></ul><div class="ex">Hermanos: 0, 1, 1, 2, 1, 3, 0, 1 (total 8)<br>f(1) = 4 → fr = 4/8 = 0,5 → 50 %</div>` },
  ],
  sim: { w: 'stats' },
  gen() {
    const n = pick([10, 20, 25]), data = Array.from({ length: n }, () => pick([0, 1, 1, 1, 2, 2, 3, 4])), v = pick([...new Set(data)]), f = data.filter(x => x === v).length;
    const list = `<div class="data">${data.join(', ')}</div>`;
    const k = R(0, 2);
    if (k === 0) return { type: 'num', q: `Cantidad de hermanos de ${n} chicos:${list}¿Cuál es la frecuencia absoluta del valor <b>${v}</b>?`, answer: f, explain: `El ${v} aparece ${f} veces.` };
    if (k === 1) return { type: 'num', q: `Cantidad de hermanos de ${n} chicos:${list}¿Cuál es la frecuencia relativa del valor <b>${v}</b>? (en decimal)`, answer: f / n, dec: 3, explain: `${f} : ${n} = ${num(f / n, 3)}` };
    return { type: 'num', q: `Cantidad de hermanos de ${n} chicos:${list}¿Qué <b>porcentaje</b> tiene ${v} hermano${v === 1 ? '' : 's'}?`, answer: 100 * f / n, unit: '%', explain: `${f} : ${n} · 100 = ${num(100 * f / n)} %` };
  },
};

const s3 = {
  id: 's3', icon: '🥧', title: 'Elegir y construir gráficos',
  theory: [
    { h: 'El gráfico adecuado', html: `<p>Cada gráfico comunica mejor un tipo de información:</p><ul><li><b>Barras</b>: comparar categorías o valores discretos.</li><li><b>Circular</b>: cuánto representa cada parte del total. Los sectores suman 100 % (360°).</li><li><b>Líneas</b>: evolución en el tiempo (temperatura durante el día).</li></ul>` },
    { h: 'Construir un gráfico circular', html: `<p>Cada categoría ocupa un ángulo proporcional a su frecuencia relativa:</p><div class="ex">ángulo = fr · 360° &nbsp;·&nbsp; 25 % → 0,25 · 360° = 90°</div>` },
  ],
  sim: { w: 'stats', opts: { pie: true } },
  gen() {
    const k = R(0, 1);
    if (k === 0) return pick([
      mc('Querés mostrar cómo varió la temperatura durante una semana. ¿Qué gráfico conviene?', 'De líneas', ['Circular', 'De barras apiladas', 'Pictograma'], 'Las líneas muestran evolución en el tiempo.'),
      mc('Querés mostrar qué parte del presupuesto escolar se usa en cada rubro. ¿Qué gráfico conviene?', 'Circular', ['De líneas', 'Ninguno', 'Una lista'], 'El circular muestra partes de un total.'),
      mc('Querés comparar cuántos alumnos tiene cada curso de la escuela. ¿Qué gráfico conviene?', 'De barras', ['De líneas', 'Circular', 'Ninguno'], 'Las barras comparan categorías.'),
    ]);
    const p = pick([10, 20, 25, 30, 40, 50, 75]);
    return { type: 'num', q: `En un gráfico circular, una categoría representa el <b>${p} %</b>. ¿Cuántos grados mide su sector?`, answer: 3.6 * p, unit: '°', explain: `${p} % de 360° = 0,${String(p).padStart(2, '0')} · 360° = ${num(3.6 * p)}°` };
  },
};

const s4 = {
  id: 's4', icon: '⚽', title: 'Media y moda',
  theory: [
    { h: 'Media (promedio)', html: `<p>Se suman todos los datos y se divide por la cantidad.</p><div class="ex">Goles: 2, 0, 3, 1, 4 → (2 + 0 + 3 + 1 + 4) : 5 = <b>2</b></div><div class="tip">La media se ve muy afectada por valores extremos: si alguien hace 20 goles, el promedio sube mucho.</div>` },
    { h: 'Moda', html: `<p>Es el valor que <b>más se repite</b>. Puede haber más de una moda, o ninguna.</p><div class="ex">3, 5, 5, 2, 5, 3 → moda = <b>5</b></div><p>La moda también sirve para datos cualitativos (el color más elegido); la media no.</p>` },
  ],
  sim: { w: 'stats' },
  gen() {
    const n = R(5, 8), k = R(0, 2);
    if (k === 0) { let data; do { data = Array.from({ length: n }, () => R(0, 10)); } while ((data.reduce((a, b) => a + b, 0) * 10 / n) % 1); const s = data.reduce((a, b) => a + b, 0); return { type: 'num', q: `Notas de una prueba:<div class="data">${data.join(' ; ')}</div>¿Cuál es la <b>media</b>?`, answer: s / n, dec: 2, explain: `Suma = ${s}; ${s} : ${n} = ${num(s / n, 2)}` }; }
    if (k === 1) { const m = R(1, 6); const data = shuffle([m, m, m, ...Array.from({ length: n - 3 }, () => { let x; do x = R(0, 8); while (x === m); return x; })]); const counts = {}; data.forEach(x => counts[x] = (counts[x] || 0) + 1); if (Object.values(counts).filter(c => c >= 3).length > 1) return this.gen(); return { type: 'num', q: `Goles por partido:<div class="data">${data.join(' ; ')}</div>¿Cuál es la <b>moda</b>?`, answer: m, explain: `El ${m} aparece ${counts[m]} veces, más que cualquier otro.` }; }
    return mc('En un grupo, los sueldos son 300, 320, 310 y 5000 (en miles). ¿Qué representa mejor lo que gana la mayoría?', 'La moda o un valor central, porque el 5000 infla la media', ['La media, siempre', 'El valor máximo', 'El valor mínimo'], 'Un valor extremo desplaza mucho la media.');
  },
};

export const YEAR2 = {
  id: 2, name: '2.º año', planets: [
    { id: 'p2-1', name: 'Planeta Zeta', subtitle: 'Bloque I · Números enteros', cuat: 1, color: ['#ff9a5c', '#ff5c8a'], topics: [e1, e2, e3] },
    { id: 'p2-2', name: 'Planeta Equis', subtitle: 'Bloque II · Álgebra y funciones', cuat: 1, color: ['#7cf3c5', '#2bb5a5'], topics: [a1, a2, a3, a4] },
    { id: 'p2-3', name: 'Planeta Fracción', subtitle: 'Bloque III · Números racionales', cuat: 2, color: ['#ffd36e', '#ff9a3c'], topics: [q1, q2, q3, q4] },
    { id: 'p2-4', name: 'Planeta Polígono', subtitle: 'Bloque IV · Geometría', cuat: 2, color: ['#8fb3ff', '#5c6bff'], topics: [g1, g2, g3, g4, g5, g6] },
    { id: 'p2-5', name: 'Planeta Datos', subtitle: 'Bloque V · Estadística', cuat: 2, color: ['#e7a3ff', '#a14cff'], topics: [s1, s2, s3, s4] },
  ],
};
