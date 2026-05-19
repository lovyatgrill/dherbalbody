// Chatbot Service - Handles all chatbot logic
import { 
  chatbotKnowledge, 
  chatbotResponses, 
  findProductByName, 
  formatProductInfo, 
  getRandomResponse,
  searchProductByCategory 
} from './chatbot-knowledge-base.js';
import cartService from './cart-service.js';
import { productsData } from './data.js';

export class ChatbotService {
  constructor() {
    this.conversationHistory = [];
    this.maxHistoryLength = 50;
    this.loadTestimonials();
  }

  loadTestimonials() {
    const saved = localStorage.getItem('chatbot-testimonials');
    this.testimonials = saved ? JSON.parse(saved) : [];
  }

  saveTestimonials() {
    localStorage.setItem('chatbot-testimonials', JSON.stringify(this.testimonials));
  }

  addTestimonial(name, email, productId, rating, message) {
    const testimonial = {
      id: Date.now(),
      name,
      email,
      productId,
      rating,
      message,
      date: new Date().toLocaleDateString(),
      approved: false
    };
    this.testimonials.push(testimonial);
    this.saveTestimonials();
    return testimonial;
  }

  getTestimonials(productId = null) {
    if (!productId) return this.testimonials;
    return this.testimonials.filter(t => t.productId === productId && t.approved);
  }

  processUserMessage(userMessage) {
    // Clean the message
    const message = userMessage.trim().toLowerCase();
    
    // Add to conversation history
    this.conversationHistory.push({
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    });
    
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory.shift();
    }

    // Process the message
    let response = this.generateResponse(message, userMessage);
    
    this.conversationHistory.push({
      type: 'bot',
      message: response,
      timestamp: new Date()
    });

    return response;
  }

  generateResponse(messageLower, originalMessage) {
    // Greeting keywords
    if (this.matchesKeywords(messageLower, ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'what\'s up', 'howdy', 'greetings'])) {
      return getRandomResponse(chatbotResponses.greeting);
    }

    // Farewell keywords
    if (this.matchesKeywords(messageLower, ['bye', 'goodbye', 'see you', 'take care', 'cya', 'farewell', 'goodbye'])) {
      return getRandomResponse(chatbotResponses.farewell);
    }

    // Help menu
    if (this.matchesKeywords(messageLower, ['help', 'menu', 'what can you do', 'options', 'commands', 'help me'])) {
      return this.getHelpMenu();
    }

    // Business info questions
    if (this.matchesKeywords(messageLower, ['about', 'who are you', 'company', 'mission', 'values', 'founded', 'history'])) {
      return this.getBusinessInfo();
    }

    // Check for FAQ matches
    for (const [question, faqData] of Object.entries(chatbotKnowledge.commonQuestions)) {
      for (const keyword of faqData.keywords) {
        if (messageLower.includes(keyword)) {
          return faqData.response;
        }
      }
    }

    // Product search
    if (this.matchesKeywords(messageLower, ['product', 'show me', 'what is', 'tell me about', 'recommend', 'suggest'])) {
      return this.handleProductQuery(originalMessage, messageLower);
    }

    // Add to cart
    if (this.matchesKeywords(messageLower, ['add to cart', 'add', 'buy', 'purchase', 'get', 'want'])) {
      return this.handleCartOperation(originalMessage);
    }

    // Check cart
    if (this.matchesKeywords(messageLower, ['cart', 'what\'s in my cart', 'my cart', 'see cart'])) {
      return this.getCartInfo();
    }

    // Checkout
    if (this.matchesKeywords(messageLower, ['checkout', 'order', 'pay', 'purchase', 'proceed'])) {
      return `Ready to checkout? Click the <strong>Cart & Checkout</strong> button in the top right to complete your order securely!`;
    }

    // Testimonials
    if (this.matchesKeywords(messageLower, ['testimonial', 'review', 'feedback', 'share experience', 'tell you about'])) {
      return this.handleTestimonial();
    }

    // Pricing info
    if (this.matchesKeywords(messageLower, ['price', 'cost', 'how much', 'expensive', 'affordable', 'discount'])) {
      return this.getPricingInfo();
    }

    // Shipping info
    if (this.matchesKeywords(messageLower, ['ship', 'delivery', 'track', 'when arrive', 'express', 'standard'])) {
      return this.getShippingInfo();
    }

    // Returns/Refunds
    if (this.matchesKeywords(messageLower, ['return', 'refund', 'money back', 'not satisfied', 'issue', 'problem'])) {
      return this.getReturnInfo();
    }

    // Ingredients/Safety
    if (this.matchesKeywords(messageLower, ['ingredient', 'safe', 'allergy', 'side effect', 'chemical'])) {
      return this.getIngredientsInfo();
    }

    // Usage instructions
    if (this.matchesKeywords(messageLower, ['how to use', 'how do i', 'instructions', 'apply', 'use', 'usage'])) {
      return this.getUsageInstructions(originalMessage);
    }

    // Contact info
    if (this.matchesKeywords(messageLower, ['contact', 'email', 'phone', 'reach out', 'support', 'customer service'])) {
      return `📧 Email: ${chatbotKnowledge.businessInfo.email}\n📍 Location: ${chatbotKnowledge.businessInfo.location}\n\nWe respond within 24 hours. How else can I help?`;
    }

    // If no match, provide helpful suggestions
    return getRandomResponse(chatbotResponses.notUnderstood) + '\n\n' + getRandomResponse(chatbotResponses.helpfulHints);
  }

  matchesKeywords(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
  }

  handleProductQuery(originalMessage, messageLower) {
    // Try to find specific product
    const product = findProductByName(originalMessage);
    if (product) {
      return formatProductInfo(product);
    }

    // Try category search
    for (const category of Object.keys(chatbotKnowledge.productCategories)) {
      if (messageLower.includes(category.replace('-', ' '))) {
        const products = searchProductByCategory(category);
        if (products.length > 0) {
          let response = `Found ${products.length} product(s) in ${category.replace('-', ' ')}:\n\n`;
          response += products.map(p => 
            `💚 <strong>${p.name}</strong> - $${p.price.toFixed(2)} (${p.rating}⭐)`
          ).join('\n');
          response += '\n\nWhich one interests you?';
          return response;
        }
      }
    }

    // Return all products
    return this.getAllProductsInfo();
  }

  handleCartOperation(originalMessage) {
    const product = findProductByName(originalMessage);
    if (product) {
      // Extract quantity if mentioned
      const quantityMatch = originalMessage.match(/\d+/);
      const quantity = quantityMatch ? parseInt(quantityMatch[0]) : 1;
      
      try {
        if (typeof cartService !== 'undefined') {
          cartService.addItem(product.id, quantity);
          return `✅ Added ${quantity}x <strong>${product.name}</strong> to your cart!\n\n💰 Price: $${(product.price * quantity).toFixed(2)}\n\nReady to checkout? I can help you proceed to payment!`;
        }
      } catch (error) {
        console.error('Cart operation error:', error);
      }
    }
    return `I'd be happy to help you add something to your cart! Which product would you like? You can ask about any of our products like "Big Butt Formula" or "Bum Curve Essential Oil"`;
  }

  getCartInfo() {
    try {
      if (typeof cartService !== 'undefined' && cartService.items) {
        const items = cartService.items;
        if (items.length === 0) {
          return `🛒 Your cart is empty! Let me help you find the perfect product. What are you looking for?`;
        }
        let cartInfo = `🛒 <strong>Your Cart (${items.length} items)</strong>\n\n`;
        let total = 0;
        items.forEach((item, index) => {
          const subtotal = item.price * item.quantity;
          total += subtotal;
          cartInfo += `${index + 1}. ${item.title} × ${item.quantity} = $${subtotal.toFixed(2)}\n`;
        });
        cartInfo += `\n💰 <strong>Total: $${total.toFixed(2)}</strong>\n\nReady to checkout?`;
        return cartInfo;
      }
    } catch (error) {
      console.error('Cart info error:', error);
    }
    return `I can't access your cart right now, but you can view it using the cart button in the top right corner!`;
  }

  getHelpMenu() {
    return `📚 <strong>I can help you with:</strong>\n
🛍️ <strong>Shopping:</strong> Browse products, add to cart, checkout
💰 <strong>Pricing:</strong> Product prices, shipping costs, deals
📦 <strong>Shipping:</strong> Delivery times, tracking, express options
🔄 <strong>Returns:</strong> Refund policy, return process
🌿 <strong>Product Info:</strong> Ingredients, how to use, results timeline
⭐ <strong>Testimonials:</strong> Share your experience, read reviews
✉️ <strong>Contact:</strong> Reach our support team

What would you like to know more about?`;
  }

  getBusinessInfo() {
    const { businessInfo } = chatbotKnowledge;
    return `🌿 <strong>${businessInfo.name}</strong>\n
<strong>Tagline:</strong> ${businessInfo.tagline}
<strong>Location:</strong> ${businessInfo.location}
<strong>Founded:</strong> ${businessInfo.founded}
<strong>Mission:</strong> ${businessInfo.mission}

<strong>Our Values:</strong>
${businessInfo.values.map(v => `✓ ${v}`).join('\n')}

We're passionate about providing natural, high-quality beauty products that truly work! Anything else you'd like to know?`;
  }

  getAllProductsInfo() {
    let response = `🌟 <strong>Our Complete Product Line</strong>\n\n`;
    for (const [id, product] of Object.entries(productsData)) {
      response += `💚 <strong>${product.name}</strong> - $${product.price.toFixed(2)}\n   ${product.description.substring(0, 80)}...\n\n`;
    }
    response += `Ask me about any product for more details!`;
    return response;
  }

  getPricingInfo() {
    return `💰 <strong>Our Pricing:</strong>\n
${Object.entries(productsData).map(([id, p]) => 
  `• ${p.name}: $${p.price.toFixed(2)}${p.originalPrice ? ` (was $${p.originalPrice.toFixed(2)})` : ''}`
).join('\n')}

📢 <strong>Great Deals:</strong>
✓ Free Shipping on orders over $50!
✓ Bundle combos are more affordable than individual items
✓ All prices are final, no hidden charges

Want to add something to your cart?`;
  }

  getShippingInfo() {
    const { shipping } = chatbotKnowledge;
    return `📦 <strong>Shipping Information</strong>\n
<strong>Standard Shipping:</strong>
⏱️ ${shipping.standard.days}
💰 ${shipping.standard.cost}

<strong>Express Shipping:</strong>
⏱️ ${shipping.express.days}
💰 ${shipping.express.cost}

<strong>Policy:</strong> ${shipping.policy}

Questions about your order?`;
  }

  getReturnInfo() {
    const { returns } = chatbotKnowledge;
    return `🔄 <strong>Return & Refund Policy</strong>\n
⏱️ <strong>Return Window:</strong> ${returns.window}
✓ <strong>Condition:</strong> ${returns.condition}
✗ <strong>Note:</strong> ${returns.restrictions}

<strong>Return Process:</strong>
${returns.process.split(' 2) ').map((step, i) => `${i + 1}. ${step}`).join('\n')}

Have an issue with your order? Contact support!`;
  }

  getIngredientsInfo() {
    return `🌿 <strong>Natural & Safe</strong>\n
${chatbotKnowledge.faqs.ingredients}\n
<strong>Allergy Info:</strong> ${chatbotKnowledge.faqs.allergyInfo}\n
<strong>Side Effects:</strong> ${chatbotKnowledge.faqs.sideEffects}\n
Always check your product's ingredient list. Need info on a specific product?`;
  }

  getUsageInstructions(originalMessage) {
    const product = findProductByName(originalMessage);
    if (product && chatbotKnowledge.faqs.howToUse[product.id]) {
      return `📝 <strong>How to Use ${product.name}:</strong>\n
${chatbotKnowledge.faqs.howToUse[product.id]}\n
<strong>Results Timeline:</strong> ${chatbotKnowledge.faqs.resultTimeline}\n
<strong>Storage:</strong> ${chatbotKnowledge.faqs.storageConditions}`;
    }
    return `${chatbotKnowledge.faqs.howToUse.default}\n
<strong>Results Timeline:</strong> ${chatbotKnowledge.faqs.resultTimeline}\n
Which product would you like instructions for?`;
  }

  handleTestimonial() {
    return `⭐ <strong>Share Your Experience!</strong>\n
We'd love to hear from you! Please share:
• Your name
• Product name
• Your rating (1-5 stars)
• Your message/experience

Just reply with these details and we'll add your testimonial! Your feedback helps other customers make the right choice. 💚`;
  }
}

export const chatbotService = new ChatbotService();
