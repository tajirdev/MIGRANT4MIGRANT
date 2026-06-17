// get_mentor.js - Handles mentor profile display in Profile page
// Duplicate resource/post rendering has been removed; 
// my_posts.js and my_resources.js now handle those tabs.

const mentor_profile = document.getElementById("mentorSection");
const get_role = localStorage.getItem('pa_role');

// Mentor profile display
if (get_role == 'mentor') {

    async function get_data() {
        try {
            const Response = await fetch("http://localhost:8000/register/mentor/me", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('pa_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await Response.json();
            if (Response.status === 401) {
                localStorage.removeItem('pa_token');
                localStorage.removeItem('pa_role');
                localStorage.removeItem('pa_role');
                window.location.href = 'login.html';
                return null;
            }
            displaymentor(data);
        } catch (error) {
            console.log("error message:", error);
        }
    }
    get_data();

    function displaymentor(user) {
        let active_mentor_profile = `
            <h2 class="text-2xl font-black text-text-main mb-6">Mentor Profile</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <p class="text-gray-500 text-sm uppercase tracking-widest font-bold mb-2">Expertise</p>
                    <p id="mentorExpertise" class="text-text-main font-bold bg-home-coral/20 px-4 py-2 rounded-lg inline-block">
                        ${user.expertise}
                    </p>
                </div>
                <div>
                    <p class="text-gray-500 text-sm uppercase tracking-widest font-bold mb-2">Organization</p>
                    <p id="mentorOrganization" class="text-text-main font-bold">${user.languages}</p>
                </div>
                <div>
                    <p class="text-gray-500 text-sm uppercase tracking-widest font-bold mb-2">Availability</p>
                    <p id="mentorAvailability" class="text-text-main font-bold">${user.availability}</p>
                </div>
                <div>
                    <p class="text-gray-500 text-sm uppercase tracking-widest font-bold mb-2">Rating</p>
                    <div class="flex items-center gap-2">
                        <span id="mentorRating" class="text-2xl font-black text-home-coral">${user.rating}</span>
                        <div class="flex items-center gap-0.5">
                            <i data-lucide="star" class="w-5 h-5 text-yellow-400 fill-yellow-400"></i>
                            <i data-lucide="star" class="w-5 h-5 text-yellow-400 fill-yellow-400"></i>
                            <i data-lucide="star" class="w-5 h-5 text-yellow-400 fill-yellow-400"></i>
                            <i data-lucide="star" class="w-5 h-5 text-yellow-400 fill-yellow-400"></i>
                            <i data-lucide="star" class="w-5 h-5 text-yellow-400 fill-yellow-400"></i>
                        </div>
                    </div>
                    <button onclick="editMentorProfile()" class="navbar-btn navbar-btn-secondary px-6">
                        Edit Mentor Info
                    </button>
                </div>
            </div>
        `;
        mentor_profile.innerHTML = active_mentor_profile;
        lucide.createIcons();
    }

} else {
    // Non-mentors: keep mentor section hidden.
    // Both tabs remain visible; my_resources.js handles the 403 case gracefully.
}