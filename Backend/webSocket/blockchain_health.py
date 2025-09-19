import asyncio
import json
import time
from fastapi import FastAPI, WebSocket
from web3 import Web3
from web3.middleware.proof_of_authority import ExtraDataToPOAMiddleware
import os

# -------------------------------
# Web3 Setup
# -------------------------------
HTTP_URL = "https://api.avax.network/ext/bc/C/rpc"
WSS_URL  = "wss://api.avax.network/ext/bc/C/ws"

w3_http = Web3(Web3.HTTPProvider(HTTP_URL))
w3_ws   = Web3(Web3.LegacyWebSocketProvider(WSS_URL))

w3_http.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
w3_ws.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

last_block_time = None
expected_block_interval = 2
health_percentage = 100

# -------------------------------
# Blockchain Health Listener
# -------------------------------
async def block_listener():
    global last_block_time, health_percentage

    latest_block = w3_http.eth.block_number
    print(f"Starting block listener at block {latest_block}")

    while True:
        try:
            current_block = w3_http.eth.block_number
            if current_block > latest_block:
                for block_num in range(latest_block + 1, current_block + 1):
                    block = w3_http.eth.get_block(block_num)
                    current_time = block.timestamp

                    if last_block_time:
                        interval = current_time - last_block_time
                        if interval <= expected_block_interval:
                            health_percentage = 100
                        else:
                            penalty = (interval - expected_block_interval) * 10
                            health_percentage = max(0, 100 - penalty)
                    last_block_time = current_time

                    print(f"[Block {block.number}] Health={health_percentage}%")

                latest_block = current_block

            # If no new block for long, decrease health
            if last_block_time:
                delay = time.time() - last_block_time
                if delay > expected_block_interval * 2:
                    penalty = (delay - expected_block_interval) * 5
                    health_percentage = max(0, 100 - int(penalty))
                    print(f"No new block detected for {delay:.1f}s → Health={health_percentage}%")

            await asyncio.sleep(2)

        except Exception as e:
            print("Listener error:", e)
            await asyncio.sleep(5)

# -------------------------------
# FastAPI + WebSocket
# -------------------------------
def register_websocket(app: FastAPI):
    @app.on_event("startup")
    async def start_listener():
        asyncio.create_task(block_listener())

    @app.websocket("/ws/health")
    async def websocket_health(ws: WebSocket):
        await ws.accept()
        print("Client connected to WebSocket")
        try:
            while True:
                await ws.send_text(
                    json.dumps({
                        "health_percentage": health_percentage
                    })
                )
                await asyncio.sleep(2)
        except Exception as e:
            print("WebSocket client disconnected", e)

