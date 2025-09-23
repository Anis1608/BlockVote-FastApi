from socket import socket
import uvicorn
import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import Base, engine
from routes.super_admin_routes import router as super_admin_router
from routes.admin_routes import router as admin
from routes.cast_vote import router as cast_vote_router
from routes.public_routes import router as public_router
from routes.election_routes import router as election_router
from routes.blockchain_monitor_routes import router as blockchain_monitor_router 
from routes.super_admin_logs_routes import router as super_admin_logs_router
from routes.voters_public import router as voters_public_router
from utils.voter_card_sending_queue import process_voter_card_emails
Base.metadata.create_all(bind=engine)
app = FastAPI(title="PostgreSQL API")
import webSocket.blockchain_health as health_ws
import webSocket.scanner_ws as scanner_ws

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"] later
    allow_credentials=True,
    allow_methods=["*"],  # ["GET", "POST", "PUT", "DELETE"] if you want to restrict
    allow_headers=["*"],
)


# @app.on_event("startup")  # FastAPI <0.100 (ya lifespan for new versions)
# def start_queue_processor():
#     # Thread me run karo taaki API block na ho
#     threading.Thread(target=process_voter_card_emails, daemon=True).start()
#     print("Email queue processor started in background")

# Routers
app.include_router(super_admin_router, prefix="/api", tags=["Super Admin"])
app.include_router(admin, prefix="/api", tags=["Admin"])
app.include_router(cast_vote_router, prefix="/api", tags=["Cast Vote"])
app.include_router(public_router, prefix="/api", tags=["Public_router"])
app.include_router(election_router, prefix="/api", tags=["Election_router"])
app.include_router(super_admin_logs_router, prefix="/api", tags=["Super Admin Logs"])
app.include_router(blockchain_monitor_router, prefix="/api", tags=["Blockchain Monitor"])
app.include_router(voters_public_router, prefix="/api", tags=["voter"])
# app.include_router(scanner_ws.router)   # WebSocket for Scanner

# health_ws.register_websocket(app)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True , ws_max_size=16777216,
        ws_ping_interval=20,
        ws_ping_timeout=20,)
