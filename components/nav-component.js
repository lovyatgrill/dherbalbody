class NavComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Create floating button immediately (synchronously)
        this.createFloatingCartButton();
        
        // Attach event listeners immediately (before async loadHeader)
        window.addEventListener('storage', () => this.updateFloatingCartCount());
        window.addEventListener('cartUpdated', () => this.updateFloatingCartCount());
        
        // Load HTML asynchronously
        this.loadHeader();
    }

    async loadHeader() {
        try {
            const response = await fetch('/components/nav-template.html');
            const html = await response.text();
            this.shadowRoot.innerHTML = html;

            // After loading HTML, initialize theme toggle
            this.initializeThemeToggle();
            this.initializeCartToggle();
            this.initializeMenuToggle();
            this.initializeFloatingCartButton();
        } catch (error) {
            console.error('Error loading navigation:', error);
        }
    }

    initializeThemeToggle() {
        const themeToggle = this.shadowRoot.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            });
        }
    }

    initializeCartToggle() {
        const cartToggle = this.shadowRoot.querySelector('.cart-toggle');
        const cartDrawer = this.shadowRoot.querySelector('.cart-drawer');
        if (cartToggle && cartDrawer) {
            cartToggle.addEventListener('click', () => {
                cartDrawer.classList.toggle('open');
            });
        }
    }

    initializeMenuToggle() {
        const menuToggle = this.shadowRoot.querySelector('.menu-toggle');
        const mobileMenu = this.shadowRoot.querySelector('.mobile-menu');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });
        }
    }

    initializeFloatingCartButton() {
        // Button already created in connectedCallback
    }

    createFloatingCartButton() {
        if (document.getElementById('floating-cart-button')) {
            return; // Already exists
        }

        const floatingButton = document.createElement('div');
        floatingButton.id = 'floating-cart-button';
        floatingButton.style.cssText = `
            position: fixed;
            bottom: calc(5.75rem + env(safe-area-inset-bottom));
            right: 1rem;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            background: #111827;
            color: #fff;
            border-radius: 999px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.25);
            padding: 0.75rem 0.9rem;
            min-width: 128px;
            max-width: calc(100vw - 1.5rem);
            font-family: system-ui, sans-serif;
            pointer-events: auto;
            overflow: hidden;
        `;

        const anchor = document.createElement('a');
        anchor.href = '/cart.html';
        anchor.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.6rem;
            color: inherit;
            text-decoration: none;
            font-weight: 700;
            width: 100%;
            justify-content: center;
        `;
        anchor.setAttribute('aria-label', 'View cart');

        anchor.innerHTML = `
            <span style="font-size:0.95rem;white-space:nowrap;">View cart</span>
            <span id="floating-cart-count" style="min-width:1.5rem;min-height:1.5rem;padding:0.2rem 0.4rem;border-radius:999px;background:#fff;color:#111;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0;">0</span>
        `;

        floatingButton.appendChild(anchor);
        document.body.appendChild(floatingButton);

        this.updateFloatingCartCount();
    }

    updateFloatingCartCount() {
        const count = this.getStoredCartCount();
        const countEl = document.getElementById('floating-cart-count');
        if (countEl) {
            countEl.textContent = String(count);
        }

        const headerBubbleTexts = this.shadowRoot.querySelectorAll('#cart-icon-bubble span');
        headerBubbleTexts.forEach(span => {
            span.textContent = String(count);
        });
    }

    getStoredCartCount() {
        try {
            const savedCart = localStorage.getItem('cart');
            const items = savedCart ? JSON.parse(savedCart) : [];
            if (!Array.isArray(items)) return 0;
            return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        } catch (error) {
            console.error('Failed to parse cart from localStorage', error);
            return 0;
        }
    }
}

customElements.define('nav-header', NavComponent);
