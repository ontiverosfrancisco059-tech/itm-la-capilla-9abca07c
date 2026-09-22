const PRODUCTS = {
  "burger-insignia": { name: "Hamburguesa insignia La Capilla", price: 129 },
  "burger-clasica": { name: "Clásica con papas", price: 119 },
  "ramen": { name: "Ramen especial de la casa", price: 139 },
  "dumplings": { name: "Dumplings al vapor (8 pzas)", price: 99 },
  "jugos": { name: "Jugos naturales", price: 45 },
  "refresco": { name: "Coca-Cola / refresco frío", price: 35 },
  "postre": { name: "Postre casero", price: 55 }
};
const WA_NUMBER = "523423432324";
const cart = JSON.parse(localStorage.getItem("capilla_cart") || "{}");

const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n + " MXN";

function save() { localStorage.setItem("capilla_cart", JSON.stringify(cart)); }
function count() { return Object.values(cart).reduce((a, b) => a + b, 0); }
function total() { return Object.entries(cart).reduce((a, [k, q]) => a + (PRODUCTS[k]?.price || 0) * q, 0); }

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

function render() {
  $("#cartCount").textContent = count();
  $("#cartTotal").textContent = money(total());
  const box = $("#cartItems");
  box.innerHTML = "";
  const keys = Object.keys(cart).filter((k) => cart[k] > 0);
  if (!keys.length) {
    box.innerHTML = "<p style='color:#7a5c42'>Tu carrito está vacío. Añade una hamburguesa, un ramen o unos dumplings para empezar.</p>";
    return;
  }
  keys.forEach((k) => {
    const p = PRODUCTS[k];
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `<div><strong>${p.name}</strong><br><small>${money(p.price)} c/u · Subtotal ${money(p.price * cart[k])}</small><div class="qty" style="margin-top:8px"><button data-dec="${k}" aria-label="Quitar uno">−</button><span>${cart[k]}</span><button data-inc="${k}" aria-label="Añadir uno">+</button></div></div><button data-del="${k}" aria-label="Eliminar">✕</button>`;
    box.appendChild(row);
  });
}

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    const id = add.getAttribute("data-add");
    cart[id] = (cart[id] || 0) + 1;
    save(); render();
    toast(PRODUCTS[id].name + " añadido");
    openCart(false);
    return;
  }
  const inc = e.target.closest("[data-inc]");
  if (inc) { cart[inc.dataset.inc]++; save(); render(); return; }
  const dec = e.target.closest("[data-dec]");
  if (dec) {
    const k = dec.dataset.dec;
    cart[k]--;
    if (cart[k] <= 0) delete cart[k];
    save(); render(); return;
  }
  const del = e.target.closest("[data-del]");
  if (del) { delete cart[del.dataset.del]; save(); render(); return; }
});

function openCart(scroll = true) {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
}
$("#cartOpen").addEventListener("click", () => { render(); openCart(); });
$("#cartClose").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

$("#clearBtn").addEventListener("click", () => {
  Object.keys(cart).forEach((k) => delete cart[k]);
  save(); render();
});

$("#checkoutBtn").addEventListener("click", () => {
  const keys = Object.keys(cart).filter((k) => cart[k] > 0);
  if (!keys.length) { toast("Añade algo al carrito primero"); return; }
  const name = $("#orderName").value.trim();
  const mode = $("#orderMode").value;
  const lines = keys.map((k) => `• ${cart[k]}x ${PRODUCTS[k].name} — $${PRODUCTS[k].price * cart[k]}`);
  const msg = `Hola La Capilla, quiero hacer un pedido:%0A%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: $${total()} MXN%0AModalidad: ${encodeURIComponent(mode)}%0A${name ? "Nombre: " + encodeURIComponent(name) : "Nombre: (sin indicar)"}%0A%0AGracias.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank", "noopener");
});

// Filtros menú
document.querySelectorAll("[data-filter]").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    const f = b.dataset.filter;
    document.querySelectorAll("#menuGrid .menu-card").forEach((c) => {
      c.style.display = (f === "all" || c.dataset.cat === f) ? "" : "none";
    });
  });
});

// Menú móvil
const toggle = $("#menuToggle"), mnav = $("#mobileNav");
toggle.addEventListener("click", () => {
  const open = mnav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});
mnav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => mnav.classList.remove("open")));

// Reveal
const io = new IntersectionObserver((es) => {
  es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

render();
