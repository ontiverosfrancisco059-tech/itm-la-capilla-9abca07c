/* ==========================================================================
   La Capilla - script.js
   Carrito de pedido por WhatsApp, navegación y animaciones.
   ========================================================================== */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '523423432324';

  var cart = {};

  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  var cartToggle = document.getElementById('cartToggle');
  var cartPanel = document.getElementById('cartPanel');
  var cartBackdrop = document.getElementById('cartBackdrop');
  var cartClose = document.getElementById('cartClose');
  var cartCount = document.getElementById('cartCount');
  var cartList = document.getElementById('cartList');
  var cartEmpty = document.getElementById('cartEmpty');
  var cartOrder = document.getElementById('cartOrder');

  function closeNav() {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
  }

  navToggle.addEventListener('click', function () {
    var open = siteNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  siteNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      closeNav();
    }
  });

  function openCart() {
    cartPanel.classList.add('open');
    cartBackdrop.classList.add('open');
    cartPanel.setAttribute('aria-hidden', 'false');
    cartToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartPanel.classList.remove('open');
    cartBackdrop.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
    cartToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  cartToggle.addEventListener('click', function () {
    cartPanel.classList.contains('open') ? closeCart() : openCart();
  });
  cartClose.addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeCart();
      closeNav();
    }
  });

  function totalItems() {
    var total = 0;
    for (var name in cart) {
      if (Object.prototype.hasOwnProperty.call(cart, name)) {
        total += cart[name];
      }
    }
    return total;
  }

  function renderCart() {
    var total = totalItems();

    cartCount.textContent = String(total);
    cartOrder.disabled = total === 0;

    cartList.innerHTML = '';

    if (total === 0) {
      cartEmpty.classList.remove('hidden');
      return;
    }

    cartEmpty.classList.add('hidden');

    Object.keys(cart).forEach(function (name) {
      var li = document.createElement('li');
      li.className = 'cart-item';

      var nameEl = document.createElement('span');
      nameEl.className = 'cart-item-name';
      nameEl.textContent = name;

      var controls = document.createElement('div');
      controls.className = 'cart-item-controls';

      var minus = document.createElement('button');
      minus.type = 'button';
      minus.className = 'qty-btn remove';
      minus.textContent = '-';
      minus.setAttribute('aria-label', 'Quitar una unidad de ' + name);
      minus.addEventListener('click', function () {
        changeQty(name, -1);
      });

      var amount = document.createElement('span');
      amount.className = 'cart-amount';
      amount.textContent = String(cart[name]);

      var plus = document.createElement('button');
      plus.type = 'button';
      plus.className = 'qty-btn';
      plus.textContent = '+';
      plus.setAttribute('aria-label', 'Agregar una unidad de ' + name);
      plus.addEventListener('click', function () {
        changeQty(name, 1);
      });

      controls.appendChild(minus);
      controls.appendChild(amount);
      controls.appendChild(plus);

      li.appendChild(nameEl);
      li.appendChild(controls);
      cartList.appendChild(li);
    });
  }

  function changeQty(name, delta) {
    cart[name] = (cart[name] || 0) + delta;
    if (cart[name] <= 0) {
      delete cart[name];
    }
    renderCart();
  }

  function addToCart(name) {
    cart[name] = (cart[name] || 0) + 1;
    renderCart();

    cartCount.classList.remove('bump');
    void cartCount.offsetWidth;
    cartCount.classList.add('bump');
  }

  document.querySelectorAll('[data-add]').forEach(function (button) {
    button.addEventListener('click', function () {
      var card = button.closest('[data-name]');
      if (card) {
        addToCart(card.getAttribute('data-name'));
      }
    });
  });

  function buildMessage() {
    var lines = ['Hola La Capilla, quiero hacer un pedido:'];
    Object.keys(cart).forEach(function (name) {
      lines.push('- ' + name + ' x' + cart[name]);
    });
    lines.push('');
    lines.push('¿Me confirman precio y disponibilidad?');
    return lines.join('\n');
  }

  cartOrder.addEventListener('click', function () {
    if (totalItems() === 0) {
      return;
    }
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildMessage());
    window.open(url, '_blank', 'noopener');
  });

  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  [
    '.hero-content',
    '.about-figures',
    '.about-text',
    '.menu-category',
    '.steps',
    '.order-banner',
    '.comments-guide',
    '.comments-widget',
    '.contact-info',
    '.contact-map'
  ].forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  });

  renderCart();
})();