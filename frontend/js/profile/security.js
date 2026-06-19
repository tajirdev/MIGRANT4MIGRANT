/**
 * Profile Security Settings Functionality
 * Handles password change and account verification
 */

// Show change password modal
function showChangePasswordModal() {
    animateModal(document.getElementById('changePasswordModal'), true);
}

// Close change password modal
function closeChangePasswordModal() {
    animateModal(document.getElementById('changePasswordModal'), false);
}

// Show verify account modal (OTP verification)
function showVerifyAccountModal() {
    animateModal(document.getElementById('verifyAccountModal'), true);
}

// Close verify account modal
function closeVerifyAccountModal() {
    animateModal(document.getElementById('verifyAccountModal'), false);
}

// Change password function
async function changePassword(currentPassword, newPassword, confirmPassword) {
    try {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('Please fill in all password fields', 'error');
            return false;
        }

        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return false;
        }

        if (newPassword.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return false;
        }

        if (currentPassword === newPassword) {
            showNotification('New password must be different from current password', 'error');
            return false;
        }

        const response = await fetch('http://localhost:8000/register/edite/me/password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('pa_token')}`
                    },
                    body: JSON.stringify({

                         password_hash:currentPassword ,
                         new_passord_hash:newPassword,
                    })
                });
                    
                if (response.ok) 
                    closeChangePasswordModal();
                    showNotification('Password changed successfully!', 'success');
                    document.getElementById('changePasswordForm').reset();


        
        return true;
    } catch (error) {
        showNotification('Error changing password: ' + error.message, 'error');
        return false;
    }
}

// Request account verification (send OTP)
async function requestAccountVerification() {
    try {
        const user_email= localStorage.getItem('pa_email')
        
        const rensponse = await fetch(`http://localhost:8000/registerverfy/me`,{
            method:'POST',
            headers:{
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${localStorage.getItem('pa_token')}`
                
            },
            body: JSON.stringify({
                email: user_email
                 })
        });

        if(rensponse.ok){
             showNotification('Verification code sent to your email', 'success');
             showVerifyAccountModal();

        }
  
        return true;
    } catch (error) {
        showNotification('Error requesting verification: ' + error.message, 'error');
        return false;
    }
}

// Verify account with OTP
async function verifyAccountWithOtp(otp) {
    try {
        const user_email= localStorage.getItem('pa_email')
        if (!otp || otp.length !== 6) {
            showNotification('Please enter a valid 6-digit verification code', 'error');
            return false;
        }

        const rensponse = await fetch(`http://localhost:8000/registerverfy/me/otp`,{
            method: 'POST',
            headers:{
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${localStorage.getItem('pa_token')}`

            },
             body: JSON.stringify({
                email: user_email,
                otp
                 })

        });

        if(rensponse.ok){
             showNotification('Account verified successfully!', 'success');
             closeVerifyAccountModal();
            document.getElementById('verifyAccountForm').reset();

        } else{
            showNotification('incorrect OTP code');

        }
        return true;
    } catch (error) {
        showNotification('Error verifying account: ' + error.message, 'error');
        return false;
    }
}

// Notification helper
function showNotification(message, type = 'error') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg font-bold text-white transition-all';
    notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Handle change password form submission
document.addEventListener('DOMContentLoaded', () => {
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            
            changePassword(currentPassword, newPassword, confirmPassword);
        });
    }

    // Handle verify account form submission
    const verifyAccountForm = document.getElementById('verifyAccountForm');
    if (verifyAccountForm) {
        verifyAccountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const otp = document.getElementById('verificationCodeInput').value.trim();
            verifyAccountWithOtp(otp);
        });
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        const changePasswordModal = document.getElementById('changePasswordModal');
        const verifyAccountModal = document.getElementById('verifyAccountModal');

        if (e.target === changePasswordModal) {
            closeChangePasswordModal();
        }
        if (e.target === verifyAccountModal) {
            closeVerifyAccountModal();
        }
    });
});
