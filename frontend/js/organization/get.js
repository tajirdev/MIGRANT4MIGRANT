/** 

let skip = 0;
const limit = 10;
let loading = false;
let allLoaded = false;
const organizations_section = document.getElementById("organizations_section")
console.log(organizations_section)



async function get_data() {
    if (loading || allLoaded) return;

    loading = true;
    try {
        const response = await fetch(
            `http://localhost:8000/organization/all?skip=${skip}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (data.length === 0) {
            allLoaded = true;
            return;
        }

        displayOrganization(data);
        skip += limit;

    } catch (error) {
        console.log("error message:", error);
    } finally {
        loading = false;
    }
}
function displayOrganization(organization){
    let organization_display =`
        <div class="org-card">
            <div class="org-card-header">
                <img src="" alt="Organization Icon" class="org-icon w-12 h-12 object-cover">
                <div>
                    <h3 class="org-name">Global Migration Network</h3>
                    <p class="org-type">${organization.name}</p>
                </div>
            </div>
            <p class="org-description">Provides free legal consultation and immigration guidance for displaced communities.</p>
            <div class="org-services">
                <span class="service-badge"></span>
                <span class="service-badge">Consultation</span>
                <span class="service-badge">Documents</span>
            </div>
            <button class="learn-more-btn">Learn More →</button>
        </div>
                
    `;

    organizations_section.innerHTML= organization_display;
}
    */
