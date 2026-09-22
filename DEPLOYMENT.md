# Vision Tech WhatsApp Cloud API & Webhook Production Guide

This document provides complete instructions for **Meta Virtual Number Integration**, the **Meta Webhook Handshake**, and **App Production Deployment**.

---

## 1. Meta Virtual Number Integration

Vision Tech includes built-in multi-provider virtual number management with automatic failover support across **5sim.net**, **SMS-Activate.org**, and **Twilio**.

### Key Workflow:
1. **Acquire Number**:
   - Go to the **Virtual Numbers** tab.
   - Click **Get Virtual Number**, choose country (India 🇮🇳, US 🇺🇸, UK 🇬🇧, etc.), and select provider.
   - The fee is automatically deducted from your Meta Wallet balance.
   - A dedicated virtual number is provisioned and saved in the backend store (`/api/virtual-numbers`).

2. **Receive / Simulate WhatsApp OTP**:
   - Once rented, Meta Cloud API sends the 6-digit SMS verification code to the number.
   - For live testing, click **Simulate SMS Arrival** or query the live provider API.
   - The OTP appears in your inbox and can be copied or auto-filled with 1 click.

3. **Auto-Failover**:
   - If the primary provider (5sim) is degraded or times out, click **Failover to Backup Provider**.
   - The previous charge is instantly refunded to your wallet, and a new virtual number is provisioned from the backup provider (SMS-Activate).

4. **Connect to Meta WhatsApp Cloud API**:
   - Click **Integrate & Register with Meta WhatsApp API**.
   - This registers the virtual number with Meta Cloud API, sets your active Phone Number ID, updates your display name (`Vision Tech (+<Number>)`), and sets status to **CONNECTED ✓**.

---

## 2. Meta Webhook Handshake & Verification

Meta WhatsApp Cloud API requires an initial HTTP `GET` verification handshake before delivering live message events.

### Handshake Requirements:
- **Endpoint**: `/api/webhook`
- **Query Parameters Sent by Meta**:
  - `hub.mode=subscribe`
  - `hub.verify_token=<YOUR_VERIFY_TOKEN>` (Default: `vision_tech_secret_2026`)
  - `hub.challenge=<RANDOM_CHALLENGE_STRING>`
- **Expected Response**: HTTP `200 OK` with the plain text challenge body.

### Live Testing the Handshake:
You can verify the handshake directly from:
1. **App UI**:
   - Navigate to **Webhook Settings** or **Webhook Inspector**.
   - Click **Test Webhook GET Handshake**.
   - The app makes a live request against `/api/webhook`, confirms HTTP 200, and displays the response latency.

2. **Terminal / Command Prompt**:
   ```bash
   curl -i "http://localhost:3000/api/webhook?hub.mode=subscribe&hub.verify_token=vision_tech_secret_2026&hub.challenge=1158201948290"
   ```
   **Expected output**:
   ```http
   HTTP/1.1 200 OK
   content-type: text/plain
   1158201948290
   ```

### Public HTTPS Tunneling for Meta Developer Portal:
Meta requires a public HTTPS URL. You can expose port 3000 using any of the following tools:

- **Cloudflare Tunnel (Free, No Port Limits)**:
  ```bash
  npx cloudflared tunnel --url http://localhost:3000
  ```
- **Ngrok**:
  ```bash
  npx ngrok http 3000
  ```
- **LocalTunnel**:
  ```bash
  npx localtunnel --port 3000
  ```

In your **Meta App Dashboard** (`developers.facebook.com`):
1. Go to **WhatsApp → Configuration → Webhook**.
2. **Callback URL**: `https://<YOUR-TUNNEL-DOMAIN>/api/webhook`
3. **Verify Token**: `vision_tech_secret_2026`
4. Click **Verify and Save**. Meta will execute the GET handshake instantly.
5. Under **Webhook fields**, click **Manage** and subscribe to:
   - `messages`
   - `message_deliveries`
   - `message_reads`


---

## 2.1 Meta Developer App Publishing & Live Release Protocol

To switch your Meta App from **Development Mode** to **Published / Live Mode** on `developers.facebook.com`, Meta requires valid Privacy, Terms, and Data Deletion URLs served by your application domain:

### Mandatory Meta Developer App Settings (App Settings → Basic):
1. **Privacy Policy URL**: `https://<YOUR-DOMAIN>/privacy-policy`
2. **Terms of Service URL**: `https://<YOUR-DOMAIN>/terms-of-service`
3. **User Data Deletion**: `https://<YOUR-DOMAIN>/data-deletion` (or Data Deletion Callback)
4. **App Category**: Select **Business and Pages** or **Utility & Productivity**.
5. **Business Verification**: Ensure your Meta Business Portfolio (WABA `1000305096170000`) has completed document upload / Business Verification if prompted.

### Step-by-Step Publishing Steps:
1. Log into [Meta Developers Console](https://developers.facebook.com/apps/).
2. Select your App (**Vision Tech**).
3. Navigate to **App settings → Basic**.
4. Fill in the **Privacy Policy URL**, **Terms of Service URL**, and **User Data Deletion URL** provided above.
5. Click **Save Changes**.
6. Navigate to **Publish** in the left sidebar menu (or toggle the top status switch from Development to **Live**).
7. Click **Publish App**.

---

## 3. Production Deployment Options

### Option A: Standard Production Node.js Server (Recommended for Webhook Listeners)
1. Build the production package:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm run start
   ```
   *Or double-click `start-production.bat` on Windows.*

The server will be live on `http://localhost:3000` with all API endpoints active:
- `/api/webhook` (GET verification & POST incoming WhatsApp events)
- `/api/virtual-numbers` (Virtual number provisioning & OTP)
- `/api/chats` (Chat history & messaging store)
- `/api/contacts` (WhatsApp contact management)
- `/api/crm/send-message` (CRM outbound message dispatches)
- `/api/wallet` (Meta billing & wallet transactions)
- `/api/logs` (Webhook inspector audit logs)
- `/api/config` (Live webhook configuration)

### Option B: 24/7 Production Deployment with PM2 Process Manager
```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the Vision Tech WhatsApp server in cluster / daemon mode
pm2 start ecosystem.config.js

# Save process list for system reboot auto-start
pm2 save
pm2 startup
```

### Option C: Windows Desktop Application (.EXE)
The app is packaged as a native Windows desktop executable:
- **Portable Version**: `VisionTech-WhatsApp-Simulator-Portable.exe` (run without installation)
- **Installer Version**: `VisionTech-WhatsApp-Simulator-Setup.exe` (NSIS installer)

To build a fresh Windows desktop distribution:
```bash
npm run dist:win
```

### Option D: Android Mobile App (.APK)
The app includes Capacitor integration for Android:
- **Pre-built APK**: `VisionTech-WhatsApp-Simulator.apk` (ready to install on Android devices)

To rebuild or sync Android:
```bash
npm run export
npx cap sync android
```
