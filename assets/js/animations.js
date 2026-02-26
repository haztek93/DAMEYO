/**
 * DAMEYO — animations.js
 * ======================
 * Deux rôles :
 *
 *   1. Scroll reveal : ajoute .visible sur les .reveal
 *      quand ils entrent dans le viewport
 *
 *   2. Hero desktop : slide automatique vers
 *      "Le Goût Qui Claque" après 1 tour de vidéo
 *      La durée de la vidéo est 10.04s (10043ms)
 */

(function () {
  'use strict';

  /* ================================================
     1. SCROLL REVEAL
     IntersectionObserver sur tous les .reveal
     → ajoute .visible → déclenche la transition CSS
  ================================================ */

  var revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // ne se joue qu'une fois
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

  } else {
    /* Fallback : navigateurs sans IntersectionObserver */
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ================================================
     2. HERO DESKTOP — SLIDE APRÈS 1 TOUR VIDÉO
     Fonctionne uniquement sur desktop (> 768px).
     
     Séquence :
       a. La vidéo tourne 1 fois (loop = false)
       b. L'event "ended" déclenche doSlide()
       c. Le track glisse : translateX(-50%)
       d. 900ms plus tard → .slide-in sur le panneau
          → les animations CSS du texte se déclenchent
       
     Fallback : si "ended" ne se déclenche pas
     (autoplay bloqué, codec non supporté…), un
     setTimeout force le slide après la durée vidéo.
  ================================================ */

  var VIDEO_DURATION_MS = 10043; // durée exacte : 10.043s

  var track      = document.getElementById('heroTrack');
  var slidePanel = document.getElementById('heroSlidePanel');
  var video      = document.getElementById('heroVideo');

  if (!track || !slidePanel || !video) return;

  var triggered = false;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function doSlide() {
    /* Ne pas déclencher sur mobile ou si déjà fait */
    if (triggered || isMobile()) return;
    triggered = true;

    /* Arrête la boucle — la vidéo se fige sur la dernière frame */
    video.loop = false;

    /* Glissement du track vers la gauche */
    track.style.transform = 'translateX(-50%)';

    /* Lance les animations du texte après la transition du track (1.1s) */
    setTimeout(function () {
      slidePanel.classList.add('slide-in');
    }, 900);
  }

  /* Écoute la fin du premier tour de vidéo */
  video.addEventListener('ended', doSlide, { once: true });

  /* Fallback au cas où l'event "ended" ne se déclenche pas */
  setTimeout(function () {
    if (!triggered && !isMobile()) {
      doSlide();
    }
  }, VIDEO_DURATION_MS + 300);

})();
