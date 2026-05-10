document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        const identity = data.username.trim(); // This is the "Username or Email" field

        // --- 1. Identity Validation (Email or Username) ---
        if (!identity) {
            alert("Please enter your username or email.");
            return;
        }

        let isIdentityValid = false;

        if (identity.includes('@')) {
            // If it looks like an email, use the email validator
            isIdentityValid = validators.isEmail(identity);
            if (!isIdentityValid) {
                alert("The email format you entered is invalid.");
                return;
            }
        } else {
            // Otherwise, treat it as a username
            isIdentityValid = validators.isValidUsername(identity);
            if (!isIdentityValid) {
                alert("Username must be at least 3 characters and contain no spaces.");
                return;
            }
        }

        // --- 2. Password Validation ---
        if (!data.password) {
            alert("Please enter your password.");
            return;
        }

        // We don't necessarily check for "Strong Password" here 
        // because the user might have an old account with a simpler pass.
        // We just ensure it's not empty.

        console.log("Login Validation Passed!");
        console.log("Targeting identity:", identity);
        
        /* Next step: We will send this data to the backend for authentication.
           fetch('/api/login', { 
               method: 'POST', 
               body: JSON.stringify(data) 
           })
        */
    });
});