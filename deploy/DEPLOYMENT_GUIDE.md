# Cal.diy Production Deployment Guide

This guide provides step-by-step instructions for deploying Cal.diy on an Ubuntu EC2 / VPS instance alongside existing services (such as AppFlowy and Excalidraw) using Docker Compose and Nginx reverse proxy.

---

## 1. Prerequisites

- Ubuntu 22.04 or 24.04 LTS
- Docker Engine & Docker Compose (`docker compose`)
- Domain with DNS A Record pointed to server public IP (e.g., `draw.pixara.online`)
- SSL Certificate via Let's Encrypt / Certbot

---

## 2. Directory Structure on Server

```text
/opt/cal-diy/
├── docker-compose.yml
└── .env
```

---

## 3. Environment Configuration

1. Copy `.env.production.example` to `/opt/cal-diy/.env`:
   ```bash
   cp deploy/.env.production.example /opt/cal-diy/.env
   chmod 600 /opt/cal-diy/.env
   ```

2. Generate secure random keys:
   ```bash
   openssl rand -base64 32 # For NEXTAUTH_SECRET and JWT_SECRET
   openssl rand -hex 32    # For CALENDSO_ENCRYPTION_KEY and CRON_API_KEY
   openssl rand -hex 16    # For POSTGRES_PASSWORD
   ```

3. Configure Email Transport:
   - **Gmail SMTP**:
     ```ini
     EMAIL_FROM="your_email@gmail.com"
     EMAIL_FROM_NAME="Cal.diy"
     EMAIL_SERVER_HOST="smtp.gmail.com"
     EMAIL_SERVER_PORT=465
     EMAIL_SERVER_USER="your_email@gmail.com"
     EMAIL_SERVER_PASSWORD="your_gmail_app_password"
     ```
   - **Resend**:
     ```ini
     RESEND_API_KEY="re_123456789"
     EMAIL_FROM="notifications@yourdomain.com"
     ```

---

## 4. Deploy Containers

```bash
cd /opt/cal-diy
docker compose -f docker-compose.production.yml up -d
```

Check container status and logs:
```bash
docker compose ps
docker compose logs -f calcom-web
```

---

## 5. Reverse Proxy Configuration

1. Connect `calcom-web` container to your external proxy network (e.g. `oci_excalidraw-net`).
2. Apply `deploy/nginx-proxy.conf.example` to your Nginx configuration.
3. Test and reload Nginx:
   ```bash
   nginx -t
   nginx -s reload
   ```

---

## 6. Initial Admin Setup & Verification

1. Open `https://yourdomain.com/auth/setup` in your browser.
2. Create the primary administrator account.
3. Verify event types, availability schedules, and public booking at `https://yourdomain.com/<admin-username>/<event-slug>`.
