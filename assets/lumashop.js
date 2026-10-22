/* LumaShop – homepage behaviour: mobile menu, hero slider, wishlist hearts. */
(function () {
  'use strict';

  function initNav(root) {
    var toggle = root.querySelector('[data-lm-nav-toggle]');
    var nav = root.querySelector('.lm-header__nav');
    if (!toggle || !nav || toggle.dataset.lmReady) return;
    toggle.dataset.lmReady = '1';
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }

  function initSlider(root) {
    if (root.dataset.lmReady) return;
    root.dataset.lmReady = '1';
    var slides = root.querySelectorAll('[data-lm-slide]');
    var dots = root.querySelectorAll('[data-lm-dot]');
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var autoplay = root.dataset.autoplay === 'true';
    var speed = parseInt(root.dataset.speed, 10) || 6000;

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
      dots.forEach(function (d, n) { d.classList.toggle('is-active', n === index); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (autoplay && !document.body.classList.contains('shopify-design-mode')) {
        timer = setInterval(function () { go(index + 1); }, speed);
      }
    }

    var prev = root.querySelector('[data-lm-prev]');
    var next = root.querySelector('[data-lm-next]');
    if (prev) prev.addEventListener('click', function () { go(index - 1); start(); });
    if (next) next.addEventListener('click', function () { go(index + 1); start(); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { go(parseInt(d.dataset.lmDot, 10)); start(); });
    });

    var touchX = null;
    root.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); start(); }
      touchX = null;
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    root.addEventListener('shopify:block:select', function (e) {
      var n = Array.prototype.indexOf.call(slides, e.target);
      if (n > -1) { go(n); stop(); }
    });
    start();
  }

  var WISH_KEY = 'lumashop_wishlist';
  function readWish() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { return []; }
  }
  function initWishlist(btn) {
    if (btn.dataset.lmReady) return;
    btn.dataset.lmReady = '1';
    var id = btn.dataset.lmWishlist;
    function paint(on) {
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    }
    paint(readWish().indexOf(id) > -1);
    btn.addEventListener('click', function () {
      var list = readWish();
      var i = list.indexOf(id);
      if (i > -1) list.splice(i, 1); else list.push(id);
      try { localStorage.setItem(WISH_KEY, JSON.stringify(list)); } catch (e) {}
      paint(i === -1);
    });
  }

  function init(scope) {
    scope = scope || document;
    scope.querySelectorAll('.lm-header').forEach(initNav);
    scope.querySelectorAll('[data-lm-slider]').forEach(initSlider);
    scope.querySelectorAll('[data-lm-wishlist]').forEach(initWishlist);
  }

  init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
