/* ============================================================
   LA CAPILLA · Catálogo ligero con carrito que envía pedidos
   a WhatsApp. Los datos del menú viven aquí y se pintan en la
   rejilla. Sin dependencias externas.
   ============================================================ */
(function () {
  "use strict";

  var PHONE = "523423432324";
  var STORAGE_KEY = "lacapilla_cart_v1";

  var money = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

  var CATEGORIES = {
    comida: "Comida rápida",
    ramen: "Ramen & orientales",
    bebidas: "Bebidas",
  };

  var PRODUCTS = [
    {
      id: "burger-clasica", cat: "comida", price: 85,
      img: "images/hamburguesas-elcorral.jpg", alt: "Hamburguesa clásica de La Capilla",
      name: "Hamburguesa Clásica",
      desc: "Pan artesanal, res jugosa, queso derretido, lechuga, jitomate y la salsa de la casa.",
      extras: [
        { label: "Sin extras", delta: 0 },
        { label: "Extra queso", delta: 12 },
        { label: "Con tocino", delta: 18 },
      ],
    },
    {
      id: "burger-doble", cat: "comida", price: 115,
      img: "images/hamburguesa-producto.jpg", alt: "Hamburguesa doble de La Capilla",
      name: "Hamburguesa Doble",
      desc: "Dos carnes, doble queso y la salsa especial de La Capilla. Para hambre seria.",
      extras: [
        { label: "Sin extras", delta: 0 },
        { label: "Extra queso", delta: 12 },
        { label: "Con tocino", delta: 18 },
      ],
    },
    {
      id: "burger-empresarial", cat: "comida", price: 140,
      img: "images/hamburguesas-empresas.jpg", alt: "Hamburguesa empresarial con acompañamientos",
      name: "Hamburguesa Empresarial",
      desc: "Nuestro festín: hamburguesa premium con acompañamientos y bebida. Ideal para compartir.",
      extras: [],
    },
    {
      id: "burger-reto", cat: "comida", price: 158,
      img: "images/burger-contest.jpg", alt: "Hamburguesa reto de gran tamaño",
      name: "Hamburguesa Reto",
      desc: "La gigante del reto: si la terminas, la próxima es de la casa. Se siente y se recuerda.",
      extras: [
        { label: "Reto completo", delta: 0 },
        { label: "Media porción", delta: -40 },
      ],
    },
    {
      id: "botana", cat: "comida", price: 110,
      img: "images/fastfood-menu.jpg", alt: "Botana variada para compartir",
      name: "Botana para compartir",
      desc: "Surtido estilo rápido para picar: bocaditos y dumplings para toda la mesa.",
      extras: [
        { label: "Para compartir", delta: 0 },
        { label: "Porción individual", delta: -25 },
      ],
    },
    {
      id: "ramen-clasico", cat: "ramen", price: 125,
      img: "images/ramen-jump.jpg", alt: "Ramen clásico humeante",
      name: "Ramen Clásico",
      desc: "Caldo propio, fideos al dente, huevo marinado y cebollín fresco.",
      extras: [
        { label: "Nivel suave", delta: 0 },
        { label: "Extra picante", delta: 10 },
      ],
    },
    {
      id: "ramen-capilla", cat: "ramen", price: 145,
      img: "images/ramen-noodly.jpg", alt: "Ramen La Capilla de autor",
      name: "Ramen La Capilla",
      desc: "Nuestra receta de autor: caldo intenso, chashu jugoso, hongo y el toque secreto.",
      extras: [
        { label: "Nivel suave", delta: 0 },
        { label: "Chashu extra", delta: 30 },
        { label: "Extra picante", delta: 10 },
      ],
    },
    {
      id: "coctel", cat: "bebidas", price: 120,
      img: "images/flaming-cocktails.jpg", alt: "Cócteles de la casa preparados al momento",
      name: "Cócteles de la casa",
      desc: "Para animar la mesa: opciones clásicas y de autor, preparadas al momento.",
      extras: [
        { label: "Con alcohol", delta: 0 },
        { label: "Sin alcohol", delta: 0 },
      ],
    },
    {
      id: "coca-600", cat: "bebidas", price: 32,
      img: null, alt: "Coca-Cola de 600 ml bien fría",
      name: "Coca-Cola 600 ml",
      desc: "Bien fría, para acompañar cualquier pedido.",
      extras: [],
    },
    {
      id: "coca-familiar", cat: "bebidas", price: 48,
      img: null, alt: "Coca-Cola familiar de 2.5 litros",
      name: "Coca-Cola Familiar 2.5 L",
      desc: "Para la mesa completa o la comida en casa.",
      extras: [],
    },
    {
      id: "jugo", cat: "bebidas", price: 55,
      img: null, alt: "Jugos naturales preparados al momento",
      name: "Jugo natural",
      desc: "Recién exprimido al momento. Elige naranja, zanahoria o verde.",
      extras: [
        { label: "Naranja", delta: 0 },
        { label: "Zanahoria", delta: 0 },
        { label: "Verde", delta: 0 },
      ],
    },
  ];

  var NOIMG_ICON =
    '<svg viewBox="0 0 24 24" class="noimg-icon" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 8.5a2 2 0 0 0-2-2H8.5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2z"/><path d="M8.5 14.5 11 12l1.8 1.8 2-2 2.7 2.7"/><path d="M11 3h2v2h-2zM11 19h2v2h-2zM3 11h2v2H3zM19 11h2v2h-2z"/></svg>';

  var grid = document.getElementById("menuGrid");
  var cartCount = document.getElementById("cartCount");
  var cartDrawer = document.getElementById("cartDrawer");
  var cartOverlay = document.getElementById("cartOverlay");
  var cartList = document.getElementById("cartList");
  var cartTotalEl = document.getElementById("cartTotal");
  var cartHeadCount = document.getElementById("cartHeadCount");
  var orderBtn = document.getElementById("orderBtn");
  var clearCartBtn = document.getElementById("clearCartBtn");

  var cart = loadCart();

  /* ---------- Persistencia ---------- */
  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) { /* almacenamiento no disponible */ }
  }

  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }

  function lineKey(product, extraLabel) {
    return product.id + "::" + (extraLabel || "");
  }

  function linePrice(product, extraLabel) {
    var extra = null;
    if (product.extras && product.extras.length) {
      for (var i = 0; i < product.extras.length; i++) {
        if (product.extras[i].label === extraLabel) extra = product.extras[i];
      }
    }
    return product.price + (extra ? extra.delta : 0);
  }

  /* ---------- Render del menú ---------- */
  function productCard(product) {
    var media;
    if (product.img) {
      media =
        '<div class="product-media"><img src="' + product.img + '" alt="' + escapeHtml(product.alt || product.name) + '" loading="lazy" /></div>';
    } else {
      media = '<div class="product-media product-media--noimg" role="img" aria-label="' + escapeHtml(product.alt || product.name) + '">' + NOIMG_ICON + "</div>";
    }

    var extras = "";
    if (product.extras && product.extras.length > 0) {
      var options = product.extras
        .map(function (e) {
          var suffix = e.delta > 0 ? "  (+" + e.delta + ")" : e.delta < 0 ? "  (-" + Math.abs(e.delta) + ")" : "";
          return '<option value="' + escapeHtml(e.label) + '">' + escapeHtml(e.label) + suffix + "</option>";
        })
        .join("");
      extras =
        '<div class="product-extras"><label>Opción<select data-extra>' + options + "</select></label></div>";
    }

    return (
      '<article class="product-card" data-id="' + product.id + '" data-cat="' + product.cat + '">' +
        '<div class="product-media-wrap">' + media +
          '<span class="product-tag">' + escapeHtml(CATEGORIES[product.cat] || product.cat) + "</span>" +
        "</div>" +
        '<div class="product-body">' +
          "<h3 class=\"product-name\">" + escapeHtml(product.name) + "</h3>" +
          '<p class="product-desc">' + escapeHtml(product.desc) + "</p>" +
          '<p class="product-price">' + money.format(product.price) + "<small>por pieza · precio de referencia</small></p>" +
          extras +
          '<button class="add-btn" type="button" data-add="' + product.id + '">Agregar al pedido</button>' +
        "</div>" +
      "</article>"
    );
  }

  function renderMenu(filter) {
    grid.innerHTML = PRODUCTS.map(productCard).join("");
    if (filter) {
      var cards = grid.querySelectorAll(".product-card");
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("is-hidden", cards[i].dataset.cat !== filter && filter !== "all");
      }
    }
  }

  /* ---------- Carrito UI ---------- */
  function renderCart() {
    var count = 0;
    var total = 0;

    cart.forEach(function (line) {
      var product = findProduct(line.id);
      if (!product) return;
      count += line.qty;
      total += linePrice(product, line.extra) * line.qty;
    });

    cartCount.hidden = count === 0;
    cartCount.textContent = String(count);
    cartHeadCount.textContent = "(" + count + ")";
    cartTotalEl.textContent = money.format(total);

    if (cart.length === 0) {
      cartList.innerHTML =
        '<li class="cart-empty">Tu carrito está vacío.<br />Agrega algo rico del menú para empezar.</li>';
    } else {
      cartList.innerHTML = cart
        .map(function (line) {
          var product = findProduct(line.id);
          if (!product) return "";
          var unit = linePrice(product, line.extra);
          var subtitle = line.extra ? "<p class=\"cart-item-extras\">" + escapeHtml(line.extra) + "</p>" : "";
          return (
            '<li class="cart-item" data-key="' + escapeHtml(lineKey(product, line.extra)) + '">' +
              '<div class="cart-item-top">' +
                "<div><h4 class=\"cart-item-name\">" + escapeHtml(product.name) + "</h4>" + subtitle + "</div>" +
                '<span class="cart-item-price">' + money.format(unit * line.qty) + "</span>" +
              "</div>" +
              '<div class="cart-item-controls">' +
                '<span class="qty">' +
                  '<button type="button" data-step="-1" aria-label="Quitar uno">−</button>' +
                  '<span>' + line.qty + "</span>" +
                  '<button type="button" data-step="1" aria-label="Agregar uno">+</button>' +
                "</span>" +
                '<button type="button" class="cart-remove" data-remove>Quitar</button>' +
              "</div>" +
            "</li>"
          );
        })
        .join("");
    }

    orderBtn.disabled = cart.length === 0;
    saveCart();
  }

  function addToCart(id, extraLabel) {
    var product = findProduct(id);
    if (!product) return;
    if (!extraLabel && product.extras && product.extras.length) extraLabel = product.extras[0].label;
    var key = lineKey(id, extraLabel || "");
    var line = cart.find(function (l) { return l.id === id && (l.extra || "") === (extraLabel || ""); });
    if (line) {
      line.qty += 1;
    } else {
      cart.push({ id: id, extra: extraLabel || "", qty: 1 });
    }
    renderCart();
    openCart();
  }

  function changeQty(key, delta) {
    var line = cart.find(function (l) { return lineKey(l.id, l.extra) === key; });
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter(function (l) { return lineKey(l.id, l.extra) !== key; });
    renderCart();
  }

  function removeLine(key) {
    cart = cart.filter(function (l) { return lineKey(l.id, l.extra) !== key; });
    renderCart();
  }

  /* ---------- Pedido por WhatsApp ---------- */
  function createOrderMessage() {
    var lines = cart
      .map(function (line) {
        var product = findProduct(line.id);
        if (!product) return "";
        var unit = linePrice(product, line.extra);
        var extra = line.extra ? " (" + line.extra + ")" : "";
        return "- " + line.qty + "x " + product.name + extra + " — " + money.format(unit) + " c/u";
      })
      .join("\n");

    var total = cart.reduce(function (sum, line) {
      var product = findProduct(line.id);
      return product ? sum + linePrice(product, line.extra) * line.qty : sum;
    }, 0);

    var name = (document.getElementById("fieldName").value || "").trim();
    var note = (document.getElementById("fieldNote").value || "").trim();

    var msg = "Hola La Capilla, quiero hacer mi pedido:\n\n";
    msg += lines + "\n";
    msg += "\nTotal estimado: " + money.format(total) + "\n";
    if (name) msg += "\nNombre: " + name;
    if (note) msg += "\nDetalle: " + note;
    msg += "\n\n(El total es de referencia; por favor confirma precio y disponibilidad.)";

    return msg;
  }

  function sendOrder() {
    if (cart.length === 0) return;
    var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(createOrderMessage());
    window.open(url, "_blank", "noopener");
    cart = [];
    renderCart();
    closeCart();
  }

  /* ---------- Carrito abrir/cerrar ---------- */
  function openCart() {
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    cartOverlay.hidden = false;
    document.body.classList.add("is-locked");
  }

  function closeCart() {
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartOverlay.hidden = true;
    document.body.classList.remove("is-locked");
  }

  /* ---------- Navegación ---------- */
  function setupNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Utilidades ---------- */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setFilters() {
    var buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (b) {
          var active = b === button;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        renderMenu(button.dataset.filter);
      });
    });
  }

  function bindEvents() {
    grid.addEventListener("click", function (event) {
      var add = event.target.closest("[data-add]");
      if (!add) return;
      var card = add.closest(".product-card");
      var select = card.querySelector("[data-extra]");
      addToCart(add.dataset.add, select ? select.value : "");
    });

    cartList.addEventListener("click", function (event) {
      var item = event.target.closest(".cart-item");
      if (!item) return;
      if (event.target.closest("[data-remove]")) {
        removeLine(item.dataset.key);
        return;
      }
      var stepBtn = event.target.closest("[data-step]");
      if (stepBtn) changeQty(item.dataset.key, Number(stepBtn.dataset.step));
    });

    document.getElementById("cartButton").addEventListener("click", function () {
      if (cart.length === 0) {
        document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
        return;
      }
      openCart();
    });
    document.getElementById("cartClose").addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    orderBtn.addEventListener("click", sendOrder);
    clearCartBtn.addEventListener("click", function () {
      cart = [];
      renderCart();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeCart();
    });
  }

  /* ---------- Inicio ---------- */
  function init() {
    renderMenu("all");
    renderCart();
    setFilters();
    bindEvents();
    setupNav();
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();