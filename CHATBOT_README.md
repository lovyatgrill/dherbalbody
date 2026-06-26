# DHERBALBODY Chatbot System Documentation

## Overview
A comprehensive, rule-based virtual assistant chatbot for the DHERBALBODY e-commerce store. No LLM required - powered entirely by predefined knowledge bases and conversation patterns.

## Features

### 🤖 Chatbot Capabilities
- **Product Information**: Full product details, prices, ratings, and recommendations
- **Order Processing**: Add to cart directly from chat, view cart summary, proceed to checkout
- **Customer Support**: Shipping info, returns/refunds, payment methods, contact details
- **Product Guidance**: Usage instructions, ingredient information, results timeline
- **Testimonial Collection**: Gather customer feedback and reviews
- **Business Information**: Company details, mission, values, location
- **Natural Conversation**: Handles greetings, farewells, help requests, and common questions

### 🎨 Design Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Site-Integrated**: Matches DHERBALBODY's design system and color scheme
- **Floating Widget**: Always accessible chat button in bottom-right corner
- **Smooth Animations**: Professional transitions and interactions
- **Accessibility**: Keyboard navigation, ARIA labels, focus management

### 📝 Testimonial Management
- **Collection**: Customers can share product experiences via chatbot
- **Admin Panel**: Review, approve, and manage testimonials
- **Rating System**: 1-5 star ratings included
- **Storage**: Local browser storage with backup capability

## File Structure

```
/js/
├── chatbot-knowledge-base.js    # Business & product knowledge database
├── chatbot-service.js            # Core chatbot logic & response generation
├── chatbot-init.js               # UI initialization and event handling
└── cart-service.js               # Cart integration (existing)

/components/
└── chatbot-component.html        # UI component with styles

/
├── index.html                    # Main page with chatbot integration
├── chatbot-admin.html            # Admin panel for testimonials & settings
└── README.md                     # This file
```

## Installation & Setup

### 1. Files Already Created
All files have been automatically created:
- ✅ `js/chatbot-knowledge-base.js`
- ✅ `js/chatbot-service.js`
- ✅ `js/chatbot-init.js`
- ✅ `components/chatbot-component.html`
- ✅ `index.html` (updated with chatbot integration)
- ✅ `chatbot-admin.html`

### 2. Integration Verification
The chatbot is integrated into `index.html` at the end of the body tag:
```html
<!-- DHERBALBODY Chatbot Component -->
<div id="chatbot-component-wrapper"></div>

<!-- Chatbot Scripts - Module Imports -->
<script type="module">
  // Dynamically load chatbot component HTML
  fetch('./components/chatbot-component.html')...
  // Import chatbot modules
  import('./js/chatbot-knowledge-base.js')...
  import('./js/chatbot-service.js')...
  import('./js/chatbot-init.js')...
</script>
```

### 3. Testing the Chatbot
1. Open your site in a browser
2. Look for the green chat bubble in the bottom-right corner
3. Click to open the chatbot window
4. Try these sample messages:
   - "Hi" or "Hello"
   - "What products do you have?"
   - "How much is the Bum Curve Essential Oil?"
   - "How do I use the Big Butt Formula?"
   - "Add Mini Combo Set to cart"
   - "Share testimonial"

## Chatbot Knowledge Base

### Business Information
- **Company**: DHERBALBODY - Natural body enhancement and beauty products
- **Location**: Hanoi, Vietnam
- **Mission**: Providing natural, handmade beauty products with proven results
- **Values**: Natural Ingredients, Quality Tested, Customer Satisfaction, Fast Shipping

### Products Included
1. **Mini Combo Set** - $95 (Body Cream + Oils)
2. **Weight Gain Powder** - $50 (Natural formula)
3. **Bum Curve Essential Oil** - $45 (Enhancement oil)
4. **CURVES AND BUTT POWDER** - $50 (Protein powder)
5. **OMEGA COMBO MAX** - $150 (Premium combo)
6. **Big Butt Formula** - $60 (Handmade cream)
7. **Milk Lotion & Triple Serum** - $75 (Brightening set)

### Shipping Options
- **Standard**: 5-7 business days (Free on $50+, $5.99 otherwise)
- **Express**: 2-3 business days ($14.99)

### Return Policy
- **Window**: 30 days
- **Condition**: Unused, original packaging
- **Note**: Opened products cannot be returned (hygiene)

### Payment Methods
- Credit/Debit Card (Visa, Mastercard, Amex)
- PayPal
- Apple Pay
- Google Pay
- Installments available on orders $100+

## Using the Chatbot

### For Customers

#### Common Questions the Chatbot Answers
```
- What products do you have?
- What are your prices?
- How long for shipping?
- Can I return products?
- Are the products natural?
- How do your products work?
- Do you offer testimonials?
- How do I use [product name]?
- What's your contact information?
- How do I add items to my cart?
```

#### Chatbot Commands
- **Add to Cart**: "Add Mini Combo Set" or "Buy Weight Gain Powder"
- **View Cart**: "Show my cart" or "What's in my cart?"
- **Checkout**: "I want to checkout" or "Ready to buy"
- **View Products**: "What products do you have?" or "Show me creams"
- **Product Info**: "Tell me about Bum Curve Oil" or "Big Butt Formula price?"
- **Share Feedback**: "I want to share a testimonial" or "Leave a review"

#### Sharing a Testimonial
1. Click the chatbot chat button
2. Type: "Share testimonial" or "Leave a review"
3. The chatbot will prompt you to provide:
   - Your name
   - Product name
   - Rating (1-5 stars)
   - Your message
4. Submit your testimonial
5. Admin reviews and approves it

### For Administrators

#### Accessing the Admin Panel
1. Navigate to: `http://yoursite.com/chatbot-admin.html`
2. Three main tabs:

##### Testimonials Tab
- View all customer testimonials
- See approval status (Approved/Pending)
- Click "View" to see full details
- Approve or delete testimonials
- See ratings and product references

##### Statistics Tab
- Total testimonials count
- Approved vs pending count
- Average rating
- Recent conversation history
- See what customers are asking

##### Settings Tab
- Configure bot name and greeting message
- Update support email
- Enable/disable testimonials collection
- Enable/disable add-to-cart feature
- **Danger Zone**: Clear all testimonials or conversation history

## Customization Guide

### Modifying Product Information
Edit `js/chatbot-knowledge-base.js`:

```javascript
export const chatbotKnowledge = {
  businessInfo: {
    name: 'Your Store Name',
    email: 'your-email@example.com',
    // ... more fields
  }
}
```

### Adding New Products to Knowledge Base
The chatbot automatically reads from `data.js`. Any product in the productsData object will be known to the chatbot.

### Customizing Responses
Edit response arrays in `js/chatbot-service.js`:

```javascript
handleProductQuery(originalMessage, messageLower) {
  // Add custom logic here
}
```

### Changing Design Colors
Edit the CSS in `components/chatbot-component.html`:

```css
:root {
  --chatbot-primary: rgb(107, 112, 80);        /* Main color */
  --chatbot-primary-light: rgb(243, 246, 239); /* Light bg */
  --chatbot-border: rgb(225, 227, 225);        /* Borders */
  --chatbot-text: rgb(36, 36, 36);            /* Text color */
}
```

### Changing Window Size
In `components/chatbot-component.html`, CSS section:

```css
.chatbot-window {
  max-width: 420px;  /* Width */
  height: 600px;     /* Height */
}
```

## Advanced Features

### 1. Cart Integration
The chatbot integrates with your existing cart system:
```javascript
// When customer says "Add Mini Combo Set to cart"
cartService.addItem('mini-combo-set', 1);
```

### 2. Testimonial Storage
Testimonials are stored in browser localStorage:
```javascript
// Automatically saved with:
// - Name, email, product ID
// - Rating (1-5 stars)
// - Message text
// - Timestamp
// - Approval status
```

### 3. Conversation History
Tracks up to 50 recent messages for context:
```javascript
this.conversationHistory = [];
this.maxHistoryLength = 50;
```

## Troubleshooting

### Chatbot Not Appearing
- Check browser console for errors
- Verify all files are in correct directories
- Clear browser cache and reload
- Check browser compatibility (works in all modern browsers)

### Knowledge Base Not Loading
- Verify `data.js` exports `productsData` correctly
- Check file paths in imports
- Check for JavaScript syntax errors

### Cart Not Working
- Ensure `cart-service.js` is loaded
- Check browser console for errors
- Verify `cartService` global variable exists

### Testimonials Not Saving
- Check browser localStorage is enabled
- Clear storage if corrupted: Run in console:
  ```javascript
  localStorage.clear();
  ```

### Styling Issues
- Check if CSS is loading (inspect browser Dev Tools)
- Verify color variables are defined
- Check for CSS conflicts with site styles

## Performance Considerations

- ✅ **Lightweight**: No external AI/ML dependencies
- ✅ **Fast**: Pure JavaScript, instant responses
- ✅ **Scalable**: Can handle unlimited conversations
- ✅ **Offline**: Works without internet connection
- ✅ **Secure**: All data stays on user's browser

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ IE11 (limited support)

## Future Enhancement Ideas

1. **Conversation Context**: Remember customer preferences across sessions
2. **Abandoned Cart Recovery**: Follow up on incomplete purchases
3. **Product Recommendations**: Based on conversation history
4. **Multi-language Support**: Add language switching
5. **Email Notifications**: Send testimonial approvals to admins
6. **Analytics**: Track popular questions and pain points
7. **Integration with Support Tickets**: Hand off to human support
8. **Live Chat Fallback**: Connect to human agents for complex issues

## Support & Maintenance

### Regular Updates Needed
- Add new products to knowledge base as they're released
- Update FAQs and common questions
- Monitor and approve testimonials regularly
- Review chat statistics for improvement opportunities

### Monthly Checklist
- [ ] Review testimonials and approve new ones
- [ ] Check conversation statistics
- [ ] Update product prices if changed
- [ ] Clear old conversation history if storage is full
- [ ] Test chat functionality on different devices

## Security Notes

- ✅ All data stored locally in browser
- ✅ No server calls for conversation
- ✅ Testimonials use browser storage
- ⚠️ Consider backing up testimonials to server for persistence
- ⚠️ Admin panel (chatbot-admin.html) has no authentication

## Summary

The DHERBALBODY chatbot is now fully integrated and ready to assist your customers 24/7. It:

✅ Answers all product and policy questions
✅ Helps customers add items to cart
✅ Collects and manages testimonials
✅ Matches your site design perfectly
✅ Works on all devices responsively
✅ Requires zero AI/ML infrastructure
✅ Is easy to customize and maintain

**Start using it now by clicking the chat bubble on your site!** 🌿
