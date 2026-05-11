document.addEventListener('DOMContentLoaded', () => {
    // Populate the datalist using the utility function
    populateCountryDatalist('country-list');

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

        if (!validators.isStrongPassword(data.password)) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        if (!validators.isValidCountry(data.native_country) || !validators.isValidCountry(data.current_country)) {
            alert("Please select a valid country from the provided list.");
            return;
        }

        console.log("Success! Data is clean. Ready for Backend:", data);
        // Here is where we will add the fetch() call later
    });
});