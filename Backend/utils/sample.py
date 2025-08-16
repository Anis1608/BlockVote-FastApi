# import base64
# import hashlib
# import os
# import dotenv
# from cryptography.fernet import Fernet

# dotenv.load_dotenv()


# personal_key = os.getenv("ENCRYPTION_KEY")
# encrypted_text = "gAAAAABonyOLfY4ccB1-2V8S-pEQOy2WHsj26G1RboRd_qWqrRTY7AEIDQF0VFz6Gb7K01FEf3pXNoDOn4c2hSSmfJs7w9PwCA=="

# def decrypt_qr_data(encrypted_text: str, personal_key: str) -> str:

#     fernet_key = base64.urlsafe_b64encode(hashlib.sha256(personal_key.encode()).digest())
#     f = Fernet(fernet_key)
#     decrypted_bytes = f.decrypt(encrypted_text.encode())
#     return decrypted_bytes.decode()

# # Example usage
# original_text = decrypt_qr_data(encrypted_text, personal_key)
# print("Original text:", original_text)


from cryptography.fernet import Fernet

key = Fernet.generate_key().decode()  # Converts bytes → string
print("Your Fernet key:", key)
