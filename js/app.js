import { YEAR2 } from './content2.js';
import { YEAR3 } from './content3.js';
import { WIDGETS, setWinHandler } from './widgets.js';
import { Q, num, parseAnswer, toMC, shuffle, pick } from './util.js';

const YEARS = { 2: YEAR2, 3: YEAR3 };
const $app = document.getElementById('app');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ======================= estado =======================
const KEY = 'galaxia_mate_v1';
const DEF = { name: '', ship: '🚀', year: 2, xp: 0, stars: {}, best: {}, ach: {}, theory: [], sims: [], streak: 0, streakBest: 0, correct: 0, sound: true };
let S = (() => { try { return { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...DEF }; } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

const RANKS = [[0, 'Cadete', '🧑‍🚀'], [200, 'Piloto', '🛩️'], [600, 'Navegante', '🧭'], [1200, 'Capitán/a', '🎖️'], [2500, 'Comandante', '⭐'], [5000, 'Leyenda galáctica', '🌌']];
const rank = xp => { let r = RANKS[0], next = null; for (let i = 0; i < RANKS.length; i++) if (xp >= RANKS[i][0]) { r = RANKS[i]; next = RANKS[i + 1] || null; } return { name: r[1], icon: r[2], from: r[0], to: next ? next[0] : r[0] }; };

const allTopics = y => YEARS[y].planets.flatMap(p => p.topics.map(t => ({ ...t, planet: p })));
const findTopic = id => { for (const y of [2, 3]) for (const p of YEARS[y].planets) { const i = p.topics.findIndex(t => t.id === id); if (i >= 0) return { t: p.topics[i], p, y, i }; } return null; };

// ======================= sonido =======================
let actx;
function beep(notes, type = 'sine', dur = 0.12, vol = 0.12) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    notes.forEach((f, i) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, actx.currentTime + i * dur); g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + (i + 1) * dur + 0.05); o.connect(g).connect(actx.destination); o.start(actx.currentTime + i * dur); o.stop(actx.currentTime + (i + 1) * dur + 0.06); });
  } catch {}
}
const sfx = { ok: () => beep([660, 880], 'triangle'), bad: () => beep([220, 160], 'sawtooth', 0.14, 0.07), win: () => beep([523, 659, 784, 1047], 'triangle', 0.11), boom: () => beep([300, 120], 'square', 0.07, 0.05), click: () => beep([500], 'sine', 0.04, 0.05) };

// ======================= efectos =======================
function toast(html, e = '⭐') { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `<span class="e">${e}</span><span>${html}</span>`; $('#toasts').append(t); setTimeout(() => t.remove(), 3200); }
function confetti(n = 70) { const c = ['#7c5cff', '#ff5c8a', '#ffd36e', '#3ddc97', '#4dc9ff']; for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = 'confetti'; d.style.left = Math.random() * 100 + 'vw'; d.style.background = c[i % 5]; d.style.animationDuration = 1.6 + Math.random() * 1.8 + 's'; d.style.animationDelay = Math.random() * .3 + 's'; document.body.append(d); setTimeout(() => d.remove(), 4000); } }

// ======================= logros =======================
const ACH = [
  ['primer', '🌱', 'Primer paso', 'Respondé bien tu primera pregunta'],
  ['mision', '🏁', 'Misión cumplida', 'Ganá al menos una estrella en una misión'],
  ['perfecto', '💎', 'Perfección', 'Conseguí 3 estrellas en una misión'],
  ['racha10', '🔥', 'En llamas', '10 respuestas correctas seguidas'],
  ['racha25', '☄️', 'Imparable', '25 respuestas correctas seguidas'],
  ['planeta', '🪐', 'Conquistador/a', 'Completá todas las misiones de un planeta'],
  ['arcade300', '👾', 'Piloto arcade', 'Hacé 300 puntos en un juego'],
  ['arcade1000', '🏆', 'As del espacio', 'Hacé 1000 puntos en un juego'],
  ['teoria10', '📚', 'Sabio/a', 'Leé la teoría de 10 temas'],
  ['sim10', '🧪', 'Científico/a', 'Usá 10 simuladores'],
  ['estrellas30', '🌟', 'Coleccionista', 'Juntá 30 estrellas'],
  ['galaxia', '🌌', 'Dueño/a de la galaxia', 'Completá todas las misiones de tu año'],
];
function unlock(id) { if (S.ach[id]) return; S.ach[id] = Date.now(); save(); const a = ACH.find(x => x[0] === id); toast(`<div>¡Logro desbloqueado!</div><b>${a[2]}</b>`, a[1]); sfx.win(); }
function checkAch() {
  if (S.correct >= 1) unlock('primer');
  if (Object.values(S.stars).some(v => v >= 1)) unlock('mision');
  if (Object.values(S.stars).some(v => v >= 3)) unlock('perfecto');
  if (S.streakBest >= 10) unlock('racha10'); if (S.streakBest >= 25) unlock('racha25');
  if (Object.values(S.best).some(v => v >= 300)) unlock('arcade300'); if (Object.values(S.best).some(v => v >= 1000)) unlock('arcade1000');
  if (S.theory.length >= 10) unlock('teoria10'); if (S.sims.length >= 10) unlock('sim10');
  if (totalStars() >= 30) unlock('estrellas30');
  for (const y of [2, 3]) for (const p of YEARS[y].planets) if (p.topics.every(t => (S.stars[t.id] || 0) >= 1)) unlock('planeta');
  if (allTopics(S.year).every(t => (S.stars[t.id] || 0) >= 1)) unlock('galaxia');
}
const totalStars = () => Object.values(S.stars).reduce((a, b) => a + b, 0);
function addXP(n) { const before = rank(S.xp).name; S.xp += Math.round(n); save(); const after = rank(S.xp); if (after.name !== before) { toast(`¡Subiste de rango! Ahora sos <b>${after.name}</b>`, after.icon); confetti(90); sfx.win(); } renderTop(); }
function registerAnswer(ok) { if (ok) { S.correct++; S.streak++; S.streakBest = Math.max(S.streakBest, S.streak); } else S.streak = 0; save(); checkAch(); }

// ======================= estructura =======================
function shell(inner) {
  $app.innerHTML = `<header class="top" id="top"></header><main class="wrap" id="main">${inner}</main>`;
  renderTop();
}
function renderTop() {
  const t = $('#top'); if (!t) return;
  const r = rank(S.xp), pct = r.to > r.from ? (S.xp - r.from) / (r.to - r.from) * 100 : 100;
  t.innerHTML = `<div class="logo" id="home"><span class="pl">🪐</span><span class="t">Galaxia Matemática</span></div><div class="grow"></div>
    <div class="xp" title="Experiencia"><span>${r.icon}</span><div><div class="bar"><div style="width:${pct}%"></div></div><small>${r.name} · ${S.xp} XP</small></div></div>
    <span class="pill" title="Estrellas">⭐ ${totalStars()}</span>
    <button class="btn sm ghost" id="snd" title="Sonido">${S.sound ? '🔊' : '🔇'}</button>
    <button class="btn sm" id="me" title="Mi perfil">${S.ship} <span class="hide-m">${esc(S.name)}</span></button>`;
  $('#home').onclick = () => go('#/');
  $('#snd').onclick = () => { S.sound = !S.sound; save(); renderTop(); };
  $('#me').onclick = () => go('#/perfil');
}
const go = h => { if (location.hash === h) route(); else location.hash = h; };

// ======================= bienvenida =======================
function welcome() {
  let ship = S.ship || '🚀', year = S.year || 2;
  $app.innerHTML = `<div class="welcome"><div class="wcard">
    <div class="hero">🪐</div><h1>Galaxia Matemática</h1>
    <p class="muted" style="font-size:16px">Viajá de planeta en planeta, completá misiones, ganá estrellas y convertite en leyenda galáctica.</p>
    <label class="field">¿Cómo te llamás, piloto?<input id="nm" maxlength="20" placeholder="Tu nombre o apodo" value="${esc(S.name)}"></label>
    <div class="field">Elegí tu nave</div>
    <div class="choices" id="ships">${['🚀', '🛸', '🛰️', '👾', '🐲', '🦄', '🐙', '🌠'].map(s => `<button class="choice ${s === ship ? 'sel' : ''}" data-s="${s}">${s}</button>`).join('')}</div>
    <div class="field">¿Qué año cursás?</div>
    <div class="choices"><button class="choice year ${year === 2 ? 'sel' : ''}" data-y="2">2.º año</button><button class="choice year ${year === 3 ? 'sel' : ''}" data-y="3">3.er año</button></div>
    <button class="btn primary big" id="go">¡Despegar! 🚀</button>
  </div></div>`;
  $$('[data-s]').forEach(b => b.onclick = () => { ship = b.dataset.s; $$('[data-s]').forEach(x => x.classList.toggle('sel', x === b)); sfx.click(); });
  $$('[data-y]').forEach(b => b.onclick = () => { year = +b.dataset.y; $$('[data-y]').forEach(x => x.classList.toggle('sel', x === b)); sfx.click(); });
  const start = () => { const n = $('#nm').value.trim(); if (!n) { $('#nm').classList.add('shake'); $('#nm').focus(); setTimeout(() => $('#nm').classList.remove('shake'), 400); return; } S.name = n; S.ship = ship; S.year = year; save(); sfx.win(); confetti(40); go('#/'); };
  $('#go').onclick = start; $('#nm').onkeydown = e => { if (e.key === 'Enter') start(); };
}

// ======================= mapa =======================
function mapView() {
  const Y = YEARS[S.year];
  const byCuat = [1, 2].map(c => Y.planets.filter(p => p.cuat === c));
  shell(`<div class="map-head"><div class="grow"><p class="muted" style="margin:0">¡Hola, ${esc(S.name)}! ${S.ship}</p><h1>Galaxia de ${Y.name}</h1></div>
    <div class="seg">${[2, 3].map(y => `<button data-y="${y}" class="${S.year === y ? 'sel' : ''}">${YEARS[y].name}</button>`).join('')}</div></div>
    ${byCuat.map((ps, i) => `<div class="cuat">${i ? 'Segundo' : 'Primer'} cuatrimestre</div><div class="planets">${ps.map(planetCard).join('')}</div>`).join('')}`);
  $$('[data-y]').forEach(b => b.onclick = () => { S.year = +b.dataset.y; save(); mapView(); });
  $$('[data-p]').forEach(c => c.onclick = () => go(`#/p/${c.dataset.p}`));
}
function planetCard(p) {
  const got = p.topics.reduce((a, t) => a + (S.stars[t.id] || 0), 0), max = p.topics.length * 3;
  return `<button class="planet" data-p="${p.id}" style="--c1:${p.color[0]};--c2:${p.color[1]}"><div class="orb"></div><h3>${p.name}</h3><div class="sub">${p.subtitle}</div><div class="prog"><span>⭐ ${got}/${max}</span><div class="bar"><div style="width:${got / max * 100}%"></div></div><span>${p.topics.length} misiones</span></div></button>`;
}

function planetView(pid) {
  const p = YEARS[2].planets.concat(YEARS[3].planets).find(x => x.id === pid); if (!p) return go('#/');
  shell(`<button class="btn sm ghost" onclick="location.hash='#/'">← Volver a la galaxia</button>
    <div class="planet-head" style="--c1:${p.color[0]};--c2:${p.color[1]}"><div class="orb"></div><div class="grow"><p class="muted" style="margin:0">${p.subtitle} · ${p.cuat === 1 ? 'Primer' : 'Segundo'} cuatrimestre</p><h1 style="font-size:34px">${p.name}</h1></div>
    <button class="btn gold" id="mix">🎮 Desafío del planeta</button></div>
    <div class="missions" style="--c1:${p.color[0]};--c2:${p.color[1]}">${p.topics.map((t, i) => `<button class="mission" data-t="${t.id}"><div class="ic">${t.icon}</div><div class="grow"><div class="n">MISIÓN ${i + 1}</div><h4>${t.title}</h4></div>${starsRow(S.stars[t.id] || 0)}</button>`).join('')}</div>`);
  $$('[data-t]').forEach(b => b.onclick = () => go(`#/m/${b.dataset.t}/teoria`));
  $('#mix').onclick = () => go(`#/juego/${p.id}`);
}
const starsRow = n => `<span class="starsrow">${[1, 2, 3].map(i => `<span class="${i <= n ? '' : 'off'}">⭐</span>`).join('')}</span>`;

// ======================= misión =======================
function missionView(tid, tab = 'teoria') {
  const f = findTopic(tid); if (!f) return go('#/');
  const { t, p, i } = f;
  shell(`<button class="btn sm ghost" onclick="location.hash='#/p/${p.id}'">← ${p.name}</button>
    <div class="mhead"><span class="ic">${t.icon}</span><div class="grow"><p class="muted" style="margin:0">Misión ${i + 1} · ${p.subtitle}</p><h1>${t.title}</h1></div>${starsRow(S.stars[t.id] || 0)}<button class="btn sm" id="prn" title="Imprimir práctica para el aula">🖨️</button></div>
    <nav class="tabs">${[['teoria', '📖 Teoría'], ['simulador', '🧪 Simulador'], ['practica', '✏️ Práctica'], ['juego', '🎮 Juego']].map(([k, l]) => `<button data-tab="${k}" class="${k === tab ? 'sel' : ''}">${l}</button>`).join('')}</nav>
    <section id="tabbody"></section>`);
  $$('[data-tab]').forEach(b => b.onclick = () => { history.replaceState(null, '', `#/m/${tid}/${b.dataset.tab}`); missionView(tid, b.dataset.tab); });
  $('#prn').onclick = () => printSheet(t, p);
  const body = $('#tabbody');
  if (tab === 'teoria') {
    body.innerHTML = `<div class="theory">${t.theory.map((c, k) => `<article class="tcard" style="animation-delay:${k * 0.08}s"><h3>${c.h}</h3>${c.html}</article>`).join('')}<div style="text-align:center;margin-top:8px"><button class="btn primary big" id="nx">Probar el simulador →</button></div></div>`;
    if (!S.theory.includes(t.id)) { S.theory.push(t.id); save(); addXP(5); checkAch(); }
    $('#nx').onclick = () => $('[data-tab="simulador"]').click();
  } else if (tab === 'simulador') {
    body.innerHTML = `<div class="panel" id="sim"></div><div style="text-align:center;margin-top:16px"><button class="btn primary big" id="nx">¡A practicar! →</button></div>`;
    let wins = 0;
    setWinHandler(() => { wins++; sfx.ok(); if (wins <= 5) addXP(3); });
    WIDGETS[t.sim.w]($('#sim'), t.sim.opts || {});
    if (!S.sims.includes(t.id)) { S.sims.push(t.id); save(); checkAch(); }
    $('#nx').onclick = () => $('[data-tab="practica"]').click();
  } else if (tab === 'practica') practice(body, t);
  else gameMenu(body, [t], t.id);
}

// ======================= práctica =======================
const N_Q = 10;
function isTerminating(q) { let d = q.d; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
function checkNum(ex, raw) {
  const v = parseAnswer(raw); if (v == null) return null;
  const target = ex.answer instanceof Q ? ex.answer.val() : ex.answer;
  let tol = ex.tol ?? 1e-6;
  if (ex.answer instanceof Q && !isTerminating(ex.answer)) tol = Math.max(tol, 0.006);
  return Math.abs(v - target) <= tol;
}
const showAnswer = ex => ex.type === 'mc' ? ex.options[ex.answer] : (ex.answer instanceof Q ? ex.answer.html() + (ex.answer.isInt() ? '' : ` (≈ ${num(ex.answer.val(), 3)})`) : num(ex.answer, ex.dec ?? 2)) + (ex.unit && ex.type !== 'mc' ? ' ' + ex.unit : '');

function practice(body, t) {
  let n = 0, results = [], ex, answered = false, streakLocal = 0;
  const next = () => {
    if (n >= N_Q) return finish();
    ex = t.gen(); answered = false;
    body.innerHTML = `<div class="panel practice"><div class="qhead"><b>${n + 1}/${N_Q}</b><div class="dots">${Array.from({ length: N_Q }, (_, k) => `<span class="${k < results.length ? (results[k] ? 'ok' : 'bad') : k === n ? 'cur' : ''}"></span>`).join('')}</div><span class="pill">🔥 ${streakLocal}</span></div>
      <div class="qtext">${ex.q}</div>
      ${ex.type === 'mc' ? `<div class="opts">${ex.options.map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join('')}</div>` : `<div class="answer-row"><input id="ans" inputmode="decimal" autocomplete="off" placeholder="Tu respuesta">${ex.unit ? `<b>${ex.unit}</b>` : ''}<div class="keys"><button data-key="−">−</button><button data-key="/">/</button><button data-key=",">,</button></div><button class="btn primary" id="chk">Comprobar</button></div><p class="muted">Podés escribir enteros (−3), decimales con coma (2,5) o fracciones (3/4).</p>`}
      <div id="fb"></div></div>`;
    if (ex.type === 'mc') $$('.opt', body).forEach(b => b.onclick = () => answer(+b.dataset.k === ex.answer, b));
    else {
      const inp = $('#ans', body); inp.focus();
      $$('[data-key]', body).forEach(b => b.onclick = () => { inp.value += b.dataset.key; inp.focus(); });
      const submit = () => { if (answered) return next(); const r = checkNum(ex, inp.value); if (r === null) { inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); return; } answer(r, inp); };
      $('#chk', body).onclick = submit; inp.onkeydown = e => { if (e.key === 'Enter') submit(); };
    }
  };
  const answer = (ok, elx) => {
    if (answered) return; answered = true;
    results.push(ok); registerAnswer(ok);
    if (ok) { sfx.ok(); streakLocal++; addXP(10); } else { sfx.bad(); streakLocal = 0; elx.classList.add('shake'); }
    if (ex.type === 'mc') { $$('.opt', body).forEach((b, k) => { b.disabled = true; if (k === ex.answer) b.classList.add('ok'); else if (b === elx) b.classList.add('bad'); }); }
    else { $('#ans', body).disabled = true; }
    const cheers = ['¡Bien ahí!', '¡Excelente!', '¡Genial!', '¡Correcto!', '¡Sos crack!', '¡Impecable!'];
    $('#fb', body).innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}"><h4>${ok ? '✅ ' + pick(cheers) : '❌ Casi…'}</h4>${ok ? '' : `<div>La respuesta correcta es <b>${showAnswer(ex)}</b>.</div>`}${ex.explain ? `<div>${ex.explain}</div>` : ''}<div style="margin-top:10px"><button class="btn primary" id="nq">${n + 1 >= N_Q ? 'Ver resultado' : 'Siguiente →'}</button></div></div>`;
    n++;
    $('#nq', body).onclick = next; $('#nq', body).focus();
  };
  const finish = () => {
    const ok = results.filter(Boolean).length, pct = ok / N_Q, stars = pct === 1 ? 3 : pct >= 0.8 ? 2 : pct >= 0.6 ? 1 : 0;
    const prev = S.stars[t.id] || 0;
    if (stars > prev) { S.stars[t.id] = stars; save(); if (stars === 3) addXP(50); }
    checkAch();
    if (stars) { confetti(stars * 40); sfx.win(); }
    body.innerHTML = `<div class="panel result"><h2 style="font-size:34px">${stars === 3 ? '¡Misión perfecta!' : stars ? '¡Misión cumplida!' : '¡Seguí intentando!'}</h2><div class="bigstars">${[1, 2, 3].map(i => `<span style="${i <= stars ? '' : 'filter:grayscale(1);opacity:.25'}">⭐</span>`).join('')}</div><p style="font-size:18px">Respondiste bien <b>${ok} de ${N_Q}</b>.</p><p class="muted">1 ⭐ con 6 · 2 ⭐ con 8 · 3 ⭐ con 10. ${stars > prev ? '¡Nuevo récord en esta misión!' : prev ? `Tu mejor marca: ${prev} ⭐` : ''}</p><div class="sim-row" style="justify-content:center"><button class="btn" id="rp">🔁 Practicar otra vez</button><button class="btn" id="th">📖 Repasar teoría</button><button class="btn primary" id="gm">🎮 Ir al juego</button></div></div>`;
    $('#rp', body).onclick = () => { n = 0; results = []; next(); };
    $('#th', body).onclick = () => $('[data-tab="teoria"]').click();
    $('#gm', body).onclick = () => $('[data-tab="juego"]').click();
  };
  next();
}

// ======================= juegos =======================
function gameMenu(body, topics, key) {
  const best = S.best[key] || 0;
  body.innerHTML = `<div class="modes">
    <button class="mode" data-m="rain"><div class="e">☄️</div><h3>Lluvia de asteroides</h3><p class="muted">Disparale al asteroide con la respuesta correcta antes de que caiga. Tenés 3 escudos.</p></button>
    <button class="mode" data-m="race"><div class="e">🏁</div><h3>Carrera contrarreloj</h3><p class="muted">60 segundos: cada respuesta correcta te acerca a la meta. ¡Las incorrectas te frenan!</p></button>
  </div><p class="muted" style="text-align:center;margin-top:14px">🏆 Tu récord: <b>${best}</b> puntos</p>`;
  $$('[data-m]', body).forEach(b => b.onclick = () => (b.dataset.m === 'rain' ? rainGame : raceGame)(body, topics, key));
}
function nextMC(topics) { for (let k = 0; k < 6; k++) { const ex = toMC(pick(topics).gen()); if (ex.options.length >= 2 && ex.options.length <= 4) return ex; } return toMC(pick(topics).gen()); }
function endGame(box, body, topics, key, score, extra = '') {
  const prev = S.best[key] || 0, rec = score > prev;
  if (rec) S.best[key] = score; save(); addXP(score / 10); checkAch();
  if (rec && score > 0) { confetti(80); sfx.win(); }
  box.insertAdjacentHTML('beforeend', `<div class="over"><div><h2>${rec && score ? '¡Nuevo récord! 🏆' : 'Fin del juego'}</h2><p style="font-size:22px">Puntaje: <b>${score}</b></p>${extra}<p class="muted">Récord: ${Math.max(prev, score)} · +${Math.round(score / 10)} XP</p><div class="sim-row" style="justify-content:center"><button class="btn primary" id="again">Jugar de nuevo</button><button class="btn" id="menu">Elegir juego</button></div></div></div>`);
  $('#again', box).onclick = () => rainOrRace(box.dataset.mode)(body, topics, key);
  $('#menu', box).onclick = () => gameMenu(body, topics, key);
}
const rainOrRace = m => (m === 'race' ? raceGame : rainGame);

function rainGame(body, topics, key) {
  body.innerHTML = `<div class="game" id="gb" data-mode="rain"><div class="hud"><span>🛡️ <b id="lv">3</b></span><span>⭐ <b id="sc">0</b></span><span>Combo <b id="cb">x1</b></span><span class="grow"></span><span>Nivel <b id="lvl">1</b></span><button class="btn sm" id="quit">✕</button></div><div class="gq" id="gq"></div><div class="ship">${S.ship}</div></div>`;
  const box = $('#gb', body); let lives = 3, score = 0, combo = 1, level = 1, hits = 0, ex, asts = [], speed, raf, alive = true, last = performance.now();
  const H = () => box.clientHeight, W = () => box.clientWidth;
  const spawn = () => {
    asts.forEach(a => a.el.remove()); asts = [];
    ex = nextMC(topics); $('#gq', box).innerHTML = ex.q;
    const top = $('#gq', box).offsetTop + $('#gq', box).offsetHeight + 8;
    const n = ex.options.length, slot = W() / n;
    ex.options.forEach((o, k) => {
      const el = document.createElement('div'); el.className = 'ast'; el.innerHTML = `<span class="k">${k + 1}</span>${o}`;
      const x = slot * k + slot / 2 - (W() < 600 ? 43 : 56) + (Math.random() - .5) * Math.max(0, slot - 120) * .6;
      el.style.left = Math.max(4, Math.min(W() - 100, x)) + 'px';
      const y = top - Math.random() * 40; el.style.top = y + 'px';
      box.append(el); const a = { el, y, k, v: 0.9 + Math.random() * 0.25 }; asts.push(a);
      el.onclick = () => shoot(a);
    });
    speed = (16 + level * 5) * (H() / 600);
  };
  const flash = (txt, x, y) => { const c = document.createElement('div'); c.className = 'combo'; c.textContent = txt; c.style.left = x + 'px'; c.style.top = y + 'px'; box.append(c); setTimeout(() => c.remove(), 1000); };
  const laser = a => { const r = a.el.getBoundingClientRect(), b = box.getBoundingClientRect(); const sx = W() / 2, sy = H() - 60, tx = r.left - b.left + r.width / 2, ty = r.top - b.top + r.height / 2; const len = Math.hypot(tx - sx, ty - sy), ang = Math.atan2(tx - sx, sy - ty) * 180 / Math.PI; const l = document.createElement('div'); l.className = 'laser'; l.style.left = sx - 2 + 'px'; l.style.top = sy - len + 'px'; l.style.height = len + 'px'; l.style.transform = `rotate(${ang}deg)`; box.append(l); setTimeout(() => l.remove(), 260); };
  const shoot = a => {
    if (!alive) return; laser(a);
    if (a.k === ex.answer) { a.el.classList.add('boom'); sfx.boom(); sfx.ok(); const pts = 10 * combo * level; score += pts; hits++; registerAnswer(true); flash(`+${pts}`, parseFloat(a.el.style.left), a.y); combo = Math.min(5, combo + 1); if (hits % 5 === 0) { level++; flash(`¡Nivel ${level}!`, W() / 2 - 50, H() / 2); } setTimeout(() => alive && spawn(), 350); }
    else { a.el.classList.add('wrong'); sfx.bad(); combo = 1; lives--; registerAnswer(false); if (lives <= 0) return over(); }
    hud();
  };
  const hud = () => { $('#lv', box).textContent = lives; $('#sc', box).textContent = score; $('#cb', box).textContent = 'x' + combo; $('#lvl', box).textContent = level; };
  const over = () => { alive = false; cancelAnimationFrame(raf); removeEventListener('keydown', keys); endGame(box, body, topics, key, score, `<p>Respuestas correctas: ${hits}</p>`); };
  const loop = now => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    for (const a of asts) { a.y += speed * a.v * dt; a.el.style.top = a.y + 'px'; }
    const good = asts.find(a => a.k === ex.answer);
    if (good && good.y > H() - 110 && !good.el.classList.contains('boom')) { lives--; combo = 1; sfx.bad(); registerAnswer(false); flash('¡Se escapó!', W() / 2 - 60, H() - 160); hud(); if (lives <= 0) return over(); spawn(); }
    if (alive) raf = requestAnimationFrame(loop);
  };
  const keys = e => { const k = +e.key; if (k >= 1 && k <= asts.length) shoot(asts[k - 1]); };
  addEventListener('keydown', keys);
  $('#quit', box).onclick = () => { alive = false; cancelAnimationFrame(raf); removeEventListener('keydown', keys); gameMenu(body, topics, key); };
  spawn(); raf = requestAnimationFrame(loop);
  const obs = new MutationObserver(() => { if (!document.body.contains(box)) { alive = false; cancelAnimationFrame(raf); removeEventListener('keydown', keys); obs.disconnect(); } }); obs.observe(document.body, { childList: true, subtree: true });
}

function raceGame(body, topics, key) {
  body.innerHTML = `<div class="game" id="gb" data-mode="race"><div class="hud"><span>⏱️ <b id="tm">60</b> s</span><span>⭐ <b id="sc">0</b></span><span>Racha <b id="st">0</b></span><span class="grow"></span><button class="btn sm" id="quit">✕</button></div><div class="gq" id="gq" style="max-height:none"></div><div id="ro" style="position:absolute;left:12px;right:12px;bottom:130px;z-index:4" class="opts"></div><div class="race"><span class="r" id="rc" style="left:0">${S.ship}</span><span class="r" style="right:-10px">🏁</span></div></div>`;
  const box = $('#gb', body); let t = 60, score = 0, streak = 0, pos = 0, ex, alive = true;
  const nextQ = () => { ex = nextMC(topics); $('#gq', box).innerHTML = ex.q; $('#ro', box).innerHTML = ex.options.map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join(''); $$('#ro .opt', box).forEach(b => b.onclick = () => pickA(+b.dataset.k, b)); };
  const pickA = (k, b) => {
    if (!alive) return;
    if (k === ex.answer) { streak++; score += 10 + streak * 2; pos = Math.min(100, pos + 6); sfx.ok(); registerAnswer(true); b.classList.add('ok'); }
    else { streak = 0; pos = Math.max(0, pos - 3); t = Math.max(0, t - 3); sfx.bad(); registerAnswer(false); b.classList.add('bad'); }
    $('#sc', box).textContent = score; $('#st', box).textContent = streak; $('#rc', box).style.left = `calc(${pos}% - 20px)`;
    if (pos >= 100) { score += t * 5; return stop(`<p>¡Llegaste a la meta con ${t} s de sobra! (+${t * 5})</p>`); }
    setTimeout(() => alive && nextQ(), 300);
  };
  const timer = setInterval(() => { if (!document.body.contains(box)) { clearInterval(timer); return; } t--; $('#tm', box).textContent = t; if (t <= 0) stop(`<p>Avanzaste ${Math.round(pos)} % del recorrido.</p>`); }, 1000);
  const stop = extra => { if (!alive) return; alive = false; clearInterval(timer); endGame(box, body, topics, key, score, extra); };
  $('#quit', box).onclick = () => { alive = false; clearInterval(timer); gameMenu(body, topics, key); };
  nextQ();
}

function planetGame(pid) {
  const p = YEARS[2].planets.concat(YEARS[3].planets).find(x => x.id === pid); if (!p) return go('#/');
  shell(`<button class="btn sm ghost" onclick="location.hash='#/p/${p.id}'">← ${p.name}</button><div class="mhead"><span class="ic">🎮</span><div class="grow"><p class="muted" style="margin:0">Preguntas de todas las misiones</p><h1>Desafío de ${p.name}</h1></div></div><section id="tabbody"></section>`);
  gameMenu($('#tabbody'), p.topics, 'planet-' + p.id);
}

// ======================= perfil =======================
function profile() {
  const r = rank(S.xp), done = allTopics(S.year).filter(t => (S.stars[t.id] || 0) >= 1).length;
  shell(`<button class="btn sm ghost" onclick="location.hash='#/'">← Volver a la galaxia</button>
    <div class="mhead"><span class="ic" style="font-size:56px">${S.ship}</span><div class="grow"><p class="muted" style="margin:0">${r.icon} ${r.name}</p><h1>${esc(S.name)}</h1></div><button class="btn" id="edit">✏️ Cambiar nave o nombre</button></div>
    <div class="statgrid"><div class="stat"><b>${S.xp}</b>XP</div><div class="stat"><b>${totalStars()}</b>estrellas</div><div class="stat"><b>${done}/${allTopics(S.year).length}</b>misiones de ${YEARS[S.year].name}</div><div class="stat"><b>${S.correct}</b>respuestas correctas</div><div class="stat"><b>${S.streakBest}</b>mejor racha</div></div>
    <h2 style="margin-bottom:12px">🏅 Logros (${Object.keys(S.ach).length}/${ACH.length})</h2>
    <div class="badges">${ACH.map(([id, e, n, d]) => `<div class="badge ${S.ach[id] ? '' : 'off'}"><div class="e">${e}</div><b>${n}</b><small>${d}</small></div>`).join('')}</div>
    <h2 style="margin:26px 0 12px">📜 Rangos</h2><div class="badges">${RANKS.map(([x, n, e]) => `<div class="badge ${S.xp >= x ? '' : 'off'}"><div class="e">${e}</div><b>${n}</b><small>${x} XP</small></div>`).join('')}</div>
    <p style="margin-top:30px"><button class="btn sm" id="reset">🗑️ Borrar mi progreso</button> <span class="muted">Tu progreso se guarda solo en este dispositivo.</span></p>`);
  $('#edit').onclick = welcome;
  $('#reset').onclick = () => { if (confirm('¿Seguro? Se borran tus estrellas, XP y logros de este dispositivo.')) { S = { ...DEF }; save(); go('#/'); } };
}

// ======================= hoja imprimible =======================
function printSheet(t, p) {
  const exs = Array.from({ length: 12 }, () => t.gen());
  const L = 'abcd';
  $('#print').innerHTML = `<h1>${t.title}</h1><p>${p.subtitle} · Nombre: ____________________ Curso: ______ Fecha: ________</p>
    ${exs.map((e, i) => `<div class="pq"><b>${i + 1}.</b> ${e.q}${e.type === 'mc' ? `<div>${e.options.map((o, k) => `&nbsp;&nbsp;${L[k]}) ${o}`).join('<br>')}</div>` : '<div>Respuesta: ______________</div>'}</div>`).join('')}
    <div class="key"><h1>Respuestas · ${t.title}</h1>${exs.map((e, i) => `<div class="pq"><b>${i + 1}.</b> ${e.type === 'mc' ? `${L[e.answer]}) ${e.options[e.answer]}` : showAnswer(e)}${e.explain ? `<br><small>${e.explain}</small>` : ''}</div>`).join('')}</div>`;
  setTimeout(() => print(), 50);
}

// ======================= router =======================
function route() {
  scrollTo(0, 0);
  if (!S.name) return welcome();
  const [, a, b, c] = location.hash.replace(/^#\/?/, '#/').split('/');
  if (a === 'p' && b) return planetView(b);
  if (a === 'm' && b) return missionView(b, c || 'teoria');
  if (a === 'juego' && b) return planetGame(b);
  if (a === 'perfil') return profile();
  mapView();
}
addEventListener('hashchange', route);
route();
