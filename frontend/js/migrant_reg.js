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

        if (!validators.isStrongPassword(data.password)) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        if (!validators.passwordsMatch(data.password, data.confirm_password)) {
            alert("Passwords do not match. Please try again.");
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