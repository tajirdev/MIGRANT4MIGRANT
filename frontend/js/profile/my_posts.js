// my_posts.js - Handles "My Posts" tab in Profile page

const POSTS_API_URL = 'http://localhost:8000';

// SVG icon templates (no emojis, no text labels)
const EDIT_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>';
const DELETE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>';

// Load user's posts
// Load user's posts
async function loadMyPosts() {
    const container = document.getElementById('myPostsContainer');
    const emptyState = document.getElementById('myPostsEmpty');
    
    if (!container) return;
    
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Loading your posts...</p>';
    
    try {
        const token = localStorage.getItem('pa_token');
        
        // Make sure this matches your backend route exactly! 
        // If it should be /posts/me, change it here.
        const response = await fetch(`${POSTS_API_URL}/pots/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            localStorage.removeItem('pa_token');
            localStorage.removeItem('pa_role');
            localStorage.removeItem('pa_email');
            window.location.href = 'login.html';
            return;
        }

        if (response.status === 404) {
            console.warn("API returned 404. Either the user has no posts, or the URL endpoint is wrong.");
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        console.log("Raw Data from API:", data); // Check your browser console to see this!
        
        // More robust way to find the array of posts
        let posts = [];
        if (Array.isArray(data)) {
            posts = data;
        } else if (data && Array.isArray(data.data)) {
            posts = data.data;
        } else if (data && Array.isArray(data.posts)) { // Checks if the array is inside a 'posts' key
            posts = data.posts;
        } else {
            console.error("Could not find an array of posts in the response data.");
        }
        
        if (posts.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        
        if (emptyState) emptyState.classList.add('hidden');
        
        let html = '';
        posts.forEach(post => {
            const categoryColor = getProfileCategoryColor(post.category);
            const formattedDate = formatProfileDate(post.created_at || new Date());
            const safeTitle = escapeProfileHtml(post.title);
            const safeBody = escapeProfileHtml(post.body || '');
            const safeCategory = post.category || 'General';
            
            html += `
                <div class="card" data-post-id="${post.id}">
                    <div class="card-header">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="card-badge" style="${categoryColor}">
                                    ${capitalizeProfileFirst(safeCategory)}
                                </span>
                            </div>
                            <h3 class="card-title">${safeTitle}</h3>
                        </div>
                    </div>
                    <p class="card-description">${safeBody}</p>
                    <div class="card-footer">
                        <div class="text-xs text-gray-500">
                            <p>Posted ${formattedDate}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick='openEditPostModal(${JSON.stringify(post.id)}, ${JSON.stringify(post.title)}, ${JSON.stringify(post.body || '')}, ${JSON.stringify(safeCategory)})' 
                                    aria-label="Edit post" title="Edit post"
                                    class="w-8 h-8 flex items-center justify-center rounded-lg text-social-teal hover:bg-social-teal/10 transition-colors">
                                ${EDIT_ICON}
                            </button>
                            <button onclick="confirmDeletePost(${post.id})"
                                    aria-label="Delete post" title="Delete post"
                                    class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                ${DELETE_ICON}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading my posts:', error);
        container.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load your posts. Please try again later.</p>';
    }
}

// Open Edit Post Modal
function openEditPostModal(id, title, body, category) {
    document.getElementById('editPostId').value = id;
    document.getElementById('editPostTitle').value = title;
    document.getElementById('editPostBody').value = body;
    document.getElementById('editPostCategory').value = category;
    document.getElementById('editPostModal').classList.remove('hidden');
}

// Close Edit Post Modal
function closeEditPostModal() {
    document.getElementById('editPostModal').classList.add('hidden');
}

// Save edited post
async function saveEditPost() {
    const id = document.getElementById('editPostId').value;
    const title = document.getElementById('editPostTitle').value.trim();
    const body = document.getElementById('editPostBody').value.trim();
    const category = document.getElementById('editPostCategory').value;
    
    if (!title || !body || !category) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('pa_token');
        
        const response = await fetch(`${POSTS_API_URL}/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, body, category })
        });
        
        if (response.status === 401) {
            localStorage.removeItem('pa_token');
            window.location.href = 'login.html';
            return;
        }
        
        if (response.status === 403) {
            showNotification('Only mentors can edit posts.', 'error');
            closeEditPostModal();
            return;
        }
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        showNotification('Post updated successfully!', 'success');
        closeEditPostModal();
        // Refresh the list
        await loadMyPosts();
    } catch (error) {
        console.error('Error updating post:', error);
        showNotification('Failed to update post. Please try again.', 'error');
    }
}

// Delete confirmation state
let pendingDeletePostId = null;

// Show delete confirmation for post
function confirmDeletePost(postId) {
    pendingDeletePostId = postId;
    document.getElementById('deleteConfirmModal').classList.remove('hidden');
}

// Close delete confirmation
function closeDeleteConfirm() {
    pendingDeletePostId = null;
    document.getElementById('deleteConfirmModal').classList.add('hidden');
}

// Execute post deletion
async function executeDeletePost() {
    if (!pendingDeletePostId) return;
    
    const postId = pendingDeletePostId;
    const card = document.querySelector(`[data-post-id="${postId}"]`);
    
    try {
        const token = localStorage.getItem('pa_token');
        
        const response = await fetch(`${POSTS_API_URL}/delete-post/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            localStorage.removeItem('pa_token');
            window.location.href = 'login.html';
            return;
        }
        
        if (response.status === 403) {
            showNotification('Only mentors can delete posts.', 'error');
            closeDeleteConfirm();
            return;
        }
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        // Remove the card from DOM immediately
        if (card) {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateX(100px)';
            setTimeout(() => {
                card.remove();
                // Check if empty
                const container = document.getElementById('myPostsContainer');
                if (container && container.children.length === 0) {
                    const emptyState = document.getElementById('myPostsEmpty');
                    if (emptyState) emptyState.classList.remove('hidden');
                }
            }, 300);
        }
        
        showNotification('Post deleted successfully!', 'success');
        closeDeleteConfirm();
    } catch (error) {
        console.error('Error deleting post:', error);
        showNotification('Failed to delete post. Please try again.', 'error');
        closeDeleteConfirm();
    }
}

// --- Helper functions ---

function getProfileCategoryColor(category) {
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

function formatProfileDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + ' days ago';
    
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalizeProfileFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function escapeProfileHtml(text) {
    if (!text) return '';
    var el = document.createElement('span');
    el.textContent = text;
    return el.innerHTML;
}

// Close modals on outside click
document.addEventListener('DOMContentLoaded', function() {
    const editPostModal = document.getElementById('editPostModal');
    if (editPostModal) {
        editPostModal.addEventListener('click', function(e) {
            if (e.target === this) closeEditPostModal();
        });
    }
    
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === this) closeDeleteConfirm();
        });
    }
});