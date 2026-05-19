// Chatbot Testimonial Integration Examples
// Use these examples to integrate testimonials in other parts of your site

// ============================================
// Example 1: Add Testimonial After Successful Order
// ============================================
// Place this code after order completion

import { chatbotService } from './chatbot-service.js';

function onOrderComplete(orderId, customerName, customerEmail, products) {
  // Offer customer to leave testimonial
  const promptTestimonial = confirm(
    `Thanks for your order, ${customerName}! Would you like to share your feedback?`
  );
  
  if (promptTestimonial) {
    // Open chatbot automatically
    const chatbotWindow = document.getElementById('chatbot-window');
    if (chatbotWindow) {
      chatbotWindow.classList.remove('hidden');
    }
    
    // Send message to chatbot
    const message = `I just purchased from order ${orderId}. I'd like to share a testimonial about my experience!`;
    chatbotService.processUserMessage(message);
  }
}

// ============================================
// Example 2: Programmatic Testimonial Addition
// ============================================
// Add testimonial directly (bypassing chat interface)

function addProgrammaticTestimonial(
  customerName,
  customerEmail,
  productId,
  rating,
  testimonialMessage
) {
  const testimonial = chatbotService.addTestimonial(
    customerName,
    customerEmail,
    productId,
    rating,
    testimonialMessage
  );
  
  console.log('Testimonial added:', testimonial);
  return testimonial;
}

// Usage:
// addProgrammaticTestimonial(
//   'John Doe',
//   'john@example.com',
//   'big-butt-formula',
//   5,
//   'Amazing product! Visible results within 2 weeks. Highly recommend!'
// );

// ============================================
// Example 3: Show Testimonial Widget on Product Pages
// ============================================
// Display approved testimonials for a specific product

function displayProductTestimonials(productId, containerId) {
  const testimonials = chatbotService.getTestimonials(productId);
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  if (testimonials.length === 0) {
    container.innerHTML = '<p>No testimonials yet. Be the first to share!</p>';
    return;
  }
  
  const html = testimonials.map(t => `
    <div class="testimonial-widget">
      <div class="testimonial-rating">${'⭐'.repeat(t.rating)}</div>
      <p class="testimonial-message">"${t.message}"</p>
      <p class="testimonial-author">- ${t.name}, ${t.date}</p>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

// Usage:
// <div id="product-testimonials"></div>
// <script>displayProductTestimonials('big-butt-formula', 'product-testimonials');</script>

// ============================================
// Example 4: Get Testimonial Statistics
// ============================================

function getTestimonialStats() {
  const testimonials = chatbotService.getTestimonials();
  
  if (testimonials.length === 0) {
    return {
      total: 0,
      averageRating: 0,
      approved: 0,
      pending: 0
    };
  }
  
  const approved = testimonials.filter(t => t.approved).length;
  const pending = testimonials.filter(t => !t.approved).length;
  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = (totalRating / testimonials.length).toFixed(1);
  
  return {
    total: testimonials.length,
    averageRating: parseFloat(averageRating),
    approved,
    pending,
    fourStarPlus: testimonials.filter(t => t.rating >= 4).length
  };
}

// Usage:
// const stats = getTestimonialStats();
// console.log(`Average Rating: ${stats.averageRating}⭐ from ${stats.total} reviews`);

// ============================================
// Example 5: Export Testimonials to CSV
// ============================================

function exportTestimonialsToCSV() {
  const testimonials = chatbotService.getTestimonials();
  
  if (testimonials.length === 0) {
    alert('No testimonials to export');
    return;
  }
  
  // CSV Headers
  const headers = ['Date', 'Name', 'Email', 'Product', 'Rating', 'Message', 'Status'];
  
  // CSV Rows
  const rows = testimonials.map(t => [
    t.date,
    t.name,
    t.email,
    t.productId,
    t.rating,
    `"${t.message}"`, // Quote to handle commas in message
    t.approved ? 'Approved' : 'Pending'
  ]);
  
  // Build CSV
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `testimonials_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Usage:
// <button onclick="exportTestimonialsToCSV()">Export Testimonials</button>

// ============================================
// Example 6: Testimonial Notification System
// ============================================
// Get notified when new testimonials are submitted

function setupTestimonialNotifications() {
  let previousCount = chatbotService.getTestimonials().length;
  
  // Check for new testimonials every minute
  setInterval(() => {
    const currentCount = chatbotService.getTestimonials().length;
    
    if (currentCount > previousCount) {
      const newTestimonialCount = currentCount - previousCount;
      console.log(`🎉 ${newTestimonialCount} new testimonial(s) received!`);
      
      // Show notification
      showNotification(
        `You have ${newTestimonialCount} new testimonial(s)!`,
        'Please review in the admin panel.'
      );
      
      previousCount = currentCount;
    }
  }, 60000); // Check every minute
}

function showNotification(title, message) {
  // You can customize this notification
  console.log(`📢 ${title}: ${message}`);
  
  // Optional: Use browser notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: message });
  }
}

// Usage:
// setupTestimonialNotifications();

// ============================================
// Example 7: Backup Testimonials to Server
// ============================================
// Send testimonials to your backend for permanent storage

async function backupTestimonials() {
  const testimonials = chatbotService.getTestimonials();
  
  try {
    const response = await fetch('/api/testimonials/backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        testimonials,
        backupTime: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      console.log('✅ Testimonials backed up successfully');
      return true;
    } else {
      console.error('Failed to backup testimonials');
      return false;
    }
  } catch (error) {
    console.error('Backup error:', error);
    return false;
  }
}

// Usage:
// backupTestimonials();

// ============================================
// Export Functions for Use
// ============================================

export {
  onOrderComplete,
  addProgrammaticTestimonial,
  displayProductTestimonials,
  getTestimonialStats,
  exportTestimonialsToCSV,
  setupTestimonialNotifications,
  backupTestimonials
};
