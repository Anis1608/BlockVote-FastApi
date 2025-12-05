# BlockVote - Secure Blockchain-Based Election System

**BlockVote** is a state-of-the-art, decentralized electronic voting system designed to ensure transparency, security, and integrity in elections. Built with a modern tech stack, it leverages blockchain technology to make votes immutable and verifiable, while providing distinct interfaces for voters, election administrators, and super administrators.

---

## 🏗️ System Architecture

The BlockVote ecosystem is composed of four main components working in harmony:

1.  **Backend Core**: The central nervous system handling API requests, database management, and blockchain transactions.
2.  **Super Admin Portal**: For high-level system configuration and management of election officials.
3.  **Admin Dashboard**: For managing specific elections, candidates, and monitoring polling stations.
4.  **Voter Registration Portal**: A public gateway for citizens to register and verify their eligibility.

---

## 🚀 Key Features

*   **Blockchain Security**: Every vote is recorded on a blockchain (Ethereum/Polygon compatible), ensuring it cannot be tampered with or deleted.
*   **Role-Based Access Control (RBAC)**: Distinct permissions for Super Admins, Admins, and Voters.
*   **Real-Time Monitoring**: Live tracking of voter turnout, device status, and election progress via WebSockets.
*   **Secure Authentication**: JWT-based session management with encrypted passwords (Bcrypt).
*   **Device Management**: Control and monitor polling devices (EVMs) remotely.
*   **Automated Communication**: Email notifications for voter registration status and election updates.
*   **Smart Contract Integration**: Automated vote tallying and result declaration using Solidity smart contracts.

---

## 💻 Technology Stack

### Backend (`/Backend`)
*   **Framework**: FastAPI (Python) - High performance, easy to use.
*   **Database**: PostgreSQL - Robust relational database for user data and logs.
*   **ORM**: SQLAlchemy - For efficient database interactions.
*   **Blockchain**: Web3.py - Python library for interacting with Ethereum nodes.
*   **Real-time**: WebSockets - For live data streaming to dashboards.
*   **Caching**: Redis - For session storage and background task queues.
*   **Utilities**:
    *   `yagmail`: Email sending service.
    *   `qrcode`: Generating voter slips/IDs.
    *   `reportlab`: PDF generation for voter ID cards.
    *   `cloudinary`: Cloud storage for candidate images and documents.

### Frontend Applications (`/AdminFrontend`, `/SuperAdminFrontend`, `/VoterRegistrationFrontend`)
All three frontends share a modern, responsive tech stack:
*   **Framework**: React.js (via Vite)
*   **Language**: TypeScript - For type-safe, maintainable code.
*   **Styling**: Tailwind CSS - Utility-first CSS framework.
*   **UI Components**: shadcn/ui & Radix UI - Accessible, high-quality components.
*   **State Management**: TanStack Query (React Query) - Efficient server state management.
*   **Forms**: React Hook Form + Zod - Schema validation and form handling.
*   **Charts**: Recharts & Chart.js - Visualizing election data.
*   **Icons**: Lucide React.

### DevOps & Infrastructure
*   **Containerization**: Docker & Docker Compose.
*   **Web Server**: Nginx (Reverse Proxy).
*   **Deployment**: AWS EC2 ready (with detailed guides).

---

## 📂 Component Details

### 1. Backend API
Located in `Backend/`, this is the engine of BlockVote.
*   **Routes**:
    *   `/api/super-admin`: Manage admins and system logs.
    *   `/api/admin`: Election creation, candidate nomination, device setup.
    *   `/api/cast-vote`: Secure vote casting endpoints.
    *   `/api/public`: Public election data.
    *   `/api/scanner`: QR code scanner integration for polling stations.
*   **WebSockets**: Dedicated channels for `scannerdata` and `blockchain_health`.

### 2. Super Admin Frontend
Located in `SuperAdminFrontend/`.
*   **Target User**: Election Commission / System Owners.
*   **Capabilities**:
    *   Create and manage Admin accounts.
    *   View global system logs and audit trails.
    *   Monitor overall system health and blockchain connectivity.

### 3. Admin Frontend
Located in `AdminFrontend/`.
*   **Target User**: Election Officers / Constituency Managers.
*   **Capabilities**:
    *   **Dashboard**: Visual analytics of active elections.
    *   **Candidate Management**: Add/Edit candidates with profiles and symbols.
    *   **Voter Management**: Verify and approve voter registrations.
    *   **Device Management**: Authorize and monitor polling devices.
    *   **Election Control**: Start/Stop election phases.

### 4. Voter Registration Frontend
Located in `VoterRegistrationFrontend/`.
*   **Target User**: General Public (Voters).
*   **Capabilities**:
    *   New Voter Registration form.
    *   Application Status tracking.
    *   Download Voter ID Card (PDF).

---

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

---

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   Docker & Docker Compose (Recommended)
*   PostgreSQL & Redis (if running locally without Docker)

### Option A: Running with Docker (Recommended)
The easiest way to spin up the entire stack.

```bash
# 1. Clone the repository
git clone https://github.com/Anis1608/BlockVote-FastApi.git
cd BlockVote

# 2. Build and start services
docker-compose up -d --build

# 3. Access the applications
# Backend: http://localhost:9000
# Voter Portal: http://localhost:5173
# Admin Dashboard: http://localhost:5174
# Super Admin Dashboard: http://localhost:5175
```

### Option B: Manual Local Setup

#### 1. Backend Setup
```bash
cd Backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
# Ensure .env is configured with DB and Redis credentials
uvicorn main:app --host 0.0.0.0 --port 9000 --reload
```

#### 2. Frontend Setup (Repeat for each frontend folder)
```bash
cd AdminFrontend  # or SuperAdminFrontend, VoterRegistrationFrontend
npm install
npm run dev
```

---

## ☁️ Deployment

Detailed deployment guides are included in the repository:

*   📄 **[AWS Deployment Guide](AWS_DEPLOYMENT_GUIDE.md)**: Complete walkthrough for deploying to AWS EC2 with Nginx, SSL, and Domain configuration.
*   🐳 **[Docker Setup Guide](DOCKER_SETUP.md)**: In-depth Docker configuration details.

---

## 🔒 Security Measures

*   **Immutable Ledger**: Votes are stored on the blockchain, making them tamper-proof.
*   **End-to-End Encryption**: All sensitive data transmission is encrypted.
*   **JWT Authentication**: Stateless and secure session handling.
*   **Input Validation**: Strict validation using Pydantic (Backend) and Zod (Frontend) to prevent injection attacks.

---

*Developed for a transparent and secure democratic process.*
