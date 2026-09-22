const WA_NUMBER = "523423432324";
const cart = new Map(); // id -> {name, price, qty}

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => "$" + n.toFixed(0);

function updateCartUI(){
  const items = $("#cartItems");
  const count = [...cart.values()].reduce((a,i)=>a+i.qty,0);
  const total = [...cart.values()].reduce((a,i)=>a+i.qty*i.price,0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  items.innerHTML = "";
  if(cart.size===0){
    items.innerHTML = "<li><div><strong>Carrito vacío</strong><br><span class='muted small'>Agrega hamburguesas, ramen, dumplings, bebidas o postres.</span></div></li>";
    return;
  }
  for(const [id,it] of cart){
    const li = document.createElement("li");
    li.innerHTML = `<div><strong></strong><br><span class="muted small"></span></div>
      <div class="qty"><button data-act="dec" aria-label="Quitar uno">−</button><span></span><button data-act="inc" aria-label="Agregar uno">+</button></div>`;
    li.querySelector("strong").textContent = it.name;
    li.querySelector(".muted").textContent = money(it.price) + " c/u · " + money(it.price*it.qty);
    li.querySelector(".qty span").textContent = it.qty;
    li.querySelector('[data-act="inc"]').onclick = ()=>{ it.qty++; updateCartUI(); };
    li.querySelector('[data-act="dec"]').onclick = ()=>{ it.qty--; if(it.qty<=0) cart.delete(id); updateCartUI(); };
    items.appendChild(li);
  }
}

function openCart(){ $("#cartDrawer").hidden=false; $("#cartBackdrop").hidden=false; }
function closeCart(){ $("#cartDrawer").hidden=true; $("#cartBackdrop").hidden=true; }

document.addEventListener("DOMContentLoaded", ()=>{
  updateCartUI();
  $$("#productGrid .add").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const card = btn.closest(".card");
      const id = card.dataset.id, name = card.dataset.name, price = Number(card.dataset.price);
      const cur = cart.get(id) || {name, price, qty:0};
      cur.qty++; cart.set(id, cur);
      updateCartUI(); openCart();
    });
  });
  $("#openCart").onclick = openCart;
  const on2 = $("#orderNow"); if(on2) on2.onclick = openCart;
  $("#closeCart").onclick = closeCart;
  $("#cartBackdrop").onclick = closeCart;
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeCart(); });
  $("#clearCart").onclick = ()=>{ cart.clear(); updateCartUI(); };

  $("#checkoutWa").onclick = ()=>{
    if(cart.size===0){ alert("Tu carrito está vacío. Agrega algo del menú primero."); return; }
    const name = ($("#buyerName").value||"").trim();
    const type = $("#deliveryType").value;
    const lines = [...cart.values()].map(i=>`• ${i.qty}× ${i.name} — ${money(i.price*i.qty)}`);
    const total = [...cart.values()].reduce((a,i)=>a+i.qty*i.price,0);
    const msg = `Hola La Capilla, quiero hacer un pedido:%0A${encodeURIComponent(lines.join("\n"))}%0ATotal estimado: ${money(total)}%0ATipo: ${encodeURIComponent(type)}${name?`%0ANombre: ${encodeURIComponent(name)}`:""}%0AGracias.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`,"_blank","noopener");
  };

  // filtros
  $$(".chip").forEach(ch=>{
    ch.onclick = ()=>{
      $$(".chip").forEach(c=>c.classList.remove("active"));
      ch.classList.add("active");
      const f = ch.dataset.filter;
      $$("#productGrid .card").forEach(card=>{
        const cats = (card.dataset.cat||"").split(" ");
        card.style.display = (f==="all"||cats.includes(f)) ? "" : "none";
      });
    };
  });

  // nav móvil
  const t = $("#menuToggle"), m = $("#mobileNav");
  t.onclick = ()=>{ const o = m.classList.toggle("open"); t.setAttribute("aria-expanded", o); };
  $$("#mobileNav a").forEach(a=>a.onclick=()=>m.classList.remove("open"));

  // formulario rápido -> WhatsApp
  $("#quickForm").addEventListener("submit", e=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const txt = `Hola La Capilla, soy ${fd.get("nombre")} (${fd.get("tipo")}). Mi antojo: ${fd.get("notas")||"ver menú"}. ¿Me confirmas tiempo y total?`;
    $("#quickMsg").textContent = "Abriendo WhatsApp con tu mensaje…";
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`,"_blank","noopener");
  });

  // sombra topbar
  const bar = $("#topbar");
  addEventListener("scroll", ()=>{ bar.style.boxShadow = scrollY>8 ? "0 6px 24px rgba(60,32,12,.12)" : "none"; }, {passive:true});
});
