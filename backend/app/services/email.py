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
        
    

    
        msg = MIMEMultipart() 
        
       
        msg['From'] = f"Migrant4Migrant Team <{SENDER_EMAIL}>"
        msg['To'] = user.email
        msg['Subject'] = "Your Migrant4Migrant Password Reset Code"

      
       # body_text = f"Hello,\n\nWe received a request to reset your password. Your code is: {otp_code}\n\nThis code expires in 20 minutes."
        

        body_html = f"""
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #F9F9F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9F9F9; padding: 40px 20px;">
              <tr>
                <td align="center">
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #4ECDC4; box-shadow: 0 4px 12px rgba(45, 52, 54, 0.05);">
                    
                    <tr>
                      <td align="center" style="background-color: #2D3436; padding: 32px 20px;">
                        <h1 style="color: #FF6B6B; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px;">Migrant4Migrant</h1>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 32px; background-color: #ffffff;">
                        <h2 style="color: #2D3436; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h2>
                        <p style="color: #2D3436; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                          Hello,
                        </p>
                        <p style="color: #2D3436; font-size: 15px; line-height: 24px; margin: 0 0 32px 0;">
                          We received a request to reset the password for your Migrant4Migrant account. Please use the secure 6-digit verification code below to proceed with setting a new password:
                        </p>
                        
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 32px 0;">
                          <tr>
                            <td align="center">
                              <div style="background-color: #F9F9F9; border: 2px dashed #4ECDC4; border-radius: 8px; padding: 20px 40px; display: inline-block;">
                                <span style="font-size: 36px; font-weight: 800; color: #FF6B6B; letter-spacing: 6px; font-family: 'Courier New', Courier, monospace;">{otp_code}</span>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #2D3436; font-size: 14px; line-height: 22px; margin: 32px 0 0 0;">
                          This security code will expire in <span style="padding: 2px 6px; border-radius: 4px; font-weight: bold; color:  #4ECDC4;">20 minutes</span>. For protection, please do not forward or share this code with anyone.
                        </p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="background-color: #F9F9F9; padding: 28px 32px; text-align: center; border-top: 1px solid #4ECDC4;">
                        <p style="color: #636e72; font-size: 12px; line-height: 18px; margin: 0;">
                          If you did not request a password change, you can safely disregard this message. Your current password will remain completely secure and unchanged.
                        </p>
                        <p style="color: #2D3436; font-size: 12px; margin: 16px 0 0 0; font-weight: 500; letter-spacing: 0.5px;">
                          &copy; 2026 Migrant4Migrant. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                  
                </td>
              </tr>
            </table>
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