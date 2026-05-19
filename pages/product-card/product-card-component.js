// Define the product card web component
class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const productData = this.getAttribute('product-data');
    console.log('Raw product data:', productData);
    
    let product;
    try {
      product = JSON.parse(productData || '{}');
      console.log('Parsed product:', product);
    } catch (error) {
      console.error('Error parsing product data:', error);
      product = {};
    }
    
    this.render(product);
    this.setupEventListeners(product);
  }

  setupEventListeners(product) {
    const card = this.shadowRoot.querySelector('.product-card');
    const image = this.shadowRoot.querySelector('.image-wrapper');
    const title = this.shadowRoot.querySelector('.product-title');
    const addToCartBtn = this.shadowRoot.querySelector('.add-to-cart');

    const handleAddToCart = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!addToCartBtn) return;

      const cartItem = {
        id: product.id,
        title: product.name || product.title || 'Product',
        price: product.price || 0,
        image: (product.images && product.images[0]) ? product.images[0] : (product.image || ''),
        quantity: 1
      };

      console.log('Adding to cart:', cartItem);
      addToCartBtn.textContent = 'Adding...';
      addToCartBtn.style.backgroundColor = '#7a7a5c';
      addToCartBtn.disabled = true;

      try {
        const module = await import('../../js/cart-service.js');
        const cartService = module.default;
        await cartService.addItem(cartItem);
        
        // Show success state and toast
        addToCartBtn.textContent = '✓ Added';
        addToCartBtn.style.backgroundColor = '#5e5e3b';
        
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #5e5e3b;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 1000;
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform: translateY(100px);
          opacity: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        toast.textContent = `${product.name || 'Product'} added to cart`;
        document.body.appendChild(toast);

        // Animate toast
        requestAnimationFrame(() => {
          toast.style.transform = 'translateY(0)';
          toast.style.opacity = '1';
        });

        // Reset after 2 seconds
        setTimeout(() => {
          addToCartBtn.textContent = 'Add to Cart';
          addToCartBtn.style.backgroundColor = '#5e5e3b';
          addToCartBtn.disabled = false;
          toast.style.transform = 'translateY(100px)';
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      } catch (error) {
        console.error('Failed to add to cart:', error);
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.style.backgroundColor = '#5e5e3b';
        addToCartBtn.disabled = false;
      }
    };

    const navigateToProduct = (e) => {
      if (e.target.closest('.add-to-cart')) return;
      window.location.href = `/singleproduct/single-product.html?product=${product.id}`;
    };

    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', handleAddToCart);
    }

    if (card) {
      card.addEventListener('click', navigateToProduct);
    }

    if (image) {
      image.addEventListener('click', navigateToProduct);
    }

    if (title) {
      title.addEventListener('click', navigateToProduct);
    }
  }
  render(product) {
    const styles = `
      <style>
        :host {
          display: block;
        }        
        .product-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 0 15px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
          position: relative;
          cursor: pointer;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .product-title {
          cursor: pointer;
          color: #333;
          transition: color 0.2s ease;
        }

        .product-title:hover {
          color: #5e5e3b;
        }
        
        .image-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .image-wrapper img {
          width: 220px;
          height: 220px;
          object-fit: cover;
          display: block;
          margin: 0 auto;
        }

        .add-to-cart {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: #5e5e3b;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 5px;
          transition: transform 0.3s ease, background-color 0.3s ease;
          cursor: pointer;
        }
        
        .add-to-cart:hover {
          transform: translateY(-2px);
          background-color: #4d4d31;
        }

        .add-to-cart:disabled {
          background-color: #7a7a5c;
          cursor: not-allowed;
          transform: none;
        }
        
        .badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: #cfd3bb;
          padding: 4px 10px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .product-info {
          padding: 16px;
          text-align: center;
        }
        
        .tag {
          font-size: 11px;
          color: #7a7a7a;
          background-color: #eaeaea;
          padding: 2px 8px;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 6px;
        }
        
        .brand {
          font-size: 13px;
          color: #888;
          margin: 5px 0;
          font-weight: 600;
        }
        
        .title {
          font-size: 15px;
          margin: 5px 0;
          color: #222;
        }
        
        .rating {
          font-size: 12px;
          color: #999;
          margin: 5px 0;
        }
        
        .price {
          font-weight: bold;
          color: #000;
          font-size: 16px;
          margin-top: 5px;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="product-card">
        <div class="image-wrapper">
          <img src="${product.images?.[0] || ''}" alt="${product.name || ''}">
          <button class="add-to-cart" type="button">Add to Cart</button>
          ${product.isBestSeller ? '<span class="badge">Bestseller</span>' : ''}
          ${product.isNew ? '<span class="badge">New</span>' : ''}
          ${product.onSale ? '<span class="badge">Sale</span>' : ''}
        </div>
        <div class="product-info">
          <span class="tag">${product.category || ''}</span>
          <h4 class="brand">${product.brand || ''}</h4>
          <p class="title">${product.name || ''}</p>
          <div class="rating">${'★'.repeat(Math.floor(product.rating || 0))} (${product.reviewCount || 0})</div>
          <p class="price">$${(product.price || 0).toFixed(2)}</p>
        </div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('product-card', ProductCard);
