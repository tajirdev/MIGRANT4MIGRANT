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

  // Handle mobile menu links
  const mobileMenuLinks = document.querySelectorAll('.navbar-mobile-menu a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('hidden');
      
      // Set active link
      mobileMenuLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
 
  // Set active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Set active on desktop menu
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Set active on mobile menu
  mobileMenuLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Check if user is logged in (from localStorage)
  const isLoggedIn = localStorage.getItem('pa_token');
  const authContainer = document.querySelector('.navbar-auth');
  
  if (isLoggedIn && authContainer) {
    authContainer.innerHTML = `
      <a href="profile.html" class="text-text-main text-sm font-bold hover:text-home-coral transition-colors">Profile</a>
      <button onclick="logout()" class="navbar-btn navbar-btn-secondary">Logout</button>
    `;
    
    // Update mobile menu auth buttons
    const mobileAuthLinks = document.querySelectorAll('.navbar-mobile-menu a[href="login.html"], .navbar-mobile-menu a[href="migrant_reg.html"]');
    if (mobileAuthLinks.length >= 2) {
      mobileAuthLinks[0].textContent = 'Profile';
      mobileAuthLinks[0].href = 'profile.html';
      mobileAuthLinks[0].classList.remove('navbar-btn-secondary');
      mobileAuthLinks[0].classList.add('text-text-main', 'text-sm', 'font-bold', 'hover:text-home-coral', 'transition-colors');
      
      mobileAuthLinks[1].textContent = 'Logout';
      mobileAuthLinks[1].onclick = function() { logout(); return false; };
      mobileAuthLinks[1].href = '#';
    }
    
    // Show hidden menu items for logged-in users
    document.getElementById("community").hidden=false
    document.getElementById("mentor").hidden = false
    document.getElementById("resource").hidden = false
  }
});

// Check if user is logged in (redirect unauthenticated users)
function requireAuth() {
  const authToken = localStorage.getItem('pa_token');
  if (!authToken) {
    window.location.href = 'login.html';
    
  }
    
}

// Logout function
function logout() {
  localStorage.removeItem('pa_token');
  localStorage.removeItem('pa_email');
  localStorage.removeItem('pa_role');

  window.location.href = 'login.html';
}
  

