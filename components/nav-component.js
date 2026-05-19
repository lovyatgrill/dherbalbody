class NavComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
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
}

customElements.define('nav-header', NavComponent);
