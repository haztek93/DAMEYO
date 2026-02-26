/**
 * DAMEYO — main.js
 * ================
 * Scripts principaux :
 *
 *   1. Onglets du menu (activation + rejoue les reveals)
 *   2. Smooth scroll sur les ancres internes
 *   3. Année dynamique dans le footer
 */

(function () {
  'use strict';

  var NAVBAR_HEIGHT = 70; // offset pour la navbar fixe (px)


  /* ================================================
     1. ONGLETS DU MENU
  ================================================ */

  var tabs   = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');

  /**
   * Active l'onglet cliqué et son panneau associé.
   * Rejoue les animations .reveal du panneau entrant.
   * @param {HTMLElement} targetTab
   */
  function activateTab(targetTab) {
    var panelId = 'tab-' + targetTab.dataset.tab;

    /* Désactiver tous les onglets et panneaux */
    tabs.forEach(function (tab) {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });

    panels.forEach(function (panel) {
      panel.classList.remove('active');
    });

    /* Activer la cible */
    targetTab.classList.add('active');
    targetTab.setAttribute('aria-selected', 'true');

    var targetPanel = document.getElementById(panelId);

    if (targetPanel) {
      targetPanel.classList.add('active');

      /* Rejouer les animations de révélation */
      targetPanel.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.remove('visible');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.classList.add('visible');
          });
        });
      });
    }
  }

  /* Attacher les écouteurs sur chaque onglet */
  tabs.forEach(function (tab) {
    /* Clic souris */
    tab.addEventListener('click', function () {
      activateTab(tab);
    });

    /* Accessibilité clavier : Entrée et Espace */
    tab.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateTab(tab);
      }
    });
  });


  /* ================================================
     2. SMOOTH SCROLL SUR LES ANCRES INTERNES
     Offset = hauteur de la navbar fixe
  ================================================ */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      var selector = anchor.getAttribute('href');
      if (selector === '#') return;

      var target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();

      var top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ================================================
     3. ANNÉE DYNAMIQUE DANS LE FOOTER
  ================================================ */

  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

})();
