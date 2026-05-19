import cartService from '../js/cart-service.js';

class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.product = JSON.parse(this.getAttribute('product'));
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .product-card {
                    border: 1px solid #ddd;
                    padding: 1rem;
                    border-radius: 8px;
                    transition: transform 0.2s ease;
                }

                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .product-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .product-info {
                    margin-top: 1rem;
                }

                .product-title {
                    font-size: 1.1rem;
                    margin: 0.5rem 0;
                    cursor: pointer;
                }

                .product-price {
                    font-weight: bold;
                    color: #333;
                }

                .add-to-cart {
                    background: var(--primary-color, #007bff);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                    margin-top: 1rem;
                    transition: background-color 0.2s ease;
                }

                .add-to-cart:hover {
                    background: var(--primary-color-dark, #0056b3);
                }

                .added-to-cart {
                    background: var(--success-color, #28a745);
                }
            </style>

            <div class="product-card">
                <img class="product-image" 
                     src="${this.product.image}" 
                     alt="${this.product.title}"
                     loading="lazy">
                <div class="product-info">
                    <h3 class="product-title">${this.product.title}</h3>
                    <div class="product-price">$${this.product.price.toFixed(2)}</div>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const card = this.shadowRoot.querySelector('.product-card');
        const addToCartBtn = this.shadowRoot.querySelector('.add-to-cart');
        const image = this.shadowRoot.querySelector('.product-image');
        const title = this.shadowRoot.querySelector('.product-title');

        // Handle click on image or title to navigate to product page
        const navigateToProduct = (event) => {
            event.stopPropagation();
            const productSlug = this.product.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            window.location.href = `/products/${productSlug}.html?id=${this.product.id}`;
        };

        image.addEventListener('click', navigateToProduct);
        title.addEventListener('click', navigateToProduct);

        // Handle add to cart
        addToCartBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            cartService.addItem(this.product);
            
            // Visual feedback
            addToCartBtn.textContent = 'Added to Cart!';
            addToCartBtn.classList.add('added-to-cart');
            
            setTimeout(() => {
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.classList.remove('added-to-cart');
            }, 2000);
        });
    }
}

customElements.define('product-card', ProductCard);
