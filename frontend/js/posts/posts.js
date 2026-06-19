// posts.js - Handles Posts page functionality

const API_BASE_URL = 'http://localhost:8000';
let allPosts = [];
let filteredPosts = [];

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadPosts();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterPosts();
        });
    }

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterPosts();
        });
    }

    // Post form submission
    const newPostForm = document.getElementById('newPostForm');
    if (newPostForm) {
        newPostForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await createPost();
        });
    }

    // Modal close on outside click
    const modal = document.getElementById('newPostModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeNewPostModal();
            }
        });
    }
}

// Handle authenticated user menu visibility
function handleAuthMenuVisibility() {
    const authToken = localStorage.getItem('pa_token');
    

}

// Load posts from backend
async function loadPosts() {
    try {
        const token = localStorage.getItem('pa_token');
        
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 401) {
            localStorage.removeItem('pa_token');
            localStorage.removeItem('pa_role');
            localStorage.removeItem('pa_role');
            
            window.location.href = 'login.html';
            return null; 
        }

  

        const data = await response.json();
        allPosts = Array.isArray(data) ? data : (data.data || []);
        
        displayPosts(allPosts);
        hideLoadingState();
    } catch (error) {
        console.error('Error loading posts:', error);
        showErrorState();
        hideLoadingState();
    }
}

// Display posts in the container
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    const emptyState = document.getElementById('emptyState');

    if (!posts || posts.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    let html = '';
    posts.forEach(post => {
        const categoryColor = getCategoryColor(post.category);
        const formattedDate = formatDate(post.created_at || post.createdAt || new Date());
        const authorName = post.author_name || post.user_name || 'Anonymous';
        
        html += `
            <div class="card">
                <div class="card-header">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="card-badge" style="${categoryColor}">
                                ${capitalizeFirst(post.category || 'General')}
                            </span>
                        </div>
                        <h3 class="card-title">${escapeHtml(post.title)}</h3>
                    </div>
                </div>
                <p class="card-description">
                    ${escapeHtml(post.body || '')}
                </p>
                <div class="card-footer">
                    <div class="text-xs text-gray-500">
                        <p>Posted by <strong>${escapeHtml(post.author.name)}</strong> • ${formattedDate}</p>
                    </div>
                    <div class="text-xs text-gray-500">
                        <a href="#" class="text-home-coral font-bold hover:underline">View post</a>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    container.classList.remove('hidden');
    emptyState.classList.add('hidden');
    filteredPosts = posts;
}

// Get category color styling
function getCategoryColor(category) {
    const colors = {
        legal: 'background-color: rgb(208,233,223); color: var(--color-social-teal);',
        employment: 'background-color: rgba(255, 107, 107, 0.2); color: var(--color-home-coral);',
        housing: 'background-color: rgba(78, 205, 196, 0.2); color: var(--color-social-teal);',
        education: 'background-color: rgba(255, 217, 61, 0.2); color: var(--color-sunny-yellow);',
        health: 'background-color: rgba(255, 107, 107, 0.2); color: var(--color-home-coral);',
        general: 'background-color: rgba(255, 217, 61, 0.2); color: var(--color-sunny-yellow);'
    };
    return colors[category?.toLowerCase()] || colors.general;
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Filter posts based on search and category
function filterPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value.toLowerCase();
    
    filteredPosts = allPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchTerm);
        const bodyMatch = (post.body || '').toLowerCase().includes(searchTerm);
        const categoryMatch = !category || (post.category || '').toLowerCase() === category;
        
        return (titleMatch || bodyMatch) && categoryMatch;
    });

    displayPosts(filteredPosts);
}

// Create new post
async function createPost() {
    const form = document.getElementById('newPostForm');
    const formData = new FormData(form);
    
    const postData = {
        title: formData.get('title'),
        body: formData.get('body'),
        category: formData.get('category')
    };

    try {
        const token = localStorage.getItem('pa_token');
        
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showNotification('Post created successfully!', 'success');
        closeNewPostModal();
        form.reset();
        
        // Reload posts
        await loadPosts();
    } catch (error) {
        console.error('Error creating post:', error);
        showNotification('Failed to create post. Please try again.', 'error');
    }
}

// Modal functions
function openNewPostModal() {
    animateModal(document.getElementById('newPostModal'), true);
}

function closeNewPostModal() {
    animateModal(document.getElementById('newPostModal'), false);
}

// UI state functions
function hideLoadingState() {
    document.getElementById('loadingState').classList.add('hidden');
}

function showErrorState() {
    document.getElementById('errorState').classList.remove('hidden');
}

// Utility functions
function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
