// cart.js

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Constants
const SHIPPING_FEE = 35.00; // Fixed shipping fee

// Grab all the UI elements
const cartIconDesktop = document.getElementById('cart-icon-desktop');
const cartIconMobile = document.getElementById('cart-icon-mobile');
const cartItems = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');
const cartSubtotal = document.getElementById('cart-subtotal');
const shippingFee = document.getElementById('shipping-fee');
const grandTotal = document.getElementById('grand-total');
const checkoutButton = document.getElementById('checkout-button');
const checkoutForm = document.getElementById('checkout-form');
const checkoutCartData = document.getElementById('checkout-cart-data');
const emptyCartMessage = document.getElementById('empty-cart-message');
const itemTemplate = document.getElementById('cart-item-template');

// Convert cents to dollars
function centsToDollars(cents) {
  // Make sure cents is a number
  cents = parseInt(cents);
  if (isNaN(cents)) return 0;
  return cents / 100;
}

// Get total items in cart
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Calculate cart subtotal
function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    // Convert price from cents to dollars and multiply by quantity
    const priceInDollars = centsToDollars(item.price);
    return sum + (priceInDollars * item.quantity);
  }, 0);
}

// Calculate grand total
function getGrandTotal(subtotal) {
  return subtotal + SHIPPING_FEE;
}

// Format price to currency
function formatPrice(price) {
  // Make sure price is a number
  price = parseFloat(price);
  if (isNaN(price)) price = 0;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

// Update the cart icons count
function updateCartIconsCount(count) {
  const desktopBubble = cartIconDesktop?.querySelector('[data-value]');
  const mobileBubble = cartIconMobile?.querySelector('[data-value]');
  [desktopBubble, mobileBubble].forEach(bubble => {
    if (!bubble) return;
    const badge = bubble.querySelector('span');
    bubble.dataset.value = count;
    badge.textContent = count;
    const countDiv = bubble.querySelector('div');
    if (count > 0) {
      countDiv.classList.remove('hidden');
    } else {
      countDiv.classList.add('hidden');
    }
  });
}

// Create a cart item element from template
function createCartItemElement(item) {
  if (!itemTemplate) return null;
  
  const element = itemTemplate.content.cloneNode(true);
  const container = element.querySelector('.cart-item');
  
  // Set item details
  container.querySelector('h3').textContent = item.name;
  if (item.variant) {
    container.querySelector('.variant').textContent = item.variant;
  }
  
  // Set product image with proper URL handling
  const imgElement = container.querySelector('img');
  if (item.image && item.image !== 'undefined') {
    // Make sure the image URL is absolute
    const imageUrl = item.image.startsWith('//') ? 'https:' + item.image : item.image;
    imgElement.src = imageUrl;
    imgElement.alt = item.name;
  } else {
    // Default placeholder image
    imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgMTZsNi02IDQgNCA4LTgiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==';
    imgElement.alt = 'Product image placeholder';
  }
  
  // Format and set price (convert from cents to dollars)
  const priceInDollars = centsToDollars(item.price);
  container.querySelector('p').textContent = formatPrice(priceInDollars);
  
  // Set quantity and add event listeners
  container.querySelector('.quantity-controls span').textContent = item.quantity;
  
  container.querySelector('.quantity-controls button:first-child')
    .addEventListener('click', () => updateItemQuantity(item.id, item.quantity - 1));
  
  container.querySelector('.quantity-controls button:last-child')
    .addEventListener('click', () => updateItemQuantity(item.id, item.quantity + 1));
  
  container.querySelector('button:last-child')
    .addEventListener('click', () => removeCartItem(item.id));
  
  return container;
}

// Update item quantity
function updateItemQuantity(itemId, newQuantity) {
  if (newQuantity < 1) {
    removeCartItem(itemId);
    return;
  }

  const itemIndex = cart.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Remove item from cart
function removeCartItem(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Handle "Add to Cart" clicks
document.addEventListener('click', function(event) {
  const addButton = event.target.closest('.add-to-cart');
  if (!addButton) return;

  const productCard = addButton.closest('.product-item');
  if (!productCard) return;

  // Get product data from the product card
  const productData = productCard.querySelector('[x-customer-event-data]');
  if (!productData) return;

  try {
    const data = JSON.parse(productData.getAttribute('x-customer-event-data').replace(/&quot;/g, '"'));
    const product = data.product;

    // Get product image
    const imageElement = productCard.querySelector('.preview-img');
    let imageUrl = '';
    if (imageElement) {
      // Get the full resolution image URL
      imageUrl = imageElement.getAttribute('src');
      if (!imageUrl) {
        // Try getting from srcset
        const srcset = imageElement.getAttribute('srcset');
        if (srcset) {
          // Get the highest resolution image from srcset
          const srcsetParts = srcset.split(',');
          const lastSrc = srcsetParts[srcsetParts.length - 1].trim().split(' ')[0];
          imageUrl = lastSrc;
        }
      }
    }

    // Update cart data
    const existing = cart.find(item => item.id === product.sku);
    if (existing) {
      existing.quantity++;
      console.log(`🛒 Increased quantity: ${product.title} now x${existing.quantity}`);
    } else {
      cart.push({
        id: product.sku,
        name: product.title,
        price: product.price, // This is in cents
        image: imageUrl,
        quantity: 1
      });
      console.log(`🛒 Added to cart: 1 × ${product.title} (${formatPrice(centsToDollars(product.price))})`);
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update UI immediately
    updateCartUI();

    // Show "Added!" feedback
    const label = addButton.querySelector('.button-text');
    if (label) {
      const orig = label.textContent;
      label.textContent = 'Added!';
      setTimeout(() => label.textContent = orig, 2000);
    }
  } catch (e) {
    console.error('Error adding item to cart:', e);
  }
});

// Update cart UI
function updateCartUI() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();
  const total = getGrandTotal(subtotal);
  
  // Update cart icon counts
  updateCartIconsCount(count);

  // Update cart page if we're on it
  if (cartItems && cartSummary && emptyCartMessage) {
    if (cart.length === 0) {
      cartItems.style.display = 'none';
      cartSummary.style.display = 'none';
      emptyCartMessage.style.display = 'flex';
      if (checkoutButton) checkoutButton.disabled = true;
    } else {
      cartItems.style.display = 'block';
      cartSummary.style.display = 'block';
      emptyCartMessage.style.display = 'none';
      if (checkoutButton) checkoutButton.disabled = false;
      
      // Clear and rebuild cart items
      cartItems.innerHTML = '';
      cart.forEach(item => {
        const itemElement = createCartItemElement(item);
        if (itemElement) {
          cartItems.appendChild(itemElement);
        }
      });
      
      // Update summary amounts
      if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
      if (shippingFee) shippingFee.textContent = formatPrice(SHIPPING_FEE);
      if (grandTotal) grandTotal.textContent = formatPrice(total);

      // Update checkout form data
      if (checkoutCartData) {
        checkoutCartData.value = JSON.stringify(cart);
      }
    }
  }
}

// Initial UI update on page load
document.addEventListener('DOMContentLoaded', updateCartUI);
