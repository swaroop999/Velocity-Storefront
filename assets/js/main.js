import { products } from "./data.js";

let cart = JSON.parse(localStorage.getItem("velocity_cart")) || [];

// DOM Cache
const grid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartList = document.getElementById("cart-items");
const filters = document.querySelectorAll('input[name="category"]');
const range = document.getElementById("price-range");
const priceLabel = document.getElementById("price-value");
const modal = document.getElementById("info-modal");
const modalBody = document.getElementById("modal-content");

const render = (list) => {
  if (!grid) return;

  grid.innerHTML = list
    .map(
      (item) => `
    <div class="card">
        <div class="card-img-wrapper">
            <img src="${item.image}" alt="${item.name}" class="card-img" loading="lazy">
        </div>
        <div class="card-info">
            <div class="card-title">${item.name}</div>
            <div class="card-price">$${item.price}</div>
        </div>
        <button class="btn-add" onclick="addToCart(${item.id})">ADD</button>
    </div>
  `
    )
    .join("");
};

const applyFilters = () => {
  const cat = document.querySelector('input[name="category"]:checked').value;
  const max = parseInt(range.value);

  priceLabel.innerText = `$${max}`;

  const res = products.filter((p) => {
    const matchesCat = cat === "all" || p.category === cat;
    return matchesCat && p.price <= max;
  });
  render(res);
};

const updateCartUI = () => {
  cartCount.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  cartTotal.innerText = `$${total.toFixed(2)}`;

  cartList.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div style="flex:1">
                <div style="font-weight:600">${item.name}</div>
                <div style="font-size:0.9rem">$${item.price} x ${item.qty}</div>
            </div>
            <button onclick="removeItem(${item.id})" style="background:none; border:none; color:white; cursor:pointer;">✕</button>
        </div>
    `
    )
    .join("");

  localStorage.setItem("velocity_cart", JSON.stringify(cart));
};

// Global handlers for HTML access
window.addToCart = (id) => {
  // console.log('add', id);
  const item = products.find((p) => p.id === id);
  const existing = cart.find((c) => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  document.getElementById("cart-overlay").classList.add("open");
};

window.removeItem = (id) => {
  cart = cart.filter((c) => c.id !== id);
  updateCartUI();
};

window.openModal = (type) => {
  modal.classList.add("open");

  // Simple content switch
  const content =
    type === "contact"
      ? `<h2>CONTACT</h2><p>support@velocity.com<br>+1 (212) 555-0199</p><p style="margin-top:1rem">104 Broadway, NY</p>`
      : `<h2>ABOUT</h2><p>Velocity bridges the gap between high-fashion minimalism and raw athletic function.</p><span class="info-highlight">EST. 2024</span>`;

  modalBody.innerHTML = content;
};

window.closeModal = () => {
  modal.classList.remove("open");
};

window.toggleCart = () => {
  document.getElementById("cart-overlay").classList.toggle("open");
};

window.scrollToShop = () => {
  document
    .getElementById("shop-section")
    .scrollIntoView({ behavior: "smooth" });
};

// Init
(() => {
  render(products);
  updateCartUI();

  filters.forEach((f) => f.addEventListener("change", applyFilters));
  range.addEventListener("input", applyFilters);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) window.closeModal();
  });
})();
