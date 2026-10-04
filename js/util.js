// Utilidades matemáticas y de presentación compartidas.

export const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const Rnz = (a, b) => { let x; do x = R(a, b); while (x === 0); return x; };
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
export const MINUS = '−';

// ---------- números racionales exactos ----------
export class Q {
  constructor(n, d = 1) {
    if (d === 0) throw new Error('denominador 0');
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d);
    this.n = n / g; this.d = d / g;
  }
  static of(x) { return x instanceof Q ? x : new Q(x, 1); }
  add(o) { o = Q.of(o); return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = Q.of(o); return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = Q.of(o); return new Q(this.n * o.n, this.d * o.d); }
  div(o) { o = Q.of(o); return new Q(this.n * o.d, this.d * o.n); }
  pow(k) { return k >= 0 ? new Q(this.n ** k, this.d ** k) : new Q(this.d ** -k, this.n ** -k); }
  neg() { return new Q(-this.n, this.d); }
  val() { return this.n / this.d; }
  eq(o) { o = Q.of(o); return this.n === o.n && this.d === o.d; }
  isInt() { return this.d === 1; }
  html(paren = false) { return frac(this.n, this.d, paren); }
  text() { return this.d === 1 ? num(this.n) : `${this.n < 0 ? MINUS : ''}${Math.abs(this.n)}/${this.d}`; }
}

// número con coma decimal y signo menos tipográfico
export function num(x, dec = 2) {
  if (typeof x !== 'number') x = +x;
  const r = round(x, dec);
  const s = Math.abs(r).toLocaleString('es-AR', { maximumFractionDigits: dec, useGrouping: false });
  return (r < 0 ? MINUS : '') + s;
}
// entero entre paréntesis si es negativo: (−3)
export const sg = (x, dec = 2) => (x < 0 ? `(${num(x, dec)})` : num(x, dec));

// fracción apilada en HTML
export function frac(n, d, paren = false) {
  if (d === 1) return paren && n < 0 ? `(${num(n)})` : num(n);
  const neg = n < 0;
  const core = `<span class="fr"><span>${Math.abs(n)}</span><span>${d}</span></span>`;
  if (!neg) return core;
  return paren ? `(${MINUS}${core})` : `${MINUS}${core}`;
}

// interpreta lo que escribe el alumno: "-3", "−3", "3/4", "1,5", "2 1/2"
export function parseAnswer(raw) {
  if (raw == null) return null;
  let s = String(raw).trim().replace(/−|–/g, '-').replace(/\s+/g, ' ').replace(/°$/, '').replace(/cm²|cm³|cm|m²|m³|m$/g, '').trim();
  if (!s) return null;
  const mixed = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/);
  if (mixed) { const v = +mixed[2] + (+mixed[3] / +mixed[4]); return mixed[1] ? -v : v; }
  const f = s.match(/^(-?\d+(?:[.,]\d+)?)\s*\/\s*(-?\d+(?:[.,]\d+)?)$/);
  if (f) { const d = +f[2].replace(',', '.'); return d === 0 ? null : +f[1].replace(',', '.') / d; }
  if (/^-?\d+(?:[.,]\d+)?$/.test(s)) return +s.replace(',', '.');
  if (/^-?[.,]\d+$/.test(s)) return +s.replace(',', '.').replace(/^(-?)\./, '$10.');
  return null;
}

export function sameValue(a, b, tol = 1e-6) { return a != null && b != null && Math.abs(a - b) <= tol; }

// distractores numéricos plausibles
export function distractors(ans, n = 3, { int = Number.isInteger(ans), spread = 0 } = {}) {
  const set = new Set([round(ans, 4)]);
  const out = [];
  const cands = [];
  const s = spread || Math.max(1, Math.round(Math.abs(ans) * 0.25));
  if (ans !== 0) cands.push(-ans);
  for (let k = 1; k <= 6; k++) cands.push(ans + k * (int ? 1 : s / 2), ans - k * (int ? 1 : s / 2), ans + k * s, ans - k * s);
  cands.push(ans * 2, ans / 2, ans + 10, ans - 10);
  for (const c of shuffle(cands)) {
    const v = int ? Math.round(c) : round(c, 2);
    if (!set.has(round(v, 4)) && Number.isFinite(v)) { set.add(round(v, 4)); out.push(v); }
    if (out.length >= n) break;
  }
  return out;
}

// convierte un ejercicio a opción múltiple (para el arcade)
export function toMC(ex) {
  if (ex.type === 'mc') return ex;
  const ansV = ex.answer instanceof Q ? ex.answer.val() : ex.answer;
  let opts;
  if (ex.answer instanceof Q) {
    const a = ex.answer;
    const raw = ex.qDistractors || [a.neg(), new Q(a.d, a.n === 0 ? 1 : a.n), a.add(1), new Q(a.n + 1, a.d), new Q(a.n, a.d + 1)];
    const seen = new Set([a.text()]); opts = [];
    for (const q of raw) { try { if (!seen.has(q.text())) { seen.add(q.text()); opts.push(q.html()); } } catch {} if (opts.length === 3) break; }
    while (opts.length < 3) opts.push(new Q(a.n + opts.length + 2, a.d).html());
    const all = shuffle([a.html(), ...opts]);
    return { ...ex, type: 'mc', options: all, answer: all.indexOf(a.html()) };
  }
  const dec = ex.dec ?? 2;
  const ds = ex.distractors || distractors(ansV, 3, { int: Number.isInteger(ansV) });
  const fmt = v => num(v, dec) + (ex.unit ? ' ' + ex.unit : '');
  const all = shuffle([fmt(ansV), ...ds.slice(0, 3).map(fmt)]);
  return { ...ex, type: 'mc', options: all, answer: all.indexOf(fmt(ansV)) };
}

// opción múltiple a partir de una respuesta correcta y otras incorrectas (texto/HTML)
export function mc(q, correct, wrongs, explain = '', extra = {}) {
  const ws = [...new Set(wrongs)].filter(w => w !== correct);
  const opts = shuffle([correct, ...ws]);
  return { type: 'mc', q, options: opts, answer: opts.indexOf(correct), explain, ...extra };
}

// ---------- evaluador seguro de fórmulas con x ----------
export function compileFormula(src) {
  const s = src.replace(/−/g, '-').replace(/·|×/g, '*').replace(/:/g, '/').replace(/,/g, '.').replace(/\s+/g, '').toLowerCase();
  if (!/^[0-9x+\-*/^().n]*$/.test(s) || !s) throw new Error('Usá solo números, x, + − · : ^ y paréntesis');
  const toks = [];
  for (let i = 0; i < s.length;) {
    const c = s[i];
    if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; toks.push({ t: 'n', v: +s.slice(i, j) }); i = j; }
    else if (c === 'x' || c === 'n') { toks.push({ t: 'x' }); i++; }
    else { toks.push({ t: c }); i++; }
  }
  // multiplicación implícita: 2x, 2(, )(, x(, )x
  const T = [];
  toks.forEach((k, i) => {
    const p = T[T.length - 1];
    if (p && (p.t === 'n' || p.t === 'x' || p.t === ')') && (k.t === 'n' || k.t === 'x' || k.t === '(')) T.push({ t: '*' });
    T.push(k);
  });
  let pos = 0;
  const peek = () => T[pos], eat = t => { if (T[pos] && T[pos].t === t) { pos++; return true; } return false; };
  const expr = () => { let f = term(); for (;;) { if (eat('+')) { const a = f, b = term(); f = x => a(x) + b(x); } else if (eat('-')) { const a = f, b = term(); f = x => a(x) - b(x); } else return f; } };
  const term = () => { let f = unary(); for (;;) { if (eat('*')) { const a = f, b = unary(); f = x => a(x) * b(x); } else if (eat('/')) { const a = f, b = unary(); f = x => a(x) / b(x); } else return f; } };
  const unary = () => { if (eat('-')) { const a = unary(); return x => -a(x); } if (eat('+')) return unary(); return power(); };
  const power = () => { const b = atom(); if (eat('^')) { const e = unary(); return x => b(x) ** e(x); } return b; };
  const atom = () => {
    const k = peek(); if (!k) throw new Error('Fórmula incompleta');
    if (k.t === 'n') { pos++; return () => k.v; }
    if (k.t === 'x') { pos++; return x => x; }
    if (eat('(')) { const f = expr(); if (!eat(')')) throw new Error('Falta cerrar un paréntesis'); return f; }
    throw new Error('Algo no está bien escrito');
  };
  const f = expr();
  if (pos < T.length) throw new Error('Algo no está bien escrito');
  return f;
}

// ---------- SVG helpers ----------
export const svg = (w, h, inner, cls = '') => `<svg viewBox="0 0 ${w} ${h}" class="${cls}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

// gráfico de barras simple (para estadística)
export function barChart(labels, values, { w = 420, h = 230, color = '#7c5cff', title = '' } = {}) {
  const max = Math.max(...values, 1), top = Math.ceil(max / 5) * 5 || 5;
  const pl = 34, pb = 36, pt = title ? 26 : 12, cw = w - pl - 10, ch = h - pb - pt, bw = cw / labels.length;
  let g = title ? `<text x="${w / 2}" y="16" text-anchor="middle" class="ch-title">${title}</text>` : '';
  for (let i = 0; i <= 5; i++) { const v = top * i / 5, y = pt + ch - ch * v / top; g += `<line x1="${pl}" x2="${w - 10}" y1="${y}" y2="${y}" class="grid"/><text x="${pl - 6}" y="${y + 4}" text-anchor="end" class="tick">${num(v, 1)}</text>`; }
  labels.forEach((l, i) => {
    const bh = ch * values[i] / top, x = pl + i * bw + bw * 0.15;
    g += `<rect x="${x}" y="${pt + ch - bh}" width="${bw * 0.7}" height="${bh}" rx="5" fill="${Array.isArray(color) ? color[i % color.length] : color}"/>`;
    g += `<text x="${x + bw * 0.35}" y="${h - pb + 16}" text-anchor="middle" class="tick">${l}</text>`;
  });
  return svg(w, h, g, 'chart');
}

export function pieChart(labels, values, colors, { w = 420, h = 230 } = {}) {
  const tot = values.reduce((a, b) => a + b, 0) || 1, cx = 115, cy = h / 2, r = 95;
  let a0 = -Math.PI / 2, g = '';
  values.forEach((v, i) => {
    const a1 = a0 + 2 * Math.PI * v / tot, large = a1 - a0 > Math.PI ? 1 : 0;
    const p = v === tot ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors[i % colors.length]}"/>` : `<path d="M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z" fill="${colors[i % colors.length]}"/>`;
    g += v ? p : '';
    g += `<rect x="235" y="${22 + i * 26}" width="14" height="14" rx="3" fill="${colors[i % colors.length]}"/><text x="256" y="${34 + i * 26}" class="tick">${labels[i]}: ${num(100 * v / tot, 1)}%</text>`;
    a0 = a1;
  });
  return svg(w, h, g, 'chart');
}

// ejes cartesianos con función (lista de puntos) para análisis de gráficos
export function axes(xmin, xmax, ymin, ymax, { w = 420, h = 300, pad = 28 } = {}) {
  const X = x => pad + (x - xmin) / (xmax - xmin) * (w - 2 * pad);
  const Y = y => h - pad - (y - ymin) / (ymax - ymin) * (h - 2 * pad);
  let g = '';
  for (let x = Math.ceil(xmin); x <= xmax; x++) g += `<line x1="${X(x)}" x2="${X(x)}" y1="${Y(ymin)}" y2="${Y(ymax)}" class="grid"/>${x !== 0 ? `<text x="${X(x)}" y="${Y(0) + 15}" text-anchor="middle" class="tick">${num(x)}</text>` : ''}`;
  for (let y = Math.ceil(ymin); y <= ymax; y++) g += `<line x1="${X(xmin)}" x2="${X(xmax)}" y1="${Y(y)}" y2="${Y(y)}" class="grid"/>${y !== 0 ? `<text x="${X(0) - 6}" y="${Y(y) + 4}" text-anchor="end" class="tick">${num(y)}</text>` : ''}`;
  g += `<line x1="${X(xmin)}" x2="${X(xmax)}" y1="${Y(0)}" y2="${Y(0)}" class="axis"/><line x1="${X(0)}" x2="${X(0)}" y1="${Y(ymin)}" y2="${Y(ymax)}" class="axis"/>`;
  g += `<text x="${X(xmax) - 4}" y="${Y(0) - 6}" class="tick" text-anchor="end">x</text><text x="${X(0) + 6}" y="${Y(ymax) + 12}" class="tick">y</text>`;
  return { X, Y, g, w, h };
}
