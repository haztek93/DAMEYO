/**
 * DAMEYO — navbar.js
 * ==================
 * Gestion de la barre de navigation :
 *   1. Fond sombre au scroll (.scrolled)
 *   2. Menu burger mobile (ouverture / fermeture)
 *   3. Fermeture au clic sur lien ou en dehors
 *   4. Lien actif selon la section visible
 */

(function () {
  'use strict';

  /* ------------------------------------------------
     Références DOM
  ------------------------------------------------ */
  const navbar    = document.getElementById('navbar');
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = navLinks.querySelectorAll('.nav-link');


  /* ------------------------------------------------
     1. Fond sombre au scroll
  ------------------------------------------------ */
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ------------------------------------------------
     2. Menu burger mobile
  ------------------------------------------------ */
  function openMenu() {
    navLinks.classList.add('open');
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', function () {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });


  /* ------------------------------------------------
     3. Fermeture au clic sur un lien
  ------------------------------------------------ */
  allLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });


  /* ------------------------------------------------
     4. Fermeture au clic en dehors du menu
  ------------------------------------------------ */
  document.addEventListener('click', function (event) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(event.target) &&
      !burgerBtn.contains(event.target)
    ) {
      closeMenu();
    }
  });


  /* ------------------------------------------------
     5. Lien actif selon la section visible
  ------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          allLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

})();
