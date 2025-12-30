// assets/js/main.js
import { products } from "./data.js";

// State
let cart = JSON.parse(localStorage.getItem("velocity_cart")) || [];

// Selectors
const grid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartItems = document.getElementById("cart-items");
const categoryInputs = document.querySelectorAll('input[name="category"]');
const priceRange = document.getElementById("price-range");
const priceValue = document.getElementById("price-value");
const modalOverlay = document.getElementById("info-modal");
const modalContent = document.getElementById("modal-content");

// Init
function init() {
  renderProducts(products);
  updateCart();
  setupListeners();
}

function renderProducts(items) {
  grid.innerHTML = items
    .map(
      (item) => `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.name}" class="card-img">
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
}

function filterProducts() {
  const selectedCat = document.querySelector(
    'input[name="category"]:checked'
  ).value;
  const maxPrice = parseInt(priceRange.value);
  priceValue.innerText = `$${maxPrice}`;

  const filtered = products.filter((p) => {
    const catMatch = selectedCat === "all" || p.category === selectedCat;
    const priceMatch = p.price <= maxPrice;
    return catMatch && priceMatch;
  });
  renderProducts(filtered);
}

// --- Cart Logic (Attached to Window for HTML access) ---

window.addToCart = (id) => {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  updateCart();
  document.getElementById("cart-overlay").classList.add("open");
};

window.removeFromCart = (id) => {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
  updateCart();
};

function updateCart() {
  cartCount.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  cartTotal.innerText = `$${total.toFixed(2)}`;
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div style="flex:1">
                <div style="font-weight:600">${item.name}</div>
                <div style="font-size:0.9rem">$${item.price} x ${item.qty}</div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:white; cursor:pointer;">✕</button>
        </div>
    `
    )
    .join("");
}

function saveCart() {
  localStorage.setItem("velocity_cart", JSON.stringify(cart));
}

// --- Modal Logic ---

window.openModal = (type) => {
  modalOverlay.classList.add("open");
  if (type === "contact") {
    modalContent.innerHTML = `
            <h2>CONTACT US</h2>
            <p>For inquiries, support, or collaborations.</p>
            <span class="info-highlight">support@velocity.com</span>
            <span class="info-highlight">+1 (212) 555-0199</span>
            <p style="margin-top:2rem">104 Broadway, SoHo<br>New York, NY 10012</p>
        `;
  } else if (type === "about") {
    modalContent.innerHTML = `
            <h2>ABOUT VELOCITY</h2>
            <p>We are a curated archive of performance footwear and avant-garde aesthetics. Born in the digital void, Velocity bridges the gap between high-fashion minimalism and raw athletic function.</p>
            <p>Every piece is selected for its silhouette, story, and technical capability.</p>
            <span class="info-highlight">EST. 2024</span>
        `;
  }
};

window.closeModal = () => {
  modalOverlay.classList.remove("open");
};

// UI Helpers
window.toggleCart = () => {
  document.getElementById("cart-overlay").classList.toggle("open");
};
window.scrollToShop = () => {
  document
    .getElementById("shop-section")
    .scrollIntoView({ behavior: "smooth" });
};

function setupListeners() {
  categoryInputs.forEach((input) =>
    input.addEventListener("change", filterProducts)
  );
  priceRange.addEventListener("input", filterProducts);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) window.closeModal();
  });
}

// Start app
init();
