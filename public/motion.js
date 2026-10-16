// Пружинная физика, магнит, tilt, reveal, параллакс, фильтры, обратный отсчёт
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Пружина: x'' = -k(x-target) - c x'
  function spring(el, vars, {k = 170, c = 18} = {}) {
    const st = {}; for (const v of vars) st[v] = {x: 0, v: 0, t: 0, unit: v.startsWith('--r') ? 'deg' : 'px'};
    let raf = 0, last = 0;
    const tick = now => { const dt = Math.min(0.032, (now - (last || now)) / 1000) || 1/60; last = now; let moving = false;
      for (const [n, s] of Object.entries(st)) { const a = -k * (s.x - s.t) - c * s.v; s.v += a * dt; s.x += s.v * dt;
        if (Math.abs(s.v) > 0.01 || Math.abs(s.x - s.t) > 0.01) moving = true; else { s.x = s.t; s.v = 0; }
        el.style.setProperty(n, n === '--s' ? (1 + s.x).toFixed(4) : s.x.toFixed(3) + s.unit); }
      raf = moving ? requestAnimationFrame(tick) : 0; if (!raf) last = 0; };
    return (targets) => { for (const [n, t] of Object.entries(targets)) st[n].t = t; if (!raf) raf = requestAnimationFrame(tick); };
  }
  // Reveal со ступенькой
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach((el, i) => { el.style.setProperty('--d', (i % 6) * 70 + 'ms'); reduce ? el.classList.add('in') : io.observe(el); });
  if (!reduce) {
    document.querySelectorAll(".tilt").forEach(el => {
      const go = spring(el, ['--rx', '--ry', '--ty', '--s']);
      if (fine) {
        el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
          go({'--rx': (0.5 - py) * 7, '--ry': (px - 0.5) * 9, '--ty': -6, '--s': 0.01}); });
        el.addEventListener('pointerleave', () => go({'--rx': 0, '--ry': 0, '--ty': 0, '--s': 0}));
      }
      el.addEventListener('pointerdown', () => go({'--s': -0.035, '--ty': 0}));
      ['pointerup', 'pointercancel'].forEach(t => el.addEventListener(t, () => go({'--s': fine ? 0.01 : 0, '--ty': fine ? -6 : 0})));
    });
    if (fine) document.querySelectorAll('.magnetic').forEach(el => { const go = spring(el, ['--tx', '--ty'], {k: 200, c: 14});
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); go({'--tx': (e.clientX - r.left - r.width / 2) * 0.3, '--ty': (e.clientY - r.top - r.height / 2) * 0.4}); });
      el.addEventListener('pointerleave', () => go({'--tx': 0, '--ty': 0})); });
    const par = [...document.querySelectorAll('.parallax')]; let tick = false;
    if (par.length) addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { const y = scrollY;
      par.forEach(el => el.style.transform = `translate3d(0,${y * +el.dataset.speed}px,0)`); tick = false; }); }, {passive: true});
  }
  // Фильтры
  const f = {company: '', tag: ''};
  document.querySelectorAll('[data-filter]').forEach(group => group.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return;
    group.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === b)); f[group.dataset.filter] = b.dataset.v;
    const apply = () => { let n = 0; document.querySelectorAll('.grid .card').forEach(c => { const ok = (!f.company || c.dataset.company === f.company) && (!f.tag || c.dataset.tags.split('|').includes(f.tag));
      c.classList.toggle('hide', !ok); if (ok) n++; c.style.viewTransitionName = 'card-' + [...c.parentNode.children].indexOf(c); });
      document.querySelector('.empty').hidden = n > 0; };
    document.startViewTransition && !reduce ? document.startViewTransition(apply) : apply(); }));
  // Обратный отсчёт
  const cd = () => document.querySelectorAll('.up').forEach(u => { const ms = new Date(u.dataset.at) - Date.now(), o = u.querySelector('.countdown');
    if (ms <= 0) { o.textContent = 'уже прошёл'; return; } const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    o.textContent = `через ${d ? d + ' д ' : ''}${h} ч ${m} мин`; }); cd(); setInterval(cd, 30000);
  // Активный раздел в оглавлении
  const toc = document.querySelectorAll('.toc a'); if (toc.length) { const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting)
    toc.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), {rootMargin: '-40% 0px -55% 0px'});
    document.querySelectorAll('.sec').forEach(s => so.observe(s)); }
})();
(() => { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -15% 0px'});
  document.querySelectorAll('.fig.draw').forEach(f => io.observe(f)); })();
