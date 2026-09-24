/* Chapter loader — counter + teardown
   Timings here must match the CSS: --dur (1.5s) and the .45s start delay. */
(function () {
  'use strict';

  var DELAY    = 450;   // ms before the rail starts filling  (CSS: .45s)
  var DUR      = 1500;  // ms the rail takes to fill          (CSS: --dur)
  var UNLOCK   = 2000;  // ms until scrolling is re-enabled
  var TEARDOWN = 2700;  // ms until the preloader is removed from the DOM

  function init() {
    var preloader = document.getElementById('preloader');
    var pct = document.querySelector('.pct');
    if (!preloader) return;

    // easeInOutCubic — mirrors the bar's cubic-bezier so the number tracks the fill
    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    if (pct) {
      var start = performance.now();
      (function tick(now) {
        var t = Math.min(Math.max(now - start - DELAY, 0) / DUR, 1);
        pct.textContent = Math.round(ease(t) * 100) + '%';
        if (t < 1) requestAnimationFrame(tick);
      })(performance.now());
    }

    setTimeout(function () {
      document.body.style.overflow = 'auto';
    }, UNLOCK);

    setTimeout(function () {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, TEARDOWN);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();