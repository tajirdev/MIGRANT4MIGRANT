// Load organizations from database
const API_BASE_URL = 'http://localhost:8000';

async function loadOrganizations() {
    try {
        const response = await fetch(`${API_BASE_URL}/organization/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const organizations = await response.json();
        displayOrganizations(organizations);
    } catch (error) {
        console.error('Error loading organizations:', error);
        // Keep displaying default organizations if API fails
    }
}

function displayOrganizations(organizations) {
    const orgsGrid = document.querySelector('.featured-orgs-grid');
    
    if (!orgsGrid) {
        console.error('Organization grid container not found');
        return;
    }

    // Clear existing hardcoded content
    orgsGrid.innerHTML = '';

    // If no organizations from API, keep the defaults visible
    if (organizations.length === 0) {
        console.log('No organizations found from API');
        return;
    }

    // Create and append organization cards
    organizations.forEach(org => {
        const card = createOrgCard(org);
        orgsGrid.appendChild(card);
    });
}

function createOrgCard(org) {
    const card = document.createElement('div');
    card.className = 'org-card';
    
    // Parse services if it's a string
    let services = [];
    if (org.services) {
        if (typeof org.services === 'string') {
            services = org.services.split(',').map(s => s.trim()).slice(0, 3);
        } else if (Array.isArray(org.services)) {
            services = org.services.slice(0, 3);
        }
    }

    // Create service badges HTML
    const serviceBadgesHTML = services.length > 0 
        ? services.map(service => `<span class="service-badge">${service}</span>`).join('')
        : '<span class="service-badge">Support</span>';

    card.innerHTML = `
        <div class="org-card-header">
            <div>
       
                <h3 class="org-name">${org.name || 'Organization'}</h3>
                <p class="org-type">${org.type || 'Community Support'}</p>
            </div>
        </div>
        <p class="org-description">${org.description || 'Supporting migrants in our community.'}</p>
        <div class="org-services">
            ${serviceBadgesHTML}
        </div>
        
    `;

    return card;
}

// Load organizations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadOrganizations();
});
