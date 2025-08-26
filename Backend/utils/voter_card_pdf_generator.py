from email.utils import formataddr
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from cryptography.fernet import Fernet
from email import encoders
from email.mime.text import MIMEText
import os
import qrcode
import io
import requests
import smtplib
import base64
import hashlib
import dotenv

dotenv.load_dotenv()


# ---------------- Helper Functions ----------------


secret_string   = os.getenv("ENCRYPTION_KEY")

def fetch_image_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return io.BytesIO(response.content)
    except Exception as e:
        print(f"Error fetching image from {url}: {e}")
        return None


def derive_fernet_key_from_string(secret: str) -> bytes:
    """
    Fernet keys must be 32 url-safe base64-encoded bytes.
    This function takes any string, hashes it to 32 bytes, and encodes to Fernet format.
    """
    hashed = hashlib.sha256(secret.encode()).digest()
    return base64.urlsafe_b64encode(hashed)


def encrypt_data(data: str, key: bytes) -> str:
    fernet = Fernet(key)
    return fernet.encrypt(data.encode()).decode()


def voter_card_generator(
    user_id: str,
    name: str,
    father_name: str,
    dob: str,
    photo_url: str = None,
    signature_url: str = None
):
    key = derive_fernet_key_from_string(secret_string)

    card_width, card_height = (175 * mm, 105 * mm)
    saffron_height = 15 * mm
    green_height = 12 * mm

    # Encrypt user_id for QR
    encrypted_data = encrypt_data(user_id, key)

    qr_img = qrcode.QRCode(version=1, box_size=10, border=0)
    qr_img.add_data(encrypted_data)
    qr_img.make(fit=True)
    qr_pil = qr_img.make_image(fill_color="black", back_color="white")
    qr_buffer = io.BytesIO()
    qr_pil.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    pdf_buffer = io.BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=(card_width, card_height))

    # Header (Saffron)
    c.setFillColorRGB(1, 0.6, 0.2)
    c.rect(0, card_height - saffron_height, card_width, saffron_height, fill=1, stroke=0)

    # Footer (Green)
    c.setFillColorRGB(0.2, 0.7, 0.32)
    c.rect(0, 0, card_width, green_height, fill=1, stroke=0)

    # Border
    c.setStrokeColor(colors.black)
    c.setLineWidth(2)
    c.rect(0, 0, card_width, card_height, fill=0, stroke=1)
    c.setFillColor(colors.black)

    # Title
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(card_width / 2, card_height - saffron_height / 2 - 2 * mm, "GOVERNMENT OF INDIA")
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(card_width / 2, card_height - saffron_height - 8 * mm, "Election Commission of India")

    # Footer text
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.white)
    c.drawCentredString(card_width / 2, green_height / 2 - 1 * mm, "BlockVote India - BlockChain Voting System")
    c.setFillColor(colors.black)

    # Photo box
    photobox_x, photobox_y = 10 * mm, card_height - saffron_height - 45 * mm
    photobox_w, photobox_h = 32 * mm, 40 * mm
    c.setStrokeColor(colors.grey)
    c.setLineWidth(1)
    c.rect(photobox_x, photobox_y, photobox_w, photobox_h, fill=0, stroke=1)

    # Profile Photo
    if photo_url:
        photo_data = fetch_image_from_url(photo_url)
        if photo_data:
            try:
                c.drawImage(ImageReader(photo_data), photobox_x + 2, photobox_y + 2,
                            photobox_w - 4, photobox_h - 4, preserveAspectRatio=True, mask='auto')
            except Exception as e:
                print("Photo error:", e)

    # Signature
    if signature_url:
        signature_data = fetch_image_from_url(signature_url)
        if signature_data:
            sig_w, sig_h = photobox_w - 4, 10 * mm
            sig_x = photobox_x + 2
            sig_y = photobox_y - sig_h - 3 * mm
            try:
                c.drawImage(ImageReader(signature_data), sig_x, sig_y, sig_w, sig_h,
                            preserveAspectRatio=True, mask='auto')
            except Exception as e:
                print("Signature error:", e)

    # QR code
    qrsize = 41 * mm
    qr_x = card_width - qrsize - 5 * mm
    qr_y = green_height + 2 * mm
    c.drawImage(ImageReader(qr_buffer), qr_x, qr_y, qrsize, qrsize)

    # Info fields
    label_x = photobox_x + photobox_w + 6 * mm
    value_x = label_x + 35 * mm
    field_start_y = card_height - saffron_height - 22 * mm
    line_spacing = 10 * mm

    fields = [
        ("Name:", name),
        ("Father's Name:", father_name),
        ("Date of Birth:", dob),
        ("Voter ID:", user_id)
    ]
    for i, (label, value) in enumerate(fields):
        y_pos = field_start_y - (i * line_spacing)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(label_x, y_pos, label)
        c.setFont("Helvetica", 13)
        c.drawString(value_x, y_pos, value)

    c.save()
    pdf_buffer.seek(0)
    return pdf_buffer



def send_voter_card_email(voter_id: str, name: str, father_name: str, dob: str, photo_url: str, signature_url: str, email: str):
    EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
    EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
    EMAIL_HOST = os.getenv("EMAIL_HOST")

    # Generate PDF
    pdf_file = voter_card_generator(
        user_id=voter_id,
        name=name,
        father_name=father_name,
        dob=dob,
        photo_url=photo_url,
        signature_url=signature_url
    )

    filename = f"voter-id-card-{voter_id}.pdf"

    # Create message
    msg = MIMEMultipart()
    msg['From'] = formataddr(("BlockVote India" , EMAIL_HOST_USER))
    msg['To'] = email
    msg['Subject'] = '🎉 Congratulations! Your Voter Card Has Been Generated'

    # HTML email content
    html_content = f"""
   <html>
<body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 5px;">
    <div style="max-width: 600px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Election Commission of India -->
        <h1 style="text-align:center; color: #000080; margin-bottom: 5px;">Election Commission of India</h1>
        
        <!-- BlockVote India Banner -->
        <div style="background-color: #28a745; color: white; padding: 12px; text-align: center; font-size: 22px; font-weight: bold; border-radius: 5px;">
            BlockVote India
        </div>
        
        <!-- Tagline -->
        <p style="text-align: center; font-size: 15px; color: #333; margin-top: 15px;">
            🔒 "Empowering Democracy with Blockchain — Secure, Transparent, and Tamper-Proof Voting for Every Citizen."
        </p>
        
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        
        <!-- Main Content -->
        <h2 style="color: #2c3e50;">Congratulations! 🎉</h2>
        <p>Dear <b>{name}</b>,</p>
        <p>Your voter card has been successfully generated and is ready for use.</p>
        <p>Please find your voter card attached in PDF format.</p>
        
        <p style="color: #27ae60; font-weight: bold;">Thank you for being a responsible citizen and embracing a transparent future of democracy!</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        
        <!-- Footer -->
        <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
            This is an auto-generated email from <b>BlockVote India</b>. Please do not reply.
        </p>
    </div>
</body>
</html>

    """

    msg.attach(MIMEText(html_content, 'html'))

    # Attach PDF
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(pdf_file.getvalue())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', f'attachment; filename="{filename}"')
    msg.attach(part)

    # Send email
    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        server.send_message(msg)

    print(f"✅ Voter card sent to {email}")

send_voter_card_email(
        voter_id="VOT12345AB234567",
        name="Anis Yasin Khan",
        father_name="Yasin Musthakim Khan",
        dob="01/06/1995",
        photo_url="https://res.cloudinary.com/yg123/image/upload/v1744563224/dp69mnqdjwxfnumxjyp5.jpg",
        signature_url="https://res.cloudinary.com/yg123/image/upload/v1755259253/signature-sample_ifpuix.jpg",
        email="ppal23819@gmail.com")

