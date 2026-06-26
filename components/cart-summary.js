// components/cart-summary.js
export class CartSummaryComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set summaryData(data) {
    this.render(data);
  }

  render(data) {
    const styles = `
      <style>
        :host {
          display: block;
        }
        .cart-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .summary-row.total {
          border-top: 1px solid #e5e5e5;
          padding-top: 15px;
          margin-top: 15px;
          font-weight: 600;
          font-size: 18px;
        }
        .checkout-button {
          width: 100%;
          background: #5e5e3b;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span class="subtotal">$${data.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span class="shipping">$${data.shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span class="total-amount">$${(data.subtotal + data.shipping).toFixed(2)}</span>
        </div>
        <button class="checkout-button">Proceed to Checkout</button>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const checkoutButton = this.shadowRoot.querySelector('.checkout-button');
    checkoutButton?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('checkout', {
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('cart-summary', CartSummaryComponent);
