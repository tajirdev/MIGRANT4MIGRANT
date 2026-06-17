/**
 * OTP and Password Reset Functionality
 * Handles OTP verification and password reset flows
 */

// Show forgot password modal
function showForgotPasswordModal() {
    animateModal(document.getElementById('forgotPasswordModal'), true);
    document.getElementById('loginForm').reset();
}

// Close forgot password modal
function closeForgotPasswordModal() {
    animateModal(document.getElementById('forgotPasswordModal'), false);
}

// Show OTP modal
function showOtpModal() {
    animateModal(document.getElementById('otpModal'), true);
}

// Close OTP modal
function closeOtpModal() {
    animateModal(document.getElementById('otpModal'), false);
}

// Show password reset modal
function showPasswordResetModal() {
    animateModal(document.getElementById('passwordResetModal'), true);
}

// Close password reset modal
function closePasswordResetModal() {
    animateModal(document.getElementById('passwordResetModal'), false);
}

// Request password reset

async function requestPasswordReset(email) {
    try {
        
        
        const response = await fetch(`http://localhost:8000/forgot-password`, {
            method: 'POST',
            headers: {
                
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email:email
            }
            )
        });
        
        
        // Simulate sending OTP
        showOtpModal();
        closeForgotPasswordModal();
        
        showStatus('OTP sent to your email! ', 'success', 'otp-status-message');
        
        // Store email in sessionStorage for next step
        sessionStorage.setItem('resetEmail', email);
        
        return true;
    } catch (error) {
        showStatus('Error sending OTP: ' + error.message, 'error', 'forgot-password-status-message');
        return false;
    }
}

// Verify OTP

async function verifyOtp(otp) {
    try {
        console.log('Verifying OTP:', otp);
        const user_email = sessionStorage.getItem('resetEmail')

        const response = await fetch(`http://localhost:8000/verify-otp`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                email: user_email,
                otp:otp

            })
        });
        
        // Simulate OTP verification
        if (otp.length === 6 && response.ok) {

            closeOtpModal();
            showPasswordResetModal();
            showStatus('OTP verified successfully!', 'success', 'otp-status-message');
            return true;
        } else {
            showStatus('Please enter a 6-digit OTP', 'error', 'otp-status-message');
            return false;
        }
    } catch (error) {
        console.error(error)
        showStatus('Error verifying OTP: ' + error.message, 'error', 'otp-status-message');
        return false;
    }
}

// Reset password
async function resetPassword(newPassword, confirmPassword) {
    const email = sessionStorage.getItem('resetEmail');
    try {
        if (newPassword !== confirmPassword) {
            showStatus('Passwords do not match', 'error', 'password-reset-status-message');
            return false;
        }

        if (newPassword.length < 8) {
            showStatus('Password must be at least 8 characters long', 'error', 'password-reset-status-message');
            return false;
        }

        const response = await fetch(`http://localhost:8000/reset-password`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                email:email,
                new_password:newPassword

            })

        });

        if(response.ok){
        
        
      
        closePasswordResetModal();
        sessionStorage.removeItem('resetEmail');
        
        showStatus('Password reset successfully! Please login with your new password.', 'success', 'password-reset-status-message');
        
        // Clear form
        document.getElementById('passwordResetForm').reset();
        

        }else{
            
            showPasswordResetModal();
        }
    } catch (error) {
        showStatus('Error resetting password: ' + error.message, 'error', 'password-reset-status-message');
        return false;
    }
}

// Status message display helper (if not already defined)
function showStatus(message, type = 'error', elementId = 'status-message') {
    const statusMessage = document.querySelector(`#${elementId}`);
    if (statusMessage) {
        statusMessage.textContent = message;
        statusMessage.style.display = 'block';
        statusMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        statusMessage.style.color = type === 'success' ? '#155724' : '#721c24';
        statusMessage.style.borderLeft = `4px solid ${type === 'success' ? '#28a745' : '#dc3545'}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Handle forgot password form submission
document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotPasswordEmail').value.trim();
            
            if (!email) {
                showStatus('Please enter your email address', 'error', 'forgot-password-status-message');
                return;
            }
            
            requestPasswordReset(email);
        });
    }

    // Handle OTP form submission
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const otp = document.getElementById('otpInput').value.trim();
            verifyOtp(otp);
        });
    }

    // Handle password reset form submission
    const passwordResetForm = document.getElementById('passwordResetForm');
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (resetPassword(newPassword, confirmPassword)) {
                // Redirect to login after successful reset
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        const otpModal = document.getElementById('otpModal');
        const passwordResetModal = document.getElementById('passwordResetModal');

        if (e.target === forgotPasswordModal) {
            closeForgotPasswordModal();
        }
        if (e.target === otpModal) {
            closeOtpModal();
        }
        if (e.target === passwordResetModal) {
            closePasswordResetModal();
        }
    });
});

