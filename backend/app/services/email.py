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
    user.reset_otp = otp_code
    user.otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=20)
    user.is_otp_verified = False  
    db.commit()
    
    print(f"\n[SECURITY DISPATCH]: User {user.email} generated OTP: {otp_code}\n")

    
    try:
        SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
        SENDER_EMAIL = os.getenv("SENDER_EMAIL")       
        SENDER_PASSWORD = os.getenv("SENDER_PASSWORD") 

        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = user.email
        msg['Subject'] = "Your Migrant4Migrant Password Reset Code"

        # email message
        body = f"""Hello,

We received a request to reset your password. 
Your 6-digit verification code is: {otp_code}

This code will expire in 20 minutes. If you did not request this change, please ignore this email.

Thank you,
Migrant4Migrant Team"""
        
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls() 
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, user.email, msg.as_string())
        server.quit()
        print("[SMTP INFO]: Verification mail sent successfully.")
        
    except Exception as e:
        print(f"[SMTP ERROR]: Failed to deliver email via SMTP. Details: {e}")
        
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
    if user.reset_otp != request.otp:
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