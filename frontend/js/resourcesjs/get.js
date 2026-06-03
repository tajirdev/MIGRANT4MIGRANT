const url = "http://localhost:8000/resources/all";
token =localStorage.getItem('pa_token')
const header = document.querySelector("#resourcesContainer");


async function get_data(){
    try{
        const Response = await fetch(url,{
            method: 'GET',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        const data = await Response.json();
       displayUser(data)
       if (Response.status === 401) {
            localStorage.removeItem('pa_token');
            localStorage.removeItem('pa_role');
            localStorage.removeItem('pa_email');
            window.location.href = 'login.html';
            return null; 
        }

    }catch(error){
        console.log("error message:",error)
    }

}
get_data()



function displayUser(userally){
    let cards = [];


    userally.forEach(user =>{
            cards += `
                <div class="card">
                    <div class="card-header">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="card-badge">${user.category}</span>
                                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Verified</span>
                            </div>
                            <h3 class="card-title">${user.title}</h3>
                        </div>
                    </div>
                    <p class="card-description">
                       ${user.description}
                    </p>
                    <div class="space-y-2 mb-4 text-sm text-gray-600">
                        <p><strong>Location:</strong> ${user.location}</p>
                        <p><strong>Contact:</strong> ${user.contact}</p>
                        
                    </div>
                    <div class="card-footer">
                        <a href="#" class="btn-sm">View Details</a>
                        <button onclick="saveResource(1)" class="text-home-coral font-bold text-sm hover:scale-110 transition">♡ Save</button>
                    </div>
                </div>
        `;
    });
        header.innerHTML+= cards;
}
        
