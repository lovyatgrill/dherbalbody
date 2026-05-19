import { productsData, getProduct, formatPrice, generateStarRating, realProductImages } from '../js/data.js';

// Enhanced collection page JavaScript with improved functionality
// Matching the Fabish UI design perfectly

// Real product images from Shopify


// Enhanced product data matching the UI design
const faceCreamProducts = Object.values(productsData);

// Global state
let currentProducts = [...faceCreamProducts];
let currentSort = 'best-selling';
let currentFilters = {
    availability: [],
    skinType: [],
    unitCount: []
};
let currentView = 'grid-3';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeAnnouncementSlider();
    initializeEventListeners();
    renderProducts();
    renderSidebarProducts();
    initializeBackToTop();
    updateCartDisplay();
});

// Announcement slider
function initializeAnnouncementSlider() {
    const items = document.querySelectorAll('.announcement-item');
    let currentIndex = 0;

    setInterval(() => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
    }, 4000);
}

// Initialize event listeners
function initializeEventListeners() {
    initializeFilterListeners();
    initializeSortListeners();
    initializeViewListeners();
    initializeModalListeners();
    initializeNewsletterForm();
    initializeSearch();
    initializeMobileFilters();
}

// Filter listeners
function initializeFilterListeners() {
    // Availability filters
    const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]');
    availabilityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleAvailabilityFilter);
    });
    
    // Skin type filters
    const skinTypeCheckboxes = document.querySelectorAll('input[name="skin-type"]');
    skinTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleSkinTypeFilter);
    });
    
    // Unit count filters
    const unitCountCheckboxes = document.querySelectorAll('input[name="unit-count"]');
    unitCountCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleUnitCountFilter);
    });
}

// Handle availability filter
function handleAvailabilityFilter(event) {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
        currentFilters.availability.push(value);
    } else {
        currentFilters.availability = currentFilters.availability.filter(item => item !== value);
    }
    
    applyFilters();
}

// Handle skin type filter
function handleSkinTypeFilter(event) {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
        currentFilters.skinType.push(value);
    } else {
        currentFilters.skinType = currentFilters.skinType.filter(item => item !== value);
    }
    
    applyFilters();
}

// Handle unit count filter
function handleUnitCountFilter(event) {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
        currentFilters.unitCount.push(value);
    } else {
        currentFilters.unitCount = currentFilters.unitCount.filter(item => item !== value);
    }
    
    applyFilters();
}

// Sort listeners
function initializeSortListeners() {
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', handleSort);
    });
}

// Handle sort
function handleSort(event) {
    const sortValue = event.target.dataset.sort;
    currentSort = sortValue;
    
    // Update active sort option
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update sort summary
    const sortSummary = document.querySelector('.sort-summary span');
    sortSummary.textContent = event.target.textContent.toUpperCase();
    
    // Close dropdown
    const sortDetails = document.querySelector('.sort-details');
    sortDetails.removeAttribute('open');
    
    applySort();
}

// View listeners
function initializeViewListeners() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', handleViewChange);
    });
}

// Handle view change
function handleViewChange(event) {
    const viewType = event.target.closest('.view-btn').dataset.view;
    currentView = viewType;
    
    // Update active view button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-btn').classList.add('active');
    
    updateGridLayout();
}

// Update grid layout
function updateGridLayout() {
    const grid = document.getElementById('products-grid');
    
    // Remove existing view classes
    grid.classList.remove('view-grid-1', 'view-grid-2', 'view-grid-3');
    
    // Add new view class
    grid.classList.add(`view-${currentView}`);
}

// Apply filters
function applyFilters() {
    let filteredProducts = [...faceCreamProducts];
    
    // Apply availability filter
    if (currentFilters.availability.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            if (currentFilters.availability.includes('in-stock') && product.inStock) {
                return true;
            }
            if (currentFilters.availability.includes('out-of-stock') && !product.inStock) {
                return true;
            }
            return false;
        });
    }
    
    // Apply skin type filter
    if (currentFilters.skinType.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return currentFilters.skinType.some(type => 
                product.skinType.includes(type) || product.skinType.includes('all')
            );
        });
    }
    
    // Apply unit count filter
    if (currentFilters.unitCount.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return currentFilters.unitCount.some(count => 
                product.unitCount.includes(count)
            );
        });
    }
    
    currentProducts = filteredProducts;
    applySort();
    updateResultsCount();
}

// Apply sort
function applySort() {
    switch(currentSort) {
        case 'best-selling':
            currentProducts.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        case 'featured':
            currentProducts.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
            break;
        case 'alphabetical-az':
            currentProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'alphabetical-za':
            currentProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-low-high':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high-low':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'date-old-new':
            currentProducts.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0));
            break;
        case 'date-new-old':
            currentProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
    }
    
    renderProducts();
}

// Update results count
function updateResultsCount() {
    const resultsInfo = document.querySelector('.results-info span');
    const total = currentProducts.length;
    resultsInfo.textContent = `Showing 1-${total} of ${total} Results`;
}

// Render products
function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    currentProducts.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
    
    updateResultsCount();
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('product-card');
    card.setAttribute('product-data', JSON.stringify(product));
    return card;
}

// Original card template for reference
function createLegacyProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    card.innerHTML = `
        <a href="../singleproduct/single-product.html?product=${product.id}" class="product-link" style="text-decoration:none;color:inherit;">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                <div class="product-badges">
                    ${product.onSale ? '<span class="product-badge badge-sale">Sale</span>' : ''}
                    ${product.isNew ? '<span class="product-badge badge-new">New</span>' : ''}
                    ${!product.inStock ? '<span class="product-badge badge-out-of-stock">Out of Stock</span>' : ''}
                </div>
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" onclick="toggleWishlist('${product.id}');event.preventDefault();" title="Add to Wishlist">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14.25 2.1a4.25 4.25 0 0 0-6.02 0L8 2.33l-.23-.23a4.25 4.25 0 0 0-6.02 6.02L8 14.37l6.25-6.25a4.25 4.25 0 0 0 0-6.02z" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                    </button>
                    <button class="action-btn quick-view-btn" onclick="openQuickView('${product.id}');event.preventDefault();" title="Quick View">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${generateStarRating(product.rating)}</div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                    ${product.originalPrice && product.originalPrice > product.price ? `<span class="discount-percentage">-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>` : ''}
                </div>
                <div class="product-variants">
                    ${product.variants.map(color => `<div class="variant-option" style="background-color: ${color};" data-color="${color}"></div>`).join('')}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}');event.preventDefault();" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </a>
    `;
    return card;
}

// Render sidebar products
function renderSidebarProducts() {
    renderBestSellerProduct();
    renderNewArrivalsProducts();
}

// Render best seller product
function renderBestSellerProduct() {
    const bestSeller = faceCreamProducts.find(product => product.isBestSeller) || faceCreamProducts[0];
    const container = document.getElementById('best-seller-product');
    
    container.innerHTML = `
        <a href="../singleproduct/single-product.html?product=${bestSeller.id}" class="sidebar-product-link">
            <div class="sidebar-product-image">
                <img src="${bestSeller.images[0]}" alt="${bestSeller.name}" loading="lazy">
            </div>
            <div class="sidebar-product-info">
                <h4 class="sidebar-product-name">${bestSeller.name}</h4>
                <p class="sidebar-product-price">${formatPrice(bestSeller.price)}</p>
            </div>
        </a>
    `;
}

// Render new arrivals products
function renderNewArrivalsProducts() {
    const newArrivals = faceCreamProducts.filter(product => product.isNew).slice(0, 3);
    const container = document.getElementById('new-arrivals-products');
    
    container.innerHTML = newArrivals.map(product => `
        <a href="../singleproduct/single-product.html?product=${product.id}" class="sidebar-product-item">
            <div class="sidebar-product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
            </div>
            <div class="sidebar-product-info">
                <h4 class="sidebar-product-name">${product.name}</h4>
                <p class="sidebar-product-price">${formatPrice(product.price)}</p>
            </div>
        </a>
    `).join('');
}

// Modal listeners
function initializeModalListeners() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Newsletter form
function initializeNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = form.querySelector('.newsletter-input').value;
            if (email) {
                alert('Thank you for subscribing!');
                form.reset();
            }
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = prompt('Enter search term:');
            if (query) {
                searchProducts(query);
            }
        });
    }
}

// Search products
function searchProducts(query) {
    const filteredProducts = faceCreamProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    currentProducts = filteredProducts;
    renderProducts();
    updateResultsCount();
}

// Back to top functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Cart functionality
function addToCart(productId) {
    const product = faceCreamProducts.find(p => p.id === productId);
    if (product && product.inStock) {
        // Simulate adding to cart
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        
        // Show success message
        showNotification(`${product.name} added to cart!`);
    }
}

// Update cart display
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// Wishlist functionality
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const product = faceCreamProducts.find(p => p.id === productId);
    
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showNotification(`${product.name} removed from wishlist!`);
    } else {
        wishlist.push(productId);
        showNotification(`${product.name} added to wishlist!`);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay();
}

// Update wishlist display
function updateWishlistDisplay() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistCountElement = document.querySelector('.wishlist-count');
    
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;
        wishlistCountElement.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// Quick view functionality
function openQuickView(productId) {
    const product = faceCreamProducts.find(p => p.id === productId);
    if (product) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = createQuickViewContent(product);
        
        const modalOverlay = document.getElementById('modal-overlay');
        modalOverlay.classList.add('active');
    }
}

// Create quick view content
function createQuickViewContent(product) {
    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="quick-view-content">
            <div class="quick-view-image">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="quick-view-info">
                <h2>${product.name}</h2>
                <p class="brand">${product.brand}</p>
                <div class="price">
                    <span class="current-price">Rs. ${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">Rs. ${product.originalPrice.toFixed(2)}</span>` : ''}
                    ${discountPercentage > 0 ? `<span class="discount">-${discountPercentage}%</span>` : ''}
                </div>
                <div class="rating">
                    <span>Rating: ${product.rating}/5 (${product.reviewCount} reviews)</span>
                </div>
                <div class="features">
                    <h4>Features:</h4>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="variants">
                    <h4>Available Colors:</h4>
                    <div class="color-options">
                        ${product.variants.map(color => `<div class="color-option" style="background-color: ${color};"></div>`).join('')}
                    </div>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}'); closeModal();" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
}

// Close modal
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.classList.remove('active');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2D5016;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mobile Filter Handling
function initializeMobileFilters() {
    const showFiltersBtn = document.getElementById('showFilters');
    const closeFiltersBtn = document.getElementById('closeFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const filterPanel = document.getElementById('mobileFilterPanel');
    
    // Show filter panel
    showFiltersBtn?.addEventListener('click', () => {
        filterPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close filter panel
    closeFiltersBtn?.addEventListener('click', () => {
        filterPanel.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Apply filters and close panel
    applyFiltersBtn?.addEventListener('click', () => {
        applyMobileFilters();
        filterPanel.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Initialize mobile filter content
    renderMobileFilterContent();
}

function renderMobileFilterContent() {
    const filterContent = document.querySelector('.mobile-filter-content');
    if (!filterContent) return;

    // Simplified filter options
    const filterOptions = {
        'Sort By': ['Best Selling', 'Price: Low to High', 'Price: High to Low', 'Newest'],
        'Availability': ['In Stock', 'Out of Stock'],
        'Skin Type': ['Fair', 'Light', 'Medium', 'Dark']
    };

    filterContent.innerHTML = Object.entries(filterOptions)
        .map(([category, options]) => `
            <div class="mobile-filter-section">
                <h4>${category}</h4>
                <div class="mobile-filter-options">
                    ${options.map(option => `
                        <label class="mobile-filter-option">
                            <input type="checkbox" value="${option.toLowerCase().replace(/\s+/g, '-')}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');
}

function applyMobileFilters() {
    // Get selected filter values
    const selectedFilters = Array.from(document.querySelectorAll('.mobile-filter-option input:checked'))
        .map(input => input.value);
    
    // Update active filters display
    updateActiveFilters(selectedFilters);
    
    // Apply filters to products
    filterProducts(selectedFilters);
}

function updateActiveFilters(filters) {
    const activeFiltersContainer = document.querySelector('.active-filters');
    if (!activeFiltersContainer) return;

    activeFiltersContainer.innerHTML = filters.map(filter => `
        <span class="active-filter">
            ${filter.replace(/-/g, ' ')}
            <button onclick="removeFilter('${filter}')">×</button>
        </span>
    `).join('');
}

// Initialize wishlist display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateWishlistDisplay();
});

