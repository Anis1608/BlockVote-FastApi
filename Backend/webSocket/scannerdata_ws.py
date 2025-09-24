import asyncio
from fastapi import APIRouter, WebSocket
import json
from database.db import redis_client 

router = APIRouter()
last_scan_cache = {}

@router.websocket("/ws/scanner/{device_id}")
async def scanner_ws(websocket: WebSocket, device_id: str):
    await websocket.accept()
    pubsub = redis_client.pubsub()
    pubsub.subscribe(f"channel:{device_id}")

    try:
        while True:
            # run the blocking get_message in a thread
            message = await asyncio.to_thread(pubsub.get_message, ignore_subscribe_messages=True, timeout=1.0)

            if message:
                try:
                    data = json.loads(message["data"])
                    await websocket.send_json(data)
                except Exception as e:
                    await websocket.send_json({"error": f"Invalid data: {str(e)}"})

            # small sleep to avoid busy loop
            await asyncio.sleep(0.10)

    except Exception as e:
        await websocket.send_json({"error": str(e)})
    finally:
        pubsub.close()
        await websocket.close()
