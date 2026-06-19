const url = "http://localhost:8000/register/me";
token =localStorage.getItem('pa_token')
const migrant = document.querySelector("#profile");


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

        if (Response.status === 401) {
            localStorage.removeItem('pa_token');
            localStorage.removeItem('pa_role');
            localStorage.removeItem('pa_role');
            window.location.href = 'login.html';
            return null; 
        }
       displayUser(data)

    }catch(error){
        console.log("error message:",error)
    }

}
get_data()





function displayUser(user){
    let profile =`
                           
            <h1 id="profileName" class="text-3xl font-black text-text-main mb-2">${user.name}</h1>
            <div class="flex flex-wrap gap-4 mb-6">
                <div class="text-sm">
                    <p class="text-gray-500 uppercase tracking-widest font-bold">Role</p>
                    <p id="profileRole" class="text-text-main font-bold">${user.role}</p>
                </div>
                <div class="text-sm">
                    <p class="text-gray-500 uppercase tracking-widest font-bold">Member Since</p>
                    <p class="text-text-main font-bold"> ${user.created_at}</p>
                </div>
                <div class="text-sm">
                    <p class="text-gray-500 uppercase tracking-widest font-bold">Language</p>
                    <p id="profileLanguage" class="text-text-main font-bold">${user.language}</p>
                </div>
            </div>

            <!-- Location Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p class="text-gray-500 text-sm uppercase tracking-widest font-bold">Native Country</p>
                    <p id="profileNativeCountry" class="text-text-main font-bold">${user.native_country}</p>
                </div>
                <div>
                    <p class="text-gray-500 text-sm uppercase tracking-widest font-bold">Current Country</p>
                    <p id="profileCurrentCountry" class="text-text-main font-bold">${user.current_country}</p>
                </div>
            </div>
                     
    `;

        migrant.innerHTML= profile;
}
        
