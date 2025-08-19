import json
import os
from solcx import compile_standard, install_solc
from web3 import Web3
from dotenv import load_dotenv

# Load env
load_dotenv()

PRIVATE_KEY = os.getenv("PRIVATE_KEY_SUPER_ADMIN")
PUBLIC_ADDRESS = os.getenv("PUBLIC_ADDRESS_SUPER_ADMIN")
RPC_URL = os.getenv("AVAX_RPC")

# Connect to Avalanche Fuji
w3 = Web3(Web3.HTTPProvider(RPC_URL))
chain_id = 43113  # Fuji Testnet
account = w3.eth.account.from_key(PRIVATE_KEY)

# Read contract
with open("C:/Users/91970/Desktop/BlockVote/Backend/deploy-contract/voting.sol", "r") as file:
    voting_source = file.read()

# Install compiler
install_solc("0.8.0")

# Compile contract
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"Voting.sol": {"content": voting_source}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    },
    solc_version="0.8.0",
)

# Save ABI
with open("Voting_abi.json", "w") as f:
    json.dump(compiled_sol["contracts"]["Voting.sol"]["Voting"]["abi"], f)

bytecode = compiled_sol["contracts"]["Voting.sol"]["Voting"]["evm"]["bytecode"]["object"]
abi = compiled_sol["contracts"]["Voting.sol"]["Voting"]["abi"]

# Create contract
Voting = w3.eth.contract(abi=abi, bytecode=bytecode)

# Build tx
nonce = w3.eth.get_transaction_count(account.address)
transaction = Voting.constructor().build_transaction(
    {
        "chainId": chain_id,
        "gasPrice": w3.eth.gas_price,
        "from": account.address,
        "nonce": nonce,
    }
)

# Sign tx
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=PRIVATE_KEY)

# Send tx
tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
print("Deploying contract...")

# Wait for receipt
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(f"Contract deployed at: {tx_receipt.contractAddress}")

# Save address
with open("Voting_address.txt", "w") as f:
    f.write(tx_receipt.contractAddress)
