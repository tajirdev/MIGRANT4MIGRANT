const mentor_profile = document.getElementById("mentorSection");
let resource_tab = document.querySelector("#MyresourceTab")
const get_role = localStorage.getItem('pa_role')
let skip = 0;
const limit = 10;
let loading = false;
let allLoded = false;



if(get_role == 'mentor'){





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
       if (Response.status === 401) {
            localStorage.removeItem('pa_token');
            localStorage.removeItem('pa_role');
            localStorage.removeItem('pa_role');
            window.location.href = 'login.html';
            return null; 
        }
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

async function get_resources() {

    if(loading || allLoded) return;
    loading = true
    try{
        const response = await fetch(`http://localhost:8000/resources/all/me?skip=${skip}&limit=${limit}`,{
        method :"GET",
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('pa_token')}`,
            'Content-Type':'application/json'
        }
    });

    const data = await response.json()
    if(data.length === 0){
        allLoded = true;

        return;
    }

    show_resource(data)
    skip += limit;

    }catch(error){
        console.log(error)
    }finally{
        loading = false;
    }
    
    
}
window.addEventListener('scroll',()=>{
    if(window.innerHeight + window.screenY >= document.body.offsetHeight - 200){
        get_resources()
    }
});
get_resources()

function show_resource(resources){
    let resource_display = [];

    resources.forEach(resource=>{
        resource_display += `
               <div class="card">
                    <div class="card-header">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="card-badge">${resource.category}</span>
                                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Verified</span>
                            </div>
                            <h3 class="card-title">${resource.title}</h3>
                        </div>
                    </div>
                    <p class="card-description">
                       ${resource.description}
                    </p>
                    <div class="space-y-2 mb-4 text-sm text-gray-600">
                        <p><strong>Location:</strong> ${resource.location}</p>
                        <p><strong>Contact:</strong> ${resource.contact}</p>
                        
                    </div>
                    <div class="card-footer">
                        <a href="#" class="btn-sm">View Details</a>
                        <button onclick="saveResource(1)" class="text-home-coral font-bold text-sm hover:scale-110 transition">♡ Save</button>
                    </div>
                </div>
      

        `;
    });
    resource_tab.innerHTML += resource_display;
    console.log(resource_tab)

}
}
        
