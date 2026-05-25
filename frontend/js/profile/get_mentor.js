const mentor_profile = document.getElementById("mentorSection");
console.log(mentor_profile)


async function get_data(){
    try{
        const Response = await fetch("http://localhost:8000/register/mentor/me",{
            method: 'GET',
            headers:{
                'Authorization':`Bearer ${localStorage.getItem('pa_token')}`,
                'Content-Type':'application/json'
            }
        });
        const data = await Response.json();
       displaymentor(data)

    }catch(error){
        console.log("error message:",error)
    }

}
get_data()





function displaymentor(user){
    let active_mentor_profile =`
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
                        <div class="text-yellow-400 text-lg">★★★★★</div>
                    </div>
                        <button onclick="editMentorProfile()" class="navbar-btn navbar-btn-secondary px-6">
                            Edit Mentor Info
                        </button>
                        </div> 

            </div>
                         
    `;

       mentor_profile.innerHTML= active_mentor_profile;
}
        
