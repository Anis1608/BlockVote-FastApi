# BlockVote - Secure Blockchain-Based Election System

BlockVote is a comprehensive, secure, and transparent election management system built on blockchain technology. It ensures the integrity of the voting process, from voter registration to the final tally.

## 🚀 Project Overview

The system consists of a robust backend and three distinct frontend applications tailored for different user roles:

*   **Backend**: A high-performance FastAPI (Python) application handling business logic, database interactions (PostgreSQL), and blockchain integration (Web3.py).
*   **Voter Registration Frontend**: A public-facing portal for voters to register and verify their identity.
*   **Admin Frontend**: A dashboard for election officials to manage specific elections, candidates, and voters.
*   **Super Admin Frontend**: A master control panel for overseeing the entire system, managing admins, and global settings.

## 📂 Project Structure

```
BlockVote/
├── Backend/                 # FastAPI Backend Application
├── AdminFrontend/           # React Admin Dashboard
├── SuperAdminFrontend/      # React Super Admin Dashboard
├── VoterRegistrationFrontend/ # React Voter Registration Portal
├── AWS_DEPLOYMENT_GUIDE.md  # Detailed AWS Deployment Instructions
├── DOCKER_SETUP.md          # Docker & Docker Compose Setup Guide
├── deploy.sh                # Deployment Script
├── docker-compose.yml       # Docker Compose Configuration
└── ...
```

## 📸 Screenshots

*(Please ensure you place your screenshots in a `screenshots` folder in this directory with the filenames below)*

### Dashboard & Election Details
Real-time overview of active elections, voter turnout, and phases.
![Dashboard](screenshots/dashboard.png)

### Secure Login
Role-based secure authentication for all system users.
![Login](screenshots/login.png)

### Device Management
Monitor and manage connected polling devices and active sessions.
![Device Management](screenshots/device_management.png)

### Profile Management
User profile settings and role information.
![Profile](screenshots/profile.png)

## 🛠️ Prerequisites

*   **Node.js** (v18+ recommended)
*   **Python** (v3.9+)
*   **Docker** & **Docker Compose**
*   **PostgreSQL**
*   **Redis**

## ⚡ Quick Start (Local Development)

### 1. Backend Setup

```bash
cd Backend
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --host 0.0.0.0 --port 9000 --reload
```

### 2. Frontend Setup

You can run each frontend independently. Open separate terminals for each:

**Admin Frontend:**
```bash
cd AdminFrontend
npm install
npm run dev
```

**Super Admin Frontend:**
```bash
cd SuperAdminFrontend
npm install
npm run dev
```

**Voter Registration Frontend:**
```bash
cd VoterRegistrationFrontend
npm install
npm run dev
```

## 🐳 Running with Docker

For a consistent environment, use Docker Compose to run all services simultaneously.

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

*   **Backend**: http://localhost:9000
*   **Voter Registration**: http://localhost:5173
*   **Admin Frontend**: http://localhost:5174
*   **Super Admin Frontend**: http://localhost:5175

## ☁️ Deployment

This project is cloud-ready. Refer to the included guides for detailed deployment instructions:

*   **[AWS Deployment Guide](AWS_DEPLOYMENT_GUIDE.md)**: Step-by-step instructions for deploying to AWS EC2 using Docker, Nginx, and SSL.
*   **[Docker Setup Guide](DOCKER_SETUP.md)**: Detailed Docker configuration and troubleshooting.

## 🔒 Security Features

*   **Blockchain Integration**: Immutable record of votes.
*   **JWT Authentication**: Secure session management.
*   **Role-Based Access Control (RBAC)**: Strict separation of duties between Super Admins, Admins, and Voters.
*   **Encrypted Data**: Sensitive voter data is encrypted at rest and in transit.

---
*Powered by BlockVote India*
