/* Pousada Enero · main.js (vanilla, sin dependencias) */
(function () {
  'use strict';
  window.__eneroOK = true;
  var E = window.ENERO || {}, T = E.t || {}, L = (E.lang || 'pt').slice(0, 2);
  var S = window.ENERO_SUITES || [];
  var root = document.documentElement, body = document.body;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desk = matchMedia('(min-width: 900px)');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tr = function (k, n) { return (T[k] || '').replace('{n}', n); };
  var byId = {}; S.forEach(function (c) { byId[c.id] = c; });

  /* ---------- scroll lock ---------- */
  var locks = 0;
  function lock() { if (locks++ === 0) { root.style.overflow = 'hidden'; body.style.overflow = 'hidden'; body.classList.add('lock'); } }
  function unlock() { if (locks > 0 && --locks === 0) { root.style.overflow = ''; body.style.overflow = ''; body.classList.remove('lock'); } }

  /* ---------- helpers de suítes ---------- */
  function img(f, size) { return '/img/suites/' + f + '-' + size + '.webp'; }
  function meta(c) {
    var p = [];
    if (c.size) p.push(c.size + ' ' + T.m2);
    p.push(tr('pax', c.pax));
    return p.join(' · ');
  }
  function unitsLabel(c) {
    if (!c.units) return '';
    var n = c.units.split('·').map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    if (!n.length) return '';
    var parts = [], i = 0;
    while (i < n.length) { var j = i; while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++; parts.push(j - i >= 2 ? n[i] + '–' + n[j] : n.slice(i, j + 1).join(', ')); i = j + 1; }
    return (n.length > 1 ? T.units : T.unit) + ' ' + parts.join(', ');
  }

  /* ---------- intro ---------- */
  var hero = $('.hero');
  function heroIn() { if (hero) requestAnimationFrame(function () { hero.classList.add('is-in'); }); }
  (function intro() {
    var el = $('.intro');
    if (!root.classList.contains('con-intro') || !el) { heroIn(); return; }
    var t0 = performance.now();
    var minT = desk.matches ? 2000 : 1500;
    el.classList.add('go');
    var waits = [];
    if (document.fonts && document.fonts.ready) waits.push(document.fonts.ready);
    var hi = $('.hero__pic img');
    if (hi && !hi.complete) waits.push(new Promise(function (r) { hi.addEventListener('load', r, { once: true }); hi.addEventListener('error', r, { once: true }); }));
    var done = false;
    function finish() {
      if (done) return; done = true;
      var wait = Math.max(0, minT - (performance.now() - t0));
      setTimeout(function () {
        el.classList.add('out');
        setTimeout(heroIn, 280);
        setTimeout(function () {
          root.classList.remove('con-intro');
          el.remove();
          try { sessionStorage.setItem('enero-intro', '1'); } catch (e) {}
        }, 900);
      }, wait);
    }
    Promise.all(waits).then(finish, finish);
    setTimeout(finish, 2600);
  })();

  /* ---------- header, barra, nav activa ---------- */
  var top = $('.top'), barra = $('[data-barra]'), waf = $('.wa-float');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || 0;
    top.classList.toggle('is-scrolled', y > 8);
    var limit = hero ? hero.offsetTop + hero.offsetHeight * 0.55 : 400;
    var show = y > limit;
    if (barra) barra.classList.toggle('is-on', show);
    if (waf) waf.classList.toggle('is-on', show);
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  var navLinks = $$('.top__nav a');
  if ('IntersectionObserver' in window && navLinks.length) {
    var ioNav = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) ioNav.observe(s); });
  }

  /* ---------- menú celu ---------- */
  var burger = $('.burger'), menu = $('#menu');
  function setMenu(open) {
    if (!menu || !burger) return;
    var isOpen = burger.getAttribute('aria-expanded') === 'true';
    if (open === isOpen) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', burger.dataset[open ? 'labelClose' : 'labelOpen']);
    if (open) {
      menu.hidden = false; lock();
      requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add('is-open'); }); });
    } else {
      menu.classList.remove('is-open'); menu.hidden = true; unlock();
    }
  }
  if (burger) {
    $$('.menu__nav a', menu).forEach(function (a, i) { a.style.setProperty('--i', i); a.addEventListener('click', function () { setMenu(false); }); });
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    desk.addEventListener && desk.addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- reveal ---------- */
  var revealEls = $$('.rv, .reveal, .reveal-img, .subs');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    revealEls.forEach(function (el) { if (!el.closest('.hero')) io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visto'); });
  }
  // los .rv del hero entran junto con el título
  if (hero) {
    var heroRv = $$('.rv', hero);
    var heroObs = new MutationObserver(function () {
      if (hero.classList.contains('is-in')) { heroRv.forEach(function (el) { el.classList.add('visto'); }); heroObs.disconnect(); }
    });
    heroObs.observe(hero, { attributes: true, attributeFilter: ['class'] });
    if (hero.classList.contains('is-in')) heroRv.forEach(function (el) { el.classList.add('visto'); });
  }

  /* ---------- hero: alt y sello ---------- */
  var heroImg = $('.hero__pic img');
  function heroAlt() { if (heroImg && heroImg.dataset.altDesk) { heroImg.dataset.altCelu = heroImg.dataset.altCelu || heroImg.alt; heroImg.alt = desk.matches ? heroImg.dataset.altDesk : heroImg.dataset.altCelu; } }
  heroAlt(); desk.addEventListener && desk.addEventListener('change', heroAlt);
  var sello = $('.sello');
  if (sello && 'IntersectionObserver' in window && !reduce) {
    new IntersectionObserver(function (es) { sello.classList.toggle('is-on', es[0].isIntersecting); }).observe(sello);
  }

  /* ---------- drawer de suíte ---------- */
  var drawer = $('[data-drawer]'), drBody = $('[data-drawer-body]'), drPanel = drawer && $('.drawer__panel', drawer);
  var opener = null, drOpen = false, pushed = false;

  function drawerHTML(c) {
    var ims = c.img || [];
    var slides = ims.map(function (m, i) {
      return '<img src="' + img(m.f, 800) + '" width="' + m.w + '" height="' + m.h + '" alt="' + esc(c.name + ' · ' + (i + 1) + '/' + ims.length) + '"' + (i > 1 ? ' loading="lazy"' : '') + ' decoding="async" draggable="false">';
    }).join('');
    var thumbs = ims.map(function (m, i) {
      return '<button type="button" data-th="' + i + '"' + (i === 0 ? ' class="is-on"' : '') + ' aria-label="' + (i + 1) + '/' + ims.length + '"><img src="' + img(m.f, 480) + '" alt="" loading="lazy" decoding="async"></button>';
    }).join('');
    var feats = (c.feat && c.feat[L]) || [];
    var specs = [];
    if (c.size) specs.push('<div><b>' + esc(c.size) + ' ' + T.m2 + '</b><span>' + T.size + '</span></div>');
    specs.push('<div><b>' + c.pax + '</b><span>' + T.people + '</span></div>');
    if (c.beds && c.beds[L]) specs.push('<div><b>' + esc(c.beds[L]) + '</b><span>' + T.beds + '</span></div>');
    var u = unitsLabel(c);
    return '' +
      '<div class="dr-gal">' +
        '<div class="dr-gal__track" data-track>' + slides + '</div>' +
        (ims.length > 1 ? '<div class="dr-gal__nav"><button type="button" data-g="-1" aria-label="' + esc(T.prev) + '">←</button><button type="button" data-g="1" aria-label="' + esc(T.next) + '">→</button></div>' : '') +
        '<span class="dr-gal__count" data-gc>1 / ' + ims.length + '</span>' +
      '</div>' +
      (ims.length > 1 ? '<div class="dr-thumbs">' + thumbs + '</div>' : '') +
      '<div class="dr-info">' +
        (u ? '<p class="dr-k">' + esc(u) + '</p>' : '') +
        '<h2 class="dr-t" id="dr-t">' + esc(c.name) + '</h2>' +
        '<div class="dr-specs" style="grid-template-columns:repeat(' + specs.length + ',minmax(0,1fr))">' + specs.join('') + '</div>' +
        '<p class="dr-p">' + esc(c.txt && c.txt[L]) + '</p>' +
        (feats.length ? '<div class="dr-feat"><h3>' + esc(T.feat) + '</h3><ul>' + feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' : '') +
      '</div>' +
      '<div class="dr-cta"><a class="btn btn--azul btn--lg btn--full" href="' + esc(E.motor) + '" target="_blank" rel="noopener">' + esc(T.book) + '</a></div>';
  }

  function setupGallery() {
    var track = $('[data-track]', drBody); if (!track) return;
    var count = $('[data-gc]', drBody), thumbs = $$('[data-th]', drBody), n = track.children.length, cur = 0;
    function go(i) {
      i = Math.max(0, Math.min(n - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    }
    function upd() {
      var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      if (i === cur) return; cur = i;
      count.textContent = (i + 1) + ' / ' + n;
      thumbs.forEach(function (b, k) { b.classList.toggle('is-on', k === i); });
    }
    track.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    $$('[data-g]', drBody).forEach(function (b) { b.addEventListener('click', function () { var d = +b.dataset.g; go(cur + d < 0 ? n - 1 : cur + d >= n ? 0 : cur + d); }); });
    thumbs.forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.th); }); });
    drPanel.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault(); }
    });
    dragScroll(track, true);
  }

  function openSuite(id, fromHash) {
    var c = byId[id]; if (!c || !drawer) return;
    if (drOpen) { drBody.innerHTML = drawerHTML(c); setupGallery(); drPanel.scrollTop = 0; return; }
    opener = document.activeElement;
    drBody.innerHTML = drawerHTML(c);
    drawer.hidden = false; drPanel.scrollTop = 0; lock(); drOpen = true;
    setupGallery();
    requestAnimationFrame(function () { requestAnimationFrame(function () { drawer.classList.add('is-open'); drPanel.focus({ preventScroll: true }); }); });
    var h = '#suite-' + id;
    try {
      if (fromHash) { history.replaceState(null, '', h); pushed = false; }
      else if (location.hash !== h) { history.pushState({ dr: 1 }, '', h); pushed = true; }
    } catch (e) {}
  }
  function closeSuite(fromPop) {
    if (!drOpen) return;
    drOpen = false;
    drawer.classList.remove('is-open');
    unlock();
    setTimeout(function () { if (!drOpen) { drawer.hidden = true; drBody.innerHTML = ''; } }, reduce ? 0 : 480);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
    if (!fromPop) {
      try {
        if (pushed) { pushed = false; history.back(); }
        else history.replaceState(null, '', location.pathname + location.search);
      } catch (e) {}
    }
    pushed = false;
  }
  if (drawer) {
    $$('[data-close]', drawer).forEach(function (b) { b.addEventListener('click', function () { closeSuite(false); }); });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeSuite(false); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a[href],button:not([disabled]),[tabindex="0"]', drPanel).filter(function (x) { return x.offsetParent !== null || x.closest('.dr-cta'); });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === drPanel)) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    });
    addEventListener('popstate', function () {
      var m = location.hash.match(/^#suite-(.+)$/);
      if (m && byId[m[1]]) { if (!drOpen) { openSuite(m[1], true); } }
      else closeSuite(true);
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && burger && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });

  /* ---------- tarjetas + filtros ---------- */
  var cardsEl = $('[data-cards]'), none = $('.cards__none'), chips = $$('[data-f]');
  var TAGS = ['mar', 'sacada', 'terrea', 'tres'];
  function cardHTML(c, i) {
    var m = c.img[0] || { f: '', w: 800, h: 600 };
    var tags = (c.tags || []).filter(function (t) { return t === 'mar' || t === 'sacada'; }).map(function (t) { return '<span class="card__tag">' + esc(T['tag_' + t]) + '</span>'; }).join('');
    return '<button type="button" class="card" data-suite="' + c.id + '" style="--i:' + i + '" aria-label="' + esc(c.name + ' · ' + meta(c) + ' · ' + T.seemore) + '">' +
      '<span class="card__img"><img src="' + img(m.f, 480) + '" srcset="' + img(m.f, 480) + ' 480w, ' + img(m.f, 800) + ' 800w" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" width="' + m.w + '" height="' + m.h + '" alt="" loading="lazy" decoding="async">' +
        (tags ? '<span class="card__tags">' + tags + '</span>' : '') +
        '<span class="card__count">' + c.img.length + ' ' + esc(T.photos) + '</span></span>' +
      '<span class="card__row"><span class="card__n">' + esc(c.name) + '</span><span class="card__go">' + esc(T.seemore) + ' →</span></span>' +
      '<span class="card__meta">' + esc([unitsLabel(c), meta(c)].filter(Boolean).join(' · ')) + '</span>' +
    '</button>';
  }
  function render(f) {
    if (!cardsEl) return;
    var list = S.filter(function (c) { return f === 'all' || (c.tags || []).indexOf(f) > -1; });
    cardsEl.innerHTML = list.map(cardHTML).join('');
    none.hidden = list.length > 0;
  }
  function setFilter(f) {
    chips.forEach(function (b) { var on = b.dataset.f === f; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    render(f);
  }
  chips.forEach(function (b) { b.addEventListener('click', function () { setFilter(b.dataset.f); }); });
  render('all');
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-suite]');
    if (b) { e.preventDefault(); openSuite(b.dataset.suite); }
  });

  /* ---------- vista mar ---------- */
  var vm = $('[data-vm-list]');
  if (vm) {
    vm.innerHTML = S.filter(function (c) { return (c.tags || []).indexOf('mar') > -1; }).map(function (c) {
      return '<li><button type="button" data-suite="' + c.id + '"><b>' + esc(c.name) + '</b><span>' + esc(meta(c)) + '</span></button></li>';
    }).join('');
  }
  var verMar = $('[data-ver-mar]');
  if (verMar) verMar.addEventListener('click', function () { setFilter('mar'); });

  /* ---------- mapa ---------- */
  var panel = $('[data-zona-panel]'), zonas = [];
  try { zonas = JSON.parse($('#zona-data').content.textContent); } catch (e) { try { zonas = JSON.parse($('#zona-data').textContent); } catch (e2) {} }
  var zById = {}; zonas.forEach(function (z, i) { z.n = i + 1; zById[z.id] = z; });
  function selectZona(id, scroll) {
    var z = zById[id]; if (!z || !panel) return;
    $$('.zona').forEach(function (g) { var on = g.dataset.zona === id; g.classList.toggle('is-on', on); g.setAttribute('aria-pressed', String(on)); });
    $$('[data-zona-btn]').forEach(function (b) { var on = b.dataset.zonaBtn === id; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    var cats = (z.cats || []).map(function (k) { return byId[k]; }).filter(Boolean);
    var src = z.img ? '/img/' + z.img : (cats[0] && cats[0].img[0] ? img(cats[0].img[0].f, 800) : '');
    var html = '<div class="js-in">' +
      (src ? '<img class="zona-panel__img" src="' + src + '" alt="" width="800" height="500" loading="lazy" decoding="async">' : '') +
      '</div><div class="js-in" style="display:flex;flex-direction:column;gap:10px">' +
      '<p class="zona-panel__k">' + z.n + '</p><h3 class="zona-panel__n">' + esc(z.name) + '</h3>' +
      '<p class="zona-panel__p">' + esc(z.p) + '</p>' +
      (cats.length ? '<ul class="zona-panel__list">' + cats.map(function (c) { return '<li><button type="button" data-suite="' + c.id + '"><strong>' + esc(c.name) + '</strong><span>' + esc(meta(c)) + ' →</span></button></li>'; }).join('') + '</ul>' : '') +
      '</div>';
    $('.zona-panel__body', panel).innerHTML = html;
    if (scroll && !desk.matches) {
      var r = panel.getBoundingClientRect();
      if (r.top > innerHeight * 0.55 || r.bottom < 0) panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }
  $$('.zona').forEach(function (g) {
    g.addEventListener('click', function () { selectZona(g.dataset.zona, true); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectZona(g.dataset.zona, true); } });
  });
  $$('[data-zona-btn]').forEach(function (b) { b.addEventListener('click', function () { selectZona(b.dataset.zonaBtn, true); }); });
  if (zonas.length) selectZona('posada', false);

  /* ---------- café: pasos con foto fija ---------- */
  var pasos = $$('[data-step]');
  if (pasos.length && 'IntersectionObserver' in window) {
    var figs = $$('[data-step-fig]');
    pasos[0].classList.add('is-on');
    var ioStep = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target.dataset.step;
        pasos.forEach(function (p) { p.classList.toggle('is-on', p === e.target); });
        figs.forEach(function (f) { f.classList.toggle('is-on', f.dataset.stepFig === n); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    pasos.forEach(function (p) { ioStep.observe(p); });
  }

  /* ---------- drag con mouse + flechas ---------- */
  function dragScroll(el, snapBack) {
    if (!el || el.__drag) return; el.__drag = true;
    var down = false, moved = false, x0 = 0, s0 = 0;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; x0 = e.clientX; s0 = el.scrollLeft;
    });
    addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 5) { moved = true; el.classList.add('is-drag'); el.style.scrollSnapType = 'none'; el.style.scrollBehavior = 'auto'; }
      if (moved) el.scrollLeft = s0 - dx;
    });
    addEventListener('pointerup', function () {
      if (!down) return; down = false;
      if (moved) {
        el.style.scrollSnapType = ''; el.style.scrollBehavior = '';
        setTimeout(function () { el.classList.remove('is-drag'); }, 0);
        if (snapBack) {
          var w = el.clientWidth, i = Math.round(el.scrollLeft / w);
          el.scrollTo({ left: i * w, behavior: 'smooth' });
        }
      }
    });
    el.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }
  $$('[data-drag]').forEach(function (el) { dragScroll(el, false); });
  var rail = $('[data-rail]');
  $$('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!rail) return;
      var card = rail.firstElementChild, step = card ? card.getBoundingClientRect().width + 22 : 320;
      rail.scrollBy({ left: +b.dataset.scroll * step, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- fechas → motor ---------- */
  var form = $('[data-fechas]');
  if (form) {
    var fin = form.elements['in'], fout = form.elements['out'], err = $('.fechas__err', form);
    var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var iso = function (d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
    var parse = function (s) { var p = (s || '').split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; };
    var fmt = function (d) { return d.getDate() + '+' + MON[d.getMonth()] + '+' + d.getFullYear(); };
    var addDays = function (d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; };
    var today = new Date(); today.setHours(0, 0, 0, 0);
    fin.min = iso(today); fout.min = iso(addDays(today, 1));
    fin.addEventListener('change', function () {
      var a = parse(fin.value); if (!a) return;
      fout.min = iso(addDays(a, 1));
      var b = parse(fout.value);
      if (!b || b <= a) fout.value = iso(addDays(a, 2));
      err.hidden = true;
    });
    fout.addEventListener('change', function () { err.hidden = true; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = parse(fin.value), b = parse(fout.value), url = E.motor;
      if (a && !b) { b = addDays(a, 1); }
      if (a && b) {
        if (b <= a || a < today) { err.textContent = T.dates; err.hidden = false; fout.focus(); return; }
        url += '&checkin=' + fmt(a) + '&checkout=' + fmt(b);
      }
      err.hidden = true;
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (x) {} } else location.href = url;
    });
  }

  /* ---------- hash inicial ---------- */
  var m0 = location.hash.match(/^#suite-(.+)$/);
  if (m0 && byId[m0[1]]) {
    var sec = $('#suites'); if (sec) sec.scrollIntoView();
    setTimeout(function () { openSuite(m0[1], true); }, root.classList.contains('con-intro') ? 50 : 0);
  }
})();
