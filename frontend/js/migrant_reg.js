
const statusMessage = document.querySelector("#status-message");
//function to call API 
const url = "http://localhost:8000/register/user"
async function registerUser(UserData){
    const response = await fetch(url,{
        method:"POST",
        headers:{
        "Content-Type":"application/json"
        },
        body:JSON.stringify(UserData)
    });
    return await response.json()
}


document.addEventListener('DOMContentLoaded', () => {
    
    // Populate the custom select dropdowns
    populateCustomSelects();

    const form = document.getElementById('migrantRegForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Use the validators from validation_util.js
        if (!validators.isEmail(data.email)) {
            alert("Please provide a valid email address.");
            return;
        }

        if (!validators.isValidUsername(data.user_name)) {
            alert("Username must be at least 3 characters and contain no spaces.");
            return;
        }

        if (!validators.isStrongPassword(data.password_hash)) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        if (!validators.passwordsMatch(data.password_hash, data.confirm_password)) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        if (!validators.isValidCountry(data.native_country) || !validators.isValidCountry(data.current_country)) {
            alert("Please select a valid country from the provided list.");
            return;
        }
       

        // Here is where we will add the fetch() call later
        //now I have added
        
        const{confirm_password,password, ...restOfData} = data;


        const dataToSend = {
        ...restOfData,         
        role: "migrant"          
    };

        (async ()=>{
            try{
                const result = await registerUser(dataToSend);
                
                

                if(result.detail){
                    showStatus(result.detail, "error");
                } else{
                    showStatus("Registration successful!","success");
                    form.reset();

                }

           }catch(err){
               console.error("regi failed: ",err)
               showStatus("Something went wrong Please try again.", "error");

        }


        })();

    });
});

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
    }, 5000);
}

// Function to populate custom select dropdowns
function populateCustomSelects() {
    const containers = document.querySelectorAll('.custom-select-container');
    
    containers.forEach(container => {
        const input = container.querySelector('.custom-select-input');
        const optionsContainer = container.querySelector('.custom-select-options');
        
        // Clear existing options
        optionsContainer.innerHTML = '';
        
        // Add options
        countries.forEach(country => {
            const option = document.createElement('div');
            option.className = 'custom-select-option';
            option.textContent = country;
            option.addEventListener('click', () => {
                input.value = country;
                container.classList.remove('open');
            });
            optionsContainer.appendChild(option);
        });
        
        // Toggle dropdown on click
        const select = container.querySelector('.custom-select');
        select.addEventListener('click', () => {
            // Close other open dropdowns
            document.querySelectorAll('.custom-select-container.open').forEach(openContainer => {
                if (openContainer !== container) {
                    openContainer.classList.remove('open');
                }
            });
            container.classList.toggle('open');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-container')) {
            document.querySelectorAll('.custom-select-container.open').forEach(container => {
                container.classList.remove('open');
            });
        }
    });
}

