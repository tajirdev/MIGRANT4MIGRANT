import os
import smtplib
import secrets
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.security import Hash
from app.schemas.schemaUser import ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest
from app.models import migrants



def forgot_password(request: ForgotPasswordRequest, db: Session):
    user = db.query(migrants.Migrant).filter(migrants.Migrant.email == request.email).first()
    
    if not user:
        return {"message": "If the email exists, a 6-digit verification code has been sent."}
    
    # 1. Automatically generate a secure 6-digit OTP string
    otp_code = "".join(secrets.choice("0123456789") for _ in range(6))
    
    # 2. Update database records to track this dynamic session
    user.reset_otp = Hash.hash(otp_code)
    user.otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=20)
    user.is_otp_verified = False  
    db.commit()
    
    print(f"\n[SECURITY DISPATCH]: User {user.email} generated OTP: {otp_code}\n")

    
    try:
        SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
        SENDER_EMAIL = os.getenv("SENDER_EMAIL")       
        SENDER_PASSWORD = os.getenv("SENDER_PASSWORD") 
        
    

    
        msg = MIMEMultipart() # Changed to 'alternative' to support both text and HTML
        
        # 1. Add a professional Display Name
        msg['From'] = f"Migrant4Migrant Team <{SENDER_EMAIL}>"
        msg['To'] = user.email
        msg['Subject'] = "Your Migrant4Migrant Password Reset Code"

      
       # body_text = f"Hello,\n\nWe received a request to reset your password. Your code is: {otp_code}\n\nThis code expires in 20 minutes."
        

        body_html = f"""
        <html>
          <body>
            <h2 style="color: #2c3e50;">Migrant4Migrant Password Reset</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Use the verification code below to proceed:</p>
            <div style=" padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; border-radius: 5px; color: #e74c3c; width: 200px;">
                {otp_code}
            </div>
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 20px;">This code will expire in 20 minutes. If you did not request this change, please ignore this email.</p>
          </body>
        </html>
        """
        
       # msg.attach(MIMEText(body_text, 'plain'))
        msg.attach(MIMEText(body_html, 'html'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls() 
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, user.email, msg.as_string())
        server.quit()
        print("[SMTP INFO]: Verification mail sent successfully.")
        
    except Exception as e:
        print(f"[SMTP ERROR]: Failed to deliver email via SMTP. Details: {e}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email delivery failed: {str(e)}"
        )
        
    return {"message": "A 6-digit verification code has been sent. Please check your email."}

def verify_otp(request: VerifyOTPRequest, db: Session):
    user = db.query(migrants.Migrant).filter(migrants.Migrant.email == request.email).first()
    if not user or not user.reset_otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active password reset session found")
        
    # Timezone-aware expiration validation check
    current_time = datetime.now(timezone.utc)
    expiry_time = user.otp_expiry.replace(tzinfo=timezone.utc) if user.otp_expiry.tzinfo is None else user.otp_expiry

    if current_time > expiry_time:
        user.reset_otp = None
        user.otp_expiry = None
        user.is_otp_verified = False
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The 6-digit verification code has expired")
    
    # Check if the code typed matches the database record
    if not Hash.verify_password(request.otp, user.reset_otp):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid 6-digit reset code")
        
    
    user.is_otp_verified = True
    db.commit()
    
    return {"message": "OTP verified successfully. You can now proceed to change your password."}


def reset_password(request: ResetPasswordRequest, db: Session):
    # Enforce confirmation match security


    user = db.query(migrants.Migrant).filter(migrants.Migrant.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request parameters")
        
    
    if not user.is_otp_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You must verify your OTP before changing the password")
        
    
    user.password_hash = Hash.hash(request.new_password)
    

    user.reset_otp = None  
    user.otp_expiry = None
    user.is_otp_verified = False  
    db.commit()
    
    return {"message": "Password reset successful. You can now log in with your new password."}