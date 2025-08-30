const API_URL = 'https://madarom-project-production.up.railway.app/api/products/details';
// const API_URL = 'https://madarom-project-production.up.railway.app/api/products';
const productContainer = document.getElementById('product-container');
const paginationContainer = document.getElementById('pagination');
const detailSection = document.getElementById('product-detail');

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const perPage = 6;
let activeSubCategoryId = null; 

function formatPrice(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(val);
}


document.addEventListener('DOMContentLoaded', fetchProducts);

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    allProducts = data;
    filteredProducts = allProducts;

    // console.log("all products: ", allProducts);
    // console.log("filtre: " , filteredProducts);
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
    <div 
      class="product-card bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 flex flex-col hover:scale-105" 
      data-aos="fade-right"
      style="height: 100%;"
    >
      <!-- Image Produit -->
      <div 
        class="h-60 bg-[#f5fefc] flex items-center justify-center cursor-pointer"
        onclick="showDetail(${product.id})"
      >
        <img 
          src="https://www.madarom.net/assets/${product.image_path ?? 'assets/img/p1.png'}" 
          alt="${product.name_en}" 
          class="h-full w-full object-cover transition-opacity duration-300 hover:opacity-90"
        >
      </div>

      <!-- Contenu Texte -->
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-lg text-gray-900 font-bold mb-1 tracking-tight">
          ${product.name_latin}
        </h3>
        <p class="text-sm text-gray-500 mb-4 leading-relaxed">
          ${product.name_en}
        </p>
        
        <!-- Prix -->
        <span class="text-base font-semibold text-red mb-4">
          ${formatPrice(product.active_price.amount)}
        </span>

        <!-- Bouton Panier -->
        <div class="mt-auto">
          <button 
            class="w-full btn-primary text-white font-medium py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-colors duration-200"
            onclick="addToCart(${product.id})"
          >
            <i class="fas fa-cart-plus text-lg"></i> Add to cart
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

window.showDetail = function(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  detailSection.classList.remove('hidden');
  detailSection.scrollIntoView({ behavior: 'smooth' });
  window.location.hash = '#detail';

  detailSection.innerHTML = `
    <div class="w-full bg-white py-12 px-6 sm:px-12 lg:px-20 rounded-3xl max-w-7xl mx-auto">
      <div class="flex flex-col-reverse lg:flex-row items-center gap-10">

        <!-- Texte -->
        <div class="w-full lg:w-1/2 text-center lg:text-left">
          <h1 class="text-3xl sm:text-4xl font-bold text-primary mb-2">${product.name_latin ?? '–'}</h1>
          <h2 class="text-xl text-gray-600 mb-4">${product.name_en}</h2>
          <p class="text-gray-700 text-base leading-relaxed mb-6">${product.description_en}</p>

          <!-- Prix -->
          <div class="flex flex-col w-full sm:w-auto sm:min-w-[120px] mb-10">
            <span class="text-sm text-gray-600 font-medium mb-1">Price/kg</span>
            <span class="text-xl font-bold text-red">
              ${formatPrice(product.active_price.amount)}
            </span>
          </div>

          <!-- Boutons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              class="btn-primary text-white font-medium px-6 py-2 rounded-full flex items-center justify-center gap-2 transition"
              onclick="addToCart(${product.id})">
              <i class="fas fa-cart-plus text-lg"></i> Add to cart
            </button>
            
            <button 
              class="btn-default px-6 py-2 rounded-full transition text-sm md:text-base"
              onclick="hideDetail()">
              Close
            </button>
          </div>
        </div>

        <!-- Image produit -->
        <div class="w-full lg:w-1/2">
          <div class="rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <img src="https://www.madarom.net/assets/${product.image_path ?? 'assets/img/p1.png'}" 
                alt="${product.name_en}" 
                class="w-full h-80 sm:h-96 object-cover transition-transform duration-500 hover:scale-105">
          </div>
        </div>

      </div>
    </div>

  `;
};

window.addToCart = function(productId) {

  sessionStorage.removeItem('cart');

  const token = sessionStorage.getItem('token');
  
  if (!token) {
    window.location.href = "/signin";
    return;
  }

  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  detailSection.classList.remove('hidden');
  detailSection.scrollIntoView({ behavior: 'smooth' });
  window.location.hash = '#detail';

  detailSection.innerHTML = `
    <div class="w-full bg-white py-12 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        
        <!-- Contenu texte -->
        <div class="w-full lg:w-1/2 text-center lg:text-left">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-primary mb-3">
            ${product.name_latin ?? '–'}
          </h1>
          <h2 class="text-lg sm:text-xl text-gray-600 mb-4 tracking-wide">
            ${product.name_en}
          </h2>
          <p class="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
            ${product.description_en}
          </p>

          <!-- Section prix + quantité -->
          <div class="w-full px-6 py-6 bg-gray-50 rounded-xl shadow-inner max-w-2xl mx-auto lg:mx-0 mb-6">
            <div class="flex flex-wrap justify-between items-center gap-6">
            
              <!-- Prix -->
              <div class="flex flex-col w-full sm:w-auto sm:min-w-[120px]">
                <span class="text-sm text-gray-600 font-medium mb-1">Price/kg</span>
                <span class="text-xl font-bold text-red">
                  ${formatPrice(product.active_price.amount)}
                </span>
              </div>

              <!-- Quantité -->
              <div class="flex flex-col w-full sm:w-auto sm:min-w-[180px]">
                <label for="quantity" class="text-sm text-gray-600 font-medium mb-1">Quantity (kg)</label>
                <div class="flex items-center gap-2">
                  <button onclick="changeQuantity(-1)" class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 font-bold text-lg text-gray-700">
                    −
                  </button>
                  <input id="quantity" type="number" value="1" min="1"
                    class="w-20 text-center border border-gray-300 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button onclick="changeQuantity(1)" class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 font-bold text-lg text-gray-700">
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-4">
            <button 
              class="w-full sm:w-auto btn-primary text-white font-semibold py-2 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200"
              onclick="handleAddToCart(${product.id})"
            >
              <i class="fas fa-cart-plus text-lg"></i> Add to cart
            </button>

            <button 
              class="btn-default px-6 py-2 rounded-full transition text-sm md:text-base"
              onclick="hideDetail()">
              Close
            </button>
          </div>
        </div>

        <!-- Image produit -->
        <div class="w-full lg:w-1/2">
          <div class="rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <img src="https://www.madarom.net/assets/${product.image_path ?? 'assets/img/p1.png'}" 
                alt="${product.name_en}" 
                class="w-full h-80 sm:h-96 object-cover transition-transform duration-500 hover:scale-105">
          </div>
        </div>
      </div>
    </div>

  `;

  updateCartCount();
};

window.changeQuantity = function(delta) {
  const input = document.getElementById('quantity');
  let value = parseInt(input.value) || 1;
  value = Math.max(1, value + delta);
  input.value = value;
};

window.hideDetail = function() {
  const detailSection = document.getElementById('product-detail');
  if (detailSection) {
    detailSection.classList.add('hidden');
    window.location.hash = '#products';
  }
};


async function addToCartStorage(product, quantity) {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = "/signin";
    return;
  }
  try {
    const response = await fetch('https://madarom-project-production.up.railway.app/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: quantity
      })
    });

    if (!response.ok) {
      // gérer erreur si besoin (ex: 401, 422, etc)
      const errorData = await response.json();
      console.error('Erreur API ajout panier:', errorData);
      alert('Erreur lors de l\'ajout au panier : ' + (errorData.message || 'Erreur inconnue'));
      return;
    }

    const data = await response.json();

    showNotification(`${product.name_latin} added to cart (${quantity} kg)`);
    hideDetail();
    updateCartCount();
  } catch (error) {
    console.error('Erreur réseau:', error);
    alert('Erreur réseau, veuillez réessayer plus tard.');
  }
}


window.handleAddToCart = function(productId) {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = "/signin";
    return;
  }
  const product = allProducts.find(p => p.id === productId);
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  addToCartStorage(product, quantity);
};

function showNotification(message) {
  const toast = document.getElementById('toast');
  const messageSpan = toast.querySelector('span'); // cible le span du message

  if (!messageSpan) return;

  messageSpan.textContent = message;

  toast.classList.remove('opacity-0', 'translate-y-10');
  toast.classList.add('opacity-100', 'translate-y-0');

  // Masquer après 3 secondes
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-10');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 5000);
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

function filterProducts() {
  const selectedCategoryIds = Array.from(
    document.querySelectorAll('input[data-type="category"]:checked')
  ).map(input => parseInt(input.value));

  filteredProducts = allProducts.filter(product => {
    const matchCategory =
      selectedCategoryIds.length === 0 || selectedCategoryIds.includes(product.category_id);
    const matchSubCategory =
      !activeSubCategoryId || product.subcategory_id === activeSubCategoryId;
    return matchCategory && matchSubCategory;
  });

  currentPage = 1;
  renderProducts();
  renderPagination();
}

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

export async function updateCartCount() {
  const desktopCount = document.getElementById("cart-count");
  const mobileCount = document.getElementById("cart-count-mobile");
  if (!desktopCount && !mobileCount) return;

  const token = sessionStorage.getItem("token");
  if (!token) {
    // Pas de token = panier vide ou pas connecté
    if (desktopCount) desktopCount.textContent = '0';
    if (mobileCount) mobileCount.textContent = '0';
    return;
  }

  try {
    const response = await fetch('https://madarom-project-production.up.railway.app/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error('Erreur API récupération panier:', response.status);
      if (desktopCount) desktopCount.textContent = '0';
      if (mobileCount) mobileCount.textContent = '0';
      return;
    }

    const cartItems = await response.json();

    // Supposons que cartItems est un tableau des produits dans le panier
    const count = cartItems.length;

    if (desktopCount) desktopCount.textContent = count;
    if (mobileCount) mobileCount.textContent = count;

  } catch (error) {
    console.error('Erreur réseau récupération panier:', error);
    if (desktopCount) desktopCount.textContent = '0';
    if (mobileCount) mobileCount.textContent = '0';
  }
}

// Appel initial
updateCartCount();


window.addEventListener("storage", updateCartCount);


export async function loadCategoriesToMenu() {
  const dropdown = document.getElementById("products-dropdown");

  try {
    const res = await fetch("https://madarom-project-production.up.railway.app/api/categories");
    const categories = await res.json();

    categories.forEach(category => {
      const a = document.createElement("a");
      a.href = "#products"; // redirige vers la section produit
      a.textContent = category.name;
      a.className = "block px-4 py-2 hover:bg-gray-100 text-black";
      a.setAttribute("data-category-id", category.id);

      // Ajoute l'écouteur de clic
      a.addEventListener("click", (e) => {
        e.preventDefault(); // évite la redirection immédiate

        applyCategoryFilter(parseInt(category.id)); // filtre par catégorie
        document.querySelector("#products").scrollIntoView({ behavior: "smooth" }); // scroll vers la section
      });

      dropdown.appendChild(a);
    });

  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  }
}

function applyCategoryFilter(categoryId) {
  // Décoche toutes les checkbox
  document.querySelectorAll('input[data-type="category"]').forEach(input => {
    input.checked = parseInt(input.value) === categoryId;
  });

  // Réinitialise la sous-catégorie active
  activeSubCategoryId = null;

  // Applique le filtre
  filteredProducts = allProducts.filter(p => p.category_id === categoryId);

  currentPage = 1;
  renderProducts();
  renderPagination();
}



