class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.loadFooter();
    }

    async loadFooter() {
        try {
            const response = await fetch('/components/footer-template.html');
            const html = await response.text();
            this.shadowRoot.innerHTML = html;
            
            // Initialize newsletter form if it exists
            this.initializeNewsletterForm();
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    initializeNewsletterForm() {
        const form = this.shadowRoot.querySelector('.newsletter-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                // Handle newsletter subscription
                console.log('Newsletter subscription for:', email);
                // Add your newsletter subscription logic here
            });
        }
    }
}

customElements.define('site-footer', FooterComponent);
