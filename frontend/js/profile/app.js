// Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                
                // Hide all tabs
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.add('hidden');
                });
                
                // Show selected tab
                document.getElementById(tabName + 'Tab').classList.remove('hidden');
                
                // Update button styles
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('border-home-coral', 'text-home-coral');
                    b.classList.add('border-transparent', 'text-gray-600');
                });
                this.classList.remove('border-transparent', 'text-gray-600');
                this.classList.add('border-home-coral', 'text-home-coral');
            });
        });

        function editProfile() {
            document.getElementById('editName').value = document.getElementById('profileName').textContent;
            document.getElementById('editLanguage').value = document.getElementById('profileLanguage').textContent;
            document.getElementById('editNativeCountry').value = document.getElementById('profileNativeCountry').textContent;
            document.getElementById('editCurrentCountry').value = document.getElementById('profileCurrentCountry').textContent;
            document.getElementById('editProfileModal').classList.remove('hidden');
        }

        function closeEditProfileModal() {
            document.getElementById('editProfileModal').classList.add('hidden');
        }

        function openBeaMentorModal() {
            document.getElementById('beaMentorModal').classList.remove('hidden');
        }

        function closeBeaMentorModal() {
            document.getElementById('beaMentorModal').classList.add('hidden');
        }

        function editMentorProfile() {
            showNotification('Edit mentor profile functionality coming soon', 'error');
        }

        function unsaveResource(resourceId) {
            const savedResources = JSON.parse(localStorage.getItem('savedResources') || '[]');
            const index = savedResources.indexOf(resourceId);
            if (index > -1) {
                savedResources.splice(index, 1);
                localStorage.setItem('savedResources', JSON.stringify(savedResources));
                location.reload();
            }
        }

        function deleteAccount() {
            if (confirm('Are you sure? This action cannot be undone.')) {
                deleteUser()
                async function deleteUser() {
                    try{

                    
                        const response = await fetch("http://localhost:8000/register/delete/me",{
                            method:"DELETE",
                            headers:{
                                'Authorization': `Bearer ${localStorage.getItem('pa_token')}`

                            }
                        });
                        const data = await response.json();

                        if(response.ok){
                            window.location.href = "index.html";
                            localStorage.removeItem('pa_token');
                            localStorage.removeItem('pa_email');
                            localStorage.removeItem('pa_role');
                            



                        }
                    }catch(error){
                        console.log(error)
                    }
                    
                }
            
                //alert('Account deletion coming soon');
            }
        }

        // Form submission
        document.getElementById('editProfileForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch('http://localhost:8000/register/edite/me', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('pa_token')}`
                    },
                    body: JSON.stringify({
                        name: document.getElementById('editName').value,
                       
                        user_name: document.getElementById('user_name').value,
                        native_country: document.getElementById('editNativeCountry').value,
                        current_country: document.getElementById('editCurrentCountry').value,
                        language: document.getElementById('editLanguage').value
                    })
                });
                    
   


                if (response.ok) {
                    closeEditProfileModal();
                    location.reload();
                    
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                showNotification('Failed to update profile. Please try again.', 'error');
            }
        });

        // Load user data (from backend in production)
        document.addEventListener('DOMContentLoaded', function() {
            // This would load from backend in production
            const userRole = localStorage.getItem('pa_role') || 'migrant';
            if (userRole === 'mentor') {
                document.getElementById('mentorSection').classList.remove('hidden');
                document.getElementById('beaMentorBtn').style.display = 'none';
            } else {
                document.getElementById('beaMentorBtn').style.display = 'block';
            }
        });

        // Handle Be a Mentor form submission
        document.getElementById('beaMentorForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const response = await fetch('http://localhost:8000/register/mentor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('pa_token')}`
                    },
                    body: JSON.stringify({
                        expertise: document.getElementById('mentorExpertiseInput').value,
                        organization: document.getElementById('mentorOrganizationInput').value,
                        availability: document.getElementById('mentorAvailabilityInput').value,
                        languages: document.getElementById('languages').value
                    })
                });
                    
                if (response.ok) {
                    closeBeaMentorModal();
                    localStorage.setItem('pa_role', 'mentor');
                    location.reload();
                } else {
                    showNotification('Failed to become a mentor. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error becoming a mentor:', error);
                showNotification('Failed to become a mentor. Please try again.', 'error');
            }
        });