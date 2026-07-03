import cartService from '../js/cart-service.js';

const SHIPPING_FEE = 35.00; // Match the shipping fee from cart.js
let shippingCost = SHIPPING_FEE; // Default shipping cost

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDeliveryOptions();
    initializeFormValidation();
    initializeCheckoutButton();
    loadCartItems();
    initializePayPalButton(); // Add this to render the real PayPal button
});

// Delivery Options Handler
function initializeDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    const addressForm = document.querySelector('.address-form');
    
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Update visual selection
            document.querySelectorAll('.delivery-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.closest('.delivery-option').classList.add('selected');
            
            // Show/hide address form based on selection
            if (this.value === 'ship') {
                addressForm.style.display = 'block';
                shippingCost = SHIPPING_FEE;
            } else {
                addressForm.style.display = 'none';
                shippingCost = 0;
            }
            
            const subtotal = parseFloat(document.querySelector('.summary-subtotal').textContent.replace('$', ''));
            updateOrderSummary({ subtotal, shipping: shippingCost, discount: 0 });
        });
    });
}

// Payment Options Handler
function initializePaymentOptions() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const creditCardForm = document.querySelector('.credit-card-form');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Update visual selection
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.closest('.payment-option').classList.add('selected');
            
            // Show/hide credit card form
            if (this.value === 'credit') {
                creditCardForm.style.display = 'block';
            } else {
                creditCardForm.style.display = 'none';
            }
        });
    });
}

// Discount Code Handler
function initializeDiscountCode() {
    const discountInput = document.querySelector('.discount-code input');
    const applyButton = document.querySelector('.discount-code button');
    
    applyButton.addEventListener('click', function() {
        const code = discountInput.value.trim().toLowerCase();
        applyDiscountCode(code);
    });
    
    discountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const code = this.value.trim().toLowerCase();
            applyDiscountCode(code);
        }
    });
}

function applyDiscountCode(code) {
    const validCodes = {
        'save10': { type: 'percentage', value: 10, description: 'DISCOUNT 10% OFF' },
        'welcome': { type: 'fixed', value: 5, description: 'WELCOME DISCOUNT $5.00' },
        'newcustomer': { type: 'percentage', value: 15, description: 'NEW CUSTOMER 15% OFF' }
    };
    
    if (validCodes[code]) {
        const discount = validCodes[code];
        showDiscountSuccess(discount);
        updateOrderSummary({ discount: discount });
    } else if (code) {
        showDiscountError();
    }
}

function showDiscountSuccess(discount) {
    const discountInput = document.querySelector('.discount-code input');
    const applyButton = document.querySelector('.discount-code button');
    
    discountInput.style.borderColor = '#28a745';
    applyButton.textContent = 'Applied';
    applyButton.style.backgroundColor = '#28a745';
    applyButton.style.color = 'white';
    applyButton.disabled = true;
    
    setTimeout(() => {
        discountInput.style.borderColor = '#d1d5db';
        applyButton.textContent = 'Apply';
        applyButton.style.backgroundColor = '#f3f4f6';
        applyButton.style.color = '#666';
        applyButton.disabled = false;
    }, 3000);
}

function showDiscountError() {
    const discountInput = document.querySelector('.discount-code input');
    const applyButton = document.querySelector('.discount-code button');
    
    discountInput.style.borderColor = '#dc3545';
    applyButton.textContent = 'Invalid';
    applyButton.style.backgroundColor = '#dc3545';
    applyButton.style.color = 'white';
    
    setTimeout(() => {
        discountInput.style.borderColor = '#d1d5db';
        applyButton.textContent = 'Apply';
        applyButton.style.backgroundColor = '#f3f4f6';
        applyButton.style.color = '#666';
    }, 2000);
}

// Form Validation
function initializeFormValidation() {
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });
}

function validateForm() {
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    const checkoutButton = document.getElementById('checkout-button');
    
    let isValid = true;
    requiredInputs.forEach(input => {
        if (!input.value) {
            isValid = false;
        }
    });
    
    checkoutButton.disabled = !isValid;
}

function initializeCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', handleCheckout);
}

function handleCheckout() {
    // Simulate processing payment
    const button = document.getElementById('checkout-button');
    const total = localStorage.getItem('checkout_total');
    
    if (!total || total <= 0) {
        alert('Your cart is empty!');
        return;
    }

    button.textContent = 'Processing...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        const cart = cartService.loadCart();
        if (cart && cart.length > 0) {
            cartService.clearCart();
            localStorage.removeItem('checkout_total');
            
            // Show success message with total
            alert(`Payment of ${formatCurrency(total)} successful! Thank you for your purchase.`);
            
            // Redirect to home page
            window.location.href = '/';
        } else {
            alert('Your cart is empty!');
            button.textContent = 'Pay with PayPal';
            button.disabled = false;
        }
    }, 2000);
}

// Shipping Calculation
function initializeShippingCalculation() {
    const addressFields = ['address', 'city', 'country'];
    
    addressFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateShippingInfo);
        }
    });
}

function updateShippingInfo() {
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value;
    
    const shippingRow = document.querySelector('.total-row:nth-child(2) span:last-child');
    const shippingMethod = document.querySelector('.shipping-method');
    
    if (address && city && country) {
        // Simulate shipping calculation
        const shippingCost = calculateShipping(country);
        shippingRow.textContent = `$${shippingCost.toFixed(2)}`;
        shippingMethod.innerHTML = `
            <h3>Shipping method</h3>
            <div style="padding: 15px; border: 1px solid #FF6B35; border-radius: 6px; background-color: #fff7f4;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 500; color: #FF6B35;">Standard Shipping</span>
                    <span style="font-weight: 600;">$${shippingCost.toFixed(2)}</span>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 5px;">2-3 business days</p>
            </div>
        `;
        updateOrderSummary({ shipping: shippingCost });
    } else {
        shippingRow.textContent = 'Enter shipping address';
        shippingMethod.innerHTML = `
            <h3>Shipping method</h3>
            <p class="shipping-note">Enter your shipping address to view available shipping methods.</p>
        `;
        updateOrderSummary({ shipping: 0 });
    }
}

function calculateShipping(country) {
    const shippingRates = {
        'vietnam': SHIPPING_FEE,
        'usa': SHIPPING_FEE,
        'uk': SHIPPING_FEE,
        'default': SHIPPING_FEE
    };
    
    return shippingRates[country] || shippingRates.default;
}

// Order Summary Updates
function updateOrderSummary({ subtotal = 0, shipping = 0, discount = 0 }) {
    document.querySelector('.summary-subtotal').textContent = formatCurrency(subtotal);
    document.querySelector('.summary-shipping').textContent = formatCurrency(shipping);
    document.querySelector('.summary-discount').textContent = formatCurrency(discount);
    
    const total = subtotal + shipping - discount;
    document.querySelector('.summary-total').textContent = formatCurrency(total);
    
    // Store the total in localStorage for reference
    localStorage.setItem('checkout_total', total);
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = cartService.loadCart();
    
    if (!cart || cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        updateOrderSummary({ subtotal: 0, shipping: 0, discount: 0 });
        document.getElementById('checkout-button').disabled = true;
        return;
    }

    // Calculate totals
    const subtotal = cart.reduce((total, item) => {
        const itemPrice = typeof item.price === 'string' ? 
            parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 
            item.price;
        return total + (itemPrice * item.quantity);
    }, 0);

    cartItemsContainer.innerHTML = cart.map(item => {
        const itemPrice = typeof item.price === 'string' ? 
            parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : 
            item.price;
        
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">
                        ${formatCurrency(itemPrice)}
                        <span class="cart-item-quantity">x${item.quantity}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateOrderSummary({ subtotal, shipping: shippingCost, discount: 0 });
}

function initializePayPalButton() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            const cart = cartService.loadCart();
            const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const orderTotal = cartTotal + shippingCost;
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: orderTotal.toFixed(2)
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Clear the cart after successful payment
                cartService.clearCart();
                
                // Show success message
                alert('Transaction completed by ' + details.payer.name.given_name);
                
                // Redirect to success page or show success message
                window.location.href = '/';
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            alert('There was an error processing your payment. Please try again.');
        }
    }).render('#paypal-button-container');
}

// Credit Card Formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiryDate');
    const securityCodeInput = document.getElementById('securityCode');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (securityCodeInput) {
        securityCodeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
        });
    }
});

// Newsletter Signup Handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterCheckbox = document.getElementById('newsletter');
    if (newsletterCheckbox) {
        newsletterCheckbox.addEventListener('change', function() {
            if (this.checked) {
                console.log('User opted in for newsletter');
            } else {
                console.log('User opted out of newsletter');
            }
        });
    }
});

// Save Information Handler
document.addEventListener('DOMContentLoaded', function() {
    const saveInfoCheckbox = document.getElementById('saveInfo');
    if (saveInfoCheckbox) {
        saveInfoCheckbox.addEventListener('change', function() {
            if (this.checked) {
                console.log('User wants to save shipping information');
            } else {
                console.log('User does not want to save shipping information');
            }
        });
    }
});

