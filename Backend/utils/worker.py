# ye reddis queue worker hai jo background me chalke email bhejega

from rq import Worker, Queue, Connection
from database.db import redis_client

listen = ["mail-queue"]

def run_worker():
    
    with Connection(redis_client):
        worker = Worker([Queue(name) for name in listen])
        worker.work(with_scheduler=True)
        print("Worker started, waiting for jobs...")

# if __name__ == "__main__":
#     print("Worker started, waiting for jobs...")
#     run_worker()
