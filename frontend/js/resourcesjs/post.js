
 const statusMessage = document.querySelector("#status-message");
const role =localStorage.getItem("pa_role");




 
if(role === "mentor"){
    

 
 function openAddResourceModal() {
            animateModal(document.getElementById('addResourceModal'), true);
        }

        function closeAddResourceModal() {
            animateModal(document.getElementById('addResourceModal'), false);
        }

        function saveResource(resourceId) {
            const savedResources = JSON.parse(localStorage.getItem('savedResources') || '[]');
            if (!savedResources.includes(resourceId)) {
                savedResources.push(resourceId);
                localStorage.setItem('savedResources', JSON.stringify(savedResources));
            }
        }

        // Close modal when clicking outside
        document.getElementById('addResourceModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeAddResourceModal();
            }
        });
        } else {
            document.getElementById("addbtn").style.display="none";
        }

        // Handle form submission
        document.getElementById('addResourceForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
                const response = await fetch('http://localhost:8000/resources/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('pa_token')}`
                    },
                    body: JSON.stringify({
                        title: formData.get('title'),
                        category: formData.get('category'),
                        description: formData.get('description'),
                        location: formData.get('location'),
                        contact: formData.get('contact')
                    })
                });

                if (response.ok) {
                    showStatus("adding resource ....", "success");
                    closeAddResourceModal();
                    location.reload();
                    document.getElementById('addResourceForm').reset()
                }
            } catch (error) {
                console.error('Error adding resource:', error);
                showNotification('Failed to add resource. Please try again.', 'error');
            }
        });

        // Search and filter functionality
        document.getElementById('searchInput').addEventListener('input', function() {
            filterResources();
        });

        document.getElementById('categoryFilter').addEventListener('change', function() {
            filterResources();
        });

        function filterResources() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const resources = document.querySelectorAll('#resourcesContainer .card');
            let visibleCount = 0;

            resources.forEach(resource => {
                const title = resource.querySelector('.card-title').textContent.toLowerCase();
                const description = resource.querySelector('.card-description').textContent.toLowerCase();
                const badges = resource.querySelectorAll('.card-badge');
                
                let matchesCategory = true;
                if (category) {
                    matchesCategory = Array.from(badges).some(badge => 
                        badge.textContent.toLowerCase().includes(category)
                    );
                }

                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);

                if (matchesSearch && matchesCategory) {
                    resource.style.display = '';
                    visibleCount++;
                } else {
                    resource.style.display = 'none';
                }
            });

            document.getElementById('emptyState').classList.toggle('hidden', visibleCount > 0);
        }


        let messageTimeout;
function showStatus(text, type) {
    clearTimeout(messageTimeout);

    statusMessage.innerText = text;
    statusMessage.style.display = "block";
    
    if (type === "success") {
        statusMessage.style.backgroundColor = "#d4edda";
        statusMessage.style.color = "#155724";
        statusMessage.style.border = "1px solid #c3e6cb";
    } else {
        statusMessage.style.backgroundColor = "#f8d7da";
        statusMessage.style.color = "#721c24";
        statusMessage.style.border = "1px solid #f5c6cb";
    }
    messageTimeout = setTimeout(() => {
        statusMessage.style.display = "none";
    }, 2000);
}


