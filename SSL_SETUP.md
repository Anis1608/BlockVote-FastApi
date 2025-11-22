# SSL Certificate Setup for BlockVote

## Your Domains
- `backend.blockvote.site`
- `superadmin.blockvote.site`
- `admin.blockvote.site`
- `voter.blockvote.site`

## Step 1: Point DNS Records to EC2 IP (13.232.7.247)

Before getting SSL certificates, make sure your DNS records point to your EC2:

### In your Domain Registrar (GoDaddy, Namecheap, etc.):

Create/Update A Records:
```
backend.blockvote.site     A     13.232.7.247
superadmin.blockvote.site  A     13.232.7.247
admin.blockvote.site       A     13.232.7.247
voter.blockvote.site       A     13.232.7.247
```

**Wait 5-15 minutes for DNS to propagate**, then verify:

```bash
# On your EC2 instance:
nslookup backend.blockvote.site
# Should return: 13.232.7.247
```

---

## Step 2: Get SSL Certificates with Let's Encrypt

Run on your EC2:

```bash
# Stop nginx if running
sudo systemctl stop nginx

# Get SSL certificate for all domains
sudo certbot certonly --standalone \
  -d backend.blockvote.site \
  -d superadmin.blockvote.site \
  -d admin.blockvote.site \
  -d voter.blockvote.site \
  --non-interactive --agree-tos --email blockvoteindia@gmail.com

# Verify certificates were created
sudo ls -la /etc/letsencrypt/live/backend.blockvote.site/
```

---

## Step 3: Copy Certificates to Project

```bash
cd /home/ubuntu/blockvote
mkdir -p ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/backend.blockvote.site/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/backend.blockvote.site/privkey.pem ssl/key.pem

# Fix permissions
sudo chown -R ubuntu:ubuntu ssl/
chmod 600 ssl/key.pem
```

---

## Step 4: Start Services

```bash
cd /home/ubuntu/blockvote
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## Step 5: Auto-Renewal Setup

Let's Encrypt certificates expire in 90 days. Set up auto-renewal:

```bash
# Enable certbot timer for auto-renewal
sudo systemctl start certbot.timer
sudo systemctl enable certbot.timer

# Verify it's active
sudo systemctl status certbot.timer
```

---

## Troubleshooting

### DNS Not Resolving
```bash
# Check if DNS is propagated
nslookup backend.blockvote.site
dig backend.blockvote.site

# Clear DNS cache (if needed)
sudo systemctl restart systemd-resolved
```

### Port 80 Already in Use
```bash
# Stop anything using port 80
sudo lsof -i :80
sudo kill -9 <PID>

# Or stop nginx temporarily
sudo systemctl stop nginx
```

### Certificate Generation Failed
```bash
# Check certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Try again with verbose
sudo certbot certonly --standalone -v \
  -d backend.blockvote.site \
  -d superadmin.blockvote.site \
  -d admin.blockvote.site \
  -d voter.blockvote.site \
  --non-interactive --agree-tos --email blockvoteindia@gmail.com
```

### Connection Refused
```bash
# Make sure services are running
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f nginx
```

---

## Verify SSL is Working

Once everything is running:

```bash
# Test each domain
curl -k https://backend.blockvote.site
curl -k https://admin.blockvote.site
curl -k https://superadmin.blockvote.site
curl -k https://voter.blockvote.site

# Or open in browser:
https://backend.blockvote.site/docs
https://admin.blockvote.site
https://superadmin.blockvote.site
https://voter.blockvote.site
```

---

## Quick Deploy Script (All-in-One)

Save as `ssl-deploy.sh` and run: `bash ssl-deploy.sh`

```bash
#!/bin/bash

set -e

echo "🔐 Setting up SSL and deploying BlockVote..."

# Stop nginx
sudo systemctl stop nginx || true

# Get SSL certificates
echo "📜 Getting SSL certificates..."
sudo certbot certonly --standalone \
  -d backend.blockvote.site \
  -d superadmin.blockvote.site \
  -d admin.blockvote.site \
  -d voter.blockvote.site \
  --non-interactive --agree-tos --email blockvoteindia@gmail.com

# Copy certs
echo "🔗 Copying certificates..."
cd /home/ubuntu/blockvote
mkdir -p ssl
sudo cp /etc/letsencrypt/live/backend.blockvote.site/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/backend.blockvote.site/privkey.pem ssl/key.pem
sudo chown -R ubuntu:ubuntu ssl/

# Build and deploy
echo "🐳 Building and deploying containers..."
git pull origin master
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml down || true
docker-compose -f docker-compose.prod.yml up -d

# Enable auto-renewal
echo "🔄 Setting up auto-renewal..."
sudo systemctl start certbot.timer
sudo systemctl enable certbot.timer

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your services are live at:"
echo "  🔧 Backend:     https://backend.blockvote.site"
echo "  👤 Admin:       https://admin.blockvote.site"
echo "  👨‍💼 Super Admin:  https://superadmin.blockvote.site"
echo "  🗳️  Voter:       https://voter.blockvote.site"
echo ""
```

---

## Summary

1. ✅ Update DNS A records to point to `13.232.7.247`
2. ✅ Wait for DNS propagation (5-15 min)
3. ✅ Run certbot to get SSL certificates
4. ✅ Copy certificates to project `ssl/` folder
5. ✅ Build and deploy Docker containers
6. ✅ Enable auto-renewal with certbot timer

Done! 🎉
