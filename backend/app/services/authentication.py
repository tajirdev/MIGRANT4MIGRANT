from fastapi import Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import migrants
from app.core.security import Hash
from app.core import jwt_token
from fastapi.security import  OAuth2PasswordRequestForm
from typing import Annotated
from datetime import timedelta, datetime, timezone
import jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from app.core.jwt_token import SECRET_KEY, ALGORITHM
from app.schemas.schemaUser import ForgotPasswordRequest, ResetPasswordRequest
from app.models import migrants


def login(request: Annotated[OAuth2PasswordRequestForm, Depends()],db:Session= Depends(get_db)):

    user = db.query(migrants.Migrant).filter(migrants.Migrant.email == request.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='incorect password or username')
    
    if not Hash.verify_password(request.password,user.password_hash):
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='incorect password or username')
    
     #  create token
    access_token = jwt_token.create_access_token(data = {
        'sub': user.email,
        'id': user.id,
        'role': user.role
    })
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }




def forgot_password(request: ForgotPasswordRequest, db: Session):
    user = db.query(migrants.Migrant).filter(migrants.Migrant.email == request.email).first()
    
    if not user:
        return {"message": "If the email exists, a password reset link has been sent."}
    
    # Generate token
    token_expiry = datetime.now(timezone.utc) + timedelta(minutes=20)
    to_encode = {
        "sub": user.email,
        "exp": token_expiry,
        "password_reset": True,
        "p_slice": user.password_hash[-10:]
    }
    reset_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
    
    # --- REAL EMAIL SENDING LOGIC ---
    try:
        # Pull your configuration variables 
        SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
        SENDER_EMAIL = os.getenv("SENDER_EMAIL")       # Your business/gmail address
        SENDER_PASSWORD = os.getenv("SENDER_PASSWORD") # Your App Password (not your main login pass)

        # Build email wrapper
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = user.email
        msg['Subject'] = "Reset Your Migrant4Migrant Password"

        body = f"""Hello,

We received a request to reset your password.
Click the link below to create a new password:

{reset_link}

If you did not request this change, please ignore this email.

Thank you,
Migrant4Migrant Team"""
        
        msg.attach(MIMEText(body, 'plain'))

        # Secure SMTP Connection
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls() 
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, user.email, msg.as_string())
        server.quit()
        
    except Exception as e:
        # Logs failure details to your console safely without crashing the backend server loop
        print(f"[EMAIL ERROR]: Failed to send email via SMTP. Details: {e}")
        
    return {"message": "a password reset link has been sent please visit your email."}


def reset_password(request: ResetPasswordRequest, db: Session):
    try:
        # Decode token using your exact configuration
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        is_reset: bool = payload.get("password_reset", False)
        token_slice: str = payload.get("p_slice")
        
        if email is None or not is_reset or token_slice is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")
    
    # Find the corresponding user record
    user = db.query(migrants.Migrant).filter(migrants.Migrant.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")
    
    # 4. Token Must Be Single-Use: Verify if password slice matches current database state
    if user.password_hash[-10:] != token_slice:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")
        
    # 5. Hash new password using your exact Hash utility class
    user.password_hash = Hash.hash(request.new_password)
    
    # Commit changes to PostgreSQL database
    db.commit()
    
    return {"message": "Password reset successful. You can now log in with your new password."}