import { productsData } from './data.js';

class CartService {
    constructor() {
        this.items = this.loadCart();
        this.subscribers = new Set();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.notifySubscribers();
    }    addItem(productOrId, quantity = 1) {
        let product;
        
        if (typeof productOrId === 'string') {
            // If we just got an ID, look up the full product data
            product = productsData[productOrId];
            if (!product) {
                console.error('Product not found:', productOrId);
                return;
            }
        } else {
            product = productOrId;
        }

        if (!product || !product.id) {
            console.error('Invalid product data:', product);
            return;
        }

        console.log('Adding item to cart:', product);

        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = quantity;  // Replace quantity instead of adding
            console.log('Updated existing item quantity:', existingItem);
        } else {
            // Create cart item with all required data
            const cartItem = {
                id: product.id,
                title: product.name || 'Unknown Product',
                price: product.price || 0,
                image: (product.images && product.images[0]) || '',
                quantity: quantity
            };
            this.items.push(cartItem);
            console.log('Added new item to cart:', cartItem);
        }
        this.saveCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    getProductData(productId) {
        const productData = productsData[productId];
        if (!productData) {
            console.error(`Product data not found for ID: ${productId}`);
            return null;
        }
        return productData;
    }

    updateQuantity(productId, quantity) {
        // Validate quantity
        const validQuantity = Math.min(Math.max(1, quantity), 99);
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = validQuantity;
            this.saveCart();
        }
    }

    getCartItems() {
        return this.items;
    }

    getCartTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    subscribe(callback) {
        this.subscribers.add(callback);
    }

    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.items));
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.notifySubscribers();
    }
}

// Create a singleton instance
const cartService = new CartService();
export default cartService;
export { cartService };
