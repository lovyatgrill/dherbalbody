import cartService from './cart-service.js';

class CartComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        console.log('Cart component connected');
        this.render();
        cartService.subscribe(() => this.render());
    }    render() {
        const items = cartService.getCartItems();
        console.log('Rendering cart with items:', items);

        // Ensure items have all required data
        const validItems = items.map(item => {
            const productData = cartService.getProductData(item.id);
            if (productData) {
                return {
                    ...item,
                    title: productData.name,
                    brand: productData.brand,
                    image: productData.images[0],
                    price: productData.price,
                    // Ensure quantity is reasonable
                    quantity: Math.min(Math.max(1, item.quantity), 99)
                };
            }
            return null;
        }).filter(item => item !== null);

        // Calculate cart total with validation
        const total = validItems.reduce((sum, item) => {
            const itemTotal = item.price * item.quantity;
            return sum + (isNaN(itemTotal) ? 0 : itemTotal);
        }, 0);

        const cartContent = validItems.length === 0 
            ? '<div class="cart-empty">Your cart is empty</div>'
            : `                <div class="cart-items">
                    ${validItems.map(item => `
                        <div class="cart-item" data-id="${item.id}">
                            <button class="delete-btn" data-id="${item.id}" title="Remove item">
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </button>
                            <img class="item-image" 
                                src="${item.image || '/placeholder-image.jpg'}" 
                                alt="${item.title || 'Product'}"
                                onerror="this.src='/placeholder-image.jpg'"
                            >
                            <div class="item-details">
                                <h3 class="item-name">${item.title || 'Product'}</h3>
                                <div class="item-brand">${item.brand || 'Brand'}</div>
                                <div class="item-price">$${(item.price || 0).toFixed(2)}</div>
                                <div class="quantity-controls">
                                    <button class="quantity-btn minus" data-id="${item.id}" 
                                        ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-btn plus" data-id="${item.id}"
                                        ${item.quantity >= 99 ? 'disabled' : ''}>+</button>
                                </div>
                            </div>
                            <div class="item-total">
                                $${((item.price || 0) * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        Total: $${total.toFixed(2)}
                    </div>
                    <a href="/checkout/checkout.html" class="checkout-btn">
                        Proceed to Checkout
                    </a>
                </div>`;

        this.shadowRoot.innerHTML = `
            <style>                :host {
                    display: block;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    min-height: calc(100vh - 80px);
                }                .cart-header {
                    text-align: center;
                    padding: 40px 0;
                    margin-bottom: 30px;
                    position: relative;
                }

                .cart-header::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 3px;
                    background: linear-gradient(to right, #7ac142, #4a9c2d);
                    border-radius: 3px;
                }

                h1 {
                    font-size: 36px;
                    margin: 0;
                    color: #1a1a1a;
                    font-weight: 600;
                    letter-spacing: -0.5px;
                }

                .cart-empty {
                    text-align: center;
                    padding: 40px;
                    background: #f9f9f9;
                    border-radius: 8px;
                    margin: 20px 0;
                }

                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }                .cart-item {
                    display: grid;
                    grid-template-columns: 150px 1fr auto;
                    gap: 30px;
                    padding: 30px;
                    background: white;
                    border-radius: 16px;
                    align-items: center;
                    position: relative;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .cart-item:hover {
                    transform: translateY(-2px);
                }

                .item-image {
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 12px;
                    transition: transform 0.3s ease;
                }

                .item-image:hover {
                    transform: scale(1.05);
                }                .item-details {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding-right: 20px;
                }

                .item-name {
                    font-size: 20px;
                    font-weight: 500;
                    color: #1a1a1a;
                    margin: 0;
                    line-height: 1.4;
                }                .item-brand {
                    font-size: 15px;
                    color: #4a9c2d;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                }

                .item-price {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-top: 4px;
                }

                .delete-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    padding: 8px;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: opacity 0.2s ease;
                }

                .delete-btn:hover {
                    opacity: 1;
                }

                .delete-btn svg {
                    width: 16px;
                    height: 16px;
                    fill: #4a9c2d;
                }                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-top: 15px;
                    background: #f8f8f8;
                    padding: 8px 12px;
                    border-radius: 30px;
                    width: fit-content;
                }

                .quantity-btn {
                    width: 28px;
                    height: 28px;
                    border: none;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;       color: #4a9c2d;
                }

                .quantity-btn:hover {
                    background: #7ac142;
                    color: white;
                    transform: scale(1.1);
                }

                .quantity {
                    font-size: 16px;
                    font-weight: 500;
                    color: #1a1a1a;
                    min-width: 24px;
                    text-align: center;
                }

                .item-total {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1a1a1a;
                    text-align: right;
                    background: #f8f8f8;
                    padding: 12px 20px;
                    border-radius: 12px;
                }

                .cart-item {
                    display: grid;
                    grid-template-columns: auto 1fr auto auto;
                    gap: 20px;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    align-items: center;
                }

                .cart-item img {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .quantity-controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                button {
                    padding: 5px 10px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                }

                button:hover {
                    background: #f5f5f5;
                }                .cart-summary {
                    margin-top: 40px;
                    padding: 30px;
                    background: white;
                    border-radius: 20px;
                }

                .cart-total {
                    font-size: 28px;
                    font-weight: 600;
                    color: #1a1a1a;
                    text-align: right;
                    margin-bottom: 25px;
                    padding-bottom: 25px;
                    border-bottom: 2px solid #f0f0f0;
                }

                .checkout-btn {
                    display: block;
                    width: 100%;
                    margin-left: -20px;
                    margin-top: 80px;
                    padding: 18px;                    background:  #606B57;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: center;
                    text-decoration: none;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 20px;
                }

                .checkout-btn:hover {
                    transform: translateY(-2px);
                }

                .checkout-btn:active {
                    transform: translateY(0);
                }

                @media (max-width: 768px) {
                    .cart-item {
                        grid-template-columns: 100px 1fr;
                    }
                    
                    .item-total {
                        grid-column: 1 / -1;
                        text-align: left;
                        padding-top: 10px;
                        border-top: 1px solid #e5e5e5;
                    }
                }

                .quantity {
                    font-size: 16px;
                    min-width: 30px;
                    text-align: center;
                }

                .remove-item {
                    color: #999;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 5px;
                    margin-top: 10px;
                }

                .remove-item:hover {
                    color: #ff4444;
                }

                .quantity-btn[disabled] {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: #eee;
                }
                .quantity-btn[disabled]:hover {
                    background: #eee;
                }
            </style>
            <div class="cart-header">
                <h1>Shopping Cart</h1>
            </div>
            ${cartContent}
        `;        // Add event listeners for quantity buttons
        this.shadowRoot.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.disabled) return;
                
                const id = e.target.dataset.id;
                const isPlus = e.target.classList.contains('plus');
                const item = validItems.find(item => item.id === id);
                
                if (item) {
                    const newQuantity = isPlus ? item.quantity + 1 : item.quantity - 1;
                    if (newQuantity >= 1 && newQuantity <= 99) {
                        cartService.updateQuantity(id, newQuantity);
                    }
                }
            });
        });

        // Add event listeners for delete buttons
        this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.delete-btn').dataset.id;
                if (id) {
                    const item = validItems.find(item => item.id === id);
                    if (item) {
                        // Add a smooth fade-out animation
                        const cartItem = e.target.closest('.cart-item');
                        cartItem.style.transition = 'all 0.3s ease';
                        cartItem.style.opacity = '0';
                        cartItem.style.transform = 'scale(0.95)';
                        
                        // Remove the item after animation
                        setTimeout(() => {
                            cartService.removeItem(id);
                        }, 300);
                    }
                }
            });
        });
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity > 0) {
            cartService.updateQuantity(itemId, newQuantity);
        } else {
            this.removeItem(itemId);
        }
    }

    removeItem(itemId) {
        cartService.removeItem(itemId);
    }

    checkout() {
        console.log('Proceeding to checkout...');
        // Add checkout logic here
    }
}

customElements.define('cart-component', CartComponent);
