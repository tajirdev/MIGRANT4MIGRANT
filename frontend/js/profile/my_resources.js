// my_resources.js - Handles "My Resources" tab in Profile page

const RESOURCES_API_URL = 'http://localhost:8000';

// SVG icon templates (no emojis, no text labels)
// Named with RES_ prefix to avoid const redeclaration conflicts with my_posts.js
var RES_EDIT_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>';
var RES_DELETE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>';

// Load user's resources
async function loadMyResources() {
    const container = document.getElementById('myResourcesContainer');
    const emptyState = document.getElementById('myResourcesEmpty');
    
    if (!container) return;
    
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Loading your resources...</p>';
    
    try {
        const token = localStorage.getItem('pa_token');
        const response = await fetch(`${RESOURCES_API_URL}/resources/all/me`, {
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
        
        // Handle 403 - user is not a mentor, no resources to show
        if (response.status === 403) {
            container.innerHTML = '';
            if (emptyState) {
                emptyState.classList.remove('hidden');
                emptyState.innerHTML = '<p class="text-gray-500 text-lg">You need to become a mentor to add resources. Click "Be a Mentor" to get started.</p>';
            }
            return;
        }
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const resources = Array.isArray(data) ? data : (data.data || []);
        
        if (!resources || resources.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        
        if (emptyState) emptyState.classList.add('hidden');
        
        let html = '';
        resources.forEach(resource => {
            const safeTitle = escapeProfileResourceHtml(resource.title);
            const safeDescription = escapeProfileResourceHtml(resource.description || '');
            const safeCategory = resource.category || 'General';
            const safeLocation = escapeProfileResourceHtml(resource.location || '');
            const safeContact = escapeProfileResourceHtml(resource.contact || '');
            const categoryColor = getProfileResourceCategoryColor(safeCategory);
            
            html += `
                <div class="card" data-resource-id="${resource.id}">
                    <div class="card-header">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="card-badge" style="${categoryColor}">
                                    ${capitalizeProfileResourceFirst(safeCategory)}
                                </span>
                                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Verified</span>
                            </div>
                            <h3 class="card-title">${safeTitle}</h3>
                        </div>
                    </div>
                    <p class="card-description">${safeDescription}</p>
                    <div class="space-y-2 mb-4 text-sm text-gray-600">
                        <p><strong>Location:</strong> ${safeLocation}</p>
                        <p><strong>Contact:</strong> ${safeContact}</p>
                    </div>
                    <div class="card-footer">
                        <div class="text-xs text-gray-500">
                            <p>Added by you</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick='openEditResourceModal(${JSON.stringify(resource.id)}, ${JSON.stringify(resource.title)}, ${JSON.stringify(resource.description || '')}, ${JSON.stringify(safeCategory)}, ${JSON.stringify(resource.location || '')}, ${JSON.stringify(resource.contact || '')})'
                                    aria-label="Edit resource" title="Edit resource"
                                    class="w-8 h-8 flex items-center justify-center rounded-lg text-social-teal hover:bg-social-teal/10 transition-colors">
                                ${RES_EDIT_ICON}
                            </button>
                            <button onclick="confirmDeleteResource(${resource.id})"
                                    aria-label="Delete resource" title="Delete resource"
                                    class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                ${RES_DELETE_ICON}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading my resources:', error);
        container.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load your resources. Please try again later.</p>';
    }
}

// Open Edit Resource Modal
function openEditResourceModal(id, title, description, category, location, contact) {
    document.getElementById('editResourceId').value = id;
    document.getElementById('editResourceTitle').value = title;
    document.getElementById('editResourceDescription').value = description;
    document.getElementById('editResourceCategory').value = category;
    document.getElementById('editResourceLocation').value = location;
    document.getElementById('editResourceContact').value = contact;
    animateModal(document.getElementById('editResourceModal'), true);
}

// Close Edit Resource Modal
function closeEditResourceModal() {
    animateModal(document.getElementById('editResourceModal'), false);
}

// Save edited resource
async function saveEditResource() {
    const id = document.getElementById('editResourceId').value;
    const title = document.getElementById('editResourceTitle').value.trim();
    const description = document.getElementById('editResourceDescription').value.trim();
    const category = document.getElementById('editResourceCategory').value;
    const location = document.getElementById('editResourceLocation').value.trim();
    const contact = document.getElementById('editResourceContact').value.trim();
    
    if (!title || !description || !category || !location || !contact) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('pa_token');
        
        const response = await fetch(`${RESOURCES_API_URL}/resources/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, category, location, contact })
        });
        
        if (response.status === 401) {
            localStorage.removeItem('pa_token');
            window.location.href = 'login.html';
            return;
        }
        
        if (response.status === 403) {
            showNotification('Only mentors can edit resources.', 'error');
            closeEditResourceModal();
            return;
        }
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        showNotification('Resource updated successfully!', 'success');
        closeEditResourceModal();
        // Refresh the list
        await loadMyResources();
    } catch (error) {
        console.error('Error updating resource:', error);
        showNotification('Failed to update resource. Please try again.', 'error');
    }
}

// Delete confirmation state for resources
let pendingDeleteResourceId = null;

// Show delete confirmation for resource
function confirmDeleteResource(resourceId) {
    pendingDeleteResourceId = resourceId;
    animateModal(document.getElementById('deleteConfirmResourceModal'), true);
}

// Close resource delete confirmation
function closeDeleteResourceConfirm() {
    pendingDeleteResourceId = null;
    animateModal(document.getElementById('deleteConfirmResourceModal'), false);
}

// Execute resource deletion
async function executeDeleteResource() {
    if (!pendingDeleteResourceId) return;
    
    const resourceId = pendingDeleteResourceId;
    const card = document.querySelector(`[data-resource-id="${resourceId}"]`);
    
    try {
        const token = localStorage.getItem('pa_token');
        
        const response = await fetch(`${RESOURCES_API_URL}/resources/delete/${resourceId}`, {
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
            showNotification('Only mentors can delete resources.', 'error');
            closeDeleteResourceConfirm();
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
                const container = document.getElementById('myResourcesContainer');
                if (container && container.children.length === 0) {
                    const emptyState = document.getElementById('myResourcesEmpty');
                    if (emptyState) emptyState.classList.remove('hidden');
                }
            }, 300);
        }
        
        showNotification('Resource deleted successfully!', 'success');
        closeDeleteResourceConfirm();
    } catch (error) {
        console.error('Error deleting resource:', error);
        showNotification('Failed to delete resource. Please try again.', 'error');
        closeDeleteResourceConfirm();
    }
}

// --- Helper functions ---

function getProfileResourceCategoryColor(category) {
    const colors = {
        legal: 'background-color: rgb(208,233,223); color: var(--color-social-teal);',
        employment: 'background-color: rgba(255, 107, 107, 0.2); color: var(--color-home-coral);',
        housing: 'background-color: rgba(78, 205, 196, 0.2); color: var(--color-social-teal);',
        education: 'background-color: rgba(255, 217, 61, 0.2); color: var(--color-sunny-yellow);',
        health: 'background-color: rgba(255, 107, 107, 0.2); color: var(--color-home-coral);',
        financial: 'background-color: rgba(78, 205, 196, 0.2); color: var(--color-social-teal);'
    };
    return colors[category?.toLowerCase()] || 'background-color: rgba(255, 217, 61, 0.2); color: var(--color-sunny-yellow);';
}

function capitalizeProfileResourceFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function escapeProfileResourceHtml(text) {
    if (!text) return '';
    var el = document.createElement('span');
    el.textContent = text;
    return el.innerHTML;
}

// Close modals on outside click
document.addEventListener('DOMContentLoaded', function() {
    const editResourceModal = document.getElementById('editResourceModal');
    if (editResourceModal) {
        editResourceModal.addEventListener('click', function(e) {
            if (e.target === this) closeEditResourceModal();
        });
    }
    
    const deleteResourceModal = document.getElementById('deleteConfirmResourceModal');
    if (deleteResourceModal) {
        deleteResourceModal.addEventListener('click', function(e) {
            if (e.target === this) closeDeleteResourceConfirm();
        });
    }
});