let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', function () {
    renderCollections();
    renderProducts();
    populateProductDropdown();
    setupEventListeners();
});

function renderCollections() {
    const collectionList = document.getElementById('collectionList');
    const collectionTitle = document.getElementById('categoryTitle'); // Fixed: was 'collectionTitle'
    const descElement = document.getElementById('collectionDescription');

    if (!collectionList) return;

    // Set initial description for "All Products"
    const allCollection = productsData.collections.find(c => c.id === 'all');
    if (descElement && allCollection && allCollection.description) {
        descElement.textContent = allCollection.description;
    }

    productsData.collections.forEach(collection => {
        const li = document.createElement('li');

        li.className = 'collection-item' +
            (collection.id === 'all' ? ' active' : '');

        li.innerHTML = `
      <span class="collection-icon">${collection.icon}</span>
      <span>${collection.name}</span>
    `;

        li.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.collection-item').forEach(item => {
                item.classList.remove('active');
            });

            // Add active to clicked
            li.classList.add('active');

            // Update title
            if (collectionTitle) {
                collectionTitle.textContent = collection.name;
            }

            // ✅ Update description
            if (descElement && collection.description) {
                descElement.textContent = collection.description;
            } else if (descElement) {
                descElement.textContent = '';
            }

            // Filter by category
            filterByCategory(collection.id, collection.name);
        });

        collectionList.appendChild(li);
    });
}

// Filter products by category
function filterByCategory(categoryId, categoryName) {
    currentCategory = categoryId;

    // Update active state
    document.querySelectorAll('.collection-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Update category title
    const collection = productsData.collections.find(c => c.id === categoryId);
    document.getElementById('categoryTitle').textContent = collection.name;

    // Render filtered products
    renderProducts();
}

// Render products grid
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    // Filter products
    const filteredProducts = currentCategory === 'all'
        ? productsData.products
        : productsData.products.filter(p => p.category === currentCategory);

    // Update count
    document.getElementById('productsCount').textContent = `${filteredProducts.length} Product${filteredProducts.length !== 1 ? 's' : ''}`;

    // Render each product
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Generate stars
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = product.description;
    const firstPara = tempDiv.querySelector("p");
    const shortDesc = firstPara
        ? firstPara.textContent.slice(0, 120) + "..."
        : product.description.replace(/<[^>]*>/g, "").slice(0, 120) + "...";

    card.innerHTML = `
        <a href="/product/${product.id}" class="product-card-link">
            <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${shortDesc}</p>
                <div class="product-rating">
                <span class="stars">${stars}</span>
                <span>${product.rating}</span>
                </div>
            </div>
        </a>
    `;
    return card;
}

function populateProductDropdown() {
    const select = document.getElementById('product');

    productsData.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.title;
        option.textContent = product.title;
        select.appendChild(option);
    });
}

function openQuoteModal(productName = '') {
    const modal = document.getElementById('quoteModal');
    modal.style.display = 'flex';

    if (productName) {
        document.getElementById('product').value = productName;
    }
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function setupEventListeners() {
    // Quote button in header
    document.getElementById('headerQuoteBtn').addEventListener('click', () => openQuoteModal());

    // Quote button in sidebar
    document.getElementById('sidebarQuoteBtn').addEventListener('click', () => openQuoteModal());

    // Contact link in nav
    document.querySelector('.contact-btn').addEventListener('click', (e) => {
        e.preventDefault();
        openContactModal();
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    document.getElementById('quoteForm').addEventListener('submit', handleQuoteSubmit);
}

