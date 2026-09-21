/**
 * La Capilla - Interacciones del sitio
 */

(function () {
  'use strict';

  // Navegacion mobile
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var nav = document.getElementById('nav');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }

  // Nav background on scroll
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.style.background = 'rgba(26, 18, 16, 0.98)';
      } else {
        nav.style.background = 'rgba(26, 18, 16, 0.95)';
      }
    });
  }

  // Scroll reveal animation
  var observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  var revealTargets = document.querySelectorAll(
    '.card, .about__grid, .gallery__item, .cta__content, .reviews__shell, .footer__inner'
  );

  revealTargets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Inject revealed style
  var style = document.createElement('style');
  style.textContent = '.revealed{opacity:1!important;transform:translateY(0)!important;}';
  document.head.appendChild(style);

  // Active nav link highlight on scroll
  var sections = document.querySelectorAll('section[id], header[id], footer[id]');
  var navLinksAll = document.querySelectorAll('.nav__links a');

  function highlightNav() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
  highlightNav();
})();
