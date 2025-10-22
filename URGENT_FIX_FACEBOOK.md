# 🚨 URGENT: Facebook OAuth Fix - Replace Placeholder Values

## ❌ Problem Found!

Your `.env` file has **placeholder values** instead of real Facebook credentials:

```env
# ❌ WRONG - These are placeholders:
FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret
FB_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
```

## ✅ Solution: Update Your .env File

### Step 1: Open Your .env File

```bash
# Navigate to backend folder
cd backend

# Open .env file in your editor
# Or use: notepad .env
```

### Step 2: Replace with Real Values

Change these lines in your `backend/.env` file:

```env
# ✅ CORRECT - Use these real values:
FB_APP_ID=1256408305896903
FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
FB_WEBHOOK_VERIFY_TOKEN=WORKFLOW_VERIFY_TOKEN_2024

# Keep these as they are (already correct):
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

### Step 3: Restart Your Backend

```bash
# Stop your backend server (Ctrl+C)
# Then restart it:
npm run dev
```

## 🧪 Test Again

After updating and restarting:

1. Go to your frontend: `http://localhost:5173`
2. Login
3. Go to Integrations page
4. Click "Connect with Facebook"
5. Should now work properly!

## 📋 Complete .env File Example

Your `backend/.env` should look like this:

```env
# Database
MONGODB_URI=mongodb+srv://your_connection_string

# JWT Secret
JWT_SECRET=Tum_Jao_Or_Kuch_Karlo_Yaar

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Server
PORT=5000
NODE_ENV=development

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Facebook OAuth (IMPORTANT - Use real values!)
FB_APP_ID=1256408305896903
FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
FB_WEBHOOK_VERIFY_TOKEN=WORKFLOW_VERIFY_TOKEN_2024
```

## 🔐 Facebook App Configuration

After fixing your `.env`, configure Facebook App:

### 1. Go to Facebook Developers
https://developers.facebook.com/apps/1256408305896903

### 2. Add OAuth Redirect URI
**Settings > Basic > App Domains:**
- Add: `localhost`

**Facebook Login > Settings > Valid OAuth Redirect URIs:**
- Add: `http://localhost:5000/api/integrations/facebook/callback`

### 3. Setup Webhook
**Messenger > Settings > Webhooks:**
- Callback URL: `http://localhost:5000/api/webhooks/facebook`
- Verify Token: `WORKFLOW_VERIFY_TOKEN_2024`
- Subscribe to: messages, messaging_postbacks, messaging_optins, message_reads

**Note:** For local development, you'll need to use **ngrok** to expose your localhost:

```bash
# Install ngrok (if not installed)
# Download from: https://ngrok.com/download

# Run ngrok
ngrok http 5000

# Use the ngrok URL in Facebook App settings
# Example: https://abc123.ngrok.io/api/webhooks/facebook
```

## 🎯 Why This Happened

The `.env.example` file has placeholder values like `your_facebook_app_id`. When you created your `.env` file, you copied these placeholders instead of replacing them with real values.

## ✅ Verification

After fixing, run the diagnostic script again:

```bash
cd backend
node check-facebook-config.js
```

Should show:
```
✅ FB_APP_ID                      1256408305896903
✅ FB_APP_SECRET                  fc7fbca3fb...
✅ FB_WEBHOOK_VERIFY_TOKEN        WORKFLOW_V...
```

## 🚀 Quick Commands

```bash
# 1. Edit .env file
cd backend
notepad .env

# 2. Update the Facebook credentials (see above)

# 3. Restart backend
npm run dev

# 4. Test the connection
# Go to http://localhost:5173 and try connecting Facebook
```

---

**This should fix your redirect issue!** The problem was that your backend was trying to use placeholder credentials instead of real Facebook App credentials.
