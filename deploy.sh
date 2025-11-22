#!/bin/bash

# BlockVote AWS Deployment Script
# Run this on your EC2 instance with: bash deploy.sh

set -e

echo "🚀 BlockVote AWS Deployment Started..."

# Variables
REPO_URL="https://github.com/Anis1608/BlockVote-FastApi.git"
PROJECT_DIR="/home/ubuntu/blockvote"
DOMAIN_BACKEND="blockvote.backend.site"
DOMAIN_SUPERADMIN="blockvote.superadmin.site"
DOMAIN_ADMIN="blockvote.admin.site"
DOMAIN_VOTER="blockvote.voter.site"
EMAIL="blockvoteindia@gmail.com"

echo "📁 Setting up project directory..."
if [ -d "$PROJECT_DIR" ]; then
    echo "📤 Pulling latest code..."
    cd "$PROJECT_DIR"
    git pull origin master
else
    echo "📥 Cloning repository..."
    cd /home/ubuntu
    git clone "$REPO_URL" blockvote
    cd "$PROJECT_DIR"
fi

echo "🔧 Installing dependencies..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx nginx

echo "📝 Creating SSL directory..."
mkdir -p ssl

echo "🔐 Setting up SSL certificates with Let's Encrypt..."
# Stop Nginx temporarily for cert generation
sudo systemctl stop nginx || true
sleep 2
sudo certbot certonly --standalone \
  -d $DOMAIN_BACKEND \
  -d $DOMAIN_SUPERADMIN \
  -d $DOMAIN_ADMIN \
  -d $DOMAIN_VOTER \
  --non-interactive --agree-tos --email $EMAIL || echo "⚠️  SSL setup skipped (may already exist or DNS not configured)"

echo "🔗 Copying SSL certificates..."
if [ -f "/etc/letsencrypt/live/$DOMAIN_BACKEND/fullchain.pem" ]; then
    sudo cp "/etc/letsencrypt/live/$DOMAIN_BACKEND/fullchain.pem" ssl/cert.pem
    sudo cp "/etc/letsencrypt/live/$DOMAIN_BACKEND/privkey.pem" ssl/key.pem
    sudo chown -R $USER:$USER ssl/
    echo "✅ SSL certificates copied"
else
    echo "⚠️  SSL certificates not found. Make sure DNS is configured and run certbot manually:"
    echo "   sudo certbot certonly --standalone -d $DOMAIN_BACKEND -d $DOMAIN_SUPERADMIN -d $DOMAIN_ADMIN -d $DOMAIN_VOTER"
fi

echo "🐳 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

echo "🏗️  Building Docker images (this may take 5-10 minutes)..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "✅ Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETE!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📍 Your services are running at:"
echo "   🔧 Backend API:     https://$DOMAIN_BACKEND"
echo "   👨‍💼 Super Admin:     https://$DOMAIN_SUPERADMIN"
echo "   👤 Admin:           https://$DOMAIN_ADMIN"
echo "   🗳️  Voter Frontend:  https://$DOMAIN_VOTER"
echo ""
echo "📊 View logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f backend"
echo ""
echo "🔄 Restart services:"
echo "   docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "📦 Stop services:"
echo "   docker-compose -f docker-compose.prod.yml down"
echo ""
echo "⚠️  Make sure DNS records point to EC2 IP: 13.232.7.247"
echo ""
