const PRODUCTS = [
    {
        id: 1,
        name: "Hamburguesa Clásica",
        category: "hamburguesas",
        price: 89,
        desc: "Jugosa carne de res, lechuga, tomate, cebolla y salsa especial en pan artesanal.",
        img: "https://itm-void-excepcional.pages.dev/api/itm-project-assets?file=d47e59e0-bf4d-4fee-adf1-659df73b8bb0",
        badge: "Popular"
    },
    {
        id: 2,
        name: "Hamburguesa Doble",
        category: "hamburguesas",
        price: 119,
        desc: "Doble carne, doble queso, tocino crujiente y aderezo especial.",
        img: "https://itm-void-excepcional.pages.dev/api/itm-project-assets?file=d2c92fab-5776-40bd-a88c-a59ad1a90774",
        badge: "Favorita"
    },
    {
        id: 3,
        name: "Hamburguesa BBQ",
        category: "hamburguesas",
        price: 99,
        desc: "Carne de res con salsa BBQ ahumada, aros de cebolla y queso cheddar.",
        img: "https://itm-void-excepcional.pages.dev/api/itm-project-assets?file=768b9e56-b2ae-4349-8ae2-8052bdaebe3c",
        badge: ""
    },
    {
        id: 4,
        name: "Ramen Tonkotsu",
        category: "ramen",
        price: 129,
        desc: "Caldo cremoso de cerdo, chashu, huevo marinado, nori y cebollín.",
        img: "https://itm-void-excepcional.pages.dev/api/itm-project-assets?file=d4fa7656-a1bd-4530-9f93-a86156cf93a4",
        badge: "Especial"
    },
    {
        id: 5,
        name: "Ramen Miso",
        category: "ramen",
        price: 119,
        desc: "Caldo de miso con tofu, maíz, espinaca y fideos frescos.",
        img: "https://itm-void-excepcional.pages.dev/api/itm-project-assets?file=5cd74183-efe2-4b7d-8821-36acb917a9cf",
        badge: ""
    },
    {
        id: 6,
        name: "Dopling",
        category: "postres",
        price: 59,
        desc: "Delicioso dopling relleno de chocolate, servido con helado de vainilla.",
        img: "https://itm-void-excepcional.pages.dev/api/itm-project-assets?file=06ef6e11-755e-4e61-81db-c425e8a2a4d3",
        badge: "Postre"
    },
    {
        id: 7,
        name: "Coca-Cola",
        category: "bebidas",
        price: 25,
        desc: "Refrescante Coca-Cola bien fría 350ml.",
        img: "https://itm-void-excepcional.pages.dev/api/itm-project-assets?file=e4d71e16-3a6b-48aa-92c0-0f3ed8f86aaa",
        badge: ""
    },
    {
        id: 8,
        name: "Jugo Natural",
        category: "bebidas",
        price: 35,
        desc: "Jugo fresco de temporada. Pregunta por sabores disponibles.",
        img: "https://itm-void-excepcional.pages.dev/api/itm-project-assets?file=9c82c287-52a7-4ee6-9f33-661c67609010",
        badge: ""
    }
];

let cart = [];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatPrice(n) {
    return "$" + n.toLocaleString("es-MX");
}

function renderProducts(filter = "todos") {
    const grid = $("#productsGrid");
    const items = filter === "todos"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === filter);

    grid.innerHTML = items.map(p => `
        <article class="product-card" data-category="${p.category}">
            <div class="product-img-wrap">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
            </div>
            <div class="product-info">
                <p class="product-category">${p.category}</p>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(p.price)}</span>
                    <button class="add-to-cart" data-id="${p.id}" aria-label="Agregar ${p.name}">+</button>
                </div>
            </div>
        </article>
    `).join("");

    $$(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
    });
}

function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(c => c.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(c => c.id !== productId);
    updateCartUI();
}

function changeQty(productId, delta) {
    const item = cart.find(c => c.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(productId);
        return;
    }

    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

    $("#cartCount").textContent = count;

    const itemsEl = $("#cartItems");
    const footerEl = $("#cartFooter");

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        footerEl.style.display = "none";
        return;
    }

    itemsEl.innerHTML = cart.map(c => `
        <div class="cart-item">
            <img class="cart-item-img" src="${c.img}" alt="${c.name}">
            <div class="cart-item-details">
                <p class="cart-item-name">${c.name}</p>
                <p class="cart-item-price">${formatPrice(c.price * c.qty)}</p>
            </div>
            <div class="cart-item-qty">
                <button onclick="changeQty(${c.id}, -1)">-</button>
                <span>${c.qty}</span>
                <button onclick="changeQty(${c.id}, 1)">+</button>
            </div>
        </div>
    `).join("");

    $("#cartTotal").textContent = formatPrice(total);
    footerEl.style.display = "block";

    $("#checkoutWhatsApp").addEventListener("click", (e) => {
        e.preventDefault();
        sendWhatsAppOrder();
    });
}

function sendWhatsAppOrder() {
    const phone = "523423432324";
    let msg = "Hola, quiero hacer un pedido:\n\n";

    cart.forEach(c => {
        msg += `${c.qty}x ${c.name} - ${formatPrice(c.price * c.qty)}\n`;
    });

    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
    msg += `\nTotal: ${formatPrice(total)}`;
    msg += "\n\nGracias!";

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
}

function openCart() {
    $("#cartSidebar").classList.add("open");
    $("#cartOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    $("#cartSidebar").classList.remove("open");
    $("#cartOverlay").classList.remove("open");
    document.body.style.overflow = "";
}

function init() {
    renderProducts();

    $$(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            $$(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderProducts(btn.dataset.category);
        });
    });

    $("#cartToggle")?.addEventListener("click", openCart);
    $$(".cart-toggle").forEach(btn => btn.addEventListener("click", openCart));
    $(".cart-close").addEventListener("click", closeCart);
    $("#cartOverlay").addEventListener("click", closeCart);

    const mobileToggle = $(".mobile-menu-toggle");
    const mainNav = $(".main-nav");
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open");
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
            });
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCart();
    });
}

document.addEventListener("DOMContentLoaded", init);