import os
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from web3 import Web3
from database.db import get_db
from middleware.security import access_check

# Load ENV variables
RPC = os.getenv("AVAX_RPC")
CHAIN_ID = int(os.getenv("CHAIN_ID", "43113"))
SNOWTRACE_API_KEY = os.getenv("SNOWTRACE_API_KEY")
CONTRACT_ADDRESS = os.getenv("SMART_CONTRACT_ADDRESS")

# Web3 connection
w3 = Web3(Web3.HTTPProvider(RPC))

# Router
router = APIRouter()

@router.get("/super_admin/blockchain-health")
async def get_blockchain_health(
    db: Session = Depends(get_db),
    # admin=Depends(access_check)  # ✅ Only superadmin access
):
    try:
        # --- Latest block info ---
        latest_block = w3.eth.get_block("latest")
        block_number = latest_block.number
        block_time = latest_block.timestamp

        # --- Average block time (last 5 blocks) ---
        timestamps = []
        for i in range(block_number, block_number - 5, -1):
            blk = w3.eth.get_block(i)
            timestamps.append(blk.timestamp)
        avg_block_time = (timestamps[0] - timestamps[-1]) / (len(timestamps) - 1)

        # --- Gas price ---
        gas_price = w3.eth.gas_price

        # --- Contract transaction count (via Snowtrace API) ---
        tx_count = None
        if SNOWTRACE_API_KEY and CONTRACT_ADDRESS:
            url = (
                f"https://api-testnet.snowtrace.io/api"
                f"?module=account&action=txlist"
                f"&address={CONTRACT_ADDRESS}"
                f"&sort=desc"
            )
            resp = requests.get(url).json()
            if resp.get("status") == "1":
                tx_count = len(resp.get("result", []))

        return {
            "Success": True,
            "message": "Avalanche blockchain health fetched successfully",
            "network": "Avalanche C-Chain",
            "latest_block": block_number,
            "latest_block_time": block_time,
            "average_block_time": avg_block_time,
            "current_gas_price": gas_price,
            "contract_tx_count": tx_count if tx_count is not None else "Snowtrace API key not set"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/blockchain/live-data")
async def get_live_data():
    try:
        # Latest block number
        block_number_resp = requests.get(
            "https://api-testnet.snowtrace.io/api?module=proxy&action=eth_blockNumber"
        ).json()
        latest_block = int(block_number_resp["result"], 16)

        # Current gas price
        gas_resp = requests.get(
            "https://api-testnet.snowtrace.io/api?module=proxy&action=eth_gasPrice"
        ).json()
        gas_price_gwei = int(gas_resp["result"], 16) / 1e9

        return {
            "success": True,
            "latest_block": latest_block,
            "gas_price_gwei": gas_price_gwei
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
