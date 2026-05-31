// ✅ FIXED: Get similar products matching YOUR actual data structure
function getSimilarProducts(currentProduct) {
    // Your data uses 'category' not 'collection'
    const category = currentProduct.category;

    if (!category) return [];

    // Filter products from the same category, excluding current product
    const similar = productsData.products.filter(
        (product) => product.category === category && product.id !== currentProduct.id
    );

    // Return up to 4 similar products
    return similar.slice(0, 4);
}

function renderSimilarProducts(currentProduct) {
    const similarProducts = getSimilarProducts(currentProduct);
    const grid = document.getElementById('similarProductsGrid');

    if (!grid) {
        console.error('Similar products grid not found! Make sure you have: <div id="similarProductsGrid"></div>');
        return;
    }

    grid.innerHTML = '';

    if (similarProducts.length === 0) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#666;">No similar products available in this category.</p>';
        return;
    }

    similarProducts.forEach((product) => {
        const card = document.createElement('a');
        card.className = 'similar-product-card';
        // Use product.id for the link (matches your existing pattern)
        card.href = `/product/${product.id}`;

        card.innerHTML = `
      <img 
        src="${product.image || 'assets/images/placeholder.jpg'}" 
        alt="${product.title}" 
        class="similar-product-image"
        loading="lazy"
      />
      <div class="similar-product-info">
        <h3>${product.title}</h3>
        <p>${product.description ? product.description.replace(/<[^>]*>/g, '').slice(0, 80) + '...' : ''}</p>
        ${product.price ? `<div class="similar-product-price">₦${product.price.toLocaleString()}</div>` : ''}
       
        <div class="similar-product-btn">View Product</div>
      </div>
    `;

        grid.appendChild(card);
    });
}

// Get current product ID from URL
// NEW
function getCurrentProductId() {
    const pathMatch = window.location.pathname.match(/\/product\/(.+)/);
    if (pathMatch) return pathMatch[1];
    return new URLSearchParams(window.location.search).get('id');
}

// ✅ FIXED: Initialize similar products on product-detail page
function initSimilarProducts() {
    const currentProductId = getCurrentProductId();

    if (!currentProductId) {
        console.log('No product ID in URL - not rendering similar products');
        return;
    }

    // Find current product from productsData.products (not collections)
    const currentProduct = productsData.products.find(p => p.id === currentProductId);

    if (!currentProduct) {
        console.error('Product not found for ID:', currentProductId);
        return;
    }

    // Render similar products
    renderSimilarProducts(currentProduct);
}

// ✅ Add this to your DOMContentLoaded on product-detail page
document.addEventListener('DOMContentLoaded', () => {
    // Only run on product detail page (check if similarProductsGrid exists)
    if (document.getElementById('similarProductsGrid')) {
        initSimilarProducts();
    }
});