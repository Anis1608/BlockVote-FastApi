# BlockVote AWS Deployment Guide

## Overview
This guide walks you through deploying BlockVote (Backend + 3 Frontends) to AWS using:
- **EC2** (or ECS) for running Docker containers
- **CloudFront + S3** for frontend CDN (optional)
- **ALB** (Application Load Balancer) for routing traffic
- **Route 53** for DNS with your domain
- **ACM** (AWS Certificate Manager) for SSL/TLS

---

## Architecture

```
Your Domain (example.com)
       ↓
Route 53 DNS
       ↓
CloudFront (optional CDN for frontends)
       ↓
ALB (Application Load Balancer)
       ├── /api/* → Backend (EC2/ECS on port 9000)
       ├── /admin → Admin Frontend (port 5174)
       ├── /super-admin → Super Admin Frontend (port 5175)
       └── / → Voter Frontend (port 5173)
       ↓
EC2 Instance(s) with Docker Compose
```

---

## Prerequisites

1. **AWS Account** with IAM permissions (EC2, ALB, Route 53, ACM, CloudWatch)
2. **Your Domain** (e.g., `example.com`) registered and accessible
3. **EC2 Key Pair** created in the region where you'll deploy
4. **Docker & Docker Compose** installed on EC2
5. **Backend .env file** with all secrets (already present at `./Backend/.env`)

---

## Step 1: Launch EC2 Instance

### 1a. Create EC2 Instance

- **Region**: Choose closest to your users (e.g., `ap-south-1` for India)
- **AMI**: Ubuntu 22.04 LTS (ami-0c55b159cbfafe1f0 or similar)
- **Instance Type**: `t3.medium` or `t3.large` (depending on traffic)
- **Storage**: 50+ GB SSD (gp3)
- **Security Group**: Allow inbound:
  - SSH (22) from your IP
  - HTTP (80) from 0.0.0.0/0
  - HTTPS (443) from 0.0.0.0/0

### 1b. Assign Elastic IP (Optional but Recommended)

- Right-click instance → **Elastic IPs** → Allocate & Associate
- This ensures your public IP doesn't change on restart

### 1c. SSH into Instance

```bash
ssh -i your-key.pem ubuntu@<PUBLIC_IP_OR_HOSTNAME>
```

---

## Step 2: Install Docker & Docker Compose on EC2

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-plugin

# Add ubuntu user to docker group (so you don't need sudo)
sudo usermod -aG docker ubuntu
newgrp docker

# Verify installation
docker --version
docker compose version
```

---

## Step 3: Clone Your BlockVote Repository

```bash
cd /home/ubuntu
git clone https://github.com/Anis1608/BlockVote-FastApi.git blockvote
cd blockvote

# Create necessary directories
mkdir -p logs
```

---

## Step 4: Configure Environment & Domain

### 4a. Update Backend .env for AWS

Edit `Backend/.env` and update the backend URL references:

```bash
# For email notifications (keep as is or update for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=blockvoteindia@gmail.com
EMAIL_HOST_PASSWORD=zvnv fofb imtw bcol  # Use app-specific password

# Database (keep your RDS endpoints)
DB_HOST=database-1.cz26sw2i67ai.ap-south-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=blockvote
DB_PASS=i4sS7dQMpYiUibzNIgGm

# Redis (keep your current setup)
REDIS_HOST=13.232.7.247
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 4b. Update Frontend .env Files

Update `VITE_BACKEND_URL` to point to your domain (not localhost):

**AdminFrontend/.env:**
```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

**SuperAdminFrontend/.env:**
```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

**VoterRegistrationFrontend/.env:**
```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

---

## Step 5: Create Production docker-compose.yml

Create/update `docker-compose.yml` with production settings:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    container_name: blockvote_backend
    expose:
      - "9000"
    environment:
      - PYTHONUNBUFFERED=1
    env_file:
      - ./Backend/.env
    networks:
      - blockvote_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/docs"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  voter_frontend:
    build:
      context: ./VoterRegistrationFrontend
      dockerfile: Dockerfile
      args:
        VITE_BACKEND_URL: https://api.yourdomain.com
    container_name: blockvote_voter_frontend
    expose:
      - "5173"
    networks:
      - blockvote_network
    restart: unless-stopped

  admin_frontend:
    build:
      context: ./AdminFrontend
      dockerfile: Dockerfile
      args:
        VITE_BACKEND_URL: https://api.yourdomain.com
    container_name: blockvote_admin_frontend
    expose:
      - "5174"
    networks:
      - blockvote_network
    restart: unless-stopped

  super_admin_frontend:
    build:
      context: ./SuperAdminFrontend
      dockerfile: Dockerfile
      args:
        VITE_BACKEND_URL: https://api.yourdomain.com
    container_name: blockvote_super_admin_frontend
    expose:
      - "5175"
    networks:
      - blockvote_network
    restart: unless-stopped

networks:
  blockvote_network:
    driver: bridge
```

---

## Step 6: Set Up Nginx Reverse Proxy (on EC2)

### 6a. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 6b. Create Nginx Config

Create `/etc/nginx/sites-available/blockvote`:

```nginx
upstream backend {
    server backend:9000;
}

upstream voter_frontend {
    server voter_frontend:5173;
}

upstream admin_frontend {
    server admin_frontend:5174;
}

upstream super_admin_frontend {
    server super_admin_frontend:5175;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;

    # SSL certificates (from ACM/Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Backend API Routes
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Admin Frontend
    location /admin {
        proxy_pass http://admin_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Super Admin Frontend
    location /super-admin {
        proxy_pass http://super_admin_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Voter Frontend (default)
    location / {
        proxy_pass http://voter_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the config:

```bash
sudo ln -s /etc/nginx/sites-available/blockvote /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl reload nginx
```

---

## Step 7: Set Up SSL/TLS Certificates

### Option A: Let's Encrypt (Free)

```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com \
  --non-interactive --agree-tos --email your-email@example.com

# Auto-renewal
sudo systemctl start certbot.timer
sudo systemctl enable certbot.timer
```

### Option B: AWS ACM (if using ALB)

- Go to **AWS ACM** → **Request certificate**
- Add your domains: `yourdomain.com`, `*.yourdomain.com`
- Validate via DNS (add CNAME records in Route 53)
- Attach to ALB listener

---

## Step 8: Update Route 53 DNS

### 8a. In AWS Route 53 Console

1. Go to **Hosted zones** → Select your domain
2. Create/Update **A Record**:
   - **Name**: `yourdomain.com`
   - **Type**: A
   - **Value**: Your EC2 Elastic IP (or ALB IP if using ALB)
   - **TTL**: 300

3. Create **CNAME Records**:
   - **Name**: `www.yourdomain.com`
   - **Type**: CNAME
   - **Value**: `yourdomain.com`
   
   - **Name**: `api.yourdomain.com`
   - **Type**: CNAME
   - **Value**: `yourdomain.com`

---

## Step 9: Update Frontend .env with Domain

Commit and push the updated `.env` files:

```bash
# Update all frontend .env files to use domain
echo "VITE_BACKEND_URL=https://api.yourdomain.com" > AdminFrontend/.env
echo "VITE_BACKEND_URL=https://api.yourdomain.com" > SuperAdminFrontend/.env
echo "VITE_BACKEND_URL=https://api.yourdomain.com" > VoterRegistrationFrontend/.env

git add .
git commit -m "Update frontend URLs for AWS deployment with domain"
git push
```

---

## Step 10: Deploy on EC2

```bash
cd /home/ubuntu/blockvote

# Pull latest code
git pull origin master

# Build all Docker images (this takes a few minutes)
docker compose build --no-cache

# Start all services
docker compose up -d

# Verify services are running
docker compose ps

# Check logs
docker compose logs -f backend

# Check Nginx
sudo systemctl status nginx
```

---

## Step 11: Configure Firewall & Security Groups

### AWS Security Group (on EC2 instance)

- **Inbound Rules**:
  - SSH (22): Your IP
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0
  
- **Outbound Rules**:
  - All traffic to 0.0.0.0/0

---

## Step 12: Monitor & Logs

### View Logs

```bash
# Backend logs
docker compose logs -f backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u docker -f
```

### Health Check Endpoint

Test your deployment:

```bash
# Backend health
curl -k https://api.yourdomain.com/docs

# Frontend status
curl -k https://yourdomain.com
```

---

## Step 13: Continuous Deployment (Optional)

### Setup GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to EC2
        env:
          EC2_USER: ubuntu
          EC2_HOST: ${{ secrets.EC2_PUBLIC_IP }}
          EC2_KEY: ${{ secrets.EC2_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$EC2_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST << 'EOF'
            cd /home/ubuntu/blockvote
            git pull origin master
            docker compose build --no-cache
            docker compose up -d
          EOF
```

---

## Troubleshooting

### Services Not Starting
```bash
# Check Docker status
docker ps -a

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates
```

### Domain Not Resolving
```bash
# DNS propagation check
nslookup yourdomain.com
dig yourdomain.com

# Check Route 53
# AWS Console → Route 53 → Hosted zones → your domain
```

### Backend Connection Issues
```bash
# Check RDS connectivity
telnet database-1.cz26sw2i67ai.ap-south-1.rds.amazonaws.com 5432

# Check Redis connectivity
redis-cli -h 13.232.7.247 -p 6379 ping
```

---

## Production Checklist

- [ ] EC2 instance running with Elastic IP
- [ ] Docker & Docker Compose installed
- [ ] Repository cloned and updated
- [ ] Frontend `.env` files updated with domain
- [ ] SSL/TLS certificates installed
- [ ] Route 53 DNS records created and propagated
- [ ] Nginx reverse proxy configured
- [ ] Services running (`docker compose ps`)
- [ ] Health checks passing
- [ ] Backend logs monitoring
- [ ] Database backups enabled (RDS)
- [ ] Security groups properly configured
- [ ] Cloudwatch alarms set up (optional)

---

## Next Steps

1. **Provide your domain name** (e.g., `yourdomain.com`)
2. **Provide your EC2 Public IP** (if you want me to help configure)
3. **Run the deployment commands** above
4. **Test the endpoints** from browser

Need help with any specific step? Let me know!
