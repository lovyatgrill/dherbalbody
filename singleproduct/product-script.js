import { productsData, getProduct, formatPrice, generateStarRating } from '../js/data.js';
import cartService from '../js/cart-service.js';

// Get product ID from URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('product');
}

// Render product details dynamically
function renderProductPage(productId) {
    const product = getProduct(productId);
    if (!product) {
        document.body.innerHTML = '<h2 style="text-align:center;">Product not found.</h2>';
        return;
    }
    // Title, category, price, rating, review count
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-category-tag').textContent = product.category;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-price').textContent = formatPrice(product.price);
    document.querySelector('.rating-text').textContent = `${product.rating} (${product.reviewCount} reviews)`;
    // Main image
    document.getElementById('main-product-image').src = product.images[0];
    document.getElementById('main-product-image').alt = product.name;
    // Thumbnails
    const thumbGrid = document.getElementById('thumbnail-grid');
    thumbGrid.innerHTML = product.images.map((img, index) => 
        `<img src="${img}" 
             alt="${product.name}" 
             class="thumbnail${index === 0 ? ' active' : ''}" 
             data-index="${index}">`
    ).join('');

    // Add click handlers for thumbnails
    const thumbnails = thumbGrid.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update main image
            mainImage.src = thumb.src;
            mainImage.alt = thumb.alt;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // Features
    const featuresList = document.getElementById('product-features-list');
    featuresList.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');
    // Description
    document.getElementById('product-description-content').textContent = product.description;
    // Ingredients (if present)
    document.getElementById('product-ingredients-content').textContent = product.ingredients || 'See packaging for full list.';
    // Sizes
    const sizeSection = document.querySelector('.size-options');
    if (sizeSection && product.unitCount) {
        sizeSection.innerHTML = product.unitCount.map((size, i) => `<button class="size-option${i===0?' active':''}" data-size="${size}">${size}</button>`).join('');
    }
    // Stock
    document.getElementById('add-to-cart').disabled = !product.inStock;

    // Handle add to cart functionality
    const addToCartBtn = document.getElementById('add-to-cart');
    const quantityInput = document.querySelector('.quantity-input');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput?.value || '1');
            cartService.addItem(product, quantity);
            
            // Visual feedback
            const originalText = addToCartBtn.textContent;
            addToCartBtn.textContent = 'Added to Cart!';
            addToCartBtn.classList.add('added');
            
            setTimeout(() => {
                addToCartBtn.textContent = originalText;
                addToCartBtn.classList.remove('added');
            }, 2000);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromUrl();
    renderProductPage(productId);
});

// Related products data
const relatedProducts = [
    {
        id: 'daily-cleanser',
        name: 'Daily Gentle Cleanser',
        description: 'Gentle foaming cleanser',
        price: 35.00,
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="250" viewBox="0 0 200 250"%3E%3Crect width="200" height="250" fill="%23f8f4e6"/%3E%3Cellipse cx="100" cy="180" rx="40" ry="60" fill="%23d4941e"/%3E%3Ctext x="100" y="230" text-anchor="middle" font-family="Arial" font-size="10" fill="%23666"%3ECleanser%3C/text%3E%3C/svg%3E'
    },
    {
        id: 'vitamin-c-serum',
        name: 'Vitamin C Brightening Serum',
        description: 'Antioxidant protection serum',
        price: 55.00,
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="250" viewBox="0 0 200 250"%3E%3Crect width="200" height="250" fill="%23f8f4e6"/%3E%3Crect x="80" y="100" width="40" height="100" rx="20" fill="%23ff8c00"/%3E%3Ctext x="100" y="230" text-anchor="middle" font-family="Arial" font-size="10" fill="%23666"%3EVitamin C%3C/text%3E%3C/svg%3E'
    },
    {
        id: 'night-cream',
        name: 'Restorative Night Cream',
        description: 'Overnight repair treatment',
        price: 65.00,
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="250" viewBox="0 0 200 250"%3E%3Crect width="200" height="250" fill="%23f8f4e6"/%3E%3Ccircle cx="100" cy="150" r="50" fill="%234a4a4a"/%3E%3Ctext x="100" y="230" text-anchor="middle" font-family="Arial" font-size="10" fill="%23666"%3ENight Cream%3C/text%3E%3C/svg%3E'
    },
    {
        id: 'eye-cream',
        name: 'Revitalizing Eye Cream',
        description: 'Anti-aging eye treatment',
        price: 48.00,
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="250" viewBox="0 0 200 250"%3E%3Crect width="200" height="250" fill="%23f8f4e6"/%3E%3Cellipse cx="100" cy="150" rx="30" ry="40" fill="%23f4a460"/%3E%3Ctext x="100" y="230" text-anchor="middle" font-family="Arial" font-size="10" fill="%23666"%3EEye Cream%3C/text%3E%3C/svg%3E'
    }
];

// Customer reviews data
const customerReviews = [
    {
        id: 1,
        name: 'Sarah M.',
        rating: 5,
        date: '2 weeks ago',
        text: 'This sunscreen is amazing! It doesn\'t leave any white residue and feels so lightweight on my skin. I\'ve been using it daily for a month now and my skin feels protected and moisturized.',
        avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23e1bee7"/%3E%3Ctext x="25" y="30" text-anchor="middle" font-family="Arial" font-size="16" fill="%23fff"%3ES%3C/text%3E%3C/svg%3E'
    },
    {
        id: 2,
        name: 'Michael R.',
        rating: 4,
        date: '1 month ago',
        text: 'Great product for sensitive skin. I usually break out from sunscreens but this one has been perfect. The only minor issue is that it takes a moment to blend in completely.',
        avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%2381c784"/%3E%3Ctext x="25" y="30" text-anchor="middle" font-family="Arial" font-size="16" fill="%23fff"%3EM%3C/text%3E%3C/svg%3E'
    },
    {
        id: 3,
        name: 'Emma L.',
        rating: 5,
        date: '3 weeks ago',
        text: 'I love that this is reef-safe and still provides excellent protection. Perfect for my beach vacations and daily wear. The packaging is also very convenient.',
        avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23ffb74d"/%3E%3Ctext x="25" y="30" text-anchor="middle" font-family="Arial" font-size="16" fill="%23fff"%3EE%3C/text%3E%3C/svg%3E'
    }
];

// Global state
let currentProduct = 'sunscreen';
let selectedSize = '50ml';
let quantity = 1;
let cartItems = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const productId = getProductIdFromUrl();
    renderProductPage(productId);
    initializeEventListeners();
    loadRelatedProducts();
    loadCustomerReviews();
    updateCartDisplay();
});

// Load product data into the page
function loadProduct(productId) {
    const product = getProduct(productId);
    if (!product) return;

    // Update product information
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-category-tag').textContent = product.category;
    document.getElementById('product-price').textContent = formatPrice(product.price);
    
    // Update rating
    const ratingText = document.querySelector('.rating-text');
    ratingText.innerHTML = `${generateStarRating(product.rating)} (${product.reviewCount} reviews)`;
    
    // Update main image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Load image thumbnails
    loadImageThumbnails(product.images);
    
    // Load product features
    loadProductFeatures(product.features);
    
    // Load product description
    loadProductDescription(product.description, product.ingredients);
    
    // Update size options
    loadSizeOptions(product.sizes);
    
    currentProduct = productId;
}

// Load image thumbnails
function loadImageThumbnails(images) {
    const thumbnailGrid = document.getElementById('thumbnail-grid');
    thumbnailGrid.innerHTML = '';
    
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="Product view ${index + 1}">`;
        thumbnail.addEventListener('click', () => selectImage(image, thumbnail));
        thumbnailGrid.appendChild(thumbnail);
    });
}

// Select main image
function selectImage(imageSrc, thumbnailElement) {
    document.getElementById('main-product-image').src = imageSrc;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnailElement.classList.add('active');
}

// Load product features
function loadProductFeatures(features) {
    const featuresList = document.getElementById('product-features-list');
    featuresList.innerHTML = '';
    
    features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
}

// Load product description and ingredients
function loadProductDescription(description, ingredients) {
    document.getElementById('product-description-content').innerHTML = description;
    document.getElementById('product-ingredients-content').innerHTML = ingredients;
}

// Load size options
function loadSizeOptions(sizes) {
    const sizeOptions = document.querySelector('.size-options');
    sizeOptions.innerHTML = '';
    
    sizes.forEach((sizeOption, index) => {
        const button = document.createElement('button');
        button.className = `size-option ${index === 0 ? 'active' : ''}`;
        button.dataset.size = sizeOption.size;
        button.dataset.price = sizeOption.price;
        button.textContent = sizeOption.size;
        button.addEventListener('click', () => selectSize(sizeOption, button));
        sizeOptions.appendChild(button);
    });
}

// Select size
function selectSize(sizeOption, buttonElement) {
    selectedSize = sizeOption.size;
    
    // Update price
    document.getElementById('product-price').textContent = formatPrice(sizeOption.price);
    
    // Update active size button
    document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
}

// Load related products
function loadRelatedProducts() {
    const productsGrid = document.getElementById('related-products-grid');
    productsGrid.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-card-price">$${product.price.toFixed(2)}</div>
            </div>
        `;
        productCard.addEventListener('click', () => {
            // In a real application, this would navigate to the product page
            console.log(`Navigate to ${product.name}`);
        });
        productsGrid.appendChild(productCard);
    });
}

// Load customer reviews
function loadCustomerReviews() {
    const reviewCards = document.getElementById('review-cards');
    reviewCards.innerHTML = '';
    
    customerReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <img src="${review.avatar}" alt="${review.name}" class="reviewer-avatar">
                <div class="reviewer-info">
                    <h4>${review.name}</h4>
                    <div class="review-date">${review.date}</div>
                </div>
            </div>
            <div class="review-rating">
                ${generateStars(review.rating)}
            </div>
            <div class="review-text">${review.text}</div>
        `;
        reviewCards.appendChild(reviewCard);
    });
}

// Generate star rating HTML
function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`;
    }
    return starsHTML;
}

// Initialize event listeners
function initializeEventListeners() {
    // Quantity controls
    document.querySelector('.quantity-btn.minus').addEventListener('click', decreaseQuantity);
    document.querySelector('.quantity-btn.plus').addEventListener('click', increaseQuantity);
    document.getElementById('quantity').addEventListener('change', updateQuantity);
    
    // Add to cart button
    document.getElementById('add-to-cart').addEventListener('click', addToCart);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
    });
    
    // Wishlist button
    document.querySelector('.wishlist-btn').addEventListener('click', toggleWishlist);
}

// Quantity controls
function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantity').value = quantity;
    }
}

function increaseQuantity() {
    if (quantity < 10) {
        quantity++;
        document.getElementById('quantity').value = quantity;
    }
}

function updateQuantity(event) {
    const value = parseInt(event.target.value);
    if (value >= 1 && value <= 10) {
        quantity = value;
    } else {
        event.target.value = quantity;
    }
}

// Add to cart functionality
function addToCart() {
    const product = getProduct(currentProduct);
    const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
    
    const cartItem = {
        id: `${product.id}-${selectedSize}`,
        name: product.name,
        size: selectedSize,
        price: selectedSizeData.price,
        quantity: quantity,
        image: product.images[0]
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        cartItems.push(cartItem);
    }
    
    updateCartDisplay();
    showAddToCartFeedback();
}

// Update cart display
function updateCartDisplay() {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

// Show add to cart feedback
function showAddToCartFeedback() {
    const button = document.getElementById('add-to-cart');
    const originalText = button.textContent;
    
    button.textContent = 'Added to Cart!';
    button.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#333';
    }, 2000);
}

// Tab switching
function switchTab(tabId, buttonElement) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
    
    // Update active tab panel
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Wishlist functionality
function toggleWishlist() {
    const button = document.querySelector('.wishlist-btn');
    const isWishlisted = button.classList.contains('wishlisted');
    
    if (isWishlisted) {
        button.classList.remove('wishlisted');
        button.style.color = '#666';
        button.style.borderColor = '#ddd';
    } else {
        button.classList.add('wishlisted');
        button.style.color = '#ff6b35';
        button.style.borderColor = '#ff6b35';
    }
}

// Search functionality (placeholder)
document.querySelector('.search-btn').addEventListener('click', function() {
    console.log('Search functionality would be implemented here');
});

// Cart functionality (placeholder)
document.querySelector('.cart-btn').addEventListener('click', function() {
    console.log('Cart items:', cartItems);
    // In a real application, this would open the cart sidebar or navigate to cart page
});

// Product switching function (for dynamic loading)
function switchProduct(productId) {
    if (productsData[productId]) {
        loadProduct(productId);
        // Reset quantity and size selection
        quantity = 1;
        selectedSize = productsData[productId].sizes[0].size;
        document.getElementById('quantity').value = quantity;
    }
}

// Export functions for potential external use
window.productPageAPI = {
    switchProduct,
    addToCart,
    cartItems,
    currentProduct
};

