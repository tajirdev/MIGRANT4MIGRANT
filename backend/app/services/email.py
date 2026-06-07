import os
import smtplib
import secrets
import jwt
from datetime import datetime, timedelta, timezone
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

# Core application utilities and schemas
from app.core.jwt_token import SECRET_KEY, ALGORITHM
from app.core.security import Hash
from app.schemas.schemaUser import ForgotPasswordRequest, ResetPasswordRequest
from app.models import migrants


def forgot_password(request: ForgotPasswordRequest, db: Session):
    user = db.query(migrants.Migrant).filter(migrants.Migrant.email == request.email).first()
    
    if not user:
        return {
            "message": "If the email exists, a 6-digit verification code has been sent.", 
            "verification_context": ""
        }
    
    # 1. Generate a secure 6-digit numeric string
    otp_code = "".join(secrets.choice("0123456789") for _ in range(6))
    
    # 2. Package OTP details into a secure stateless JWT verification context
    token_expiry = datetime.now(timezone.utc) + timedelta(minutes=20)
    to_encode = {
        "sub": user.email,
        "exp": token_expiry,
        "password_reset": True,
        "otp_hash": Hash.hash(otp_code),
        "p_slice": user.password_hash[-10:]
    }
    verification_context = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    # Terminal Logging Backup
    print("\n" + "="*60)
    print(f"!!! SECURITY LOG FOR USER: {user.email} ")
    print(f"YOUR 6-DIGIT OTP CODE IS: {otp_code}")
    print(f"YOUR VERIFICATION CONTEXT IS:\n{verification_context}")
    print("="*60 + "\n")

    # --- SMTP EMAIL DELIVERY LOGIC ---
    try:
        SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
        SENDER_EMAIL = os.getenv("SENDER_EMAIL")       
        SENDER_PASSWORD = os.getenv("SENDER_PASSWORD") 

        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = user.email
        msg['Subject'] = "Your Migrant4Migrant Password Reset Code"

        body = f"""Hello,

We received a request to reset your password. 
Your 6-digit verification code is:

{otp_code}

This code will expire in 20 minutes. If you did not request this change, please ignore this email.

Thank you,
Migrant4Migrant Team"""
        
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls() 
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, user.email, msg.as_string())
        server.quit()
        print("[SMTP INFO]: Email dispatched successfully.")
        
    except Exception as e:
        print(f"[SMTP ERROR]: Failed to deliver email. Details: {e}")
        
    return {
        "message": "A 6-digit verification code has been sent. Please check your email.",
        "verification_context": verification_context
    }


def reset_password(request: ResetPasswordRequest, db: Session):
    try:
        payload = jwt.decode(request.verification_context, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        is_reset: bool = payload.get("password_reset", False)
        otp_hash: str = payload.get("otp_hash")
        token_slice: str = payload.get("p_slice")
        
        if email is None or not is_reset or token_slice is None or otp_hash is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification context")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification context")
    
    user = db.query(migrants.Migrant).filter(migrants.Migrant.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset reference")
    
    if not Hash.verify_password(request.otp, otp_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid 6-digit reset code")

    if user.password_hash[-10:] != token_slice:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This verification token has already been used")
        
    user.password_hash = Hash.hash(request.new_password)
    db.commit()
    
    return {"message": "Password reset successful. You can now log in with your new password."}