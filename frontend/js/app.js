function requireAuth() {
  const authToken = localStorage.getItem('pa_token');
  if (!authToken) {
    window.location.href = 'login.html';
    
  }
    
}






// Global Notification System
function showNotification(message, type = 'error', duration = 4000) {
    const container = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            ${type === 'success' ? 
                '<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' :
                '<svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>'
            }
        </div>
        <div class="toast-text">${message}</div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-slide-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
}

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
    document.querySelectorAll(".community").forEach(function(element){
      element.hidden = false;
    });

    document.querySelectorAll(".posts").forEach(function(element){
      element.hidden = false;
    });
    
    document.querySelectorAll(".resource").forEach(function(element) {
    element.hidden = false;
   });
  }
});

// Check if user is logged in (redirect unauthenticated users)


function checkTokenExpiry() {
    const token = localStorage.getItem('pa_token'); 
    

       if(token){
        const payloadBase64 = token.split('.')[1];
        
        
        const decodedJson = atob(payloadBase64);
        const payload = JSON.parse(decodedJson);

       
        const currentTime = Math.floor(Date.now() / 1000);
        

        if (currentTime >= payload.exp) {
            console.warn("Session expired. Redirecting to login...");
            localStorage.removeItem('pa_token');
            localStorage.removeItem('pa_email');
            localStorage.removeItem('pa_role');
            location.reload();
            window.location.href = 'index.html';
        }
        }

    } 


checkTokenExpiry();


function logout() {
  localStorage.removeItem('pa_token');
  localStorage.removeItem('pa_email');
  localStorage.removeItem('pa_role');

  window.location.href = 'index.html';
}
  

