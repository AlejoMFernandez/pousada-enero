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
    if (!root.classList.contains('con-intro') || !el) { root.classList.remove('con-intro'); heroIn(); return; }
    var t0 = performance.now();
    var minT = desk.matches ? 2150 : 1600;
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
  var top = $('.top'), barra = $('[data-barra]'), waf = $('.wa-float'), bot = $('[data-bot]');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || 0;
    top.classList.toggle('is-scrolled', y > 8);
    var limit = hero ? hero.offsetTop + hero.offsetHeight * 0.55 : 400;
    var show = y > limit;
    if (barra) barra.classList.toggle('is-on', show);
    if (waf) waf.classList.toggle('is-on', show);
    if (bot) bot.classList.toggle('is-on', show || bot.classList.contains('is-open'));
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
    navLinks.forEach(function (a) { var h = a.getAttribute('href'); if (h && h.charAt(0) === '#') { var s = $(h); if (s) ioNav.observe(s); } });
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

  /* ---------- tarjetas + filtros (multi) ---------- */
  var cardsEl = $('[data-cards]'), none = $('.cards__none'), chips = $$('[data-f]'), countEl = $('[data-count]'), clearBtn = $('[data-clear]');
  var active = [];
  var PERSON = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="4.6" r="3"/><path d="M2.4 15c0-3.6 2.5-6 5.6-6s5.6 2.4 5.6 6z"/></svg>';
  function cardHTML(c, i) {
    var m = c.img[0] || { f: '', w: 800, h: 600 };
    var tags = (c.tags || []).filter(function (t) { return t === 'mar' || t === 'sacada' || t === 'terrea'; }).map(function (t) { return '<span class="card__tag">' + esc(T['tag_' + t]) + '</span>'; }).join('');
    var ppl = ''; for (var k = 0; k < c.pax; k++) ppl += PERSON;
    return '<article class="card" style="--i:' + i + '">' +
      '<button type="button" class="card__open" data-suite="' + c.id + '" aria-label="' + esc(c.name + ' · ' + tr('people', c.pax) + ' · ' + T.details) + '">' +
        '<span class="card__img"><img src="' + img(m.f, 480) + '" srcset="' + img(m.f, 480) + ' 480w, ' + img(m.f, 800) + ' 800w" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" width="' + m.w + '" height="' + m.h + '" alt="" loading="lazy" decoding="async">' +
          (tags ? '<span class="card__tags">' + tags + '</span>' : '') +
          '<span class="card__ppl" title="' + esc(tr('people', c.pax)) + '">' + ppl + '<b>' + c.pax + '</b></span>' +
          '<span class="card__count">' + c.img.length + ' ' + esc(T.photos) + '</span></span>' +
        '<span class="card__n">' + esc(c.name) + '</span>' +
        (unitsLabel(c) ? '<span class="card__meta">' + esc(unitsLabel(c)) + '</span>' : '') +
      '</button>' +
      '<div class="card__foot"><button type="button" class="card__more" data-suite="' + c.id + '" tabindex="-1">' + esc(T.details) + ' →</button><a class="card__book" href="' + esc(E.motor) + '" target="_blank" rel="noopener">' + esc(T.book_short) + ' · 17% OFF</a></div>' +
    '</article>';
  }
  function match(c, tags) { return tags.every(function (f) { return (c.tags || []).indexOf(f) > -1; }); }
  function render() {
    if (!cardsEl) return;
    var list = S.filter(function (c) { return match(c, active); });
    cardsEl.innerHTML = list.map(cardHTML).join('');
    none.hidden = list.length > 0;
    if (countEl) countEl.textContent = list.length === 1 ? T.count1 : tr('count', list.length);
    if (clearBtn) clearBtn.hidden = !active.length;
    chips.forEach(function (b) {
      var f = b.dataset.f, on = active.indexOf(f) > -1, n = S.filter(function (c) { return match(c, active.concat(on ? [] : [f])); }).length;
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on));
      var ne = $('[data-fn]', b); if (ne) ne.textContent = n;
      b.disabled = !on && n === 0;
    });
  }
  function setFilter(f, only) {
    if (only) active = f ? [f] : [];
    else { var i = active.indexOf(f); if (i > -1) active.splice(i, 1); else active.push(f); }
    render();
  }
  chips.forEach(function (b) { b.addEventListener('click', function () { setFilter(b.dataset.f); }); });
  if (clearBtn) clearBtn.addEventListener('click', function () { setFilter(null, true); });
  render();
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-suite]');
    if (b) { e.preventDefault(); openSuite(b.dataset.suite); }
  });

  /* ---------- mapa satelital ---------- */
  var panel = $('[data-zona-panel]'), stage = $('[data-map-stage]'), zonas = [];
  try { zonas = JSON.parse($('#zona-data').content.textContent); } catch (e) { try { zonas = JSON.parse($('#zona-data').textContent); } catch (e2) {} }
  var zById = {}; zonas.forEach(function (z, i) { z.n = i + 1; zById[z.id] = z; });
  if (stage && panel && zonas.length) (function () {
    var layer = $('[data-map-layer]'), marksEl = $('[data-map-marks]'), frames = $('[data-map-frames]'), holes = $('[data-map-holes]');
    var W = 1100, H = 940, ALL = [440, 250, 440, 680];
    var sc = 1, tx = 0, ty = 0, anim = 0, cur = null, mk = {};
    var NS = 'http://www.w3.org/2000/svg';
    zonas.forEach(function (z) {
      var r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', z.b[0]); r.setAttribute('y', z.b[1]); r.setAttribute('width', z.b[2]); r.setAttribute('height', z.b[3]);
      if (!z.pt) holes.appendChild(r.cloneNode());
      var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'mapa__frame' + (z.pt ? ' is-sea' : '')); g.dataset.id = z.id;
      r.setAttribute('class', 'mapa__hit'); if (z.pt) { r.setAttribute('rx', 60); }
      g.appendChild(r); frames.appendChild(g);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'mapa__mk' + (z.pt ? ' is-sea' : '');
      b.innerHTML = '<b>' + z.n + '</b><span>' + esc(z.name) + '</span>'; b.setAttribute('aria-label', z.name); b.dataset.id = z.id;
      marksEl.appendChild(b); mk[z.id] = b;
    });
    function anchor(z) { return z.pt || [z.b[0] + 12, z.b[1] + 12]; }
    function minS() { return Math.max(stage.clientWidth / W, stage.clientHeight / H); }
    function maxS() { return Math.max(minS() * 1.4, 2.4); }
    function clampV() {
      sc = Math.min(Math.max(sc, minS()), maxS());
      tx = Math.min(0, Math.max(stage.clientWidth - W * sc, tx));
      ty = Math.min(0, Math.max(stage.clientHeight - H * sc, ty));
    }
    function render() {
      clampV();
      layer.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + sc + ')';
      zonas.forEach(function (z) { var p = anchor(z); mk[z.id].style.transform = 'translate(' + (tx + p[0] * sc - 13) + 'px,' + (ty + p[1] * sc - 13) + 'px)'; });
      stage.classList.toggle('is-wide', sc > 1.5);
    }
    function target(box, pad) {
      var sw = stage.clientWidth, sh = stage.clientHeight, ns = Math.min(sw / (box[2] + pad * 2), sh / (box[3] + pad * 2));
      ns = Math.min(Math.max(ns, minS()), maxS());
      return { s: ns, tx: sw / 2 - (box[0] + box[2] / 2) * ns, ty: sh / 2 - (box[1] + box[3] / 2) * ns };
    }
    function fly(t) {
      cancelAnimationFrame(anim);
      if (reduce) { sc = t.s; tx = t.tx; ty = t.ty; render(); return; }
      var a = { s: sc, tx: tx, ty: ty }, t0 = performance.now(), dur = 750;
      (function step(now) {
        var k = Math.min(1, (now - t0) / dur); k = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        sc = a.s + (t.s - a.s) * k; tx = a.tx + (t.tx - a.tx) * k; ty = a.ty + (t.ty - a.ty) * k; render();
        if (k < 1) anim = requestAnimationFrame(step);
      })(t0);
    }
    function mark(id) {
      $$('.mapa__frame', frames).forEach(function (g) { g.classList.toggle('is-on', g.dataset.id === id); });
      Object.keys(mk).forEach(function (k) { mk[k].classList.toggle('is-on', k === id); mk[k].setAttribute('aria-pressed', String(k === id)); });
      stage.classList.toggle('has-sel', !!id);
    }
    function count(z) { return (z.cats || []).reduce(function (a, k) { var c = byId[k]; return a + (c && c.rooms ? c.rooms.length : 0); }, 0); }
    function sub(z) { var n = count(z); return n ? tr('sub_casa', n) : (z.id === 'restaurante' ? T.sub_rest : T.sub_praia); }
    function zoneImg(z) { var cats = (z.cats || []).map(function (k) { return byId[k]; }).filter(Boolean); return z.img ? '/img/' + z.img : (cats[0] ? img(cats[0].img[0].f, 800) : ''); }
    function index() {
      cur = null; mark(null);
      panel.innerHTML = '<div class="zp js-in"><p class="zp__k">' + esc(T.map_kicker) + '</p><h3 class="zp__t">' + esc(T.map_t) + '</h3><p class="zp__p">' + esc(T.map_p) + '</p>' +
        '<ul class="zp__list">' + zonas.map(function (z) {
          return '<li><button type="button" class="zp__row" data-zona="' + z.id + '"><span class="zp__n">' + z.n + '</span><span class="zp__nm">' + esc(z.name) + '</span><small>' + esc(sub(z)) + '</small><i aria-hidden="true">→</i></button></li>';
        }).join('') + '</ul></div>';
    }
    function open(id, fromMap) {
      var z = zById[id]; if (!z) return; cur = id; mark(id);
      var cats = (z.cats || []).map(function (k) { return byId[k]; }).filter(Boolean);
      var src = zoneImg(z);
      panel.innerHTML = '<div class="zp js-in">' +
        '<button type="button" class="zp__back" data-map-back>← ' + esc(T.map_back) + '</button>' +
        '<div class="zp__fig"><img data-zp-img src="' + src + '" alt="" width="800" height="500" decoding="async"><img data-zp-img2 alt="" width="800" height="500" decoding="async"></div>' +
        '<p class="zp__k">' + z.n + ' · ' + esc(sub(z)) + '</p><h3 class="zp__t">' + esc(z.name) + '</h3><p class="zp__p">' + esc(z.p) + '</p>' +
        (cats.length ? '<ul class="zp__rooms">' + cats.map(function (c) {
          return '<li><button type="button" class="zp__room" data-suite="' + c.id + '" data-cover="' + img(c.img[0].f, 800) + '"><img src="' + img(c.img[0].f, 480) + '" alt="" width="64" height="48" loading="lazy" decoding="async"><span><strong>' + esc(c.name) + '</strong><small>' + esc(meta(c)) + '</small></span><i aria-hidden="true">→</i></button></li>';
        }).join('') + '</ul>' : '') +
        (z.id === 'restaurante' ? '<a class="btn btn--azul zp__cta" href="#restaurante">' + esc($('#restaurante h2') ? $('#restaurante h2').textContent : '') + ' →</a>' : '') +
        (z.id === 'praia' ? '<a class="btn btn--azul zp__cta" href="#passeios">' + esc($('#passeios h2') ? $('#passeios h2').textContent : '') + ' →</a>' : '') +
      '</div>';
      panel.scrollTop = 0;
      fly(target(z.b, z.pt ? 70 : 150));
      if (fromMap && !desk.matches) {
        var r = panel.getBoundingClientRect();
        if (r.top > innerHeight * 0.7) panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    }
    // preview de portada al pasar por una suíte
    var prevT = 0;
    panel.addEventListener('mouseover', function (e) {
      var b = e.target.closest('.zp__room'); var i1 = $('[data-zp-img]', panel), i2 = $('[data-zp-img2]', panel); if (!i1) return;
      clearTimeout(prevT);
      if (b) { i2.src = b.dataset.cover; i2.classList.add('is-on'); }
    });
    panel.addEventListener('mouseout', function (e) {
      var b = e.target.closest('.zp__room'); if (!b || b.contains(e.relatedTarget)) return;
      var i2 = $('[data-zp-img2]', panel); prevT = setTimeout(function () { if (i2) i2.classList.remove('is-on'); }, 120);
    });
    panel.addEventListener('focusin', function (e) { var b = e.target.closest('.zp__room'), i2 = $('[data-zp-img2]', panel); if (b && i2) { i2.src = b.dataset.cover; i2.classList.add('is-on'); } });
    panel.addEventListener('click', function (e) {
      var r = e.target.closest('[data-zona]'); if (r) { open(r.dataset.zona); return; }
      if (e.target.closest('[data-map-back]')) { index(); fly(target(ALL, 10)); }
    });
    marksEl.addEventListener('click', function (e) { var b = e.target.closest('.mapa__mk'); if (b) open(b.dataset.id, true); });
    frames.addEventListener('click', function (e) { var g = e.target.closest('.mapa__frame'); if (g && !moved) open(g.dataset.id, true); });
    frames.addEventListener('mouseover', function (e) { var g = e.target.closest('.mapa__frame'); Object.keys(mk).forEach(function (k) { mk[k].classList.toggle('is-hover', !!g && g.dataset.id === k); }); });
    frames.addEventListener('mouseleave', function () { Object.keys(mk).forEach(function (k) { mk[k].classList.remove('is-hover'); }); });
    // pan con mouse (en touch se deja el scroll de la página)
    var moved = false, last = null;
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.mapa__ctrl,.mapa__mk')) return;
      cancelAnimationFrame(anim); last = { x: e.clientX, y: e.clientY }; moved = false;
    });
    addEventListener('pointermove', function (e) {
      if (!last) return;
      var dx = e.clientX - last.x, dy = e.clientY - last.y;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      if (!moved) { moved = true; stage.classList.add('is-drag'); }
      tx += dx; ty += dy; last = { x: e.clientX, y: e.clientY }; render();
    });
    addEventListener('pointerup', function () { if (!last) return; last = null; stage.classList.remove('is-drag'); setTimeout(function () { moved = false; }, 0); });
    stage.addEventListener('wheel', function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault(); cancelAnimationFrame(anim);
      var r = stage.getBoundingClientRect(), f = Math.exp(-e.deltaY * 0.0016), cx = e.clientX - r.left, cy = e.clientY - r.top;
      var ns = Math.min(Math.max(sc * f, minS()), maxS()); tx = cx - (cx - tx) * (ns / sc); ty = cy - (cy - ty) * (ns / sc); sc = ns; render();
    }, { passive: false });
    $$('[data-map-zoom]', stage).forEach(function (b) {
      b.addEventListener('click', function () { var f = +b.dataset.mapZoom, cx = stage.clientWidth / 2, cy = stage.clientHeight / 2; fly({ s: sc * f, tx: cx - (cx - tx) * f, ty: cy - (cy - ty) * f }); });
    });
    $('[data-map-fit]', stage).addEventListener('click', function () { fly(target(cur ? zById[cur].b : ALL, cur ? 150 : 10)); });
    index();
    var t0 = target(ALL, 10); sc = t0.s; tx = t0.tx; ty = t0.ty; render();
    if ('ResizeObserver' in window) new ResizeObserver(function () { render(); }).observe(stage);
  })();

  /* ---------- barquito que navega con el scroll (divisor) ---------- */
  var nav = $('[data-navega]');
  if (nav && !reduce) {
    var boat = $('.navega__boat', nav), nTick = false, bx = 0, tx2 = 0, raf2 = 0;
    var target = function () {
      var r = nav.getBoundingClientRect(), vh = innerHeight;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      return p * (nav.clientWidth - boat.clientWidth - 8);
    };
    var glide = function () {
      bx += (tx2 - bx) * 0.06;
      boat.style.transform = 'translateX(' + bx.toFixed(1) + 'px)';
      if (Math.abs(tx2 - bx) > 0.5) raf2 = requestAnimationFrame(glide); else raf2 = 0;
    };
    var upd = function () {
      nTick = false;
      var r = nav.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return;
      tx2 = target(); if (!raf2) raf2 = requestAnimationFrame(glide);
    };
    addEventListener('scroll', function () { if (!nTick) { nTick = true; requestAnimationFrame(upd); } }, { passive: true });
    bx = tx2 = target(); boat.style.transform = 'translateX(' + bx + 'px)';
  }

  /* ---------- hero: punta de la vela alineada con el botón Reservar ---------- */
  var hMedia = $('.hero__media'), bookBtn = $('.top__book');
  function alignTip() {
    if (!hMedia || !bookBtn) return;
    hMedia.style.marginRight = '';
    if (!desk.matches) return;
    var C = hMedia.getBoundingClientRect().width, e = hero.getBoundingClientRect().right - bookBtn.getBoundingClientRect().right;
    var m = (e - 0.06 * C) / 0.94; if (m > 0) hMedia.style.marginRight = m + 'px';
  }
  alignTip(); addEventListener('resize', function () { requestAnimationFrame(alignTip); });

  /* ---------- hero: mismas líneas en todos los idiomas ---------- */
  var heroT = $('.hero__t');
  function fitHero() {
    if (!heroT) return;
    heroT.style.fontSize = '';
    var lines = $$('.ln', heroT), par = heroT.parentNode, cs = getComputedStyle(par), w = par.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var max = 0; lines.forEach(function (l) { var c = l.firstElementChild; max = Math.max(max, c.scrollWidth); });
    if (max > w) { var fs = parseFloat(getComputedStyle(heroT).fontSize); heroT.style.fontSize = Math.floor(fs * w / max * 0.98) + 'px'; }
  }
  if (heroT) { fitHero(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHero); addEventListener('resize', function () { requestAnimationFrame(fitHero); }); }

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

  /* ---------- fechas → motor (calendario de rango) ---------- */
  var form = $('[data-fechas]');
  if (form) {
    var cal = $('[data-cal]', form), months = $('[data-cal-months]', form), hint = $('[data-cal-hint]', form), err = $('.fechas__err', form);
    var vIn = $('[data-cal-v="in"]', form), vOut = $('[data-cal-v="out"]', form);
    var bIn = $('[data-cal-open="in"]', form), bOut = $('[data-cal-open="out"]', form);
    var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var loc = E.lang || 'pt-BR';
    var fMonth = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' });
    var fShort = new Intl.DateTimeFormat(loc, { weekday: 'short', day: 'numeric', month: 'short' });
    var fLong = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    var wk = []; for (var w = 0; w < 7; w++) wk.push(new Intl.DateTimeFormat(loc, { weekday: 'narrow' }).format(new Date(2026, 1, 1 + w))); // 1/2/2026 = domingo
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var dIn = null, dOut = null, hover = null, phase = 'in', view = new Date(today.getFullYear(), today.getMonth(), 1);
    var same = function (x, y) { return x && y && x.getTime() === y.getTime(); };
    var addDays = function (d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; };
    var nights = function () { return dIn && dOut ? Math.round((dOut - dIn) / 864e5) : 0; };
    var cap = function (x) { return x.charAt(0).toUpperCase() + x.slice(1); };
    function nMonths() { return innerWidth >= 640 ? 2 : 1; }
    function monthHTML(m) {
      var y = m.getFullYear(), mo = m.getMonth(), first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
      var h = '<div class="cal__m"><p class="cal__t">' + cap(fMonth.format(m)) + '</p><div class="cal__g">';
      wk.forEach(function (x) { h += '<span class="cal__w">' + x + '</span>'; });
      for (var i = 0; i < first; i++) h += '<span></span>';
      var end = dOut || (phase === 'out' && dIn && hover > dIn ? hover : null);
      for (var d = 1; d <= days; d++) {
        var dt = new Date(y, mo, d), c = 'cal__d', dis = dt < today;
        if (same(dt, today)) c += ' is-today';
        if (same(dt, dIn)) c += ' is-in';
        if (same(dt, dOut) || (!dOut && same(dt, end))) c += ' is-out';
        if (dIn && end && dt > dIn && dt < end) c += ' is-mid';
        h += '<button type="button" class="' + c + '" data-day="' + dt.getTime() + '"' + (dis ? ' disabled' : '') + ' aria-label="' + fLong.format(dt) + '"' + (same(dt, dIn) || same(dt, dOut) ? ' aria-pressed="true"' : '') + '>' + d + '</button>';
      }
      return h + '</div></div>';
    }
    function draw() {
      var h = '';
      for (var i = 0; i < nMonths(); i++) h += monthHTML(new Date(view.getFullYear(), view.getMonth() + i, 1));
      months.innerHTML = h;
      $('[data-cal-nav="-1"]', form).disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      var n = nights();
      hint.textContent = phase === 'in' ? T.cal_in : (n ? (n === 1 ? T.night : tr('nights', n)) : T.cal_out);
      vIn.textContent = dIn ? fShort.format(dIn) : T.pick;
      vOut.textContent = dOut ? fShort.format(dOut) : T.pick;
      bIn.classList.toggle('is-on', !cal.hidden && phase === 'in');
      bOut.classList.toggle('is-on', !cal.hidden && phase === 'out');
      bIn.classList.toggle('has-v', !!dIn); bOut.classList.toggle('has-v', !!dOut);
    }
    function openCal(p) {
      phase = p === 'out' && dIn ? 'out' : 'in';
      var ref = phase === 'out' ? (dOut || dIn) : (dIn || today);
      view = new Date(ref.getFullYear(), ref.getMonth(), 1);
      if (phase === 'out' && nMonths() === 2 && dIn && dIn.getMonth() !== ref.getMonth()) view = new Date(dIn.getFullYear(), dIn.getMonth(), 1);
      cal.hidden = false; err.hidden = true;
      if (!desk.matches) lock();
      draw();
      requestAnimationFrame(function () { cal.classList.add('is-open'); var f = $('.cal__d.is-in, .cal__d:not([disabled])', cal); if (f) f.focus({ preventScroll: true }); });
    }
    function closeCal(focusBtn) {
      if (cal.hidden) return;
      cal.classList.remove('is-open'); cal.hidden = true;
      if (!desk.matches) unlock();
      draw();
      if (focusBtn) focusBtn.focus({ preventScroll: true });
    }
    bIn.addEventListener('click', function () { cal.hidden || phase !== 'in' ? openCal('in') : closeCal(); });
    bOut.addEventListener('click', function () { cal.hidden || phase !== 'out' ? openCal('out') : closeCal(); });
    $('[data-cal-close]', form).addEventListener('click', function () { closeCal(bIn); });
    $$('[data-cal-nav]', form).forEach(function (b) { b.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + (+b.dataset.calNav), 1); draw(); }); });
    months.addEventListener('click', function (e) {
      var b = e.target.closest('[data-day]'); if (!b || b.disabled) return;
      var d = new Date(+b.dataset.day);
      if (phase === 'in' || !dIn || d <= dIn) {
        dIn = d; dOut = null; phase = 'out'; hover = null; draw();
        var nb = $('[data-day="' + d.getTime() + '"]', months); if (nb) nb.focus({ preventScroll: true });
      } else {
        dOut = d; draw();
        setTimeout(function () { closeCal(); $('button[type=submit]', form).focus({ preventScroll: true }); }, 280);
      }
    });
    months.addEventListener('mouseover', function (e) {
      if (phase !== 'out' || !dIn || dOut) return;
      var b = e.target.closest('[data-day]'); if (!b) return;
      var d = new Date(+b.dataset.day); if (same(d, hover)) return;
      hover = d;
      $$('.cal__d', months).forEach(function (x) {
        var t = +x.dataset.day;
        x.classList.toggle('is-mid', t > dIn.getTime() && t < hover.getTime());
        x.classList.toggle('is-out', hover > dIn && t === hover.getTime());
      });
    });
    cal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); closeCal(phase === 'out' ? bOut : bIn); return; }
      var b = e.target.closest && e.target.closest('[data-day]'); if (!b) return;
      var mv = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]; if (!mv) return;
      e.preventDefault();
      var t = addDays(new Date(+b.dataset.day), mv); if (t < today) return;
      var nb = $('[data-day="' + t.getTime() + '"]', months);
      if (!nb) { view = new Date(view.getFullYear(), view.getMonth() + (mv > 0 ? 1 : -1), 1); draw(); nb = $('[data-day="' + t.getTime() + '"]', months); }
      if (nb) nb.focus();
    });
    document.addEventListener('pointerdown', function (e) { if (!cal.hidden && !cal.contains(e.target) && !e.target.closest('[data-cal-open]')) closeCal(); });
    addEventListener('resize', function () { if (!cal.hidden) draw(); });
    var fmt = function (d) { return d.getDate() + '+' + MON[d.getMonth()] + '+' + d.getFullYear(); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!dIn) { openCal('in'); return; }
      if (!dOut) { openCal('out'); return; }
      var url = E.motor + '&checkin=' + fmt(dIn) + '&checkout=' + fmt(dOut);
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (x) {} } else location.href = url;
    });
    draw();
  }

  /* ---------- FAQ con animación ---------- */
  $$('.faq details').forEach(function (d) {
    var sum = $('summary', d), box = $('.faq__a', d), an = null;
    sum.addEventListener('click', function (e) {
      if (reduce || !box.animate) return;
      e.preventDefault();
      if (an) an.cancel();
      if (!d.open) {
        d.open = true;
        var h = box.scrollHeight;
        an = box.animate([{ height: '0px', opacity: 0, transform: 'translateY(-6px)' }, { height: h + 'px', opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,.8,.25,1)' });
        an.onfinish = function () { an = null; };
      } else {
        d.classList.add('is-closing');
        an = box.animate([{ height: box.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)' });
        an.onfinish = function () { d.open = false; d.classList.remove('is-closing'); an = null; };
      }
    });
  });

  /* ---------- bot barquito ---------- */
  if (bot) {
    var bPanel = $('.bot__panel', bot), bLog = $('[data-bot-log]', bot), bTog = $('[data-bot-toggle]', bot), busy = false;
    var bOpen = function (open) {
      bPanel.hidden = !open; bot.classList.toggle('is-open', open); bTog.setAttribute('aria-expanded', String(open));
      if (open) { setTimeout(function () { var q = $('.bot__q', bot); if (q) q.focus({ preventScroll: true }); }, 50); }
      else bTog.focus({ preventScroll: true });
    };
    bTog.addEventListener('click', function () { bOpen(bPanel.hidden); });
    $('[data-bot-close]', bot).addEventListener('click', function () { bOpen(false); });
    bot.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !bPanel.hidden) { e.stopPropagation(); bOpen(false); } });
    document.addEventListener('pointerdown', function (e) { if (!bPanel.hidden && !bot.contains(e.target)) bOpen(false); });
    var scrollLog = function () { bLog.scrollTo({ top: bLog.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }); };
    $('[data-bot-qs]', bot).addEventListener('click', function (e) {
      var q = e.target.closest('.bot__q'); if (!q || busy) return;
      busy = true; q.classList.add('is-used');
      var me = document.createElement('div'); me.className = 'bot__me'; me.textContent = q.textContent; bLog.appendChild(me);
      var ty = document.createElement('div'); ty.className = 'bot__msg bot__typing'; ty.innerHTML = '<i></i><i></i><i></i>'; bLog.appendChild(ty); scrollLog();
      setTimeout(function () {
        ty.remove();
        var tpl = $('template[data-a="' + q.dataset.q + '"]', bot), m = document.createElement('div'); m.className = 'bot__msg';
        m.appendChild(tpl.content.cloneNode(true)); bLog.appendChild(m);
        var more = $('template[data-more]', bot); if (more && bLog.querySelectorAll('.bot__me').length === 1) bLog.appendChild(more.content.cloneNode(true));
        scrollLog(); busy = false;
      }, reduce ? 0 : 650);
    });
  }

  /* ---------- hash inicial ---------- */
  var m0 = location.hash.match(/^#suite-(.+)$/);
  if (m0 && byId[m0[1]]) {
    var sec = $('#suites'); if (sec) sec.scrollIntoView();
    setTimeout(function () { openSuite(m0[1], true); }, root.classList.contains('con-intro') ? 50 : 0);
  }
})();
