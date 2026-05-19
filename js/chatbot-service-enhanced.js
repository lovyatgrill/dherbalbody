// Enhanced Chatbot Service - Intelligent & Memory-Rich
// Features: Context awareness, conversation threading, semantic understanding, user profiling
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

export class ChatbotServiceEnhanced {
  constructor() {
    this.conversationHistory = [];
    this.maxHistoryLength = 100; // Doubled memory
    this.contextStack = []; // Track conversation topics
    this.userProfile = {}; // Store user preferences
    this.sessionStartTime = new Date();
    this.messageCount = 0;
    
    // Initialize product cache for instant lookup
    this.productCache = new Map();
    this.categoryCache = new Map();
    this.priceIndex = new Map();
    
    this.loadEnhancedData();
    this.initializeIntentMaps();
    this.buildProductCache();
  }

  buildProductCache() {
    // Pre-index all products for lightning-fast lookups
    for (const [id, product] of Object.entries(productsData)) {
      this.productCache.set(id, product);
      
      // Index by price for range queries
      const priceRange = Math.floor(product.price / 25) * 25; // Group by $25
      if (!this.priceIndex.has(priceRange)) {
        this.priceIndex.set(priceRange, []);
      }
      this.priceIndex.get(priceRange).push(product);
      
      // Build name index for fast fuzzy matching
      const nameWords = product.name.toLowerCase().split(/\s+/);
      nameWords.forEach(word => {
        if (!this.categoryCache.has(word)) {
          this.categoryCache.set(word, []);
        }
        this.categoryCache.get(word).push(product);
      });
    }
    
    console.log(`✅ Product cache built: ${this.productCache.size} products indexed`);
  }

  loadEnhancedData() {
    // Load testimonials
    const saved = localStorage.getItem('chatbot-testimonials');
    this.testimonials = saved ? JSON.parse(saved) : [];
    
    // Load user profile
    const userProfileSaved = localStorage.getItem('chatbot-user-profile');
    this.userProfile = userProfileSaved ? JSON.parse(userProfileSaved) : {
      name: null,
      interests: [],
      viewedProducts: [],
      preferences: {},
      lastVisit: new Date().toISOString(),
      visitCount: 0
    };
    
    // Increment visit count
    this.userProfile.visitCount = (this.userProfile.visitCount || 0) + 1;
    this.userProfile.lastVisit = new Date().toISOString();
    this.saveUserProfile();
  }

  saveUserProfile() {
    localStorage.setItem('chatbot-user-profile', JSON.stringify(this.userProfile));
  }

  saveTestimonials() {
    localStorage.setItem('chatbot-testimonials', JSON.stringify(this.testimonials));
  }

  initializeIntentMaps() {
    // Synonyms and variations for better intent matching
    this.intentMap = {
      greeting: {
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'what\'s up', 'howdy', 'greetings', 'yo', 'sup', 'hiya'],
        confidence: 0.95
      },
      farewell: {
        keywords: ['bye', 'goodbye', 'see you', 'take care', 'cya', 'farewell', 'later', 'peace', 'adios', 'bye bye'],
        confidence: 0.95
      },
      help: {
        keywords: ['help', 'menu', 'what can you do', 'options', 'commands', 'assist', 'guide', 'support'],
        confidence: 0.9
      },
      business: {
        keywords: ['about', 'who are you', 'company', 'mission', 'values', 'founded', 'history', 'brand', 'story'],
        confidence: 0.85
      },
      product_search: {
        keywords: ['product', 'show me', 'what is', 'tell me about', 'recommend', 'suggest', 'find', 'search', 'looking for', 'interested in'],
        confidence: 0.8
      },
      add_cart: {
        keywords: ['add to cart', 'add', 'buy', 'purchase', 'get', 'want', 'add it', 'grab', 'order'],
        confidence: 0.85
      },
      view_cart: {
        keywords: ['cart', 'what\'s in my cart', 'my cart', 'see cart', 'view cart', 'shopping cart'],
        confidence: 0.9
      },
      checkout: {
        keywords: ['checkout', 'order', 'pay', 'proceed', 'finalize', 'complete purchase'],
        confidence: 0.9
      },
      shipping: {
        keywords: ['ship', 'delivery', 'track', 'when arrive', 'express', 'standard', 'how long', 'delivery time', 'shipping'],
        confidence: 0.85
      },
      returns: {
        keywords: ['return', 'refund', 'money back', 'not satisfied', 'issue', 'problem', 'exchange', 'damaged'],
        confidence: 0.85
      },
      ingredients: {
        keywords: ['ingredient', 'safe', 'allergy', 'side effect', 'chemical', 'contains', 'made of', 'formula'],
        confidence: 0.8
      },
      usage: {
        keywords: ['how to use', 'how do i', 'instructions', 'apply', 'use', 'usage', 'application', 'process'],
        confidence: 0.8
      },
      price: {
        keywords: ['price', 'cost', 'how much', 'expensive', 'affordable', 'discount', 'sale', 'promo'],
        confidence: 0.85
      },
      testimonial: {
        keywords: ['testimonial', 'review', 'feedback', 'share experience', 'tell you about', 'rating'],
        confidence: 0.8
      },
      contact: {
        keywords: ['contact', 'email', 'phone', 'reach out', 'support', 'customer service', 'call', 'connect'],
        confidence: 0.85
      }
    };
  }

  processUserMessage(userMessage) {
    this.messageCount++;
    const message = userMessage.trim().toLowerCase();
    
    // Extract and store any product mentions
    this.extractProductMentions(userMessage);
    
    // Add to conversation history with metadata
    this.conversationHistory.push({
      type: 'user',
      message: userMessage,
      timestamp: new Date(),
      messageCount: this.messageCount,
      intent: this.detectIntent(message)
    });
    
    // Maintain history size
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory.shift();
    }

    // Generate intelligent response
    let response = this.generateIntelligentResponse(message, userMessage);
    
    // Add bot response to history
    this.conversationHistory.push({
      type: 'bot',
      message: response,
      timestamp: new Date(),
      messageCount: this.messageCount
    });

    return response;
  }

  detectIntent(messageLower) {
    // Score each intent based on keyword matches
    const scores = {};
    
    for (const [intent, data] of Object.entries(this.intentMap)) {
      let matches = 0;
      for (const keyword of data.keywords) {
        if (messageLower.includes(keyword)) {
          matches++;
        }
      }
      // Normalize score
      scores[intent] = (matches / data.keywords.length) * data.confidence;
    }

    // Return highest scoring intent
    const topIntent = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return { intent: topIntent, confidence: scores[topIntent] };
  }

  extractProductMentions(message) {
    // Look for product names and store user interest
    const product = findProductByName(message);
    if (product) {
      if (!this.userProfile.interests.includes(product.id)) {
        this.userProfile.interests.push(product.id);
      }
      if (!this.userProfile.viewedProducts.includes(product.id)) {
        this.userProfile.viewedProducts.push(product.id);
      }
      this.saveUserProfile();
    }
  }

  generateIntelligentResponse(messageLower, originalMessage) {
    const detectedIntent = this.detectIntent(messageLower);
    
    // Check conversation context for better responses
    const recentContext = this.getRecentContext(3); // Last 3 messages
    
    // Route to appropriate handler based on intent
    switch(detectedIntent.intent) {
      case 'greeting':
        return this.handleGreeting();
      
      case 'farewell':
        return this.handleFarewell();
      
      case 'help':
        return this.getEnhancedHelpMenu();
      
      case 'business':
        return this.getBusinessInfo();
      
      case 'product_search':
        return this.handleProductQuery(originalMessage, messageLower);
      
      case 'add_cart':
        return this.handleCartOperation(originalMessage);
      
      case 'view_cart':
        return this.getCartInfo();
      
      case 'checkout':
        return `✨ <strong>Ready to checkout?</strong> Click the <strong>Cart & Checkout</strong> button in the top right to complete your order securely!\n\n💳 We accept all major payment methods.`;
      
      case 'shipping':
        return this.getShippingInfo();
      
      case 'returns':
        return this.getReturnInfo();
      
      case 'ingredients':
        return this.getIngredientsInfo(originalMessage);
      
      case 'usage':
        return this.getUsageInstructions(originalMessage);
      
      case 'price':
        return this.getPricingInfo();
      
      case 'testimonial':
        return this.handleTestimonial();
      
      case 'contact':
        return this.getContactInfo();
      
      default:
        return this.handleNotUnderstood(messageLower, recentContext);
    }
  }

  handleGreeting() {
    // Personalized greeting if we know the user
    if (this.userProfile.name) {
      return getRandomResponse(chatbotResponses.greeting) + ` Welcome back, ${this.userProfile.name}! 👋`;
    }
    
    // Check if they've visited before
    if (this.userProfile.visitCount > 1) {
      return getRandomResponse(chatbotResponses.greeting) + ` Great to see you again! 😊`;
    }
    
    return getRandomResponse(chatbotResponses.greeting);
  }

  handleFarewell() {
    let farewell = getRandomResponse(chatbotResponses.farewell);
    
    // Add personalization
    if (this.messageCount > 5) {
      farewell += '\n\n💚 Thanks for chatting! Don\'t forget to check out your cart!';
    }
    
    return farewell;
  }

  getEnhancedHelpMenu() {
    return `<strong>🌿 How can I help you today?</strong>

💚 <strong>Shop:</strong> "Show me products" or "What do you recommend?"
🛒 <strong>Cart:</strong> "Add to cart" or "View my cart"
📦 <strong>Shipping:</strong> "How long does delivery take?"
💰 <strong>Pricing:</strong> "What are your prices?"
🔄 <strong>Returns:</strong> "What's your return policy?"
📖 <strong>Usage:</strong> "How do I use this?"
⭐ <strong>Reviews:</strong> "Share your experience"
🏢 <strong>About:</strong> "Tell me about DHERBALBODY"
📞 <strong>Support:</strong> "How do I contact you?"

Just type any question and I'll help! 😊`;
  }

  getRecentContext(limit = 3) {
    // Get recent conversation history for context
    return this.conversationHistory
      .filter(msg => msg.type === 'user')
      .slice(-limit)
      .map(msg => msg.message.toLowerCase());
  }

  handleNotUnderstood(messageLower, recentContext) {
    let response = '';
    
    // Try to provide contextual suggestions
    if (messageLower.length < 3) {
      response = `❓ I didn't quite catch that. Could you be more specific?\n\n`;
    } else if (recentContext.length > 0) {
      response = `❓ I'm not sure what you mean. Are you asking about something related to our previous conversation?\n\n`;
    } else {
      response = getRandomResponse(chatbotResponses.notUnderstood) + '\n\n';
    }
    
    // Always provide helpful suggestions
    response += this.getSuggestedTopics();
    
    return response;
  }

  getSuggestedTopics() {
    const suggestions = [
      'Try: "Show me products"',
      'Try: "Tell me about shipping"',
      'Try: "What\'s your return policy?"',
      'Try: "How do I use these?"',
      'Try: "Contact support"'
    ];
    
    return '<strong>Quick suggestions:</strong>\n' + suggestions.slice(0, 3).join('\n');
  }

  handleProductQuery(originalMessage, messageLower) {
    // Try specific product match first using cache
    let product = findProductByName(originalMessage);
    
    // If not found, try fuzzy matching in cache
    if (!product) {
      product = this.fuzzyMatchProduct(messageLower);
    }
    
    if (product) {
      this.userProfile.viewedProducts.push(product.id);
      this.saveUserProfile();
      return this.formatDetailedProductInfo(product);
    }

    // Try category search
    for (const category of Object.keys(chatbotKnowledge.productCategories)) {
      if (messageLower.includes(category.replace('-', ' '))) {
        const products = searchProductByCategory(category);
        if (products.length > 0) {
          let response = `<strong>✨ Found ${products.length} product(s) in ${category.replace('-', ' ')}:</strong>\n\n`;
          response += products.map(p => 
            `💚 <strong>${p.name}</strong> - $${p.price.toFixed(2)} (${p.rating}⭐) - ${p.reviewCount} reviews`
          ).join('\n');
          response += '\n\n<em>Which one interests you? Just type the name!</em>';
          return response;
        }
      }
    }

    // Return all products with recommendation
    return `<strong>🌿 All Our Products:</strong>\n\n` + this.getAllProductsInfoDetailed();
  }

  fuzzyMatchProduct(messageLower) {
    // Try to fuzzy match against cached products
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [id, product] of this.productCache) {
      const name = product.name.toLowerCase();
      const score = this.stringSimilarity(messageLower, name);
      
      if (score > bestScore && score > 0.5) {
        bestScore = score;
        bestMatch = product;
      }
    }
    
    return bestMatch;
  }

  stringSimilarity(str1, str2) {
    // Simple similarity score (0-1)
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  getEditDistance(s1, s2) {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  formatDetailedProductInfo(product) {
    let response = `<strong>💚 ${product.name}</strong>\n\n`;
    
    response += `📊 <strong>Brand:</strong> ${product.brand}\n`;
    response += `💰 <strong>Price:</strong> $${product.price.toFixed(2)}`;
    
    if (product.originalPrice) {
      response += ` <em>(Was $${product.originalPrice.toFixed(2)})</em>`;
    }
    
    response += `\n⭐ <strong>Rating:</strong> ${product.rating}/5 (${product.reviewCount} reviews)\n`;
    response += `📦 <strong>Status:</strong> ${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}\n`;
    
    if (product.isNew) response += `✨ <strong>New Product!</strong>\n`;
    if (product.onSale) response += `🔥 <strong>On Sale!</strong>\n`;
    if (product.isBestSeller) response += `🏆 <strong>Best Seller!</strong>\n`;
    
    response += `\n<strong>📝 Description:</strong>\n${product.description}\n`;
    
    if (product.ingredients) {
      response += `\n<strong>🌿 Key Ingredients:</strong>\n${product.ingredients}\n`;
    }
    
    if (product.features && product.features.length > 0) {
      response += `\n<strong>✨ Features:</strong>\n`;
      response += product.features.map(f => `• ${f}`).join('\n') + '\n';
    }
    
    response += `\n<strong>💪 What to do next:</strong>\n`;
    response += `• "Add ${product.name} to cart"\n`;
    response += `• "How do I use this?"\n`;
    response += `• "Tell me about other products"\n`;
    
    return response;
  }

  getAllProductsInfoDetailed() {
    let response = `<strong>🌿 Complete Product Collection (${this.productCache.size} items):</strong>\n\n`;
    
    // Group by price range
    const priceGroups = {
      'Budget ($45-$65)': [],
      'Premium ($75-$95)': [],
      'Luxury ($150+)': []
    };
    
    for (const product of this.productCache.values()) {
      if (product.price < 70) priceGroups['Budget ($45-$65)'].push(product);
      else if (product.price < 100) priceGroups['Premium ($75-$95)'].push(product);
      else priceGroups['Luxury ($150+)'].push(product);
    }
    
    for (const [group, products] of Object.entries(priceGroups)) {
      if (products.length > 0) {
        response += `<strong>${group}:</strong>\n`;
        response += products.map(p => 
          `💚 ${p.name} - $${p.price.toFixed(2)} (${p.rating}⭐ ${p.reviewCount} reviews)`
        ).join('\n');
        response += '\n\n';
      }
    }
    
    response += `<em>Click on any product to learn more!</em>`;
    return response;
  }

  handleCartOperation(originalMessage) {
    const product = findProductByName(originalMessage);
    if (product) {
      const quantityMatch = originalMessage.match(/\d+/);
      const quantity = quantityMatch ? parseInt(quantityMatch[0]) : 1;
      
      try {
        cartService.addToCart(product.id, quantity);
        return `✅ <strong>Added ${quantity}x ${product.name} to cart!</strong>\n\nYour cart now has ${cartService.getCartCount()} items. 🛒\n\n<strong>Next steps:</strong>\n• Continue shopping: "Show me more products"\n• View cart: "See my cart"\n• Checkout: "Proceed to checkout"`;
      } catch (error) {
        return `❌ Sorry, there was an issue adding to cart. Please try again!`;
      }
    }
    
    return `I'd be happy to add something to your cart! Which product would you like? Try saying "Add Advanced Night Repair" or "Show me products"`;
  }

  getCartInfo() {
    try {
      const cart = cartService.getCart();
      if (!cart || cart.length === 0) {
        return `🛒 <strong>Your cart is empty!</strong>\n\nReady to find something? Try "Show me products" or ask for a recommendation! 💚`;
      }
      
      let response = `<strong>🛒 Your Cart:</strong>\n\n`;
      let total = 0;
      
      cart.forEach(item => {
        const product = productsData.find(p => p.id === item.id);
        if (product) {
          const itemTotal = product.price * item.quantity;
          total += itemTotal;
          response += `• ${product.name} x${item.quantity} - $${itemTotal.toFixed(2)}\n`;
        }
      });
      
      response += `\n<strong>Total: $${total.toFixed(2)}</strong>\n\nReady to checkout? Click the Cart & Checkout button! 🚀`;
      return response;
    } catch (error) {
      return `❌ Error loading cart. Please refresh the page.`;
    }
  }

  getShippingInfo() {
    return `📦 <strong>Shipping Options:</strong>\n\n` +
      `🚚 <strong>Standard Shipping:</strong> 5-7 business days - $25\n` +
      `✈️ <strong>Express Shipping:</strong> 2-3 business days - $25\n\n` +
      `All orders ship from Nigeria. You'll receive tracking info once your order ships!\n\n` +
      `Questions? Contact us at ${chatbotKnowledge.businessInfo.email}`;
  }

  getReturnInfo() {
    return `🔄 <strong>Return & Refund Policy:</strong>\n\n` +
      `• <strong>30-day guarantee:</strong> Return unused products in original packaging\n` +
      `• Full refund or exchange available\n` +
      `• FREE return shipping for defective items\n` +
      `• Contact support to start a return\n\n` +
      `Your satisfaction is our priority! 💚`;
  }

  getIngredientsInfo(originalMessage = '') {
    const product = findProductByName(originalMessage);
    if (product) {
      return `<strong>${product.name}</strong>\n\n` +
        `<strong>✅ Key Ingredients:</strong> ${product.ingredients || 'Natural botanical extracts'}\n\n` +
        `<strong>🌿 Safety:</strong>\n` +
        `• ${product.safety || 'Dermatologically tested and gentle on skin'}\n` +
        `• Free of harsh chemicals\n` +
        `• Cruelty-free and eco-friendly\n\n` +
        `Questions about allergies? Contact us at ${chatbotKnowledge.businessInfo.email}`;
    }
    
    return `<strong>✨ Our Ingredients Philosophy:</strong>\n\n` +
      `All DHERBALBODY products feature natural, botanical extracts carefully selected for their benefits.\n\n` +
      `🌿 <strong>What we avoid:</strong>\n` +
      `• Harsh chemicals\n` +
      `• Artificial fragrances\n` +
      `• Unnecessary fillers\n\n` +
      `Want to know about a specific product? Just tell me which one!`;
  }

  getUsageInstructions(originalMessage = '') {
    const product = findProductByName(originalMessage);
    if (product) {
      return `<strong>📖 How to Use ${product.name}:</strong>\n\n` +
        `${product.instructions || '1. Apply to clean skin\n2. Use twice daily (morning & evening)\n3. Follow with your favorite moisturizer'}\n\n` +
        `💡 <strong>Pro tip:</strong> A little goes a long way!\n\nNeed more help? Contact us! 💚`;
    }
    
    return `Tell me which product you'd like instructions for, and I'll guide you through it! 📖`;
  }

  getPricingInfo() {
    // Build price breakdown from cached products
    const products = Array.from(this.productCache.values()).sort((a, b) => a.price - b.price);
    
    let response = `<strong>💰 Complete Price List:</strong>\n\n`;
    
    // Show all products with pricing
    response += products.map(p => {
      let priceStr = `💚 ${p.name}`;
      priceStr += ` - $${p.price.toFixed(2)}`;
      if (p.originalPrice) priceStr += ` <em>(Reg. $${p.originalPrice.toFixed(2)})</em>`;
      if (p.isBestSeller) priceStr += ` 🏆`;
      if (p.onSale) priceStr += ` 🔥`;
      return priceStr;
    }).join('\n');
    
    response += `\n\n<strong>💳 Payment Info:</strong>\n`;
    response += `• Installment plans available on orders over $100\n`;
    response += `• Flat shipping rate: $25 (all orders)\n`;
    response += `• All prices in USD\n\n`;
    
    response += `<strong>Any product catch your eye?</strong> Just say "Add [product name]"!`;
    
    return response;
  }

  getBusinessInfo() {
    return `<strong>🌿 About DHERBALBODY</strong>\n\n` +
      `We're a premium herbal beauty brand dedicated to natural skincare excellence.\n\n` +
      `<strong>✨ Our Mission:</strong> Empower customers with pure, effective herbal products that celebrate natural beauty.\n\n` +
      `<strong>🌍 Based in:</strong> ${chatbotKnowledge.businessInfo.location}\n\n` +
      `<strong>💚 What we believe:</strong>\n` +
      `• Nature knows best\n` +
      `• Quality over quantity\n` +
      `• Your skin deserves the best\n\n` +
      `Been around since 2020, serving beauty enthusiasts worldwide! ✨`;
  }

  getContactInfo() {
    return `<strong>📞 Get in Touch:</strong>\n\n` +
      `📧 <strong>Email:</strong> ${chatbotKnowledge.businessInfo.email}\n` +
      `📍 <strong>Location:</strong> ${chatbotKnowledge.businessInfo.location}\n\n` +
      `<strong>Response time:</strong> We reply within 24 hours\n\n` +
      `Or just chat with me! I'm here to help 24/7. 💚`;
  }

  getAllProductsInfo() {
    let response = `<strong>🌿 Our Complete Collection (${this.productCache.size} items):</strong>\n\n`;
    response += Array.from(this.productCache.values())
      .slice(0, 7)
      .map((p, i) => `${i + 1}. <strong>${p.name}</strong> - $${p.price.toFixed(2)} (${p.rating}⭐ ${p.reviewCount} reviews)`)
      .join('\n');
    response += `\n\n<em>Which product interests you? Ask about any one!</em>`;
    return response;
  }

  searchProductsByPrice(maxPrice) {
    // Find all products within price range
    const results = Array.from(this.productCache.values())
      .filter(p => p.price <= maxPrice)
      .sort((a, b) => a.price - b.price);
    
    if (results.length === 0) {
      return `No products found under $${maxPrice}. Our most affordable product is $45.`;
    }
    
    let response = `<strong>💰 Products under $${maxPrice}:</strong>\n\n`;
    response += results.map(p => 
      `💚 ${p.name} - $${p.price.toFixed(2)} (${p.rating}⭐)`
    ).join('\n');
    
    return response;
  }

  handleTestimonial() {
    return `⭐ <strong>Share Your Experience!</strong>\n\nYour feedback helps us improve. Would you like to share your thoughts?\n\nOpen the admin panel or contact us directly! 💚`;
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

  // Get conversation analytics
  getAnalytics() {
    return {
      messageCount: this.messageCount,
      conversationDuration: new Date() - this.sessionStartTime,
      historyLength: this.conversationHistory.length,
      userInterests: this.userProfile.interests,
      topIntent: this.getTopIntent(),
      viewedProducts: this.userProfile.viewedProducts
    };
  }

  getTopIntent() {
    const intents = this.conversationHistory
      .filter(msg => msg.intent)
      .map(msg => msg.intent.intent);
    
    if (intents.length === 0) return null;
    
    const frequency = {};
    intents.forEach(intent => {
      frequency[intent] = (frequency[intent] || 0) + 1;
    });
    
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
  }

  // Clear conversation but keep user profile
  clearConversation() {
    this.conversationHistory = [];
    this.contextStack = [];
    this.messageCount = 0;
    console.log('🔄 Conversation cleared, user profile retained');
  }
}

// Create singleton instance
export const chatbotServiceEnhanced = new ChatbotServiceEnhanced();
