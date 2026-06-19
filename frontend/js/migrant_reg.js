
const statusMessage = document.querySelector("#status-message");

// Function to show field-specific errors
function showFieldError(fieldName, message) {
    const errorElement = document.querySelector(`.error-message[data-field="${fieldName}"]`);
    const inputElement = document.querySelector(`input[name="${fieldName}"]`);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    if (inputElement) {
        inputElement.classList.add('has-error');
    }
}

// Function to clear field-specific errors
function clearFieldError(fieldName) {
    const errorElement = document.querySelector(`.error-message[data-field="${fieldName}"]`);
    const inputElement = document.querySelector(`input[name="${fieldName}"]`);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    if (inputElement) {
        inputElement.classList.remove('has-error');
    }
}

// Function to clear all field errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('.form-input.has-error');
    
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
    
    inputElements.forEach(element => {
        element.classList.remove('has-error');
    });
}

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
    const passwordInput = document.querySelector('input[name="password_hash"]');
    
    // Real-time password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const requirements = validators.checkPasswordRequirements(this.value);
            const isValid = validators.isStrongPassword(this.value);
            
            if (this.value.length > 0) {
                const errorElement = document.querySelector('.error-message[data-field="password_hash"]');
                
                if (errorElement && !isValid) {
                    // Build HTML for requirements with color coding
                    const requirementsHTML = `
                        <div class="password-requirements">
                            <div class="requirement-item ${requirements.hasMinLength ? 'met' : 'unmet'}">
                                <span class="requirement-icon">${requirements.hasMinLength ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                                <span>8+ characters</span>
                            </div>
                            <div class="requirement-item ${requirements.hasUpperCase ? 'met' : 'unmet'}">
                                <span class="requirement-icon">${requirements.hasUpperCase ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                                <span>Uppercase (A-Z)</span>
                            </div>
                            <div class="requirement-item ${requirements.hasLowerCase ? 'met' : 'unmet'}">
                                <span class="requirement-icon">${requirements.hasLowerCase ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                                <span>Lowercase (a-z)</span>
                            </div>
                            <div class="requirement-item ${requirements.hasNumber ? 'met' : 'unmet'}">
                                <span class="requirement-icon">${requirements.hasNumber ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                                <span>Number (0-9)</span>
                            </div>
                            <div class="requirement-item ${requirements.hasSpecialChar ? 'met' : 'unmet'}">
                                <span class="requirement-icon">${requirements.hasSpecialChar ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                                <span>Special char (!@#$%^&*)</span>
                            </div>
                        </div>
                    `;
                    
                    errorElement.innerHTML = requirementsHTML;
                    errorElement.classList.add('show');
                    passwordInput.classList.add('has-error');
                } else if (isValid) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('show');
                    passwordInput.classList.remove('has-error');
                }
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear all previous errors
        clearAllErrors();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Use the validators from validation_util.js
        if (!validators.isEmail(data.email)) {
            showFieldError('email', "Please provide a valid email address.");
            return;
        }

        if (!validators.isValidUsername(data.user_name)) {
            showFieldError('user_name', "Username must be at least 3 characters and contain no spaces.");
            return;
        }

        if (!validators.isStrongPassword(data.password_hash)) {
            const requirements = validators.checkPasswordRequirements(data.password_hash);
            
            // Build color-coded requirements list for error message
            const requirementsHTML = `
                <div class="password-requirements">
                    <div class="requirement-item ${requirements.hasMinLength ? 'met' : 'unmet'}">
                        <span class="requirement-icon">${requirements.hasMinLength ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                        <span>8+ characters</span>
                    </div>
                    <div class="requirement-item ${requirements.hasUpperCase ? 'met' : 'unmet'}">
                        <span class="requirement-icon">${requirements.hasUpperCase ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                        <span>Uppercase (A-Z)</span>
                    </div>
                    <div class="requirement-item ${requirements.hasLowerCase ? 'met' : 'unmet'}">
                        <span class="requirement-icon">${requirements.hasLowerCase ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                        <span>Lowercase (a-z)</span>
                    </div>
                    <div class="requirement-item ${requirements.hasNumber ? 'met' : 'unmet'}">
                        <span class="requirement-icon">${requirements.hasNumber ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                        <span>Number (0-9)</span>
                    </div>
                    <div class="requirement-item ${requirements.hasSpecialChar ? 'met' : 'unmet'}">
                        <span class="requirement-icon">${requirements.hasSpecialChar ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : '<i data-lucide="x" class="w-3.5 h-3.5"></i>'}</span>
                        <span>Special char (!@#$%^&*)</span>
                    </div>
                </div>
            `;
            
            const errorElement = document.querySelector('.error-message[data-field="password_hash"]');
            if (errorElement) {
                errorElement.innerHTML = requirementsHTML;
                errorElement.classList.add('show');
            }
            return;
        }

        if (!validators.passwordsMatch(data.password_hash, data.confirm_password)) {
            showFieldError('confirm_password', "Passwords do not match. Please try again.");
            return;
        }

        if (!validators.isValidCountry(data.native_country) || !validators.isValidCountry(data.current_country)) {
            if (!validators.isValidCountry(data.native_country)) {
                showFieldError('native_country', "Please select a valid country.");
            }
            if (!validators.isValidCountry(data.current_country)) {
                showFieldError('current_country', "Please select a valid country.");
            }
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
                    window.location.href = 'login.html';
                    clearAllErrors();

                }

           }catch(err){
               console.error("regi failed: ",err)
               showStatus("Something went wrong Please try again.", "error");

        }


        })();

    });
    // Render any dynamically added Lucide icons
    lucide.createIcons();
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

