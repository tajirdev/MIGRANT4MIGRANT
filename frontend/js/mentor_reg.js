document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mentorRegForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.expertise.length < 5) {
            alert("Please provide more detail about your expertise.");
            return;
        }

        console.log("Mentor details ready:", data);
        // Note: You will need to send the logged-in user's ID here too!
    });
});