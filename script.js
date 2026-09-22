const PRODUCTS = {
  hamburguesa: { name: "Hamburguesa artesanal", price: 129 },
  ramen: { name: "Ramen caliente", price: 139 },
  dumplings: { name: "Dumplings dorados · 8 pzas", price: 99 },
  jugos: { name: "Jugos naturales 500ml", price: 45 },
  cola: { name: "Coca-Cola bien fría", price: 35 },
  postre: { name: "Flan casero de la capilla", price: 55 }
};
const WA_NUMBER = "523423432324";
const KEY = "lacapilla_cart_v1";

const $ = (s) => document.querySelector(s);
const drawer = $("#cartDrawer"), overlay = $("#cartOverlay");

function loadCart(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function saveCart(c){ localStorage.setItem(KEY, JSON.stringify(c)); }
let cart = loadCart();

function money(n){ return "$" + n.toLocaleString("es-MX"); }
function count(){ return Object.values(cart).reduce((a,b)=>a+b,0); }
function total(){ return Object.entries(cart).reduce((a,[id,q])=>a+(PRODUCTS[id]?.price||0)*q,0); }

function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"), 2200);
}

function render(){
  $("#cartCount").textContent = count();
  $("#cartTotal").textContent = money(total());
  const box = $("#cartItems");
  const ids = Object.keys(cart).filter(id=>cart[id]>0);
  if(!ids.length){ box.innerHTML = '<p class="empty">Tu carrito está vacío.<br>Agrega algo rico del menú.</p>'; return; }
  box.innerHTML = ids.map(id=>{
    const p = PRODUCTS[id]; const q = cart[id];
    return `<div class="cart-item"><div><strong>${p.name}</strong><br><span>${money(p.price)} c/u · ${money(p.price*q)}</span></div>
    <div class="qty"><button data-dec="${id}" aria-label="Quitar uno">−</button><span>${q}</span><button data-inc="${id}" aria-label="Agregar uno">+</button></div></div>`;
  }).join("");
}

function openCart(){ render(); drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); overlay.hidden = false; }
function closeCart(){ drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); overlay.hidden = true; }

document.addEventListener("click", (e)=>{
  const add = e.target.closest("[data-add]");
  if(add){ const id = add.dataset.add; cart[id]=(cart[id]||0)+1; saveCart(cart); render(); toast(PRODUCTS[id].name+" agregado"); return; }
  const inc = e.target.closest("[data-inc]");
  if(inc){ cart[inc.dataset.inc]++; saveCart(cart); render(); return; }
  const dec = e.target.closest("[data-dec]");
  if(dec){ const id=dec.dataset.dec; cart[id]--; if(cart[id]<=0) delete cart[id]; saveCart(cart); render(); return; }
});

$("#openCart").addEventListener("click", openCart);
$("#openCart2").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeCart(); });

$("#clearCart").addEventListener("click", ()=>{ cart={}; saveCart(cart); render(); });

$("#checkoutBtn").addEventListener("click", ()=>{
  const ids = Object.keys(cart);
  if(!ids.length){ toast("Agrega al menos un platillo"); return; }
  const modo = (document.querySelector('input[name="modo"]:checked')||{}).value || "Para llevar";
  const lines = ids.map(id=>`• ${cart[id]}x ${PRODUCTS[id].name} — ${money(PRODUCTS[id].price*cart[id])}`);
  const msg = `Hola La Capilla, quiero hacer un pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(total())}\nModalidad: ${modo}\nNombre: \nDirección (si es domicilio): `;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
});

// filtros menú
document.querySelectorAll(".chip").forEach(ch=>{
  ch.addEventListener("click", ()=>{
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    ch.classList.add("active");
    const f = ch.dataset.filter;
    document.querySelectorAll("#menuGrid .card").forEach(card=>{
      card.style.display = (f==="todo" || card.dataset.cat===f) ? "" : "none";
    });
  });
});

// nav móvil
$("#menuToggle").addEventListener("click", ()=> $("#nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click", ()=> $("#nav").classList.remove("open")));

render();
