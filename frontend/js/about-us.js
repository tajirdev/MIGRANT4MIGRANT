// about-us.js - Handles About Us page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for any anchor links
    setupSmoothScroll();
    
    // Handle authenticated user menu visibility
    handleAuthMenuVisibility();
});

// Setup smooth scrolling for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle authenticated user menu visibility
function handleAuthMenuVisibility() {
    const authToken = localStorage.getItem('pa_token');
    
    if (authToken) {
        // Show authenticated user menu items (desktop menu only)
        // [TEMP REMOVED] Community link unhiding
        // const communityLink = document.getElementById('community');
        const resourceLink = document.getElementById('resource');

        // if (communityLink) communityLink.hidden = false;
        if (resourceLink) resourceLink.hidden = false;
    }
}

// Scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.card, .glass-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
});
