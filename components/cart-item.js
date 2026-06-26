// components/cart-item.js
export class CartItemComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set itemData(data) {
    this.render(data);
  }

  render(item) {
    const styles = `
      <style>
        :host {
          display: block;
        }
        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid #e5e5e5;
          align-items: center;
        }
        .item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }
        .item-details h3 {
          margin: 0 0 5px;
          font-size: 16px;
          color: #333;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }
        .quantity-btn {
          background: #f3f4f6;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="cart-item" data-id="${item.id}">
        <img class="item-image" src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          ${item.variant ? `<div class="variant">${item.variant}</div>` : ''}
          <div class="quantity-controls">
            <button class="quantity-btn decrease">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase">+</button>
          </div>
        </div>
        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `;

    // Setup event listeners for this item
    this.setupEventListeners();
  }

  setupEventListeners() {
    const decreaseBtn = this.shadowRoot.querySelector('.decrease');
    const increaseBtn = this.shadowRoot.querySelector('.increase');
    
    decreaseBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('quantity-change', {
        detail: { type: 'decrease' },
        bubbles: true,
        composed: true
      }));
    });

    increaseBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('quantity-change', {
        detail: { type: 'increase' },
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('cart-item', CartItemComponent);
