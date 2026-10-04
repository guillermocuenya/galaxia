// Simuladores interactivos. Cada uno recibe un contenedor y lo llena.
import { R, Rnz, pick, Q, num, sg, frac, svg, round, gcd, compileFormula, barChart, pieChart, axes, MINUS } from './util.js';
import { combo, linEq, eqHTML } from './content2.js';
import { randomGraph, lin } from './content3.js';

const M = MINUS;
const $ = (s, el) => el.querySelector(s);
const $$ = (s, el) => [...el.querySelectorAll(s)];
const slider = (id, label, min, max, step, val) => `<label class="sl"><span>${label} <b id="${id}-v">${num(val)}</b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
const val = (el, id) => +$('#' + id, el).value;
function live(el, ids, fn) { ids.forEach(id => { const i = $('#' + id, el); i.addEventListener('input', () => { const v = $('#' + id + '-v', el); if (v) v.textContent = num(+i.value); fn(); }); }); fn(); }
function svgPoint(svgEl, e) { const p = svgEl.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svgEl.getScreenCTM().inverse()); }
const COL = ['#7c5cff', '#ff5c8a', '#ffb84d', '#3ddc97', '#4dc9ff', '#ff7a45', '#e7a3ff'];
let onWin = () => {};
export function setWinHandler(fn) { onWin = fn; }

// ---------- 1. Recta numérica ----------
function numline(el, { mode = 'place' } = {}) {
  if (mode === 'jumps') return jumps(el);
  if (mode === 'density') return density(el);
  let target = Rnz(-10, 10), pos = 0, hits = 0;
  const W = 640, X = v => 20 + (v + 10) * 30;
  el.innerHTML = `<p class="sim-q">🎯 Arrastrá la nave hasta el número <b id="tg"></b> y tocá <b>Comprobar</b>.</p><div class="svgbox"><svg viewBox="0 0 ${W} 110" id="nl"></svg></div><div class="sim-row"><button class="btn primary" id="chk">Comprobar</button><button class="btn" id="nx">Otro número</button><span class="pill">Aciertos: <b id="hits">0</b></span></div><p class="sim-out" id="out"></p>`;
  const s = $('#nl', el);
  const draw = () => {
    let g = `<line x1="10" x2="${W - 10}" y1="70" y2="70" class="axis"/>`;
    for (let v = -10; v <= 10; v++) g += `<line x1="${X(v)}" x2="${X(v)}" y1="${v % 5 ? 64 : 58}" y2="${v % 5 ? 76 : 82}" class="axis"/>${v % 5 === 0 ? `<text x="${X(v)}" y="100" text-anchor="middle" class="tick">${num(v)}</text>` : ''}`;
    g += `<g transform="translate(${X(pos)},40)" class="drag"><text text-anchor="middle" font-size="30">🚀</text><text y="-26" text-anchor="middle" class="tick b">${num(pos)}</text></g>`;
    s.innerHTML = g;
  };
  const setTarget = () => { target = Rnz(-10, 10); $('#tg', el).textContent = num(target); $('#out', el).textContent = ''; };
  let drag = false;
  s.addEventListener('pointerdown', e => { drag = true; s.setPointerCapture(e.pointerId); move(e); });
  s.addEventListener('pointermove', e => drag && move(e));
  s.addEventListener('pointerup', () => (drag = false));
  function move(e) { const p = svgPoint(s, e); pos = Math.max(-10, Math.min(10, Math.round((p.x - 20) / 30 - 10))); draw(); }
  $('#chk', el).onclick = () => { const ok = pos === target; $('#out', el).innerHTML = ok ? `✅ ¡Exacto! ${num(target)} está ${target < 0 ? 'a la izquierda' : 'a la derecha'} del 0.` : `❌ Estás en ${num(pos)}. ${pos < target ? 'Tenés que ir más a la derecha.' : 'Tenés que ir más a la izquierda.'}`; if (ok) { hits++; $('#hits', el).textContent = hits; onWin(); setTimeout(setTarget, 900); } };
  $('#nx', el).onclick = setTarget;
  setTarget(); draw();
}
function jumps(el) {
  const W = 640, X = v => 20 + (v + 15) * 20;
  el.innerHTML = `<p class="sim-q">Mirá cómo se mueve la nave en la recta. Restar es sumar el opuesto.</p><div class="sim-row">${slider('ja', 'a =', -10, 10, 1, -3)}<select id="jop"><option value="+">+</option><option value="-">${M}</option></select>${slider('jb', 'b =', -10, 10, 1, 5)}</div><div class="svgbox"><svg viewBox="0 0 ${W} 130" id="js"></svg></div><p class="sim-out big sm" id="jo"></p>`;
  const s = $('#js', el);
  const draw = () => {
    const a = val(el, 'ja'), b = val(el, 'jb'), op = $('#jop', el).value, step = op === '+' ? b : -b, r = a + step;
    let g = `<line x1="10" x2="${W - 10}" y1="90" y2="90" class="axis"/>`;
    for (let v = -15; v <= 15; v++) g += `<line x1="${X(v)}" x2="${X(v)}" y1="85" y2="95" class="axis"/>${v % 5 === 0 ? `<text x="${X(v)}" y="115" text-anchor="middle" class="tick">${num(v)}</text>` : ''}`;
    const arc = (x1, x2, y, c) => `<path d="M${X(x1)} 90 Q ${(X(x1) + X(x2)) / 2} ${y} ${X(x2)} 90" fill="none" stroke="${c}" stroke-width="3" marker-end="url(#ar${c.slice(1)})"/>`;
    g += `<defs>${['#4dc9ff', '#ff5c8a'].map(c => `<marker id="ar${c.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('')}</defs>`;
    if (a) g += arc(0, a, 40, '#4dc9ff'); if (step && r >= -15 && r <= 15) g += arc(a, r, 10, '#ff5c8a');
    if (r >= -15 && r <= 15) g += `<text x="${X(r)}" y="80" text-anchor="middle" font-size="22">🚀</text>`;
    s.innerHTML = g;
    $('#jo', el).innerHTML = `${num(a)} ${op === '+' ? '+' : M} ${sg(b)} ${op === '-' ? `= ${num(a)} + ${sg(-b)}` : ''} = <b>${num(r)}</b>`;
  };
  $('#jop', el).onchange = draw;
  live(el, ['ja', 'jb'], draw);
}
function density(el) {
  let lo = 0, step = 1, mode = 'Q';
  const W = 640;
  el.innerHTML = `<p class="sim-q">Tocá entre dos marcas para hacer <b>zoom</b>. ¿Se acaban alguna vez los números?</p><div class="sim-row"><button class="btn" id="dz">Volver a empezar</button><button class="btn" id="dzz">Ver en ℤ (enteros)</button></div><div class="svgbox"><svg viewBox="0 0 ${W} 120" id="ds"></svg></div><p class="sim-out" id="do"></p>`;
  const s = $('#ds', el);
  const dec = () => Math.max(0, Math.round(-Math.log10(step / 10)));
  const draw = () => {
    let g = `<line x1="10" x2="${W - 10}" y1="60" y2="60" class="axis"/>`;
    const X = i => 30 + i * 58;
    for (let i = 0; i <= 10; i++) { const v = lo + i * step / 10; g += `<line x1="${X(i)}" x2="${X(i)}" y1="${i % 5 ? 52 : 46}" y2="${i % 5 ? 68 : 74}" class="axis"/>`; if (mode === 'Q' || i === 0 || i === 10) g += `<text x="${X(i)}" y="96" text-anchor="middle" class="tick" ${i % 5 ? 'font-size="10"' : ''}>${num(v, dec())}</text>`; if (i < 10 && mode === 'Q') g += `<rect x="${X(i)}" y="30" width="58" height="50" fill="transparent" class="zoomhit" data-i="${i}"/>`; }
    s.innerHTML = g;
    $('#do', el).innerHTML = mode === 'Q' ? `Entre <b>${num(lo, dec())}</b> y <b>${num(lo + step, dec())}</b> hay infinitos racionales. Zoom ×${num(1 / step, 0)}. ¡Tocá de nuevo!` : `Entre <b>${lo}</b> y <b>${lo + 1}</b> no hay ningún entero: ℤ es <b>discreto</b>.`;
    $$('.zoomhit', s).forEach(r => r.onclick = () => { if (step < 1e-6) { $('#do', el).innerHTML += ' 🤯 (paramos acá, pero podríamos seguir para siempre)'; return; } lo = round(lo + (+r.dataset.i) * step / 10, 10); step = step / 10; onWin(); draw(); });
  };
  $('#dz', el).onclick = () => { lo = 0; step = 1; mode = 'Q'; draw(); };
  $('#dzz', el).onclick = () => { lo = 3; step = 1; mode = 'Z'; draw(); };
  draw();
}

// ---------- 2. Paso a paso ----------
function steps(el) {
  let c, i;
  el.innerHTML = `<p class="sim-q">Resolvé en tu carpeta y después revelá cada paso.</p><div class="big sm calc" id="sq"></div><ol id="sl" class="steps"></ol><div class="sim-row"><button class="btn primary" id="sn">Siguiente paso</button><button class="btn" id="sr">Nuevo cálculo</button></div>`;
  const reset = () => { c = combo(); i = 0; $('#sq', el).innerHTML = c.q; $('#sl', el).innerHTML = ''; $('#sn', el).disabled = false; };
  $('#sn', el).onclick = () => { if (i < c.steps.length) { $('#sl', el).insertAdjacentHTML('beforeend', `<li class="pop">${c.steps[i++]}</li>`); } if (i >= c.steps.length) { $('#sn', el).disabled = true; $('#sl', el).insertAdjacentHTML('beforeend', `<li class="pop res">Resultado: <b>${num(c.r)}</b></li>`); onWin(); } };
  $('#sr', el).onclick = reset; reset();
}

// ---------- 3. Patrones con fósforos ----------
function pattern(el) {
  el.innerHTML = `<p class="sim-q">Mové el control y contá los fósforos. ¿Podés escribir una fórmula que funcione para cualquier n?</p><div class="sim-row"><select id="pk"><option value="sq">Cuadrados</option><option value="tr">Triángulos</option><option value="hx">Hexágonos</option></select>${slider('pn', 'n =', 1, 10, 1, 3)}</div><div class="svgbox"><svg viewBox="0 0 640 150" id="ps"></svg></div><p class="sim-out" id="pc"></p><div class="sim-row"><label class="grow">Tu fórmula (usá n): <input id="pf" placeholder="por ejemplo 3n + 1"></label><button class="btn primary" id="pt">Probar</button></div><p class="sim-out" id="po"></p>`;
  const s = $('#ps', el), F = { sq: n => 3 * n + 1, tr: n => 2 * n + 1, hx: n => 5 * n + 1 };
  const stick = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="stick"/><circle cx="${x2}" cy="${y2}" r="3.5" class="head"/>`;
  const draw = () => {
    const n = val(el, 'pn'), k = $('#pk', el).value; let g = '';
    const L = Math.min(55, 560 / (n * (k === 'hx' ? 1.6 : 1) + 1)), x0 = 20, y0 = 120;
    if (k === 'sq') { g += stick(x0, y0, x0, y0 - L); for (let i = 0; i < n; i++) { const x = x0 + i * L; g += stick(x, y0 - L, x + L, y0 - L) + stick(x, y0, x + L, y0) + stick(x + L, y0, x + L, y0 - L); } }
    if (k === 'tr') { const h = L * 0.87; g += stick(x0, y0, x0 + L / 2, y0 - h); for (let i = 0; i < n; i++) { if (i % 2 === 0) { const x = x0 + (i / 2) * L; g += stick(x, y0, x + L, y0) + stick(x + L / 2, y0 - h, x + L, y0); } else { const x = x0 + ((i - 1) / 2) * L + L / 2; g += stick(x, y0 - h, x + L, y0 - h) + stick(x + L, y0 - h, x + L / 2, y0); } } }
    if (k === 'hx') { const r = L / 1.2, w = r * 1.5; const P = (cx, j) => [cx + r * Math.cos(Math.PI / 3 * j), 75 + r * Math.sin(Math.PI / 3 * j)]; for (let i = 0; i < n; i++) { const cx = x0 + r + i * w * 2 * 0.87 / 1.3 * 1.15; for (let j = 0; j < 6; j++) { if (i > 0 && j === 3) continue; const [a, b] = P(cx, j), [c, d] = P(cx, j + 1); g += stick(a, b, c, d); } } }
    s.innerHTML = g; $('#pc', el).innerHTML = `Con <b>${n}</b> figura${n > 1 ? 's' : ''} se usan <b>${F[k](n)}</b> fósforos.`;
  };
  $('#pk', el).onchange = draw; live(el, ['pn'], draw);
  $('#pt', el).onclick = () => { const k = $('#pk', el).value; try { const f = compileFormula($('#pf', el).value); const bad = [1, 2, 3, 5, 10, 25].find(n => Math.abs(f(n) - F[k](n)) > 1e-9); $('#po', el).innerHTML = bad == null ? '✅ ¡Tu fórmula funciona para todos los casos que probé! Es equivalente a la correcta.' : `❌ Para n = ${bad} tu fórmula da ${num(f(bad))}, pero hacen falta ${F[k](bad)}.`; if (bad == null) onWin(); } catch (e) { $('#po', el).textContent = '⚠️ ' + e.message; } };
  draw();
}

// ---------- 4. Comparador de fórmulas ----------
function formulas(el) {
  el.innerHTML = `<p class="sim-q">Escribí dos fórmulas con x y compará sus valores. ¿Son equivalentes?</p><div class="sim-row"><label class="grow">Fórmula A <input id="fa" value="2(x + 3)"></label><label class="grow">Fórmula B <input id="fb" value="2x + 6"></label></div><div id="ft"></div><p class="sim-out" id="fo"></p><div class="sim-row wrap"><button class="btn sm" data-p="3(x+2)+x|4x+6">3(x+2)+x y 4x+6</button><button class="btn sm" data-p="(x+1)^2|x^2+1">(x+1)² y x²+1</button><button class="btn sm" data-p="5x-2x|3x">5x−2x y 3x</button><button class="btn sm" data-p="2(x-4)|2x-4">2(x−4) y 2x−4</button></div>`;
  const run = () => {
    try {
      const A = compileFormula($('#fa', el).value), B = compileFormula($('#fb', el).value), xs = [-3, -2, -1, 0, 1, 2, 3, 10];
      $('#ft', el).innerHTML = `<table class="tbl sm"><tr><th>x</th>${xs.map(x => `<td>${num(x)}</td>`).join('')}</tr><tr><th>A</th>${xs.map(x => `<td>${num(A(x))}</td>`).join('')}</tr><tr><th>B</th>${xs.map(x => `<td class="${Math.abs(A(x) - B(x)) < 1e-9 ? 'ok' : 'bad'}">${num(B(x))}</td>`).join('')}</tr></table>`;
      const diff = xs.some(x => Math.abs(A(x) - B(x)) > 1e-9) || [0.5, 7.3, -4.1].some(x => Math.abs(A(x) - B(x)) > 1e-6);
      $('#fo', el).innerHTML = diff ? '❌ No son equivalentes: encontramos valores de x donde dan distinto.' : '✅ Dan lo mismo en todos los valores probados. Parecen equivalentes: ¿podés justificarlo con propiedades?';
    } catch (e) { $('#fo', el).textContent = '⚠️ ' + e.message; }
  };
  $$('[data-p]', el).forEach(b => b.onclick = () => { const [a, c] = b.dataset.p.split('|'); $('#fa', el).value = a; $('#fb', el).value = c; run(); });
  $('#fa', el).oninput = $('#fb', el).oninput = run; run();
}

// ---------- 5. Balanza ----------
function balance(el) {
  let e, st;
  el.innerHTML = `<p class="sim-q">Hacé la misma operación en los dos platos hasta dejar <b>x</b> sola.</p><div class="big sm calc" id="be"></div><div class="svgbox"><svg viewBox="0 0 640 220" id="bs"></svg></div><div class="sim-row wrap"><button class="btn" data-o="u-">${M}1 a ambos</button><button class="btn" data-o="u+">+1 a ambos</button><button class="btn" data-o="x-">${M}x a ambos</button><button class="btn" data-o="x+">+x a ambos</button><button class="btn" data-o="div">÷ a ambos</button><button class="btn primary" data-o="new">Nueva ecuación</button></div><p class="sim-out" id="bo"></p><p class="muted">🟦 = x &nbsp; 🟨 = +1 &nbsp; 🎈 rojo = ${M}1 (tira para arriba) &nbsp; 🎈 violeta = ${M}x</p>`;
  const s = $('#bs', el);
  const items = (a, b, cx) => {
    let g = '', i = 0; const pos = () => { const col = i % 6, row = Math.floor(i / 6); i++; return [cx - 72 + col * 24, 114 - row * 26]; };
    const nx = Math.min(Math.abs(a), 12), nu = Math.min(Math.abs(b), 24 - nx);
    for (let k = 0; k < nx; k++) { const [x, y] = pos(); g += a > 0 ? `<rect x="${x}" y="${y}" width="22" height="22" rx="5" fill="#4dc9ff"/><text x="${x + 11}" y="${y + 16}" text-anchor="middle" class="tick b" fill="#012">x</text>` : `<circle cx="${x + 11}" cy="${y + 4}" r="10" fill="#a14cff"/><line x1="${x + 11}" y1="${y + 14}" x2="${x + 11}" y2="${y + 22}" stroke="#a14cff"/><text x="${x + 11}" y="${y + 9}" text-anchor="middle" class="tick b" fill="#fff">x</text>`; }
    for (let k = 0; k < nu; k++) { const [x, y] = pos(); g += b > 0 ? `<rect x="${x + 3}" y="${y + 5}" width="16" height="16" rx="3" fill="#ffd36e"/>` : `<circle cx="${x + 11}" cy="${y + 8}" r="8" fill="#ff5c8a"/><line x1="${x + 11}" y1="${y + 16}" x2="${x + 11}" y2="${y + 22}" stroke="#ff5c8a"/>`; }
    if (Math.abs(a) > nx || Math.abs(b) > nu) g += `<text x="${cx}" y="160" text-anchor="middle" class="tick">(hay más piezas de las que se ven)</text>`;
    return g;
  };
  const draw = () => {
    const [a, b, c, d] = st;
    const L = { a, b, c: 0, d: 0 }, Rr = { a: c, b: d };
    s.innerHTML = `<polygon points="320,200 300,220 340,220" fill="#888"/><line x1="320" y1="140" x2="320" y2="205" stroke="#888" stroke-width="6"/><line x1="120" y1="140" x2="520" y2="140" stroke="#bbb" stroke-width="6" stroke-linecap="round"/><path d="M60 140 h120 l-15 12 h-90z" fill="#666"/><path d="M460 140 h120 l-15 12 h-90z" fill="#666"/>${items(a, b, 120)}${items(c, d, 520)}`;
    $('#be', el).innerHTML = eqHTML({ a: L.a, b: L.b, c: Rr.a, d: Rr.b });
    if (a === 1 && b === 0 && c === 0) { $('#bo', el).innerHTML = `🎉 ¡Resuelta! <b>x = ${num(d)}</b>. Verificá en la ecuación original: ${eqHTML(e)}`; onWin(); }
    else if (a === 0 && c === 1 && d === 0) { $('#bo', el).innerHTML = `🎉 ¡Resuelta! <b>x = ${num(b)}</b>.`; onWin(); }
    else $('#bo', el).innerHTML = '';
  };
  const fresh = () => { const x0 = R(1, 4), a = R(2, 4), c = R(0, a - 1), b = R(0, 6), d = a * x0 + b - c * x0; e = { a, b, c, d, x: new Q(x0) }; st = [a, b, c, d]; draw(); };
  $$('[data-o]', el).forEach(btn => btn.onclick = () => {
    const o = btn.dataset.o;
    if (o === 'new') return fresh();
    if (o === 'u-') { st[1]--; st[3]--; } if (o === 'u+') { st[1]++; st[3]++; } if (o === 'x-') { st[0]--; st[2]--; } if (o === 'x+') { st[0]++; st[2]++; }
    if (o === 'div') { const [a, b, c, d] = st; if (b === 0 && c === 0 && a !== 0 && d % a === 0) st = [1, 0, 0, d / a]; else if (b === 0 && c === 0 && a !== 0) { $('#bo', el).innerHTML = `x = ${frac(d, a)} (no da entero, ¡pero es la solución!)`; return; } else { $('#bo', el).innerHTML = '💡 Primero dejá todas las x de un lado y todos los números del otro.'; return; } }
    draw();
  });
  fresh();
}

// ---------- 6. Ecuaciones como rectas ----------
function eqgraph(el) {
  el.innerHTML = `<p class="sim-q">Cada miembro de la ecuación es una recta. ¿Dónde se cortan?</p><div class="sim-row wrap">${slider('ea', 'a', -3, 3, 1, 2)}${slider('eb', 'b', -5, 5, 1, 1)}${slider('ec', 'c', -3, 3, 1, 1)}${slider('ed', 'd', -5, 5, 1, 4)}</div><div class="big sm calc" id="eqe"></div><div class="svgbox"><svg viewBox="0 0 420 320" id="eqs"></svg></div><p class="sim-out" id="eqo"></p>`;
  const draw = () => {
    const a = val(el, 'ea'), b = val(el, 'eb'), c = val(el, 'ec'), d = val(el, 'ed');
    const A = axes(-6, 6, -6, 6, { w: 420, h: 320 }), L = (m, n, col) => `<line x1="${A.X(-6)}" y1="${A.Y(m * -6 + n)}" x2="${A.X(6)}" y2="${A.Y(m * 6 + n)}" stroke="${col}" stroke-width="3"/>`;
    let g = A.g + `<clipPath id="cp"><rect x="28" y="28" width="364" height="264"/></clipPath><g clip-path="url(#cp)">${L(a, b, '#ff5c8a')}${L(c, d, '#4dc9ff')}</g>`;
    let msg;
    if (a !== c) { const x = (d - b) / (a - c), y = a * x + b; if (Math.abs(x) <= 6 && Math.abs(y) <= 6) g += `<circle cx="${A.X(x)}" cy="${A.Y(y)}" r="7" class="pt"/>`; msg = `✅ Pendientes distintas: se cortan en un punto. <b>Solución única: x = ${num(x)}</b>`; }
    else if (b === d) msg = '♾️ Son la misma recta: <b>infinitas soluciones</b>.';
    else msg = '🚫 Rectas paralelas: nunca se cortan. <b>No tiene solución</b>.';
    $('#eqs', el).innerHTML = g; $('#eqo', el).innerHTML = msg;
    $('#eqe', el).innerHTML = `<span style="color:#ff5c8a">${lin(a, b).replace('y = ', '') || '0'}</span> = <span style="color:#4dc9ff">${lin(c, d).replace('y = ', '') || '0'}</span>`;
  };
  live(el, ['ea', 'eb', 'ec', 'ed'], draw);
}

// ---------- 7. Fracciones ----------
function fraction(el) {
  el.innerHTML = `<p class="sim-q">Cambiá numerador y denominador y mirá las distintas representaciones.</p><div class="sim-row">${slider('fn', 'Numerador', 0, 24, 1, 3)}${slider('fd', 'Denominador', 1, 12, 1, 4)}</div><div class="rep" id="fr"></div><div class="svgbox"><svg viewBox="0 0 640 170" id="fs"></svg></div>`;
  const draw = () => {
    const n = val(el, 'fn'), d = val(el, 'fd'), q = new Q(n, d);
    $('#fr', el).innerHTML = `<div><small>Fracción</small><b>${frac(n, d)}</b></div><div><small>Simplificada</small><b>${q.html()}</b></div><div><small>Decimal</small><b>${num(n / d, 4)}${(d % 3 === 0 && n % 3 && (d / gcd(n, d)) % 3 === 0) ? '…' : ''}</b></div><div><small>Porcentaje</small><b>${num(100 * n / d, 1)} %</b></div>`;
    let g = ''; const bars = Math.max(1, Math.ceil(n / d)); const bw = Math.min(190, 600 / Math.min(bars, 3) - 10);
    for (let b = 0; b < Math.min(bars, 3); b++) for (let i = 0; i < d; i++) { const k = b * d + i; g += `<rect x="${20 + b * (bw + 12) + i * bw / d}" y="10" width="${bw / d}" height="40" class="cell ${k < n ? 'on' : ''}"/>`; }
    const X = v => 30 + v * 190; g += `<line x1="20" x2="620" y1="120" y2="120" class="axis"/>`;
    for (let i = 0; i <= 3 * d; i++) g += `<line x1="${X(i / d)}" x2="${X(i / d)}" y1="${i % d ? 114 : 108}" y2="${i % d ? 126 : 132}" class="axis"/>${i % d ? '' : `<text x="${X(i / d)}" y="152" text-anchor="middle" class="tick">${i / d}</text>`}`;
    if (n / d <= 3) g += `<circle cx="${X(n / d)}" cy="120" r="8" class="pt"/>`;
    $('#fs', el).innerHTML = g;
  };
  live(el, ['fn', 'fd'], draw);
}

// ---------- 8. Operaciones con fracciones ----------
function fracops(el) {
  el.innerHTML = `<p class="sim-q">Elegí dos fracciones y una operación: te mostramos el camino.</p><div class="sim-row wrap">${slider('oa', 'a', -9, 9, 1, 2)}${slider('ob', 'b', 1, 9, 1, 3)}<select id="oop"><option>+</option><option>${M}</option><option>·</option><option>:</option></select>${slider('oc', 'c', -9, 9, 1, 1)}${slider('od', 'd', 1, 9, 1, 4)}</div><div class="calc big sm" id="oq"></div><ol class="steps" id="os"></ol>`;
  const draw = () => {
    const a = val(el, 'oa'), b = val(el, 'ob'), c = val(el, 'oc'), d = val(el, 'od'), op = $('#oop', el).value;
    const A = new Q(a, b), C = new Q(c, d); let st = [], r;
    if (op === '+' || op === M) { const l = b * d / gcd(b, d); st.push(`Denominador común: ${l}`); st.push(`${frac(a * l / b, l)} ${op} ${frac(c * l / d, l, true)} = ${frac(op === '+' ? a * l / b + c * l / d : a * l / b - c * l / d, l)}`); r = op === '+' ? A.add(C) : A.sub(C); }
    else if (op === '·') { st.push(`Multiplicamos numeradores y denominadores: ${frac(a * c, b * d)}`); r = A.mul(C); }
    else { if (c === 0) { $('#os', el).innerHTML = '<li>⚠️ No se puede dividir por 0.</li>'; return; } st.push(`Multiplicamos por el inverso: ${frac(a, b)} · ${frac(d, c, true)}`); st.push(`= ${frac(a * d, b * c)}`); r = A.div(C); }
    st.push(`Simplificado: <b>${r.html()}</b> = ${num(r.val(), 4)}`);
    $('#oq', el).innerHTML = `${frac(a, b)} ${op} ${frac(c, d, true)}`; $('#os', el).innerHTML = st.map(s => `<li>${s}</li>`).join('');
  };
  $('#oop', el).onchange = draw; live(el, ['oa', 'ob', 'oc', 'od'], draw);
}

// ---------- 9. Grilla decimal ----------
function decimal(el) {
  el.innerHTML = `<p class="sim-q">Cada cuadradito es un centésimo (0,01). Pintá con el control o tocando la grilla.</p>${slider('dv', 'Centésimos:', 0, 100, 1, 35)}<div class="split"><div class="svgbox"><svg viewBox="0 0 220 220" id="dg"></svg></div><div class="rep col" id="dr"></div></div>`;
  const draw = () => {
    const v = val(el, 'dv'); let g = '';
    for (let i = 0; i < 100; i++) g += `<rect x="${10 + (i % 10) * 20}" y="${10 + Math.floor(i / 10) * 20}" width="19" height="19" class="cell ${i < v ? 'on' : ''}" data-i="${i}"/>`;
    $('#dg', el).innerHTML = g; const q = new Q(v, 100);
    $('#dr', el).innerHTML = `<div><small>Decimal</small><b>${num(v / 100)}</b></div><div><small>Fracción</small><b>${frac(v, 100)} = ${q.html()}</b></div><div><small>Porcentaje</small><b>${v} %</b></div><div><small>× 10</small><b>${num(v / 10, 1)}</b></div>`;
    $$('rect', $('#dg', el)).forEach(r => r.onclick = () => { $('#dv', el).value = +r.dataset.i + 1; $('#dv-v', el).textContent = +r.dataset.i + 1; draw(); });
  };
  live(el, ['dv'], draw);
}

// ---------- 10. Explorador de cuadriláteros ----------
function quad(el, { grid = false, challenge = false } = {}) {
  const U = 40, W = 560, H = 360;
  let P = grid ? [[2, 2], [8, 2], [9, 6], [3, 6]] : [[2, 2], [9, 1.5], [11, 6], [4, 8]];
  const goals = ['Cuadrado', 'Rectángulo', 'Rombo', 'Paralelogramo', 'Trapecio', 'Romboide'];
  let goal = pick(goals);
  el.innerHTML = `<p class="sim-q">${challenge ? `🎯 Desafío: arrastrá los vértices hasta formar un <b id="qg">${goal}</b>.` : 'Arrastrá los vértices A, B, C y D. Mirá cómo cambian las propiedades.'}</p><div class="split"><div class="svgbox"><svg viewBox="0 0 ${W} ${H}" id="qs"></svg></div><div class="props" id="qp"></div></div><div class="sim-row wrap">${goals.map(g => `<button class="btn sm" data-q="${g}">${g}</button>`).join('')}${challenge ? '<button class="btn primary sm" id="qn">Otro desafío</button>' : ''}</div>`;
  const s = $('#qs', el);
  const presets = { 'Cuadrado': [[4, 2], [8, 2], [8, 6], [4, 6]], 'Rectángulo': [[3, 2.5], [10, 2.5], [10, 6.5], [3, 6.5]], 'Rombo': [[7, 1], [10, 4.5], [7, 8], [4, 4.5]], 'Paralelogramo': [[2, 6.5], [8, 6.5], [10, 2.5], [4, 2.5]], 'Trapecio': [[2, 7], [11, 7], [8, 2.5], [4, 2.5]], 'Romboide': [[7, 1], [9.5, 3.5], [7, 8], [4.5, 3.5]] };
  const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const v = (p, q) => [q[0] - p[0], q[1] - p[1]];
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0], dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const par = (a, b) => Math.abs(cross(a, b)) / (Math.hypot(...a) * Math.hypot(...b)) < 0.02;
  const perp = (a, b) => Math.abs(dot(a, b)) / (Math.hypot(...a) * Math.hypot(...b)) < 0.03;
  const eq = (x, y) => Math.abs(x - y) / Math.max(x, y) < 0.03;
  function classify() {
    const [A, B, C, D] = P, s1 = d(A, B), s2 = d(B, C), s3 = d(C, D), s4 = d(D, A);
    const AB = v(A, B), BC = v(B, C), CD = v(C, D), DA = v(D, A), AC = v(A, C), BD = v(B, D);
    const segX = (p1, p2, p3, p4) => { const o = (a, b, c) => Math.sign(cross(v(a, b), v(a, c))); return o(p1, p2, p3) !== o(p1, p2, p4) && o(p3, p4, p1) !== o(p3, p4, p2); };
    if (segX(A, B, C, D) || segX(B, C, D, A)) return { name: '¡Los lados se cruzan!', props: [] };
    const p1 = par(AB, CD), p2 = par(BC, DA), right = [perp(DA, AB), perp(AB, BC), perp(BC, CD), perp(CD, DA)];
    const allEq = eq(s1, s2) && eq(s2, s3) && eq(s3, s4), dEq = eq(d(A, C), d(B, D)), dPerp = perp(AC, BD);
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], m1 = mid(A, C), m2 = mid(B, D), bis = Math.hypot(m1[0] - m2[0], m1[1] - m2[1]) < 0.12;
    let name;
    if (p1 && p2) name = right.every(Boolean) ? (allEq ? 'Cuadrado' : 'Rectángulo') : allEq ? 'Rombo' : 'Paralelogramo';
    else if (p1 || p2) name = right.some(Boolean) ? 'Trapecio rectángulo' : (p1 ? eq(s2, s4) : eq(s1, s3)) ? 'Trapecio isósceles' : 'Trapecio';
    else if ((eq(s1, s2) && eq(s3, s4)) || (eq(s2, s3) && eq(s4, s1))) name = 'Romboide';
    else name = 'Trapezoide (cuadrilátero cualquiera)';
    const ang = i => { const a = v(P[i], P[(i + 3) % 4]), b = v(P[i], P[(i + 1) % 4]); return Math.acos(dot(a, b) / (Math.hypot(...a) * Math.hypot(...b))) * 180 / Math.PI; };
    return { name, props: [[`Lados: ${[s1, s2, s3, s4].map(x => num(x, 1)).join(' · ')}`, null], [`Ángulos: ${[0, 1, 2, 3].map(i => Math.round(ang(i)) + '°').join(' · ')}`, null], ['Dos pares de lados paralelos', p1 && p2], ['4 lados iguales', allEq], ['4 ángulos rectos', right.every(Boolean)], ['Diagonales iguales', dEq], ['Diagonales perpendiculares', dPerp], ['Diagonales se cortan en su punto medio', bis]] };
  }
  const draw = () => {
    let g = '';
    for (let x = 0; x <= W; x += U) g += `<line x1="${x}" x2="${x}" y1="0" y2="${H}" class="grid"/>`;
    for (let y = 0; y <= H; y += U) g += `<line y1="${y}" y2="${y}" x1="0" x2="${W}" class="grid"/>`;
    const pts = P.map(p => [p[0] * U, H - p[1] * U]);
    g += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" class="shape"/><line x1="${pts[0][0]}" y1="${pts[0][1]}" x2="${pts[2][0]}" y2="${pts[2][1]}" class="diag"/><line x1="${pts[1][0]}" y1="${pts[1][1]}" x2="${pts[3][0]}" y2="${pts[3][1]}" class="diag"/>`;
    'ABCD'.split('').forEach((L, i) => { g += `<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="11" class="vtx" data-i="${i}"/><text x="${pts[i][0]}" y="${pts[i][1] - 16}" text-anchor="middle" class="tick b">${L}${grid ? ` (${num(P[i][0], 1)}; ${num(P[i][1], 1)})` : ''}</text>`; });
    s.innerHTML = g;
    const c = classify();
    $('#qp', el).innerHTML = `<h4>${c.name}</h4>${c.props.map(([t, ok]) => `<div class="prop ${ok === null ? '' : ok ? 'yes' : 'no'}">${ok === null ? '📏' : ok ? '✔' : '✘'} ${t}</div>`).join('')}`;
    if (challenge && c.name.startsWith(goal) && !(goal === 'Trapecio' && c.name !== 'Trapecio' && !c.name.startsWith('Trapecio')) && !draw.won) { draw.won = true; $('#qp', el).insertAdjacentHTML('afterbegin', `<div class="win">🎉 ¡Lograste un ${goal}!</div>`); onWin(); }
  };
  let drag = -1;
  s.addEventListener('pointerdown', e => { const t = e.target.closest('.vtx'); if (t) { drag = +t.dataset.i; s.setPointerCapture(e.pointerId); } });
  s.addEventListener('pointermove', e => { if (drag < 0) return; const p = svgPoint(s, e); let x = Math.max(0.3, Math.min(W / U - 0.3, p.x / U)), y = Math.max(0.3, Math.min(H / U - 0.3, (H - p.y) / U)); if (grid) { x = Math.round(x); y = Math.round(y); } else { x = Math.round(x * 4) / 4; y = Math.round(y * 4) / 4; } P[drag] = [x, y]; draw(); });
  s.addEventListener('pointerup', () => (drag = -1));
  $$('[data-q]', el).forEach(b => b.onclick = () => { P = presets[b.dataset.q].map(p => [...p]); draw(); });
  if (challenge) $('#qn', el).onclick = () => { goal = pick(goals); draw.won = false; $('#qg', el).textContent = goal; P = [[2, 2], [9, 1.5], [11, 6], [4, 8]]; draw(); };
  if (challenge) $$('[data-q]', el).forEach(b => b.style.display = 'none');
  draw();
}

// ---------- 11. Constructor de triángulos ----------
function triangle(el) {
  el.innerHTML = `<p class="sim-q">Elegí tres longitudes. ¿Siempre se cierra el triángulo?</p><div class="sim-row wrap">${slider('ta', 'a', 1, 12, 0.5, 5)}${slider('tb', 'b', 1, 12, 0.5, 4)}${slider('tc', 'c', 1, 12, 0.5, 3)}</div><div class="svgbox"><svg viewBox="0 0 560 300" id="ts"></svg></div><p class="sim-out" id="to"></p>`;
  const draw = () => {
    const a = val(el, 'ta'), b = val(el, 'tb'), c = val(el, 'tc'), k = 34, x0 = 80, y0 = 260;
    const ok = a < b + c && b < a + c && c < a + b; let g = '';
    if (ok) {
      const A = Math.acos((b * b + c * c - a * a) / (2 * b * c)), Bv = Math.acos((a * a + c * c - b * b) / (2 * a * c)), C = Math.PI - A - Bv;
      const P1 = [x0, y0], P2 = [x0 + c * k, y0], P3 = [x0 + b * k * Math.cos(A), y0 - b * k * Math.sin(A)];
      g += `<polygon points="${[P1, P2, P3].map(p => p.join(',')).join(' ')}" class="shape"/><text x="${(P1[0] + P2[0]) / 2}" y="${y0 + 20}" text-anchor="middle" class="tick b">c = ${num(c)}</text><text x="${(P2[0] + P3[0]) / 2 + 12}" y="${(P2[1] + P3[1]) / 2}" class="tick b">a = ${num(a)}</text><text x="${(P1[0] + P3[0]) / 2 - 12}" y="${(P1[1] + P3[1]) / 2}" text-anchor="end" class="tick b">b = ${num(b)}</text>`;
      const deg = x => Math.round(x * 180 / Math.PI), angs = [deg(A), deg(Bv), deg(C)];
      const bySide = (eqQ(a, b) && eqQ(b, c)) ? 'equilátero' : (eqQ(a, b) || eqQ(b, c) || eqQ(a, c)) ? 'isósceles' : 'escaleno';
      const byAng = angs.some(x => x === 90) ? 'rectángulo' : angs.some(x => x > 90) ? 'obtusángulo' : 'acutángulo';
      $('#to', el).innerHTML = `✅ Se puede: el lado mayor (${num(Math.max(a, b, c))}) es menor que la suma de los otros dos. Ángulos: ${angs.join('° + ')}° = 180°. Es <b>${bySide}</b> y <b>${byAng}</b>.`;
    } else {
      const L = Math.max(a, b, c), o = [a, b, c].sort((x, y) => y - x);
      g += `<line x1="${x0}" y1="${y0}" x2="${x0 + L * k}" y2="${y0}" class="stick"/><line x1="${x0}" y1="${y0}" x2="${x0 + o[1] * k * 0.9}" y2="${y0 - o[1] * k * 0.43}" class="stick" stroke="#ff5c8a"/><line x1="${x0 + L * k}" y1="${y0}" x2="${x0 + L * k - o[2] * k * 0.9}" y2="${y0 - o[2] * k * 0.43}" class="stick" stroke="#ff5c8a"/>`;
      $('#to', el).innerHTML = `❌ No cierra: ${num(o[1])} + ${num(o[2])} = ${num(o[1] + o[2])}, que ${o[1] + o[2] === L ? 'es igual a' : 'es menor que'} ${num(L)}. ¡Los lados no se tocan!`;
    }
    $('#ts', el).innerHTML = g;
  };
  const eqQ = (x, y) => Math.abs(x - y) < 1e-9;
  live(el, ['ta', 'tb', 'tc'], draw);
}

// ---------- 12. Polígonos ----------
function polygon(el) {
  el.innerHTML = `<p class="sim-q">Cambiá la cantidad de lados. Las diagonales desde un vértice forman triángulos.</p><div class="sim-row">${slider('pg', 'Lados n =', 3, 12, 1, 6)}<label class="chk"><input type="checkbox" id="pall"> Todas las diagonales</label></div><div class="split"><div class="svgbox"><svg viewBox="0 0 320 320" id="pgs"></svg></div><div class="rep col" id="pgr"></div></div>`;
  const draw = () => {
    const n = val(el, 'pg'), all = $('#pall', el).checked, cx = 160, cy = 165, r = 135;
    const P = Array.from({ length: n }, (_, i) => [cx + r * Math.cos(-Math.PI / 2 + 2 * Math.PI * i / n), cy + r * Math.sin(-Math.PI / 2 + 2 * Math.PI * i / n)]);
    let g = '';
    if (!all) for (let i = 1; i < n - 1; i++) g += `<polygon points="${[P[0], P[i], P[i + 1]].map(p => p.join(',')).join(' ')}" fill="${COL[i % COL.length]}" opacity=".35"/>`;
    g += `<polygon points="${P.map(p => p.join(',')).join(' ')}" class="shape" fill="none"/>`;
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) { if (i === 0 && j === n - 1) continue; if (all || i === 0) g += `<line x1="${P[i][0]}" y1="${P[i][1]}" x2="${P[j][0]}" y2="${P[j][1]}" class="diag"/>`; }
    P.forEach(p => g += `<circle cx="${p[0]}" cy="${p[1]}" r="5" class="vtx sm"/>`);
    $('#pgs', el).innerHTML = g;
    $('#pgr', el).innerHTML = `<div><small>Triángulos desde un vértice</small><b>n ${M} 2 = ${n - 2}</b></div><div><small>Suma de ángulos interiores</small><b>${n - 2} · 180° = ${(n - 2) * 180}°</b></div><div><small>Cada ángulo (si es regular)</small><b>${num((n - 2) * 180 / n, 2)}°</b></div><div><small>Diagonales desde un vértice</small><b>${n - 3}</b></div><div><small>Diagonales en total</small><b>${n} · ${n - 3} : 2 = ${n * (n - 3) / 2}</b></div>`;
  };
  $('#pall', el).onchange = draw; live(el, ['pg'], draw);
}

// ---------- 13. Áreas ----------
function areas(el) {
  el.innerHTML = `<p class="sim-q">Elegí una figura y cambiá sus medidas. Cada cuadradito es 1 cm².</p><div class="sim-row wrap"><select id="ak"><option value="rect">Rectángulo</option><option value="tri">Triángulo</option><option value="par">Paralelogramo</option><option value="rom">Rombo</option><option value="tra">Trapecio</option></select>${slider('a1', 'Base / D', 1, 12, 1, 6)}${slider('a2', 'Altura / d', 1, 8, 1, 4)}${slider('a3', 'Base menor', 1, 10, 1, 3)}</div><div class="svgbox"><svg viewBox="0 0 560 300" id="as"></svg></div><p class="sim-out big sm" id="ao"></p>`;
  const draw = () => {
    const k = $('#ak', el).value, b = val(el, 'a1'), h = val(el, 'a2'), b2 = Math.min(val(el, 'a3'), b), U = 34, x0 = 60, y0 = 280;
    $('#a3', el).parentElement.style.display = k === 'tra' ? '' : 'none';
    let g = ''; for (let x = 0; x <= 560; x += U) g += `<line x1="${x + 26 % U}" x2="${x + 26 % U}" y1="0" y2="300" class="grid"/>`; for (let y = 0; y <= 300; y += U) g += `<line x1="0" x2="560" y1="${y + 8}" y2="${y + 8}" class="grid"/>`;
    const X = u => x0 + u * U, Y = u => y0 - u * U; let pts, f, A, Pm = null;
    if (k === 'rect') { pts = [[0, 0], [b, 0], [b, h], [0, h]]; f = `b · h = ${b} · ${h}`; A = b * h; Pm = 2 * (b + h); }
    if (k === 'tri') { pts = [[0, 0], [b, 0], [b / 3, h]]; f = `b · h : 2 = ${b} · ${h} : 2`; A = b * h / 2; }
    if (k === 'par') { pts = [[0, 0], [b, 0], [b + 2, h], [2, h]]; f = `b · h = ${b} · ${h}`; A = b * h; }
    if (k === 'rom') { pts = [[b / 2, 0], [b, h / 2], [b / 2, h], [0, h / 2]]; f = `D · d : 2 = ${b} · ${h} : 2`; A = b * h / 2; g += `<line x1="${X(0)}" y1="${Y(h / 2)}" x2="${X(b)}" y2="${Y(h / 2)}" class="diag"/><line x1="${X(b / 2)}" y1="${Y(0)}" x2="${X(b / 2)}" y2="${Y(h)}" class="diag"/>`; }
    if (k === 'tra') { const off = (b - b2) / 2; pts = [[0, 0], [b, 0], [off + b2, h], [off, h]]; f = `(B + b) · h : 2 = (${b} + ${b2}) · ${h} : 2`; A = (b + b2) * h / 2; }
    g += `<polygon points="${pts.map(p => `${X(p[0])},${Y(p[1])}`).join(' ')}" class="shape"/>`;
    if (k !== 'rom' && k !== 'rect') g += `<line x1="${X(k === 'tri' ? b / 3 : k === 'par' ? 2 : (b - b2) / 2)}" y1="${Y(0)}" x2="${X(k === 'tri' ? b / 3 : k === 'par' ? 2 : (b - b2) / 2)}" y2="${Y(h)}" class="diag"/>`;
    $('#as', el).innerHTML = g; $('#ao', el).innerHTML = `Área = ${f} = <b>${num(A)} cm²</b>${Pm ? ` &nbsp;·&nbsp; Perímetro = ${Pm} cm` : ''}`;
  };
  $('#ak', el).onchange = draw; live(el, ['a1', 'a2', 'a3'], draw);
}

// ---------- 14. Estadística ----------
function stats(el, { pie = false } = {}) {
  const samples = ['2, 3, 1, 0, 2, 4, 2, 1, 3, 2, 5, 2', 'fútbol, vóley, fútbol, básquet, fútbol, hockey, vóley, fútbol, natación, vóley', '7, 8, 6, 9, 10, 7, 7, 5, 8, 6'];
  el.innerHTML = `<p class="sim-q">Escribí datos separados por comas (números o palabras). Se arma la tabla y el gráfico.</p><textarea id="sd" rows="2">${samples[0]}</textarea><div class="sim-row wrap"><button class="btn sm" id="sr">🎲 Datos al azar</button><button class="btn sm" id="sx">➕ Agregar un valor extremo</button><div class="seg"><button data-g="bar" class="${pie ? '' : 'sel'}">Barras</button><button data-g="pie" class="${pie ? 'sel' : ''}">Circular</button></div></div><div class="split"><div id="st"></div><div id="sc"></div></div><p class="sim-out" id="so"></p>`;
  let kind = pie ? 'pie' : 'bar';
  const run = () => {
    const raw = $('#sd', el).value.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    if (!raw.length) return;
    const numeric = raw.every(x => /^-?\d+([.,]\d+)?$/.test(x)), data = numeric ? raw.map(x => +x.replace(',', '.')) : raw.map(x => x.toLowerCase());
    const counts = new Map(); data.forEach(x => counts.set(x, (counts.get(x) || 0) + 1));
    const keys = [...counts.keys()].sort((a, b) => numeric ? a - b : 0), n = data.length;
    $('#st', el).innerHTML = `<table class="tbl sm"><tr><th>Valor</th><th>f</th><th>fr</th><th>%</th></tr>${keys.map(k => `<tr><td>${numeric ? num(k) : k}</td><td>${counts.get(k)}</td><td>${num(counts.get(k) / n, 2)}</td><td>${num(100 * counts.get(k) / n, 1)}</td></tr>`).join('')}<tr><th>Total</th><th>${n}</th><th>1</th><th>100</th></tr></table>`;
    const labels = keys.map(k => numeric ? num(k) : k), vals = keys.map(k => counts.get(k));
    $('#sc', el).innerHTML = kind === 'bar' ? barChart(labels, vals, { color: COL, w: 380, h: 220 }) : pieChart(labels, vals, COL, { w: 380, h: Math.max(220, 40 + labels.length * 26) });
    const mx = Math.max(...vals), modes = keys.filter(k => counts.get(k) === mx);
    $('#so', el).innerHTML = `${numeric ? `Media = ${num(data.reduce((a, b) => a + b, 0))} : ${n} = <b>${num(data.reduce((a, b) => a + b, 0) / n, 2)}</b> &nbsp;·&nbsp; ` : ''}Moda = <b>${modes.length === keys.length && keys.length > 1 ? 'no hay (todos igual)' : modes.map(k => numeric ? num(k) : k).join(' y ')}</b>`;
  };
  $('#sd', el).oninput = run;
  $('#sr', el).onclick = () => { $('#sd', el).value = Math.random() < .5 ? Array.from({ length: R(10, 20) }, () => pick([0, 1, 1, 2, 2, 2, 3, 3, 4, 5])).join(', ') : pick(samples); run(); };
  $('#sx', el).onclick = () => { $('#sd', el).value += ', 50'; run(); };
  $$('[data-g]', el).forEach(b => b.onclick = () => { kind = b.dataset.g; $$('[data-g]', el).forEach(x => x.classList.toggle('sel', x === b)); run(); });
  run();
}

// ---------- 15. Potencias ----------
function powers(el) {
  el.innerHTML = `<p class="sim-q">Mirá qué pasa con el signo y el valor según el exponente.</p><div class="sim-row wrap">${slider('wn', 'Numerador', -5, 5, 1, -2)}${slider('wd', 'Denominador', 1, 6, 1, 3)}${slider('we', 'Exponente', 0, 6, 1, 3)}</div><div class="calc big sm" id="wo"></div><p class="sim-out" id="wx"></p>`;
  const draw = () => {
    const n = val(el, 'wn'), d = val(el, 'wd'), e = val(el, 'we'); if (n === 0 && e === 0) { $('#wo', el).innerHTML = '0⁰ no está definido'; return; }
    const b = new Q(n, d), r = b.pow(e);
    $('#wo', el).innerHTML = `(${b.html()})<sup>${e}</sup> = ${e === 0 ? '1' : Array(e).fill(`(${b.html()})`).join(' · ')} = <b class="${r.n < 0 ? 'neg' : 'pos'}">${r.html()}</b>`;
    $('#wx', el).innerHTML = e === 0 ? 'Todo número distinto de 0 elevado a la 0 da 1.' : n < 0 ? `Base negativa con exponente <b>${e % 2 ? 'impar → resultado negativo' : 'par → resultado positivo'}</b>.` : 'Base positiva: el resultado siempre es positivo.' + (Math.abs(n) < d ? ' Como la base está entre 0 y 1, ¡cuanto mayor el exponente, más chico el resultado!' : '');
  };
  live(el, ['wn', 'wd', 'we'], draw);
}

// ---------- 16. Raíces ----------
function roots(el) {
  el.innerHTML = `<p class="sim-q">Si conocés el área de un cuadrado, su lado es la raíz cuadrada. Si conocés el volumen de un cubo, la arista es la raíz cúbica.</p><div class="sim-row">${slider('rl', 'Lado', 0.5, 10, 0.5, 3)}<div class="seg"><button data-r="2" class="sel">Cuadrado</button><button data-r="3">Cubo</button></div></div><div class="split"><div class="svgbox"><svg viewBox="0 0 300 300" id="rs"></svg></div><div class="rep col" id="rr"></div></div>`;
  let dim = 2;
  const draw = () => {
    const l = val(el, 'rl'), s = l * 26; let g = '';
    if (dim === 2) { for (let i = 0; i < Math.ceil(l); i++) for (let j = 0; j < Math.ceil(l); j++) g += `<rect x="${20 + i * 26}" y="${20 + j * 26}" width="${Math.min(26, s - i * 26)}" height="${Math.min(26, s - j * 26)}" class="cell on" />`; }
    else { const o = s * 0.4; g += `<polygon points="${30},${270 - s} ${30 + o},${270 - s - o} ${30 + s + o},${270 - s - o} ${30 + s},${270 - s}" fill="#9a86ff"/><polygon points="${30 + s},${270} ${30 + s + o},${270 - o} ${30 + s + o},${270 - s - o} ${30 + s},${270 - s}" fill="#5c45d6"/><rect x="30" y="${270 - s}" width="${s}" height="${s}" fill="#7c5cff"/>`; }
    $('#rs', el).innerHTML = g;
    $('#rr', el).innerHTML = dim === 2 ? `<div><small>Lado</small><b>${num(l)}</b></div><div><small>Área = lado²</small><b>${num(l * l)}</b></div><div><small>√${num(l * l)}</small><b>= ${num(l)}</b></div>` : `<div><small>Arista</small><b>${num(l)}</b></div><div><small>Volumen = arista³</small><b>${num(l ** 3, 3)}</b></div><div><small>∛${num(l ** 3, 3)}</small><b>= ${num(l)}</b></div>`;
  };
  $$('[data-r]', el).forEach(b => b.onclick = () => { dim = +b.dataset.r; $$('[data-r]', el).forEach(x => x.classList.toggle('sel', x === b)); draw(); });
  live(el, ['rl'], draw);
}

// ---------- 17. Pitágoras ----------
function pythagoras(el) {
  el.innerHTML = `<p class="sim-q">Los cuadrados construidos sobre los catetos suman el área del cuadrado de la hipotenusa.</p><div class="sim-row">${slider('pa', 'Cateto a', 1, 8, 0.5, 3)}${slider('pb', 'Cateto b', 1, 8, 0.5, 4)}</div><div class="svgbox"><svg viewBox="0 0 560 420" id="pys"></svg></div><p class="sim-out big sm" id="pyo"></p>`;
  const draw = () => {
    const a = val(el, 'pa'), b = val(el, 'pb'), c = Math.hypot(a, b), k = 300 / (a + b + c) * 1.25, ox = 230, oy = 225;
    const A = [ox, oy], B = [ox + b * k, oy], C = [ox, oy - a * k];
    const sq = (P1, P2, col) => { const dx = P2[0] - P1[0], dy = P2[1] - P1[1]; return `<polygon points="${P1.join(',')} ${P2.join(',')} ${P2[0] - dy},${P2[1] + dx} ${P1[0] - dy},${P1[1] + dx}" fill="${col}" opacity=".55"/>`; };
    let g = sq(A, B, '#4dc9ff') + sq(C, A, '#ffd36e') + sq(B, C, '#ff5c8a') + `<polygon points="${A.join(',')} ${B.join(',')} ${C.join(',')}" class="shape"/><rect x="${ox}" y="${oy - 12}" width="12" height="12" fill="none" stroke="currentColor"/>`;
    g += `<text x="${ox - 8}" y="${oy - a * k / 2}" text-anchor="end" class="tick b">a = ${num(a)}</text><text x="${ox + b * k / 2}" y="${oy + 18}" text-anchor="middle" class="tick b">b = ${num(b)}</text><text x="${ox + b * k / 2 + 10}" y="${oy - a * k / 2 - 6}" class="tick b">c ≈ ${num(c, 2)}</text>`;
    $('#pys', el).innerHTML = g;
    $('#pyo', el).innerHTML = `<span style="color:#ffd36e">a² = ${num(a * a)}</span> + <span style="color:#4dc9ff">b² = ${num(b * b)}</span> = <span style="color:#ff5c8a">c² = ${num(c * c)}</span> → c = √${num(c * c)} ≈ <b>${num(c, 2)}</b>`;
  };
  live(el, ['pa', 'pb'], draw);
}

// ---------- 18. Trigonometría ----------
function trig(el) {
  el.innerHTML = `<p class="sim-q">Mové el ángulo: las razones trigonométricas solo dependen del ángulo, no del tamaño.</p><div class="sim-row">${slider('ga', 'Ángulo α', 5, 85, 1, 35)}${slider('gh', 'Hipotenusa', 2, 10, 0.5, 8)}</div><div class="split"><div class="svgbox"><svg viewBox="0 0 400 300" id="gs"></svg></div><div class="rep col" id="gr"></div></div>`;
  const draw = () => {
    const a = val(el, 'ga') * Math.PI / 180, h = val(el, 'gh'), k = 34, op = h * Math.sin(a), ad = h * Math.cos(a), x0 = 30, y0 = 280;
    const P = [x0 + ad * k, y0 - op * k];
    $('#gs', el).innerHTML = `<polygon points="${x0},${y0} ${x0 + ad * k},${y0} ${P.join(',')}" class="shape"/><rect x="${x0 + ad * k - 12}" y="${y0 - 12}" width="12" height="12" fill="none" stroke="currentColor"/><path d="M${x0 + 40} ${y0} A40 40 0 0 0 ${x0 + 40 * Math.cos(a)} ${y0 - 40 * Math.sin(a)}" fill="none" stroke="#ffb84d" stroke-width="3"/><text x="${x0 + 48}" y="${y0 - 8}" class="tick b" fill="#ffb84d">α</text><text x="${x0 + ad * k / 2}" y="${y0 + 16}" text-anchor="middle" class="tick b" fill="#4dc9ff">adyacente ${num(ad, 2)}</text><text x="${x0 + ad * k + 6}" y="${y0 - op * k / 2}" class="tick b" fill="#3ddc97">opuesto ${num(op, 2)}</text><text x="${x0 + ad * k / 2 - 14}" y="${y0 - op * k / 2 - 10}" text-anchor="end" class="tick b" fill="#ff5c8a">hip. ${num(h)}</text>`;
    $('#gr', el).innerHTML = `<div><small>sen α = op / hip</small><b>${num(Math.sin(a), 4)}</b></div><div><small>cos α = ady / hip</small><b>${num(Math.cos(a), 4)}</b></div><div><small>tg α = op / ady</small><b>${num(Math.tan(a), 4)}</b></div>`;
  };
  live(el, ['ga', 'gh'], draw);
}

// ---------- 19. Thales ----------
function thales(el) {
  el.innerHTML = `<p class="sim-q">Mové las rectas. Si son paralelas, los cocientes coinciden.</p><div class="sim-row wrap">${slider('t1', 'Recta 2', 1, 5, 0.25, 2)}${slider('t2', 'Recta 3', 2, 8, 0.25, 5)}<label class="chk"><input type="checkbox" id="tnp"> Inclinar la recta 3 (no paralela)</label></div><div class="svgbox"><svg viewBox="0 0 560 320" id="ths"></svg></div><p class="sim-out big sm" id="tho"></p>`;
  const draw = () => {
    const t1 = val(el, 't1'), t2 = Math.max(val(el, 't2'), t1 + 0.5), np = $('#tnp', el).checked;
    const O = [40, 290], u1 = [1, -0.35], u2 = [1, -1.1], k = 60;
    const L1 = s => [O[0] + u1[0] * s * k, O[1] + u1[1] * s * k], L2 = s => [O[0] + u2[0] * s * k, O[1] + u2[1] * s * k];
    const sB = t1 * 1.6, sC = t2 * 1.6 * (np ? 0.78 : 1);
    const A1 = L1(1), B1 = L1(t1), C1 = L1(t2), A2 = L2(1 * 0.4), B2 = L2(t1 * 0.4), C2 = L2(t2 * 0.4 * (np ? 0.78 : 1));
    const seg = (P, Q2) => Math.hypot(P[0] - Q2[0], P[1] - Q2[1]) / k;
    let g = `<line x1="${O[0]}" y1="${O[1]}" x2="${L1(8.5)[0]}" y2="${L1(8.5)[1]}" class="axis"/><line x1="${O[0]}" y1="${O[1]}" x2="${L2(3.4)[0]}" y2="${L2(3.4)[1]}" class="axis"/>`;
    [[A1, A2, '#ffd36e'], [B1, B2, '#4dc9ff'], [C1, C2, np ? '#ff5c8a' : '#3ddc97']].forEach(([P, Q2, c]) => { const dx = Q2[0] - P[0], dy = Q2[1] - P[1]; g += `<line x1="${P[0] - dx * .4}" y1="${P[1] - dy * .4}" x2="${Q2[0] + dx * .4}" y2="${Q2[1] + dy * .4}" stroke="${c}" stroke-width="3"/><circle cx="${P[0]}" cy="${P[1]}" r="4" fill="${c}"/><circle cx="${Q2[0]}" cy="${Q2[1]}" r="4" fill="${c}"/>`; });
    $('#ths', el).innerHTML = g;
    const ab = seg(A1, B1), bc = seg(B1, C1), ab2 = seg(A2, B2), bc2 = seg(B2, C2);
    $('#tho', el).innerHTML = `AB / BC = ${num(ab, 2)} / ${num(bc, 2)} = <b>${num(ab / bc, 3)}</b> &nbsp;&nbsp; A'B' / B'C' = ${num(ab2, 2)} / ${num(bc2, 2)} = <b>${num(ab2 / bc2, 3)}</b> ${Math.abs(ab / bc - ab2 / bc2) < 0.01 ? '✅ ¡Iguales!' : '❌ Distintos: las rectas no son paralelas'}`;
    void sB; void sC;
  };
  $('#tnp', el).onchange = draw; live(el, ['t1', 't2'], draw);
}

// ---------- 20. Cuerpos ----------
function solids(el, { mode = 'area' } = {}) {
  el.innerHTML = `<p class="sim-q">Elegí un cuerpo y sus medidas. π ≈ 3,14.</p><div class="sim-row wrap"><select id="ck"><option value="prism">Prisma rectangular</option><option value="cube">Cubo</option><option value="pyr">Pirámide cuadrada</option><option value="cyl">Cilindro</option><option value="cone">Cono</option><option value="sph">Esfera</option></select>${slider('c1', 'Lado / radio', 1, 8, 0.5, 3)}${slider('c2', 'Altura', 1, 10, 0.5, 6)}</div><div class="split"><div class="svgbox"><svg viewBox="0 0 300 280" id="cs"></svg></div><div class="rep col" id="cr"></div></div>`;
  const P = 3.14;
  const draw = () => {
    const k = $('#ck', el).value, a = val(el, 'c1'), h = val(el, 'c2'), s = 22; let g = '', info;
    $('#c2', el).parentElement.style.display = (k === 'cube' || k === 'sph') ? 'none' : '';
    const cx = 150, by = 250;
    if (k === 'prism' || k === 'cube') { const H = (k === 'cube' ? a : h) * s, w = a * s, dep = a * s * 0.5; g = `<polygon points="${cx - w / 2},${by - H} ${cx - w / 2 + dep},${by - H - dep} ${cx + w / 2 + dep},${by - H - dep} ${cx + w / 2},${by - H}" fill="#9a86ff"/><polygon points="${cx + w / 2},${by} ${cx + w / 2 + dep},${by - dep} ${cx + w / 2 + dep},${by - H - dep} ${cx + w / 2},${by - H}" fill="#5c45d6"/><rect x="${cx - w / 2}" y="${by - H}" width="${w}" height="${H}" fill="#7c5cff"/>`; const hh = k === 'cube' ? a : h; info = { 'Área lateral': [`4 · ${num(a)} · ${num(hh)}`, 4 * a * hh], 'Área total': [`${k === 'cube' ? `6 · ${num(a)}²` : `4 · ${num(a)} · ${num(h)} + 2 · ${num(a)}²`}`, 4 * a * hh + 2 * a * a], 'Volumen': [`${num(a)}² · ${num(hh)}`, a * a * hh] }; }
    if (k === 'pyr') { const w = a * s, H = h * s, ap = Math.hypot(h, a / 2); g = `<polygon points="${cx - w / 2},${by} ${cx + w / 2},${by} ${cx},${by - H}" fill="#7c5cff"/><polygon points="${cx + w / 2},${by} ${cx + w / 2 + w * .3},${by - w * .3} ${cx},${by - H}" fill="#5c45d6"/>`; info = { 'Apotema lateral': [`√(${num(h)}² + ${num(a / 2)}²)`, ap], 'Área lateral': [`4 · ${num(a)} · ${num(ap, 2)} : 2`, 2 * a * ap], 'Área total': [`A<sub>L</sub> + ${num(a)}²`, 2 * a * ap + a * a], 'Volumen': [`${num(a)}² · ${num(h)} : 3`, a * a * h / 3] }; }
    if (k === 'cyl') { const r = a * s * 0.8, H = h * s; g = `<rect x="${cx - r}" y="${by - H}" width="${2 * r}" height="${H}" fill="#7c5cff"/><ellipse cx="${cx}" cy="${by}" rx="${r}" ry="${r * .3}" fill="#5c45d6"/><ellipse cx="${cx}" cy="${by - H}" rx="${r}" ry="${r * .3}" fill="#9a86ff"/>`; info = { 'Área lateral': [`2 · π · ${num(a)} · ${num(h)}`, 2 * P * a * h], 'Área total': [`2 · π · ${num(a)} · (${num(h)} + ${num(a)})`, 2 * P * a * (h + a)], 'Volumen': [`π · ${num(a)}² · ${num(h)}`, P * a * a * h] }; }
    if (k === 'cone') { const r = a * s * 0.8, H = h * s, gg = Math.hypot(a, h); g = `<polygon points="${cx - r},${by} ${cx + r},${by} ${cx},${by - H}" fill="#7c5cff"/><ellipse cx="${cx}" cy="${by}" rx="${r}" ry="${r * .3}" fill="#5c45d6"/>`; info = { 'Generatriz g': [`√(${num(a)}² + ${num(h)}²)`, gg], 'Área lateral': [`π · ${num(a)} · ${num(gg, 2)}`, P * a * gg], 'Área total': [`π · ${num(a)} · (${num(gg, 2)} + ${num(a)})`, P * a * (gg + a)], 'Volumen': [`π · ${num(a)}² · ${num(h)} : 3`, P * a * a * h / 3] }; }
    if (k === 'sph') { const r = a * s * 1.1; g = `<circle cx="${cx}" cy="${by - 110}" r="${Math.min(r, 120)}" fill="#7c5cff"/><ellipse cx="${cx}" cy="${by - 110}" rx="${Math.min(r, 120)}" ry="${Math.min(r, 120) * .3}" fill="none" stroke="#ffffff66"/>`; info = { 'Área': [`4 · π · ${num(a)}²`, 4 * P * a * a], 'Volumen': [`4/3 · π · ${num(a)}³`, 4 / 3 * P * a ** 3] }; }
    $('#cs', el).innerHTML = g;
    $('#cr', el).innerHTML = Object.entries(info).map(([n, [f, v]]) => `<div class="${(mode === 'vol' && n === 'Volumen') || (mode === 'area' && n === 'Área total') ? 'hl' : ''}"><small>${n} = ${f}</small><b>${num(v, 2)}</b></div>`).join('');
  };
  $('#ck', el).onchange = draw; live(el, ['c1', 'c2'], draw);
}

// ---------- 21. Proporcionalidad ----------
function propo(el) {
  el.innerHTML = `<div class="sim-row"><div class="seg"><button data-p="d" class="sel">Directa</button><button data-p="i">Inversa</button></div>${slider('pk', 'Constante k', 1, 12, 1, 4)}</div><div class="split"><div class="svgbox"><svg viewBox="0 0 400 300" id="prs"></svg></div><div id="prt"></div></div><p class="sim-out" id="pro"></p>`;
  let t = 'd';
  const draw = () => {
    const k = val(el, 'pk'), f = x => t === 'd' ? k * x : k / x, A = axes(0, 10, 0, t === 'd' ? Math.max(10, k * 10) : 12, { w: 400, h: 300 });
    let path = ''; for (let x = t === 'd' ? 0 : 0.35; x <= 10; x += 0.05) { const y = f(x); if (y <= (t === 'd' ? Math.max(10, k * 10) : 12)) path += `${path ? 'L' : 'M'}${A.X(x)} ${A.Y(y)}`; }
    const xs = [1, 2, 3, 4, 6];
    $('#prs', el).innerHTML = (t === 'd' && k > 1 ? axes(0, 10, 0, k * 10, { w: 400, h: 300 }).g.replace(/<text[^>]*class="tick"[^>]*>[^<]*<\/text>/g, '') : A.g) + `<path d="${path}" class="fn"/>` + xs.map(x => `<circle cx="${A.X(x)}" cy="${A.Y(f(x))}" r="5" class="fnpt"/>`).join('');
    $('#prt', el).innerHTML = `<table class="tbl sm"><tr><th>x</th><th>y</th><th>${t === 'd' ? 'y / x' : 'x · y'}</th></tr>${xs.map(x => `<tr><td>${x}</td><td>${num(f(x), 2)}</td><td class="ok">${num(t === 'd' ? f(x) / x : f(x) * x, 2)}</td></tr>`).join('')}</table>`;
    $('#pro', el).innerHTML = t === 'd' ? `y = ${k} · x &nbsp;—&nbsp; recta que pasa por el origen. Si x se duplica, y se duplica.` : `y = ${k} / x &nbsp;—&nbsp; hipérbola. Si x se duplica, y se reduce a la mitad.`;
  };
  $$('[data-p]', el).forEach(b => b.onclick = () => { t = b.dataset.p; $$('[data-p]', el).forEach(x => x.classList.toggle('sel', x === b)); draw(); });
  live(el, ['pk'], draw);
}

// ---------- 22. Analizar gráficos ----------
function funcgraph(el) {
  let G;
  el.innerHTML = `<p class="sim-q">Pasá el dedo o el mouse por el gráfico y activá cada característica.</p><div class="sim-row wrap"><label class="chk"><input type="checkbox" id="gz"> Ceros</label><label class="chk"><input type="checkbox" id="gp"> Positividad / negatividad</label><label class="chk"><input type="checkbox" id="gc"> Crecimiento</label><button class="btn sm" id="gn">🎲 Otro gráfico</button></div><div class="svgbox"><svg viewBox="0 0 400 300" id="fgs"></svg></div><div class="rep" id="fgr"></div>`;
  const s = $('#fgs', el);
  const draw = (hx = null) => {
    const A = axes(-6, 6, -4, 5, { w: 400, h: 300 }); let g = A.g;
    if ($('#gp', el).checked) for (let x = G.x0; x < G.x1; x += 0.05) { const y = G.f(x + 0.025); g += `<rect x="${A.X(x)}" y="${y > 0 ? A.Y(5) : A.Y(0)}" width="${A.X(x + 0.05) - A.X(x) + 0.3}" height="${y > 0 ? A.Y(0) - A.Y(5) : A.Y(-4) - A.Y(0)}" fill="${y > 0 ? '#3ddc97' : '#ff5c8a'}" opacity=".13"/>`; }
    for (let i = 0; i < G.pts.length - 1; i++) { const [x1, y1] = G.pts[i], [x2, y2] = G.pts[i + 1]; g += `<line x1="${A.X(x1)}" y1="${A.Y(y1)}" x2="${A.X(x2)}" y2="${A.Y(y2)}" class="fn" ${$('#gc', el).checked ? `stroke="${y2 > y1 ? '#3ddc97' : '#ff5c8a'}"` : ''}/>`; }
    if ($('#gz', el).checked) G.zeros.forEach(z => g += `<circle cx="${A.X(z)}" cy="${A.Y(0)}" r="7" class="pt"/>`);
    if (hx != null && hx >= G.x0 && hx <= G.x1) { const y = G.f(hx); g += `<line x1="${A.X(hx)}" x2="${A.X(hx)}" y1="${A.Y(0)}" y2="${A.Y(y)}" class="diag"/><circle cx="${A.X(hx)}" cy="${A.Y(y)}" r="6" class="fnpt"/><text x="${A.X(hx) + 8}" y="${A.Y(y) - 8}" class="tick b">(${num(hx, 1)}; ${num(y, 1)})</text>`; }
    s.innerHTML = g;
    $('#fgr', el).innerHTML = `<div><small>Dominio</small><b>${G.dom}</b></div><div><small>Imagen</small><b>${G.img}</b></div><div><small>Ceros</small><b>${G.zeros.length ? G.zeros.map(z => num(z)).join(' ; ') : 'no tiene'}</b></div><div><small>Ordenada</small><b>${G.f(0) == null ? '—' : num(G.f(0))}</b></div><div><small>Crece en</small><b>${G.up}</b></div><div><small>Decrece en</small><b>${G.down}</b></div>`;
  };
  s.addEventListener('pointermove', e => { const p = svgPoint(s, e); draw(round(-6 + (p.x - 28) / (400 - 56) * 12, 1)); });
  ['gz', 'gp', 'gc'].forEach(id => $('#' + id, el).onchange = () => draw());
  $('#gn', el).onclick = () => { G = randomGraph(); draw(); };
  G = randomGraph(); draw();
}

// ---------- 23. Función lineal ----------
function linear(el, { points = false, zero = false } = {}) {
  el.innerHTML = points
    ? `<p class="sim-q">Escribí dos puntos y descubrí la fórmula de la recta que pasa por ellos.</p><div class="sim-row wrap">${slider('x1', 'x₁', -5, 5, 1, -2)}${slider('y1', 'y₁', -5, 5, 1, -1)}${slider('x2', 'x₂', -5, 5, 1, 2)}${slider('y2', 'y₂', -5, 5, 1, 5)}</div><div class="svgbox"><svg viewBox="0 0 400 320" id="ls"></svg></div><p class="sim-out big sm" id="lo"></p>`
    : `<p class="sim-q">Mové la pendiente <b>a</b> y la ordenada <b>b</b>.</p><div class="sim-row">${slider('la', 'a (pendiente)', -5, 5, 0.5, 2)}${slider('lb', 'b (ordenada)', -6, 6, 1, -3)}</div><div class="svgbox"><svg viewBox="0 0 400 320" id="ls"></svg></div><div class="rep" id="lr"></div>`;
  const draw = () => {
    const A = axes(-6, 6, -6, 6, { w: 400, h: 320 }); let a, b, g = A.g + '<clipPath id="lcp"><rect x="28" y="28" width="344" height="264"/></clipPath>';
    if (points) {
      const x1 = val(el, 'x1'), y1 = val(el, 'y1'), x2 = val(el, 'x2'), y2 = val(el, 'y2');
      if (x1 === x2) { $('#ls', el).innerHTML = g + `<line x1="${A.X(x1)}" x2="${A.X(x1)}" y1="28" y2="292" class="fn"/>`; $('#lo', el).innerHTML = 'Con x₁ = x₂ la recta es vertical: no es una función.'; return; }
      a = (y2 - y1) / (x2 - x1); b = y1 - a * x1;
      g += `<g clip-path="url(#lcp)"><line x1="${A.X(-6)}" y1="${A.Y(a * -6 + b)}" x2="${A.X(6)}" y2="${A.Y(a * 6 + b)}" class="fn"/></g><circle cx="${A.X(x1)}" cy="${A.Y(y1)}" r="7" class="pt"/><circle cx="${A.X(x2)}" cy="${A.Y(y2)}" r="7" class="pt"/>`;
      $('#ls', el).innerHTML = g;
      const aq = new Q(y2 - y1, x2 - x1), bq = new Q(y1).sub(aq.mul(x1));
      $('#lo', el).innerHTML = `a = (${num(y2)} ${M} ${sg(y1)}) / (${num(x2)} ${M} ${sg(x1)}) = ${aq.html()} &nbsp;→&nbsp; <b>y = ${aq.html()}x ${bq.n < 0 ? M : '+'} ${new Q(Math.abs(bq.n), bq.d).html()}</b>`;
      return;
    }
    a = val(el, 'la'); b = val(el, 'lb');
    g += `<g clip-path="url(#lcp)"><line x1="${A.X(-6)}" y1="${A.Y(a * -6 + b)}" x2="${A.X(6)}" y2="${A.Y(a * 6 + b)}" class="fn"/></g><circle cx="${A.X(0)}" cy="${A.Y(b)}" r="6" class="fnpt"/>`;
    if (a !== 0 && Math.abs(-b / a) <= 6) g += `<circle cx="${A.X(-b / a)}" cy="${A.Y(0)}" r="7" class="pt"/>`;
    g += `<path d="M${A.X(0)} ${A.Y(b)} h${A.X(1) - A.X(0)} v${A.Y(b + a) - A.Y(b)}" fill="none" stroke="#ffb84d" stroke-width="2" stroke-dasharray="4 3"/>`;
    $('#ls', el).innerHTML = g;
    $('#lr', el).innerHTML = `<div><small>Fórmula</small><b>${lin(a, b)}</b></div><div><small>Ordenada</small><b>${num(b)}</b></div><div><small>Cero</small><b>${a === 0 ? (b === 0 ? 'todos' : 'no tiene') : num(-b / a, 2)}</b></div><div><small>La recta</small><b>${a > 0 ? 'crece ↗' : a < 0 ? 'decrece ↘' : 'es constante →'}</b></div>`;
    void zero;
  };
  live(el, points ? ['x1', 'y1', 'x2', 'y2'] : ['la', 'lb'], draw);
}

export const WIDGETS = { numline, steps, pattern, formulas, balance, eqgraph, fraction, fracops, decimal, quad, triangle, polygon, areas, stats, powers, roots, pythagoras, trig, thales, solids, propo, funcgraph, linear };
