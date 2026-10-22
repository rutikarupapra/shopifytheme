/* Glow landing page: mobile menu toggle and wishlist hearts. */
(function () {
  'use strict';

  function initNav(root) {
    var toggle = root.querySelector('[data-gl-nav-toggle]');
    var nav = root.querySelector('.gl-header__nav');
    if (!toggle || !nav || toggle.dataset.glReady) return;
    toggle.dataset.glReady = '1';
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }

  var WISH_KEY = 'glow_wishlist';
  function readWish() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { return []; }
  }
  function initWishlist(btn) {
    if (btn.dataset.glReady) return;
    btn.dataset.glReady = '1';
    var id = btn.dataset.glWishlist;
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
    scope.querySelectorAll('.gl-header').forEach(initNav);
    scope.querySelectorAll('[data-gl-wishlist]').forEach(initWishlist);
  }

  init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
