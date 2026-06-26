// Chatbot Initialization - Global Integration with Enhanced Service
import { chatbotServiceEnhanced as chatbotService } from './chatbot-service-enhanced.js';
import { productsData } from './data.js';
import cartService from './cart-service.js';

class ChatbotUI {
  constructor() {
    this.isInitialized = false;
    this.windowElement = null;
    this.messagesContainer = null;
    this.inputElement = null;
    this.toggleButton = null;
    this.storageKey = 'chatbot-window-state';
  }

  async init() {
    if (this.isInitialized) {
      console.log('⚠️ Chatbot already initialized, skipping');
      return;
    }

    console.log('🚀 Starting chatbot initialization...');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      console.log('⏳ DOM still loading, waiting for DOMContentLoaded...');
      document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOMContentLoaded fired, setting up UI');
        this.setupUI();
      });
    } else {
      console.log('📄 DOM already loaded, setting up UI immediately');
      this.setupUI();
    }
  }

  setupUI() {
    // Get references to DOM elements
    this.windowElement = document.getElementById('chatbot-window');
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.inputElement = document.getElementById('chatbot-input');
    this.toggleButton = document.getElementById('chatbot-toggle');
    const closeButton = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-form');

    console.log('🔍 Chatbot elements found:', {
      window: !!this.windowElement,
      toggle: !!this.toggleButton,
      messages: !!this.messagesContainer,
      input: !!this.inputElement,
      close: !!closeButton,
      form: !!form
    });

    if (!this.windowElement || !this.toggleButton) {
      console.error('❌ Chatbot elements not found in DOM');
      return;
    }

    // Restore window state from localStorage
    this.restoreWindowState();

    // Event listeners
    this.toggleButton.addEventListener('click', () => {
      console.log('🖱️ Toggle button clicked');
      this.toggleWindow();
    });
    closeButton.addEventListener('click', () => this.closeWindow());
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.windowElement.classList.contains('hidden')) {
        this.closeWindow();
      }
    });

    this.isInitialized = true;
    console.log('✅ Chatbot UI setup complete');
  }

  restoreWindowState() {
    // Get stored state, default to open (true) for first-time visitors
    const storedState = localStorage.getItem(this.storageKey);
    const isOpen = storedState === null ? true : JSON.parse(storedState);

    if (isOpen) {
      this.windowElement.classList.remove('hidden');
    } else {
      this.windowElement.classList.add('hidden');
    }
  }

  saveWindowState(isOpen) {
    localStorage.setItem(this.storageKey, JSON.stringify(isOpen));
  }

  toggleWindow() {
    if (!this.windowElement) return;
    
    this.windowElement.classList.toggle('hidden');
    const isOpen = !this.windowElement.classList.contains('hidden');
    this.saveWindowState(isOpen);
    
    // Focus input when opened
    if (isOpen) {
      setTimeout(() => this.inputElement?.focus(), 100);
    }
  }

  closeWindow() {
    if (!this.windowElement) return;
    
    this.windowElement.classList.add('hidden');
    this.saveWindowState(false);
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const message = this.inputElement.value.trim();
    if (!message) return;

    // Add user message to UI
    this.addMessage(message, 'user');
    this.inputElement.value = '';
    this.inputElement.focus();

    // Get bot response
    const response = chatbotService.processUserMessage(message);
    
    // Add bot response with slight delay
    setTimeout(() => {
      this.addMessage(response, 'bot');
      this.scrollToBottom();
    }, 300);
  }

  addMessage(text, sender = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

    if (sender === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.textContent = '🌿';
      messageDiv.appendChild(avatar);
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Handle HTML content for bot messages
    if (sender === 'bot') {
      contentDiv.innerHTML = this.sanitizeAndFormatHTML(text);
    } else {
      contentDiv.textContent = text;
    }

    messageDiv.appendChild(contentDiv);
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  sanitizeAndFormatHTML(text) {
    // Create a container to safely parse HTML
    const div = document.createElement('div');
    
    // Handle line breaks and formatting
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Safely allow specific HTML tags
    formatted = formatted
      .replace(/&lt;strong&gt;/g, '<strong>')
      .replace(/&lt;\/strong&gt;/g, '</strong>')
      .replace(/&lt;br&gt;/g, '<br>')
      .replace(/&lt;em&gt;/g, '<em>')
      .replace(/&lt;\/em&gt;/g, '</em>')
      .replace(/&lt;p&gt;/g, '<p>')
      .replace(/&lt;\/p&gt;/g, '</p>');

    // Wrap in paragraph if needed
    if (!formatted.startsWith('<p>')) {
      formatted = '<p>' + formatted + '</p>';
    }

    // Remove multiple paragraph wrappers
    formatted = formatted
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<p>)/g, '<p>')
      .replace(/(<\/p>)<\/p>/g, '</p>');

    return formatted;
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      setTimeout(() => {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }, 0);
    }
  }
}

// Initialize chatbot when script loads
const chatbotUI = new ChatbotUI();
chatbotUI.init();

// Export for external access
window.chatbotUI = chatbotUI;
window.chatbotService = chatbotService;

console.log('🤖 DHERBALBODY Chatbot initialized successfully!');
