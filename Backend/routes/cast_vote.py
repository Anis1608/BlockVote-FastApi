from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from web3 import Web3
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os

# ------------------ Load ENV ------------------
load_dotenv()


app = FastAPI()
