// Comprehensive Chatbot Knowledge Base - No LLM Required
import { productsData } from './data.js';

export const chatbotKnowledge = {
  // Business Information
  businessInfo: {
    name: 'DHERBALBODY',
    tagline: 'Best store for Health and Beauty products',
    description: 'We offer premium herbal and natural skincare products focused on body enhancement and beauty.',
    location: 'Nigeria',
    email: 'support@dherbalbody.com',
    founded: '2020',
    mission: 'Providing natural, handmade beauty products with proven results',
    values: ['Natural Ingredients', 'Quality Tested', 'Customer Satisfaction', 'Fast Shipping']
  },

  // Shipping & Delivery
  shipping: {
    standard: {
      name: 'Standard Shipping',
      days: '5-7 business days',
      cost: '$25'
    },
    express: {
      name: 'Express Shipping',
      days: '2-3 business days',
      cost: '$25'
    },
    policy: 'We ship worldwide. Orders are processed within 24 hours. Tracking information provided via email. All shipping is $25.'
  },

  // Returns & Refunds
  returns: {
    window: '30 days',
    condition: 'Products must be unused and in original packaging',
    process: '1) Contact support 2) Get return label 3) Ship back 4) Receive refund within 5-7 days',
    restrictions: 'Opened products cannot be returned due to hygiene regulations'
  },

  // Payment Methods
  payment: {
    accepted: ['Credit/Debit Card (Visa, Mastercard, American Express)', 'PayPal', 'Apple Pay', 'Google Pay'],
    security: 'All transactions are encrypted and secure',
    installments: 'Available on orders over $100'
  },

  // FAQs
  faqs: {
    howToUse: {
      'bumcurve-essential-oil': 'Apply 2-3 times daily on clean, dry skin. Massage gently in circular motions. Results visible within 2-3 weeks with consistent use.',
      'big-butt-formula': 'Apply morning and night to target areas. Use with massage for best results. Handmade formula works best with proper application.',
      'weight-gain-powder': 'Mix 1 scoop with daily meals or beverages. Can be added to cereal, yogurt, or desserts. Results visible within 14 days.',
      'curves-n-butt-powder': 'Mix with cereal, meals, or desserts. Consume daily for optimal results. Works best with consistent 14+ days of use.',
      'milk-lotion-triple-serum': 'Apply lotion first, then apply Triple Action Serum. Use in morning for sunscreen protection. Best for light skin types.',
      default: 'Apply to clean skin. Follow the instructions on the product label. Consistency is key for visible results.'
    },
    storageConditions: 'Store in cool, dry place away from direct sunlight. Keep containers tightly closed. All products are best used within 12 months of opening.',
    skinnySuitability: 'All products are formulated for body enhancement and curves. They work best with healthy diet and exercise.',
    allergyInfo: 'Products contain natural ingredients. Always check ingredient list for allergies. Perform patch test before full application.',
    sideEffects: 'Natural products are generally safe. Mild tingling or slight redness is normal initially. Discontinue if allergic reaction occurs.',
    resultTimeline: '2-3 weeks for noticeable results, 30-60 days for significant visible changes with consistent use',
    ingredients: 'All products use natural, organic ingredients. No harmful chemicals or artificial additives.'
  },

  // Product Information
  productCategories: {
    'body-creams': ['mini-combo-set', 'big-butt-formula'],
    'essential-oils': ['bumcurve-essential-oil'],
    'powders': ['weight-gain-powder', 'curves-n-butt-powder'],
    'serums-lotions': ['milk-lotion-triple-serum'],
    'combo-sets': ['mini-combo-set', 'omega-combo-max']
  },

  // Common Questions
  commonQuestions: {
    'What products do you have?': {
      response: `We offer a premium collection of natural body enhancement products:
• Mini Combo Set ($95) - Combination cream & oils
• Weight Gain Powder ($50) - Natural weight gain formula
• Bum Curve Essential Oil ($45) - Curved enhancement oil
• CURVES AND BUTT POWDER ($50) - Protein powder formula
• OMEGA COMBO MAX ($150) - Premium combo set
• Big Butt Formula ($60) - Handmade herbal cream
• Milk Lotion & Triple Serum ($75) - Brightening lotion set

All products are handmade, natural, and tested. Would you like details on any product?`,
      keywords: ['products', 'what do you sell', 'product list', 'catalog']
    },
    'What are your prices?': {
      response: `Our product prices range from $45 to $150:
• Budget-Friendly: Essential Oil ($45), Powders ($50)
• Mid-Range: Creams ($60-$95)
• Premium: Combo Max ($150)

We offer flat $25 shipping! What product interests you?`,
      keywords: ['price', 'cost', 'how much', 'pricing']
    },
    'How long for shipping?': {
      response: `We offer flexible shipping options:
📦 Standard Shipping: 5-7 business days - $25
🚀 Express Shipping: 2-3 business days - $25

Orders process within 24 hours. You'll get tracking info via email. Where are you shipping to?`,
      keywords: ['shipping', 'delivery', 'how long', 'when arrive']
    },
    'Can I return products?': {
      response: `Yes! We have a 30-day return policy:
✓ Unused products in original packaging
✓ Full refund within 5-7 days after return received
✗ Opened products cannot be returned (hygiene regulations)

Contact support with your order number to start a return. Simple process!`,
      keywords: ['return', 'refund', 'money back', 'not satisfied']
    },
    'Are the products natural?': {
      response: `Absolutely! All DHERBALBODY products are:
✓ Made with natural, organic ingredients
✓ Handmade with care
✓ No harmful chemicals
✓ No artificial additives
✓ Lab-tested and proven effective

We pride ourselves on quality and purity. Check product descriptions for ingredient lists!`,
      keywords: ['natural', 'organic', 'ingredients', 'safe']
    },
    'How do your products work?': {
      response: `Our products work through natural formulations:
• Herbal ingredients support body enhancement
• Natural oils nourish and firm skin
• Powders provide internal nutritional support
• Consistent use (2-4 weeks) shows visible results
• Works best with healthy lifestyle

Most customers see results within 2-3 weeks! Want specific product info?`,
      keywords: ['how does it work', 'how effective', 'will it work', 'does it really work']
    },
    'Do you offer testimonials?': {
      response: `Yes! We'd love to hear about your experience! After purchasing, you can share your testimonial with us:
• Product reviews & ratings
• Before & after feedback
• Usage tips & results

Your honest feedback helps other customers. We even feature customer testimonials on our site!`,
      keywords: ['testimonial', 'review', 'feedback', 'customer experience']
    }
  },

  // Order Processing Keywords
  orderKeywords: {
    checkout: ['checkout', 'buy', 'purchase', 'place order', 'pay', 'process order'],
    cart: ['add to cart', 'add', 'cart', 'shopping bag'],
    account: ['my account', 'orders', 'order history', 'login']
  }
};

export const chatbotResponses = {
  greeting: [
    "Hey there! 👋 Welcome to DHERBALBODY! I'm your virtual assistant. How can I help you today?",
    "Hi! Welcome to DHERBALBODY! Looking for beauty products or have questions? I'm here to help!",
    "Hello! 🌿 I'm your DHERBALBODY assistant. What can I do for you today?"
  ],
  
  farewell: [
    "Thanks for chatting! Enjoy shopping with DHERBALBODY! 💚",
    "Bye! Hope to see you soon with your order! 👋",
    "Take care! Don't hesitate to reach out if you have more questions!"
  ],

  notUnderstood: [
    "I'm not quite sure about that. Can you rephrase? Or ask about products, shipping, returns, or pricing?",
    "I didn't catch that. Try asking about specific products or our policies!",
    "Hmm, I'm still learning! Ask me about DHERBALBODY products or services instead."
  ],

  helpfulHints: [
    "💡 Tip: Ask me about specific products like 'Bum Curve Essential Oil' or 'Big Butt Formula'",
    "💡 Try: 'What's the price?' or 'How long for shipping?'",
    "💡 Need help? Ask about returns, shipping, ingredients, or how to use products!"
  ],

  productSuggestions: [
    "🌟 Best sellers: Mini Combo Set and Big Butt Formula - both highly rated!",
    "⭐ New arrivals: Bum Curve Essential Oil and Milk Lotion & Triple Serum",
    "💰 Budget pick: Powders at $50 - great value!"
  ]
};

export function findProductByName(query) {
  const searchTerm = query.toLowerCase();
  for (const [id, product] of Object.entries(productsData)) {
    if (
      product.name.toLowerCase().includes(searchTerm) ||
      id.toLowerCase().includes(searchTerm) ||
      (product.category && product.category.toLowerCase().includes(searchTerm))
    ) {
      return product;
    }
  }
  return null;
}

export function formatProductInfo(product) {
  if (!product) return 'Product not found.';
  
  return `
🛍️ <strong>${product.name}</strong>
📊 Brand: ${product.brand}
💰 Price: $${product.price.toFixed(2)}
⭐ Rating: ${product.rating}/5 (${product.reviewCount} reviews)
📦 Status: ${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
📝 Description: ${product.description}

Would you like to add this to your cart or learn more about usage?
  `.trim();
}

export function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

export function buildProductRecommendation(budget) {
  const budgetNum = parseFloat(budget);
  if (isNaN(budgetNum)) return null;

  for (const [id, product] of Object.entries(productsData)) {
    if (product.price <= budgetNum) {
      return product;
    }
  }
  return null;
}

export function searchProductByCategory(category) {
  const categoryKey = category.toLowerCase().replace(/\s/g, '-');
  const ids = chatbotKnowledge.productCategories[categoryKey];
  if (!ids) return [];
  return ids.map(id => productsData[id]).filter(p => p);
}
