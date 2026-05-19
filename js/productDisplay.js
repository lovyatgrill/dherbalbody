// Import product data
import { getProduct, formatPrice, generateStarRating } from './data.js';

class ProductDisplay {
    constructor(productId) {
        this.product = getProduct(productId);
        if (!this.product) {
            throw new Error(`Product with ID ${productId} not found`);
        }
    }

    // Update product name
    updateName() {
        const nameElement = document.querySelector('.product-title');
        if (nameElement) {
            nameElement.textContent = this.product.name;
        }
    }

    // Update product images
    updateImages() {
        const mainImage = document.querySelector('.product-main-image');
        if (mainImage) {
            mainImage.src = this.product.images[0];
            mainImage.alt = this.product.name;
        }

        // Update image gallery
        const gallery = document.querySelector('.product-gallery');
        if (gallery) {
            gallery.innerHTML = this.product.images.map(image => `
                <div class="gallery-item">
                    <img src="${image}" alt="${this.product.name}" 
                         onclick="this.classList.toggle('selected')">
                </div>
            `).join('');
        }
    }

    // Update product price
    updatePrice() {
        const priceElement = document.querySelector('.price-sale');
        if (priceElement) {
            priceElement.textContent = formatPrice(this.product.price);
        }
    }

    // Update product ratings
    updateRatings() {
        const ratingElement = document.querySelector('.product-rating');
        if (ratingElement) {
            ratingElement.innerHTML = `
                <div class="stars">${generateStarRating(this.product.rating)}</div>
                <div class="rating-count">${this.product.reviewCount} reviews</div>
            `;
        }
    }

    // Update product description
    updateDescription() {
        const descElement = document.querySelector('.product-description');
        if (descElement) {
            descElement.innerHTML = this.product.description;
        }
    }

    // Initialize all updates
    init() {
        this.updateName();
        this.updateImages();
        this.updatePrice();
        this.updateRatings();
        this.updateDescription();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const productId = 'advanced-night-repair'; // Get this from URL or data attribute
    try {
        const display = new ProductDisplay(productId);
        display.init();
    } catch (error) {
        console.error('Error initializing product display:', error);
    }
});
