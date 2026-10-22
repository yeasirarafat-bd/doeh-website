/* DOEH polish layer: scroll reveal, stat count-up, phone header behavior, link prefetch.
   Plain JavaScript, no dependencies. If this file fails to load, every page still works. */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll reveal ---------- */
  function setupReveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var vh = window.innerHeight || 800;
    var SKIP = '.site-header,.ftr,#siteSearch,#facOverlay,.wa-float,.legacy-nav-stub,.reveal,[hidden],[data-no-reveal],iframe,noscript,script,style';

    function usable(el) {
      return el.nodeType === 1 && !el.matches('script,style,noscript,template');
    }
    function kids(node) {
      return Array.prototype.filter.call(node.children, usable);
    }
    function isGrid(el) {
      var cs = kids(el);
      if (cs.length < 3) return false;
      var count = {}, best = 0;
      cs.forEach(function (c) {
        var k = c.tagName + '.' + (c.classList[0] || '');
        count[k] = (count[k] || 0) + 1;
        if (count[k] > best) best = count[k];
      });
      return best >= 3 && best >= cs.length * 0.6;
    }
    function eligible(el) {
      if (el.closest(SKIP)) return false;
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      if (cs.position === 'fixed' || cs.position === 'absolute' || cs.position === 'sticky') return false;
      if (cs.transform !== 'none' || cs.opacity !== '1' || cs.animationName !== 'none') return false;
      var r = el.getBoundingClientRect();
      if (r.height < 8 || r.width < 8) return false;
      if (r.top < vh * 0.9) return false; /* already on screen, or above it */
      return true;
    }

    var items = [];
    Array.prototype.forEach.call(doc.querySelectorAll('section'), function (sec) {
      if (sec.closest(SKIP) || sec.querySelector('h1')) return;
      var node = sec, blocks = [];
      for (var d = 0; d < 4; d++) {
        blocks = kids(node);
        if (blocks.length === 1) node = blocks[0]; else break;
      }
      blocks.forEach(function (b) {
        if (isGrid(b)) {
          kids(b).forEach(function (c, i) { items.push([c, Math.min(i, 7)]); });
        } else {
          items.push([b, 0]);
        }
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target;
        if (e.isIntersecting) {
          io.unobserve(el);
          el.addEventListener('animationend', function done(ev) {
            if (ev.target !== el) return;
            el.removeEventListener('animationend', done);
            el.classList.remove('pl-rv', 'pl-in');
            el.style.removeProperty('--pl-i');
          });
          el.classList.add('pl-in');
        } else if (e.boundingClientRect.top < 0) {
          /* scrolled past before it was seen (anchor jump): show it, no animation */
          io.unobserve(el);
          el.classList.remove('pl-rv', 'pl-in');
          el.style.removeProperty('--pl-i');
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (pair) {
      var el = pair[0];
      if (!eligible(el)) return;
      el.style.setProperty('--pl-i', pair[1]);
      el.classList.add('pl-rv');
      io.observe(el);
    });
  }

  /* ---------- 2. Stat count-up (runs once, when seen) ---------- */
  function setupCount() {
    var nodes = Array.prototype.slice.call(doc.querySelectorAll('.st-n'));
    if (!nodes.length || reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        run(e.target);
      });
    }, { threshold: 0.6 });
    nodes.forEach(function (n) {
      var m = /^(\d[\d,]*)(.*)$/.exec(n.textContent.trim());
      if (!m) return;
      n._end = parseInt(m[1].replace(/,/g, ''), 10);
      n._suffix = m[2];
      n.setAttribute('aria-label', n.textContent.trim());
      io.observe(n);
    });
    function run(n) {
      var start = null, dur = 900, end = n._end;
      function frame(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        n.textContent = Math.round(end * eased) + n._suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      n.textContent = '0' + n._suffix;
      requestAnimationFrame(frame);
    }
  }

  /* ---------- 3. Header: hides on scroll down, returns on scroll up (phones and tablets) ---------- */
  function setupHeader() {
    var h = doc.querySelector('.site-header');
    if (!h || !window.matchMedia) return;
    var mq = window.matchMedia('(max-width: 900px)');
    var last = window.pageYOffset, ticking = false, hidden = false;
    function show() { if (hidden) { h.classList.remove('pl-hide'); hidden = false; } }
    function update() {
      ticking = false;
      var y = window.pageYOffset;
      if (!mq.matches || h.classList.contains('open')) { show(); last = y; return; }
      var dy = y - last;
      if (Math.abs(dy) < 8) return;
      if (dy > 0 && y > 120 && !hidden) { h.classList.add('pl-hide'); hidden = true; }
      else if ((dy < 0 || y <= 40) && hidden) { show(); }
      last = y;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    h.addEventListener('focusin', show);
    if (mq.addEventListener) mq.addEventListener('change', function () { show(); last = window.pageYOffset; });
  }

  /* ---------- 4. Prefetch pages on hover or touch (Chrome only, harmless elsewhere) ---------- */
  function setupPrefetch() {
    try {
      if (!(window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules'))) return;
      var s = doc.createElement('script');
      s.type = 'speculationrules';
      s.textContent = JSON.stringify({ prefetch: [{ where: { href_matches: '/*' }, eagerness: 'moderate' }] });
      doc.head.appendChild(s);
    } catch (err) { /* optional enhancement */ }
  }

  function init() {
    try { setupReveal(); } catch (e) {}
    try { setupCount(); } catch (e) {}
    try { setupHeader(); } catch (e) {}
    setupPrefetch();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
