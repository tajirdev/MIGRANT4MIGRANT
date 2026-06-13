const statusMessage = document.querySelector("#status-message");
const url = "http://localhost:8000/login";

/**
 * Sends login credentials using OAuth2 standard form-encoding
 * @param {Object} userdata - Contains email and password from the form
 */
async function loginUser(userdata) {
    // 1. OAuth2 requires 'application/x-www-form-urlencoded'
    // We use URLSearchParams to format the body correctly
    const formBody = new URLSearchParams();
    
    // 2. CRITICAL: OAuth2 expects the key 'username', even for email addresses
    formBody.append('username', userdata.username.trim());
    formBody.append('password', userdata.password);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
    });

    const data = await response.json();

    if (!response.ok) {
        // Handle cases where detail is an array (validation) or string (auth error)
        const errorMsg = Array.isArray(data.detail) 
            ? `${data.detail[0].msg}: ${data.detail[0].loc[1]}` 
            : data.detail || "Server error";
        throw new Error(errorMsg);
    }

    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        
        
        if (!data.username || !data.password) {
            showStatus("Please fill in all fields.");
            return;
        }

        console.log("Login Validation Passed! Formulating OAuth2 request...");

      
        try {
            const result = await loginUser(data);

            if (result.access_token) {
                showStatus("Login Successful!...","success");
                loginForm.reset();
                
                
                localStorage.setItem('pa_token', result.access_token);
                localStorage.setItem('pa_email', data.username.trim());
                localStorage.setItem('pa_role',result.role);

                
                
                
                
                
                
                window.location.href = "index.html"; 
            }
        } catch (err) {
            
            
            showStatus("network error","error");
            showStatus( err.message,"error")
        }
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
