const WA_NUMBER = "523423432324";
const money = n => "$" + n.toFixed(0);
const cart = new Map(); // id -> {name, price, qty}

const $ = s => document.querySelector(s);
const grid = $("#menuGrid"), drawer = $("#drawer"), overlay = $("#overlay");
const itemsEl = $("#cartItems"), totalEl = $("#cartTotal"), countEl = $("#cartCount");

function openCart(){ drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); overlay.hidden = false; render(); }
function closeCart(){ drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); overlay.hidden = true; }
$("#openCart").addEventListener("click", openCart);
$("#openCart2").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if(e.key === "Escape") closeCart(); });

document.querySelectorAll("[data-add]").forEach(b => b.addEventListener("click", () => {
  const card = b.closest(".card");
  const id = card.dataset.id, name = card.dataset.name, price = Number(card.dataset.price);
  const cur = cart.get(id) || { name, price, qty: 0 };
  cur.qty += 1; cart.set(id, cur); render();
  b.textContent = "Agregado ✓"; setTimeout(() => b.textContent = "Agregar", 900);
}));

function render(){
  let total = 0, count = 0;
  itemsEl.innerHTML = "";
  if(cart.size === 0){ itemsEl.innerHTML = "<p class='muted'>Tu carrito está vacío. Agrega algo rico del menú.</p>"; }
  cart.forEach((v, id) => {
    total += v.price * v.qty; count += v.qty;
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `<div class="item-info"><strong></strong><span></span></div>
      <div class="qty"><button aria-label="Quitar">−</button><b></b><button aria-label="Añadir">+</button></div>`;
    d.querySelector("strong").textContent = v.name;
    d.querySelector("span").textContent = money(v.price) + " c/u · " + money(v.price * v.qty);
    d.querySelector("b").textContent = v.qty;
    const [minus, plus] = d.querySelectorAll("button");
    minus.onclick = () => { v.qty -= 1; if(v.qty <= 0) cart.delete(id); else cart.set(id, v); render(); };
    plus.onclick = () => { v.qty += 1; cart.set(id, v); render(); };
    itemsEl.appendChild(d);
  });
  totalEl.textContent = money(total); countEl.textContent = count;
}

$("#clearCart").addEventListener("click", () => { cart.clear(); render(); });
$("#checkout").addEventListener("click", () => {
  if(cart.size === 0){ alert("Agrega al menos un platillo antes de enviar."); return; }
  const mod = $("#modality").value, name = $("#custName").value.trim(), notes = $("#custNotes").value.trim();
  let lines = ["Hola La Capilla, quiero hacer un pedido:", ""];
  let total = 0;
  cart.forEach(v => { lines.push(`• ${v.qty} x ${v.name} — ${money(v.price*v.qty)}`); total += v.price*v.qty; });
  lines.push("", `Total: ${money(total)}`, `Modalidad: ${mod}`);
  if(name) lines.push(`Nombre: ${name}`);
  if(notes) lines.push(`Notas: ${notes}`);
  lines.push("Gracias.");
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
});

// Filtros
document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
  document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
  c.classList.add("active");
  const f = c.dataset.filter;
  document.querySelectorAll("#menuGrid .card").forEach(card => {
    card.style.display = (f === "todo" || card.dataset.cat === f) ? "" : "none";
  });
}));

// Nav móvil
const nav = $("#nav"), menuBtn = $("#menuBtn");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

// Reveal
const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("vis"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".card,.step,.gal figure,.opi-card").forEach(el => { el.classList.add("reveal"); io.observe(el); });

$("#year").textContent = new Date().getFullYear();
render();
