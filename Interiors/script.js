// ===================================
// Smooth Scroll Navigation
// ===================================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===================================
// Contact Form Handling
// ===================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic validation (HTML5 handles most of this)
    if (name && email && message) {
        // Show toast notification
        showToast();
        
        // Reset form
        contactForm.reset();
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', { name, email, message });
    }
});

// ===================================
// Toast Notification
// ===================================
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Set Current Year in Footer
// ===================================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===================================
// Scroll Animations (Optional Enhancement)
// ===================================
// Add fade-in animations when elements come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll(
        '.stat-card, .portfolio-card, .skill-card, .contact-card, .section-header'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ===================================
// Mobile Menu (if needed in future)
// ===================================
// This is a placeholder for mobile navigation if you add a header menu later

// ===================================
// Performance Optimization
// ===================================
// Lazy load images (modern browsers support this natively via loading="lazy")
// Add loading="lazy" to img tags in HTML for better performance

// ===================================
// Accessibility Enhancements
// ===================================
// Add keyboard navigation for cards
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            // Could open a modal or navigate to project detail
            console.log('Portfolio card activated');
        }
    });
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c👋 Welcome to my Portfolio!', 'color: #8B6F47; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Feel free to reach out!', 'color: #7A9B76; font-size: 14px;');
