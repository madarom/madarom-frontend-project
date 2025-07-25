const API_URL = 'https://madarom-project-production.up.railway.app/api/products';
const productContainer = document.getElementById('product-container');
const paginationContainer = document.getElementById('pagination');
const detailSection = document.getElementById('product-detail');

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const perPage = 6;
let activeSubCategoryId = null; 

document.addEventListener('DOMContentLoaded', fetchProducts);

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    allProducts = data;
    filteredProducts = allProducts;
    renderProducts();
    renderPagination();
  } catch (error) {
    console.error('Erreur API :', error);
  }
}

function renderProducts() {
  const start = (currentPage - 1) * perPage;
  const paginated = filteredProducts.slice(start, start + perPage);

  productContainer.innerHTML = paginated.map(product => `
    <div class="product-card bg-white rounded-xl overflow-hidden shadow-md transition duration-300 cursor-pointer flex flex-col" data-aos="fade-right" style="height: 100%;">
      <div class="h-48 bg-[#fcffff] flex items-center justify-center">
        <img src="https://www.madarom.net/${product.image_path ?? 'assets/img/p1.png'}" alt="${product.name_en}" class="h-full w-full object-cover">
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="text-xl font-semibold mb-2">${product.name_latin}</h3>
        <p class="text-gray-600 mb-4 flex-grow">${product.name_en}</p>
        <span class="text-sm font-bold text-teal mb-3">${product.price} €</span>

        <div class="flex justify-between items-center w-full mt-auto">
          <!-- Icône panier à gauche -->
          <button class="text-teal" onclick="addtoCart(${product.id})">
            <i class="fas fa-cart-plus text-2xl"></i>
          </button>
          
          <!-- Bouton View Details à droite -->
          <button class="btn-primary text-white px-5 py-1 text-sm" onclick="showDetail(${product.id})">
            View Details
          </button>
        </div>
      
      </div> 
    </div>
  `).join('');
}


function renderPagination() {
  const pageCount = Math.ceil(filteredProducts.length / perPage);
  paginationContainer.innerHTML = '';

  const nav = document.createElement('nav');
  nav.className = 'flex items-center space-x-2';

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '&laquo;';
  prevBtn.className = 'px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      renderPagination();
    }
  });
  nav.appendChild(prevBtn);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `px-4 py-1 rounded-full border ${
      i === currentPage
        ? 'bg-teal text-white'
        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
    }`;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderProducts();
      renderPagination();
    });
    nav.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '&raquo;';
  nextBtn.className = 'px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100';
  nextBtn.disabled = currentPage === pageCount;
  nextBtn.addEventListener('click', () => {
    if (currentPage < pageCount) {
      currentPage++;
      renderProducts();
      renderPagination();
    }
  });
  nav.appendChild(nextBtn);

  const wrapper = document.createElement('div');
  wrapper.className = 'mt-12 flex justify-center';
  wrapper.appendChild(nav);
  paginationContainer.appendChild(wrapper);
}

function showDetail(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  detailSection.classList.remove('hidden');
  detailSection.scrollIntoView({ behavior: 'smooth' });

  detailSection.innerHTML = `
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-12 items-center">
        <div class="w-full lg:w-1/2">
          <div class="bg-gray-100 rounded-xl overflow-hidden h-96 flex items-center justify-center">
            <img src="https://www.madarom.net/${product.image_path ?? 'assets/img/p1.png'}" alt="${product.name_en}" class="h-full w-full object-cover">
          </div>
        </div>
        <div class="w-full lg:w-1/2">
        <p class="text-4xl font-bold mb-4">${product.name_latin ?? '–'}</p>
          <h2 class="text-2xl font-bold mb-4 text-gray-600">${product.name_en}</h2>
          <p class="text-gray-700 mb-4">${product.description_en}</p>
          <p class="text-gray-600 mb-4">Catégory : ${product.category?.name ?? '–'}</p>
          <button class="mt-6 btn-primary text-white px-6 py-2 rounded-full" onclick="hideDetail()">Fermer</button>
        </div>
      </div>
    </div>
  `;
}

function addtoCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  detailSection.classList.remove('hidden');
  detailSection.scrollIntoView({ behavior: 'smooth' });

  detailSection.innerHTML = `
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-12 items-center">
        <div class="w-full lg:w-1/2">
          <div class="bg-gray-100 rounded-xl overflow-hidden h-96 flex items-center justify-center">
            <img src="https://www.madarom.net/${product.image_path ?? 'assets/img/p1.png'}" alt="${product.name_en}" class="h-full w-full object-cover">
          </div>
        </div>
        <div class="w-full lg:w-1/2">
          <p class="text-4xl font-bold mb-4">${product.name_latin ?? '–'}</p>
          <h2 class="text-2xl font-bold mb-4 text-gray-600">${product.name_en}</h2>
          <p class="text-gray-700 mb-4">${product.description_en}</p>
          <p class="text-gray-600 mb-4">Catégory : ${product.category?.name ?? '–'}</p>
          <p class="text-gray-600 mb-4">Price : ${product.price}</p>

          <div class="mb-6">
            <label for="quantity" class="block mb-2 font-semibold text-gray-700">Quantity (kg)</label>
            <div class="flex items-center gap-4">
              <button onclick="changeQuantity(-1)" class="text-lg font-bold px-3 py-1 bg-gray-200 rounded">−</button>
              <input type="number" id="quantity" min="1" value="1" class="w-20 text-center border border-gray-300 rounded py-1">
              <button onclick="changeQuantity(1)" class="text-lg font-bold px-3 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>

          <button class="mt-6 btn-primary text-white px-6 py-2 rounded-full" onclick="handleAddToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

// Fonction globale pour modifier la quantité
function changeQuantity(delta) {
  const input = document.getElementById('quantity');
  let value = parseInt(input.value) || 1;
  value = Math.max(1, value + delta);
  input.value = value;
}


function hideDetail() {
  detailSection.classList.add('hidden');
}

function addToCartStorage(product, quantity) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showNotification(`${product.name_en} added to cart (${quantity} kg)`);
  hideDetail();
}

// function showNotification(message) {
//   const toast = document.getElementById('toast');
//   toast.textContent = message;
//   toast.classList.remove('opacity-0');

//   setTimeout(() => {
//     toast.classList.add('opacity-0');
//   }, 2500);
// }

function showNotification(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-10');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-10');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 3000); // disparaît après 3s
}


function handleAddToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  addToCartStorage(product, quantity);
}

async function loadCategories() {
  const container = document.getElementById("category-container");

  try {
    const res = await fetch("https://madarom-project-production.up.railway.app/api/categories");
    const categories = await res.json();

    categories.forEach(category => {
      const label = document.createElement("label");
      label.className = "flex items-center space-x-3 cursor-pointer";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "form-checkbox h-5 w-5 text-teal rounded border-gray-300";
      input.value = category.id;
      input.setAttribute("data-type", "category");

      input.addEventListener("change", () => {
        filterProducts();
      });

      const span = document.createElement("span");
      span.textContent = category.name;

      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégorys:", error);
  }
}

async function loadSubCategories() {
  const container = document.getElementById("subcategory-container");

  try {
    const res = await fetch("https://madarom-project-production.up.railway.app/api/subcategories");
    const subcategories = await res.json();

    subcategories.forEach(sub => {
      const div = document.createElement("div");
      div.className = "filter-item p-2 rounded cursor-pointer";
      div.textContent = sub.name;
      div.setAttribute("data-id", sub.id);
      div.setAttribute("data-type", "subcategory");

      div.addEventListener("click", () => {
        // toggle l'activation si déjà cliqué
        if (activeSubCategoryId === sub.id) {
          activeSubCategoryId = null;
        } else {
          activeSubCategoryId = sub.id;
        }
        filterProducts();
        highlightSelectedSubcategory();
      });

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des sous-catégorys :", error);
  }
}

// Fonction de filtrage
function filterProducts() {
  const selectedCategoryIds = Array.from(
    document.querySelectorAll('input[data-type="category"]:checked')
  ).map(input => parseInt(input.value));

  filteredProducts = allProducts.filter(product => {
    const matchCategory =
      selectedCategoryIds.length === 0 || selectedCategoryIds.includes(product.category_id);
    const matchSubCategory =
      !activeSubCategoryId || product.sub_category_id === activeSubCategoryId;
    return matchCategory && matchSubCategory;
  });

  currentPage = 1;
  renderProducts();
  renderPagination();
}

// Visuel sélection sous-catégory
function highlightSelectedSubcategory() {
  document.querySelectorAll('[data-type="subcategory"]').forEach(el => {
    const id = parseInt(el.getAttribute("data-id"));
    if (id === activeSubCategoryId) {
      el.classList.add("bg-teal", "text-white");
    } else {
      el.classList.remove("bg-teal", "text-white");
    }
  });
}

// Charger les filtres
loadCategories();
loadSubCategories();

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.length;
  document.getElementById("cart-count").textContent = cartCount;
}

updateCartCount();

window.addEventListener("storage", updateCartCount);