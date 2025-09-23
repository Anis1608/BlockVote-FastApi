import json
from database.db import redis_client
import time
from database.db import redis_client
from utils.send_voting_card import send_voter_card_email

QUEUE_NAME = "mail-queue"
def enqueue_voter_card_email(voter_id, name, father_name, voter_dob, profile_picture, signature, email):
    """
    Add a voter email job to a simple Redis FIFO list.
    """
    payload = {
        "voter_id": voter_id,
        "name": name,
        "father_name": father_name,
        "voter_dob": voter_dob,
        "profile_picture": profile_picture,
        "signature": signature,
        "email": email
    }
    
    redis_client.rpush(QUEUE_NAME, json.dumps(payload))
    queue_length = redis_client.llen(QUEUE_NAME)
    return {"status": "queued", "queue_position": queue_length}
# process.p

QUEUE_NAME = "mail-queue"
def process_voter_card_emails():
    """
    Simple processor: pop one by one from Redis and send email.
    """
    print("Starting simple email processor...")

    while True:
        payload = redis_client.lpop(QUEUE_NAME)  
        if not payload:
            print("Queue empty. Waiting...")
            time.sleep(2)
            continue

        try:
            if isinstance(payload, bytes):
                data = json.loads(payload.decode("utf-8"))
            else:
                data = json.loads(payload)
                
            print(f"Processing email to {data['email']} (Voter ID: {data['voter_id']})")

            # Call your sending function
            send_voter_card_email(
                data['voter_id'],
                data['name'],
                data['father_name'],
                data['voter_dob'],
                data['profile_picture'],
                data['signature'],
                data['email']
            )

            print(f"Email sent successfully: {data['email']}")
            
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON payload: {e}")
            print(f"Raw payload: {payload}")
            
        except KeyError as e:
            print(f"Missing required field in payload: {e}")
            print(f"Payload data: {data}")
            
        except Exception as e:
            # Use data if it exists, otherwise handle gracefully
            if 'data' in locals():
                print(f"Error sending email to {data.get('email', 'unknown')}: {e}")
            else:
                print(f"Error processing payload: {e}")
            print(f"Failed to process payload: {e}")
            
        time.sleep(1)  # Throttle to avoid spamming