// App de rutina para clientes. Lee window.CLIENTE (config.js de cada cliente)
// y window.EJERCICIOS (ejercicios.js). Los datos se guardan solo en el teléfono.
(function () {
  const C = window.CLIENTE, EJ = window.EJERCICIOS, SPR = window.SPRITE;
  if (C.marca && C.marca.color) document.documentElement.style.setProperty('--brand', C.marca.color);
  document.title = 'Mi rutina · ' + C.nombre;

  const DN = ['L','M','M','J','V','S','D'];
  const DNL = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  const MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const AGUA = C.agua || { min: 6, max: 8 };
  const META = C.diasMeta || 5;

  // ---------- almacenamiento ----------
  const KEY = 'rutina:' + location.pathname;
  let mem = {};
  try { mem = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { mem = {}; }
  mem.w = mem.w || {}; mem.ci = mem.ci || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {} };

  // ---------- fechas ----------
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const monday = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; };
  const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = new Date(), todayMon = monday(today), todayIdx = (today.getDay() + 6) % 7;
  if (!mem.start) { mem.start = iso(today); save(); }

  let wk = todayMon, sel = todayIdx, tab = 'hoy', mode = mem.mode || 'gym', skipOpen = false;
  const COMIDAS = C.comidas || ['🌅 Desayuno', '🍎 Colación', '🍲 Comida', '🥪 Snack antes del gym', '🌙 Cena'];
  const MOTIVOS = C.motivos || [['trabajo', '💼 Trabajo'], ['escuela', '📚 Escuela'], ['cansancio', '😴 Mucho cansancio'], ['dolor', '🩹 Me duele algo'], ['otro', '🤷 Otro']];
  const motivo = v => (MOTIVOS.find(m => m[0] === v) || [v, v])[1];
  const mealsCount = r => r && r.f ? Object.keys(r.f).filter(k => r.f[k] && +k < COMIDAS.length).length : 0;

  // ---------- datos ----------
  function rec(w, i) { const k = iso(w); mem.w[k] = mem.w[k] || {}; mem.w[k][i] = mem.w[k][i] || { c: {}, w: 0, k: '', p: {} }; return mem.w[k][i]; }
  function peek(w, i) { return (mem.w[iso(w)] || {})[i]; }
  function keyOf(it, j) { return it.id || ('x' + j); }

  function item(i, j) {
    const it = C.dias[i].items[j], base = EJ[it.id] || {};
    let e = base, d = it.d, tag = '';
    if (mode === 'casa') {
      if (base.sub) { e = EJ[base.sub]; d = it.ds || it.d; tag = '🏠 Sin máquina'; }
      else if (base.img) tag = '✔️ Igual en casa';
    }
    return { key: keyOf(it, j), n: it.n || e.n, d, img: e.img, emo: it.emo || e.emo, tip: it.tip || e.tip, pesas: !!e.pesas, tag };
  }
  function doneCount(r, i) { if (!r) return 0; return C.dias[i].items.filter((it, j) => r.c[keyOf(it, j)]).length; }
  function status(w, i) {
    const r = peek(w, i), n = doneCount(r, i), total = C.dias[i].items.length, d = iso(addDays(w, i));
    if (n >= total) return '✅';
    if (r && r.skip) return '⏸️';
    if (n > 0) return '🟡';
    if (d < mem.start) return '·';
    return d < iso(today) ? '❌' : '⬜';
  }
  function weekStats(w) {
    let full = 0, water = 0, hyd = 0, meals = 0, skips = 0;
    for (let i = 0; i < 7; i++) {
      const r = peek(w, i);
      if (status(w, i) === '✅') full++;
      if (r) { water += r.w; if (r.w >= AGUA.min) hyd++; if (mealsCount(r) >= COMIDAS.length) meals++; if (r.skip) skips++; }
    }
    return { full, water, hyd, meals, skips };
  }
  // historial de pesos por ejercicio: [{fecha, peso}]
  function weights() {
    const h = {};
    Object.keys(mem.w).sort().forEach(k => {
      const wkD = fromIso(k);
      Object.keys(mem.w[k]).forEach(i => {
        const p = mem.w[k][i].p || {};
        Object.keys(p).forEach(id => { const v = parseFloat(p[id]); if (!isNaN(v)) (h[id] = h[id] || []).push({ f: iso(addDays(wkD, +i)), v }); });
      });
    });
    Object.values(h).forEach(a => a.sort((x, y) => x.f < y.f ? -1 : 1));
    return h;
  }
  function lastWeight(id, beforeIso) {
    const a = (weights()[id] || []).filter(x => x.f < beforeIso); return a.length ? a[a.length - 1].v : null;
  }
  function streak() {
    let w = todayMon, n = 0;
    if (weekStats(w).full < META) w = addDays(w, -7); // la semana actual aún puede completarse
    while (iso(addDays(w, 6)) >= mem.start && weekStats(w).full >= META) { n++; w = addDays(w, -7); }
    return n;
  }
  function badges() {
    let fullDays = 0, anyDay = false, weekOk = false, hydOk = false, mealOk = false, warned = false, hydDays = 0;
    Object.keys(mem.w).forEach(k => {
      const w = fromIso(k), s = weekStats(w);
      fullDays += s.full; hydDays += s.hyd; if (s.full >= META) weekOk = true; if (s.hyd >= 7) hydOk = true;
      if (s.meals >= 7) mealOk = true; if (s.skips > 0) warned = true;
      for (let i = 0; i < 7; i++) if (doneCount(peek(w, i), i) > 0) anyDay = true;
    });
    const up = Object.values(weights()).some(a => a.length > 1 && a[a.length - 1].v > a[0].v);
    const st = streak();
    return [
      ['🌱', 'Primer entreno', anyDay],
      ['🔥', 'Semana cumplida', weekOk],
      ['💧', '7 días con agua', hydOk],
      ['💪', '10 días completos', fullDays >= 10],
      ['📈', 'Subí de peso', up],
      ['🏆', '4 semanas seguidas', st >= 4],
      ['⭐', '25 días completos', fullDays >= 25],
      ['📲', 'Mandé mi resumen', !!mem.sent],
      ['🍎', '7 días comiendo bien', mealOk],
      ['🗣️', 'Avisé cuando no pude', warned],
      ['🌊', '30 días con agua', hydDays >= 30],
      ['👑', '12 semanas seguidas', st >= 12]
    ];
  }

  // ---------- vistas ----------
  const $ = s => document.querySelector(s);
  const app = $('#app');
  const fecha = d => d.getDate() + ' ' + MES[d.getMonth()];

  function pic(e) {
    if (!e.img) return `<div class="pic emo">${e.emo || '💪'}</div>`;
    const pos = n => { const k = SPR.indexOf(e.img) * 2 + n; return `background-position:${(k % 4) / 3 * 100}% ${Math.floor(k / 4) / 11 * 100}%`; };
    return `<div class="pic"><div class="sp" style="${pos(0)}"></div><div class="sp b" style="${pos(1)}"></div>${e.tag ? `<span class="tag">${e.tag}</span>` : ''}</div>`;
  }

  function weekNav() {
    const end = addDays(wk, 6);
    let h = `<div class="weeknav"><button data-a="prev" aria-label="Semana anterior">◀</button>
      <span>${iso(wk) === iso(todayMon) ? 'Esta semana · ' : ''}${fecha(wk)} – ${fecha(end)}</span>
      <button data-a="next" aria-label="Semana siguiente" style="visibility:${iso(wk) >= iso(todayMon) ? 'hidden' : 'visible'}">▶</button></div>`;
    return h;
  }

  function viewHoy() {
    const D = C.dias[sel], r = peek(wk, sel) || { c: {}, w: 0, k: '', p: {} }, dayIso = iso(addDays(wk, sel));
    const done = doneCount(r, sel), total = D.items.length;
    let h = weekNav() + '<div class="cal">';
    for (let i = 0; i < 7; i++) h += `<button data-day="${i}" class="${i === sel ? 'sel' : ''}"><span class="d">${DN[i]}</span><span class="n">${addDays(wk, i).getDate()}</span><span class="s">${status(wk, i)}</span></button>`;
    h += `</div><div class="legend"><span>✅ completo</span><span>🟡 a medias</span><span>⏸️ avisé que no pude</span><span>❌ no lo hice</span><span>⬜ pendiente</span></div>
      <div class="seg"><button data-mode="gym" class="${mode === 'gym' ? 'on' : ''}">🏋️ En el gym</button><button data-mode="casa" class="${mode === 'casa' ? 'on' : ''}">🏠 Sin máquinas</button></div>
      <div class="dayhead" style="background:${D.color}"><h2>${D.titulo}</h2>
      <p>${DNL[sel]} ${fecha(addDays(wk, sel))} · ${done} de ${total} hechos ${done === total ? '🎉' : ''}</p>
      ${D.nota ? `<p>${D.nota}</p>` : ''}<div class="bar"><i style="width:${Math.round(done / total * 100)}%"></i></div></div>`;
    if (r.skip) {
      h += `<div class="panel skip"><h3>⏸️ Hoy no pude entrenar</h3>
        <p class="hint">Motivo: <b>${motivo(r.skip)}</b>. Está bien descansar cuando lo necesitas, y avisar es de personas responsables. 💚 Si puedes, haz 5 minutos de estiramiento.</p>
        <div class="btns"><button data-a="unskip">↩️ Sí voy a entrenar</button></div></div>`;
    } else if (skipOpen) {
      h += `<div class="panel skip"><h3>⏸️ ¿Por qué no puedes hoy?</h3><div class="reasons">
        ${MOTIVOS.map(([v, t]) => `<button data-skip="${v}">${t}</button>`).join('')}</div>
        <div class="btns" style="margin-top:8px"><button data-a="skipcancel">Cancelar</button></div></div>`;
    } else if (done < total) {
      h += `<button class="skipbtn" data-a="skipopen">⏸️ Hoy no puedo entrenar</button>`;
    }
    D.items.forEach((_, j) => {
      const e = item(sel, j), ok = !!r.c[e.key];
      h += `<div class="ex ${ok ? 'done' : ''}">${pic(e)}
        <div class="body"><div class="txt"><div class="name">${e.n}</div><div class="dose">${e.d || ''}</div>${e.tip ? `<div class="tip">💡 ${e.tip}</div>` : ''}</div>
        <button class="check" data-k="${e.key}" aria-label="Marcar hecho">${ok ? '✓' : ''}</button></div>`;
      if (e.pesas && mode === 'gym') {
        const last = lastWeight(e.key, dayIso);
        h += `<div class="peso">🏋️ Peso usado <input inputmode="decimal" data-p="${e.key}" value="${r.p[e.key] || ''}" placeholder="kg"> ${last !== null ? `<span>La vez pasada: <b>${last}</b></span>` : ''}</div>`;
      }
      h += `</div>`;
    });
    h += `<div class="panel"><h3>💧 Agua de este día (meta: ${AGUA.min} a ${AGUA.max} vasos)</h3><div class="water">`;
    for (let i = 1; i <= AGUA.max; i++) h += `<button data-water="${i}" class="${i <= r.w ? 'on' : ''}">🥛</button>`;
    const f = r.f || {}, nm = mealsCount(r);
    h += `</div></div>
      <div class="panel"><h3>🍽️ Mis comidas de hoy (${nm} de ${COMIDAS.length})</h3>
        <p class="hint">Marca cada comida que hiciste. Comer las ${COMIDAS.length} te da energía para crecer y entrenar.</p>
        <div class="meals">${COMIDAS.map((m, i) => `<button data-meal="${i}" class="${f[i] ? 'on' : ''}"><span class="mc">${f[i] ? '✓' : ''}</span>${m}</button>`).join('')}</div>
      </div>
      <div class="panel"><h3>🩹 ¿Te dolió algo este día?</h3><div class="pick bad">
        ${[['no', '😊 No'], ['poco', '😐 Poquito'], ['si', '😣 Sí']].map(([v, t]) => `<button data-pain="${v}" data-v="${v}" class="${r.k === v ? 'on' : ''}">${t}</button>`).join('')}
      </div></div>`;
    if (C.precauciones && C.precauciones.length) h += `<div class="warn">⚠️ <b>Cuídate:</b><ul>${C.precauciones.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
    if (C.reglas && C.reglas.length) h += `<div class="panel"><h3>📏 Reglas</h3><div class="rules">${C.reglas.map(x => `<div>${x}</div>`).join('')}</div></div>`;
    return h;
  }

  function summary() {
    const end = addDays(wk, 6), s = weekStats(wk), ci = mem.ci[iso(wk)] || {};
    let t = `💪 Semana de ${C.nombre} (${fecha(wk)} – ${fecha(end)})\n`;
    for (let i = 0; i < 7; i++) {
      const r = peek(wk, i), pain = r && r.k ? (r.k === 'no' ? '' : r.k === 'poco' ? ' · dolor: poquito' : ' · dolor: sí') : '';
      const ent = r && r.skip && doneCount(r, i) < C.dias[i].items.length ? `no pudo (${motivo(r.skip).replace(/^\S+\s/, '').toLowerCase()})` : `${doneCount(r, i)}/${C.dias[i].items.length}`;
      t += `${status(wk, i)} ${DNL[i]}: ${ent} · 🍽️${mealsCount(r)}/${COMIDAS.length} · 💧${r ? r.w : 0} vasos${pain}\n`;
    }
    t += `\nDías completos: ${s.full} (meta ${META}) · Comidas completas: ${s.meals}/7 días · Racha: ${streak()} semanas`;
    const lab = { 1: '😴', 2: '😐', 3: '🙂', 4: '😄' };
    if (ci.e || ci.s || ci.a) t += `\nEnergía ${lab[ci.e] || '–'} · Sueño ${lab[ci.s] || '–'} · Ánimo ${lab[ci.a] || '–'}`;
    if (ci.nota) t += `\nNota: ${ci.nota}`;
    return t;
  }

  function viewSemana() {
    const s = weekStats(wk), ci = mem.ci[iso(wk)] || {};
    const pick = (f, label) => `<p class="hint" style="margin:8px 0 4px">${label}</p><div class="pick">${[1, 2, 3, 4].map(v => `<button data-ci="${f}" data-v="${v}" class="${ci[f] === v ? 'on' : ''}">${['😴', '😐', '🙂', '😄'][v - 1]}</button>`).join('')}</div>`;
    let h = weekNav() + `
      <div class="panel"><h3>📊 Mi semana</h3><div class="stats">
        <div><b>${s.full}/${META}</b>días completos</div><div><b>${s.meals}/7</b>días con ${COMIDAS.length} comidas</div>
        <div><b>${s.hyd}/7</b>días con agua</div><div><b>${streak()}</b>semanas seguidas</div>
      </div></div>
      <div class="panel"><h3>📝 ¿Cómo me fue esta semana?</h3>
        ${pick('e', '⚡ Mi energía')}${pick('s', '😴 Cómo dormí')}${pick('a', '😊 Mi ánimo')}
        <p class="hint" style="margin:10px 0 4px">✍️ Algo que quiera contarle a mi coach</p>
        <textarea data-ci-nota placeholder="Opcional">${ci.nota || ''}</textarea>
      </div>
      <div class="panel"><h3>📲 Manda tu semana</h3><p class="hint">Envíale tu resumen a tu coach o a tu familia.</p>
        <div class="btns"><a class="wa" data-a="wa" href="https://wa.me/?text=${encodeURIComponent(summary())}">🟢 WhatsApp</a><button data-a="copy">📋 Copiar</button></div>
        <div class="msg" id="msg"></div></div>
      <div class="panel"><h3>🏅 Mis logros</h3><div class="badges">
        ${badges().map(([e, t, g]) => `<div class="badge ${g ? 'got' : ''}"><span>${e}</span>${t}</div>`).join('')}
      </div></div>
      <div class="panel"><h3>🔐 Respaldo</h3><p class="hint">Tus marcas viven solo en este teléfono. Copia tu respaldo y guárdalo en WhatsApp. Si cambias de teléfono, pégalo aquí y toca Recuperar.</p>
        <div class="btns"><button data-a="backup">📦 Copiar respaldo</button><button data-a="restore">♻️ Recuperar</button></div>
        <textarea id="bk" placeholder="Pega aquí tu respaldo para recuperarlo"></textarea><div class="msg" id="bkmsg"></div></div>`;
    return h;
  }

  function viewFuerza() {
    const h = weights(), ids = Object.keys(h);
    let out = `<div class="panel"><h3>📈 Mi fuerza</h3><p class="hint">Así se mide tu progreso: por lo que levantas, no por la báscula. Anota el peso en cada ejercicio cuando estés en el gym.</p>`;
    if (!ids.length) out += `<p style="font-size:13.5px">Todavía no hay pesos anotados. 💪 Cuando anotes el peso de un ejercicio, aquí verás cómo vas subiendo.</p>`;
    ids.forEach(id => {
      const a = h[id], first = a[0].v, last = a[a.length - 1].v, max = Math.max(...a.map(x => x.v)), diff = +(last - first).toFixed(1);
      out += `<div class="str"><span>${(EJ[id] || {}).n || id}<br><small style="color:var(--muted)">Inicio ${first} · Ahora ${last} · Récord ${max}</small></span><span class="${diff > 0 ? 'up' : ''}">${diff > 0 ? '▲ +' + diff : diff < 0 ? diff : '='}</span></div>`;
    });
    out += `</div><div class="panel"><h3>🧠 ¿Cuándo subo de peso?</h3><p style="font-size:13px;margin:0">Si terminas tus series y te sobran <b>más de 3 repeticiones</b> dos entrenos seguidos, sube <b>un poquito</b> con ayuda de tu instructor. Si no puedes terminar con buena técnica, baja el peso. Nunca al fallo.</p></div>`;
    return out;
  }

  function render() {
    const views = { hoy: viewHoy, semana: viewSemana, fuerza: viewFuerza };
    app.innerHTML = `<div class="wrap">
      <header>${C.marca && C.marca.nombre ? `<div class="brand">${C.marca.nombre}</div>` : ''}<h1>💪 Mi rutina, ${C.nombre}</h1><p>${C.subtitulo || 'Marca cada ejercicio cuando lo termines.'}</p></header>
      ${views[tab]()}
      <footer>Tus datos se guardan solo en este teléfono.<br>Material educativo; no sustituye la consulta médica.<br>Imágenes: free-exercise-db (dominio público).</footer></div>
      <nav class="tabs"><div>
        ${[['hoy', '📅', 'Hoy'], ['semana', '🏅', 'Mi semana'], ['fuerza', '📈', 'Mi fuerza']].map(([t, e, l]) => `<button data-tab="${t}" class="${tab === t ? 'on' : ''}"><span>${e}</span>${l}</button>`).join('')}
        <button data-a="timer"><span>⏱️</span>Descanso</button>
      </div></nav>
      <div class="timer" id="timer"><div class="sheet"><h3 style="margin:0">⏱️ Descanso</h3><div class="big" id="tt">0:00</div>
        <div class="btns"><button data-t="60">60 seg</button><button data-t="90">90 seg</button><button data-a="tclose">Cerrar</button></div></div></div>`;
  }

  // ---------- eventos ----------
  let tInt = null;
  function startTimer(sec) {
    clearInterval(tInt); let left = sec; const el = $('#tt');
    const show = () => { el.textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0'); };
    show();
    tInt = setInterval(() => { left--; show(); if (left <= 0) { clearInterval(tInt); el.textContent = '¡Listo! 💪'; try { navigator.vibrate && navigator.vibrate([300, 150, 300]); } catch (e) {} } }, 1000);
  }
  function copy(text, msgId, ok) {
    const m = document.getElementById(msgId);
    const fallback = () => { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); m.textContent = ok; } catch (e) { m.textContent = 'No se pudo copiar.'; } t.remove(); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => { m.textContent = ok; }, fallback); else fallback();
  }

  app.addEventListener('click', ev => {
    const b = ev.target.closest('button, a'); if (!b) return;
    const d = b.dataset;
    if (d.a === 'prev') { wk = addDays(wk, -7); }
    else if (d.a === 'next') { if (iso(wk) < iso(todayMon)) wk = addDays(wk, 7); }
    else if (d.day !== undefined) { sel = +d.day; skipOpen = false; }
    else if (d.meal !== undefined) { const R = rec(wk, sel); R.f = R.f || {}; if (R.f[d.meal]) delete R.f[d.meal]; else R.f[d.meal] = true; save(); }
    else if (d.a === 'skipopen') { skipOpen = true; }
    else if (d.a === 'skipcancel') { skipOpen = false; }
    else if (d.skip) { const R = rec(wk, sel); R.skip = d.skip; skipOpen = false; save(); }
    else if (d.a === 'unskip') { const R = rec(wk, sel); delete R.skip; save(); }
    else if (d.mode) { mode = d.mode; mem.mode = mode; save(); }
    else if (d.tab) { tab = d.tab; window.scrollTo(0, 0); }
    else if (d.k) { const R = rec(wk, sel); R.c[d.k] = !R.c[d.k]; if (!R.c[d.k]) delete R.c[d.k]; save(); }
    else if (d.water) { const R = rec(wk, sel), i = +d.water; R.w = R.w === i ? i - 1 : i; save(); }
    else if (d.pain) { const R = rec(wk, sel); R.k = R.k === d.pain ? '' : d.pain; save(); }
    else if (d.ci) { const k = iso(wk); mem.ci[k] = mem.ci[k] || {}; mem.ci[k][d.ci] = mem.ci[k][d.ci] === +d.v ? 0 : +d.v; save(); }
    else if (d.a === 'wa') { mem.sent = true; save(); return; }
    else if (d.a === 'copy') { mem.sent = true; save(); copy(summary(), 'msg', '¡Copiado! Pégalo en WhatsApp.'); return; }
    else if (d.a === 'backup') { copy('RUTINA1:' + btoa(unescape(encodeURIComponent(JSON.stringify(mem)))), 'bkmsg', '¡Respaldo copiado! Guárdalo en un chat de WhatsApp.'); return; }
    else if (d.a === 'restore') {
      const m = $('#bkmsg'), v = ($('#bk').value || '').trim();
      try { if (!v.startsWith('RUTINA1:')) throw 0; const o = JSON.parse(decodeURIComponent(escape(atob(v.slice(8))))); if (!o.w) throw 0; mem = o; mem.ci = mem.ci || {}; save(); render(); $('#bkmsg') && ($('#bkmsg').textContent = '✅ ¡Recuperado!'); }
      catch (e) { m.textContent = 'Ese texto no es un respaldo válido.'; }
      return;
    }
    else if (d.a === 'timer') { $('#timer').classList.add('open'); $('#tt').textContent = 'Elige'; return; }
    else if (d.t) { startTimer(+d.t); return; }
    else if (d.a === 'tclose') { clearInterval(tInt); $('#timer').classList.remove('open'); return; }
    else return;
    render();
  });
  app.addEventListener('change', ev => {
    const t = ev.target;
    if (t.dataset.p) { const R = rec(wk, sel); const v = t.value.replace(',', '.').trim(); if (v) R.p[t.dataset.p] = v; else delete R.p[t.dataset.p]; save(); }
    if (t.hasAttribute('data-ci-nota')) { const k = iso(wk); mem.ci[k] = mem.ci[k] || {}; mem.ci[k].nota = t.value.trim(); save(); render(); }
  });

  render();
})();
