// ===================================
// Smooth Scroll Navigation
// ===================================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// // ===================================
// // Contact Form Handling
// // ===================================
// const contactForm = document.getElementById('contactForm');

// contactForm.addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     // Get form values
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const message = document.getElementById('message').value;
    
//     // Basic validation (HTML5 handles most of this)
//     if (name && email && message) {
//         // Show toast notification
//         showToast();
        
//         // Reset form
//         contactForm.reset();
        
//         // In a real application, you would send this data to a server
//         console.log('Form submitted:', { name, email, message });
//     }
// });

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


// ===============================
// Auto-load 2D Designs from folder
// ===============================
const design2dGrid = document.getElementById("design2d-grid");
const designsFolder = "assets/2d-designs/";
const totalImages = 13; // <-- change this to how many images are in folder

let imageList = [];

// Load images automatically
for (let i = 1; i <= totalImages; i++) {
    const imgPath = `${designsFolder}${i}.png`;

    const card = document.createElement("div");
    card.classList.add("portfolio-card");

    card.innerHTML = `
        <div class="portfolio-image-wrapper">
            <img src="${imgPath}" class="portfolio-image" loading="lazy">
        </div>
    `;

    design2dGrid.appendChild(card);
    imageList.push(imgPath);

    // Click to open viewer
    card.addEventListener("click", () => openViewer(i - 1));
}

// ===============================
// Image Viewer (Lightbox)
// ===============================
const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImage");
const closeViewerBtn = document.getElementById("closeViewer");
const nextBtn = document.getElementById("nextImg");
const prevBtn = document.getElementById("prevImg");

let currentIndex = 0;

function openViewer(index) {
    currentIndex = index;
    viewerImg.src = imageList[currentIndex];
    viewer.style.display = "flex";
}

function closeViewer() {
    viewer.style.display = "none";
}

function showNext() {
    currentIndex = (currentIndex + 1) % imageList.length;
    viewerImg.src = imageList[currentIndex];
}

function showPrev() {
    currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    viewerImg.src = imageList[currentIndex];
}

// Buttons
closeViewerBtn.onclick = closeViewer;
nextBtn.onclick = showNext;
prevBtn.onclick = showPrev;

// Close on background click
viewer.addEventListener("click", (e) => {
    if (e.target === viewer) closeViewer();
});
