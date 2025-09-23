import serial, asyncio
from fastapi import APIRouter, WebSocket

router = APIRouter()

# WebSocket URL will include the port: /ws/scan/{port}
@router.websocket("/ws/scan/{port}")
async def scan_ws(websocket: WebSocket, port: str):
    await websocket.accept()
    try:
        # Try to open the selected port
        try:
            ser = serial.Serial(port, 9600, timeout=1)  # Use the port from frontend
        except serial.SerialException as e:
            await websocket.send_json({"error": f"Cannot open port {port}: {str(e)}"})
            await websocket.close()
            return

        while True:
            if ser.in_waiting > 0:
                data = ser.readline().decode().strip()
                if data:
                    await websocket.send_json({"voter_id": data})
                    break   # Stop after one scan
            await asyncio.sleep(0.1)

    finally:
        await websocket.close()
