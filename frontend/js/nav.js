// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.navbar-toggle');
  const mobileMenu = document.querySelector('.navbar-mobile-menu');
  const navLinks = document.querySelectorAll('.navbar-menu a');

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('hidden');
      
      // Set active link
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Set active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Check if user is logged in (from localStorage)
  const isLoggedIn = localStorage.getItem('authToken');
  const authContainer = document.querySelector('.navbar-auth');
  
  if (isLoggedIn && authContainer) {
    authContainer.innerHTML = `
      <a href="profile.html" class="text-text-main text-sm font-bold hover:text-home-coral transition-colors">Profile</a>
      <button onclick="logout()" class="navbar-btn navbar-btn-secondary">Logout</button>
    `;
  }
});

// Logout function
function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}

// Check if user is logged in (redirect unauthenticated users)
function requireAuth() {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    window.location.href = 'login.html';
  }
}
