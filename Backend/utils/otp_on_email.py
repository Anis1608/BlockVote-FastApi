import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from database.db import redis_client
import redis

import os
from dotenv import load_dotenv
load_dotenv()

# Constants
MAX_OTP_ATTEMPTS = 5          # Max OTP requests allowed
OTP_EXPIRY = 300              # OTP expiry in seconds (5 minutes)
OTP_ATTEMPTS_WINDOW = 900  

# store otp in redis of multiple user and mulitple time of user
def generate_otp():
    import random
    return str(random.randint(100000, 999999))

# Store OTP in Redis with purpose and rate limit
def store_otp_in_redis(email: str, otp: str, purpose: str, expiry: int = 300, attempts_window: int = 600):
    otp_key = f"otp:{purpose}:{email}"
    attempts_key = f"otp_attempts:{purpose}:{email}"

    attempts = redis_client.get(attempts_key)
    attempts = int(attempts) if attempts else 0

    if attempts >= MAX_OTP_ATTEMPTS:
        raise Exception("Maximum OTP requests exceeded. Please try again later.")

    with redis_client.pipeline() as pipe:
        pipe.set(otp_key, otp, ex=expiry)              # Store OTP with expiry
        pipe.incr(attempts_key)                        # Increment attempts count
        pipe.expire(attempts_key, attempts_window)     # Reset attempts after window
        pipe.execute()


# Verify OTP with cleanup and purpose
async def verify_otp(email: str, otp: str, purpose: str ):
    otp_key = f"otp:{purpose}:{email}"
    attempts_key = f"otp_attempts:{purpose}:{email}"

    stored = redis_client.get(otp_key)
    if stored and stored == otp:
        with redis_client.pipeline() as pipe:
            pipe.delete(otp_key)
            pipe.delete(attempts_key)
            pipe.execute()
        return True

    return False


    
def send_otp_email(to_email: str, otp: str):
    EMAIL_HOST = os.getenv("EMAIL_HOST")
    EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
    EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

    msg = MIMEMultipart("alternative")
    msg['Subject'] = "Your OTP Code"
    msg['From'] = formataddr(("BlockVote India", EMAIL_HOST_USER))
    msg['To'] = to_email

    html = f"""
   <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    </style>
  </head>
  <body style="font-family: 'Poppins', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%); margin: 0; padding: 0;">
    <!-- Header with Gradient -->
    <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#4F46E5">
      <tr>
        <td align="center" style="padding: 25px 0; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">BlockVote India</h1>
          <p style="margin: 5px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">India's Trusted Digital Voting Platform</p>
        </td>
      </tr>
    </table>

    <!-- Main Content -->
    <table width="100%" cellspacing="0" cellpadding="0" bgcolor="transparent">
      <tr>
        <td align="center" style="padding: 30px 20px;">
          <table width="100%" max-width="500" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 12px; box-shadow: 0 6px 18px rgba(79, 70, 229, 0.12); border: 1px solid #E5E7EB;">
            <tr>
              <td style="padding: 40px 30px; text-align: center;">
                  <img  src="https://cdn.britannica.com/97/1597-050-008F30FA/Flag-India.jpg" alt="BlockVote Logo" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
              
                <h2 style="margin: 0 0 15px; color: #111827; font-size: 20px; font-weight: 600;">Your Login Verification Code</h2>
                <p style="margin: 0 0 25px; color: #6B7280; font-size: 14px; line-height: 1.5;">Please use the following One-Time Password to securely login to your BlockVote account:</p>
                
                <!-- OTP Display -->
                <div style="background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%); border-radius: 8px; padding: 15px 25px; display: inline-block; border: 1px dashed #D1D5DB;">
                  <span style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #4F46E5; text-shadow: 0 2px 4px rgba(0,0,0,0.05);">{otp}</span>
                </div>
                
                <p style="margin: 25px 0 0; color: #6B7280; font-size: 13px; line-height: 1.5;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 5px;">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8V12M12 16H12.01" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  This OTP expires in <strong style="color: #EF4444;">5 minutes</strong>
                </p>
                
                <div style="margin: 30px 0; height: 1px; background: linear-gradient(90deg, rgba(239,68,68,0) 0%, #E5E7EB 50%, rgba(239,68,68,0) 100%);"></div>
                
                <p style="margin: 0; color: #9CA3AF; font-size: 12px; line-height: 1.5;">If you didn't request this OTP, please secure your account by changing your password.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <table width="100%" cellspacing="0" cellpadding="0" bgcolor="transparent">
      <tr>
        <td align="center" style="padding: 20px;">
          <table width="100%" max-width="500" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 0 0 20px;">
                <!-- Facebook -->
                <a href="#" style="margin: 0 8px; display: inline-block;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#4F46E5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                
                <!-- Twitter -->
                <a href="#" style="margin: 0 8px; display: inline-block;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#4F46E5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                
                <!-- Instagram -->
                <a href="#" style="margin: 0 8px; display: inline-block;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#4F46E5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4077 15.9059C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1902 8.22768 13.4229 8.09402 12.5922C7.96035 11.7616 8.09202 10.9099 8.47028 10.1584C8.84854 9.40685 9.45414 8.79377 10.2009 8.40627C10.9477 8.01878 11.7977 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8716 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.5 6.5H17.51" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                
                <!-- LinkedIn -->
                <a href="#" style="margin: 0 8px; display: inline-block;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#4F46E5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 9H2V21H6V9Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 0 15px;">
                <p style="margin: 0; color: #6B7280; font-size: 12px;">BlockVote India - Revolutionizing Digital Democracy</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 0 15px;">
                <p style="margin: 0; color: #6B7280; font-size: 12px;"> IMCC College Kothrud , Pune 411052 </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 0 0 15px;">
                <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none; margin: 0 10px; font-weight: 500;">Privacy Policy</a>
                <span style="color: #D1D5DB;">|</span>
                <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none; margin: 0 10px; font-weight: 500;">Terms</a>
                <span style="color: #D1D5DB;">|</span>
                <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none; margin: 0 10px; font-weight: 500;">Contact</a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 15px 0 0;">
                <p style="margin: 0; color: #9CA3AF; font-size: 11px;">© 2025 BlockVote India. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    """

    part = MIMEText(html, "html")
    msg.attach(part)

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.ehlo()  # Optional, but good practice
        server.starttls()
        server.ehlo()  # Optional, but good practice
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        server.sendmail(EMAIL_HOST_USER, [to_email], msg.as_string())
