/**
 * OTP and Password Reset Functionality
 * Handles OTP verification and password reset flows
 */

// Show forgot password modal
function showForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
    document.getElementById('loginForm').reset();
}

// Close forgot password modal
function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
}

// Show OTP modal
function showOtpModal() {
    document.getElementById('otpModal').classList.remove('hidden');
}

// Close OTP modal
function closeOtpModal() {
    document.getElementById('otpModal').classList.add('hidden');
}

// Show password reset modal
function showPasswordResetModal() {
    document.getElementById('passwordResetModal').classList.remove('hidden');
}

// Close password reset modal
function closePasswordResetModal() {
    document.getElementById('passwordResetModal').classList.add('hidden');
}

// Request password reset
async function requestPasswordReset(email) {
    try {
        // Since email is not configured yet, just simulate the request
        console.log('Password reset requested for:', email);
        
        // Simulate sending OTP
        showOtpModal();
        closeForgotPasswordModal();
        
        showStatus('OTP sent to your email! (Simulated)', 'success');
        
        // Store email in sessionStorage for next step
        sessionStorage.setItem('resetEmail', email);
        
        return true;
    } catch (error) {
        showStatus('Error sending OTP: ' + error.message, 'error');
        return false;
    }
}

// Verify OTP
async function verifyOtp(otp) {
    try {
        console.log('Verifying OTP:', otp);
        
        // Simulate OTP verification
        if (otp.length === 6) {
            closeOtpModal();
            showPasswordResetModal();
            showStatus('OTP verified successfully!', 'success');
            return true;
        } else {
            showStatus('Please enter a 6-digit OTP', 'error');
            return false;
        }
    } catch (error) {
        showStatus('Error verifying OTP: ' + error.message, 'error');
        return false;
    }
}

// Reset password
async function resetPassword(newPassword, confirmPassword) {
    try {
        if (newPassword !== confirmPassword) {
            showStatus('Passwords do not match', 'error');
            return false;
        }

        if (newPassword.length < 8) {
            showStatus('Password must be at least 8 characters long', 'error');
            return false;
        }

        const email = sessionStorage.getItem('resetEmail');
        
        console.log('Resetting password for:', email);
        
        // Simulate password reset
        closePasswordResetModal();
        sessionStorage.removeItem('resetEmail');
        
        showStatus('Password reset successfully! Please login with your new password.', 'success');
        
        // Clear form
        document.getElementById('passwordResetForm').reset();
        
        return true;
    } catch (error) {
        showStatus('Error resetting password: ' + error.message, 'error');
        return false;
    }
}

// Status message display helper (if not already defined)
function showStatus(message, type = 'error') {
    const statusMessage = document.querySelector("#status-message");
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
                showStatus('Please enter your email address', 'error');
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
