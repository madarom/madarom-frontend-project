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
    <div class="product-card bg-white rounded-xl overflow-hidden shadow-md transition duration-300 cursor-pointer" onclick="showDetail(${product.id})" data-aos="fade-right">
      <div class="h-48 bg-[#fcffff] flex items-center justify-center">
        <img src="https://www.madarom.net/${product.image_path ?? 'assets/img/p1.png'}" alt="${product.image_path}" class="h-full w-full object-cover">
      </div>
      <div class="p-5">
        <h3 class="text-xl font-semibold mb-2">${product.name_latin}</h3>
        <p class="text-gray-600 mb-4">${product.name_fr?.slice(0, 60)}</p>
        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold text-teal">–</span>
          <button class="btn-primary text-white px-4 py-2 text-sm">View Details</button>
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
            <img src="https://www.madarom.net/${product.image_path ?? 'assets/img/p1.png'}" alt="${product.image_path}" class="h-full w-full object-cover">
          </div>
        </div>
        <div class="w-full lg:w-1/2">
        <p class="text-4xl font-bold mb-4">${product.name_latin ?? '–'}</p>
          <h2 class="text-2xl font-bold mb-4 text-gray-600">${product.name_fr}</h2>
          <p class="text-gray-700 mb-4">${product.description_fr}</p>
          <p class="text-gray-600 mb-4">Catégorie : ${product.category?.name ?? '–'}</p>
          <button class="mt-6 btn-primary text-white px-6 py-2 rounded-full" onclick="hideDetail()">Fermer</button>
        </div>
      </div>
    </div>
  `;
}

function hideDetail() {
  detailSection.classList.add('hidden');
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
    console.error("Erreur lors du chargement des catégories:", error);
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
    console.error("Erreur lors du chargement des sous-catégories :", error);
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

// Visuel sélection sous-catégorie
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
