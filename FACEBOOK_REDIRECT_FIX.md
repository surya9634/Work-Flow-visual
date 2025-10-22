# Facebook OAuth Redirect Issue - FIXED

## 🔍 Problem Diagnosis

**Symptom:** When clicking "Connect Facebook", you're redirected to `/auth/facebook` but then immediately sent back to the landing page.

**Root Cause:** The `FRONTEND_URL` environment variable is not set correctly, causing the OAuth callback to redirect to the wrong URL (likely the root `/` instead of `/dashboard/integrations`).

## ✅ Solution

### Step 1: Set Environment Variables

You need to add these to your backend `.env` file:

```env
# Facebook OAuth Configuration
FB_APP_ID=1256408305896903
FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
FB_WEBHOOK_VERIFY_TOKEN=your_secure_random_token_here

# IMPORTANT: Set your frontend URL
# For local development:
FRONTEND_URL=http://localhost:5173

# For production (Render):
# FRONTEND_URL=https://your-frontend-domain.com

# Backend URL (for OAuth callback)
# For local development:
BACKEND_URL=http://localhost:5000

# For production:
# BACKEND_URL=https://work-automation-platform.onrender.com
```

### Step 2: Update Your .env File

**For Local Development:**
```bash
# Navigate to backend folder
cd backend

# Create or edit .env file
# Add the variables above
```

**For Production (Render):**
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these environment variables:
   - `FB_APP_ID` = `1256408305896903`
   - `FB_APP_SECRET` = `fc7fbca3fbecd5bc6b06331bc4da17c9`
   - `FB_WEBHOOK_VERIFY_TOKEN` = (create a secure random string)
   - `FRONTEND_URL` = (your frontend URL, e.g., `https://your-app.vercel.app`)
   - `BACKEND_URL` = `https://work-automation-platform.onrender.com`

### Step 3: Verify Facebook App Settings

Go to https://developers.facebook.com/apps/1256408305896903

**1. OAuth Redirect URIs:**
   - Settings > Basic > App Domains
   - Add your domains (without http/https):
     - For local: `localhost`
     - For production: `work-automation-platform.onrender.com` and your frontend domain

**2. Valid OAuth Redirect URIs:**
   - Facebook Login > Settings
   - Add these EXACT URLs:
     ```
     http://localhost:5000/api/integrations/facebook/callback
     https://work-automation-platform.onrender.com/api/integrations/facebook/callback
     ```

**3. Webhook Configuration:**
   - Messenger > Settings > Webhooks
   - Callback URL: `https://work-automation-platform.onrender.com/api/webhooks/facebook`
   - Verify Token: (same as `FB_WEBHOOK_VERIFY_TOKEN`)
   - Subscribe to: messages, messaging_postbacks, messaging_optins, message_reads

### Step 4: Restart Your Backend

**Local Development:**
```bash
# Stop the server (Ctrl+C)
# Restart it
npm run dev
```

**Production (Render):**
- Render will automatically restart when you add environment variables
- Or manually trigger a redeploy

## 🧪 Testing the Fix

### Test 1: Check Environment Variables
```bash
# In your backend folder
node -e "console.log('FB_APP_ID:', process.env.FB_APP_ID); console.log('FRONTEND_URL:', process.env.FRONTEND_URL)"
```

### Test 2: Test OAuth URL Generation
```bash
# Make sure your backend is running
# Then test the endpoint (replace YOUR_TOKEN with your JWT)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/integrations/facebook/auth
```

Should return:
```json
{
  "authUrl": "https://www.facebook.com/v18.0/dialog/oauth?client_id=1256408305896903&redirect_uri=..."
}
```

### Test 3: Full OAuth Flow
1. Open your frontend: `http://localhost:5173`
2. Login to your account
3. Go to Integrations page
4. Click "Connect with Facebook"
5. Should redirect to Facebook
6. Grant permissions
7. Should redirect back to `/dashboard/integrations` with success message

## 🐛 Troubleshooting

### Issue 1: "Redirect URI Mismatch" Error
**Cause:** Facebook redirect URI doesn't match what's configured in Facebook App

**Fix:**
1. Check the exact URL in the error message
2. Add that EXACT URL to Facebook App Settings > Facebook Login > Valid OAuth Redirect URIs
3. Make sure there are no trailing slashes or typos

### Issue 2: Still Redirecting to Landing Page
**Cause:** `FRONTEND_URL` is not set or incorrect

**Fix:**
```bash
# Check your backend logs when the callback happens
# Look for the redirect URL being used

# In your backend code, temporarily add this log:
console.log('Redirecting to:', `${process.env.FRONTEND_URL}/dashboard/integrations`);

# If it shows 'undefined', your env variable isn't loaded
```

**Solution:**
- Make sure `.env` file is in the `backend` folder (not root)
- Make sure you're using `dotenv` in your server.js:
  ```javascript
  require('dotenv').config();
  // or
  import 'dotenv/config';
  ```
- Restart your server after changing `.env`

### Issue 3: "Facebook App ID not configured"
**Cause:** `FB_APP_ID` environment variable is not set

**Fix:**
```bash
# Add to your .env file:
FB_APP_ID=1256408305896903
FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
```

### Issue 4: Frontend Route Not Found
**Cause:** Your frontend doesn't have a `/dashboard/integrations` route

**Fix:**
Check your frontend routing. The route should be:
```javascript
// In your App.jsx or router configuration
<Route path="/dashboard/integrations" element={<Integrations />} />
```

## 📝 Complete .env File Example

Create `backend/.env` with this content:

```env
# ========================================
# DATABASE
# ========================================
MONGODB_URI=mongodb+srv://your_connection_string

# ========================================
# JWT & SECURITY
# ========================================
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# ========================================
# AI SERVICE
# ========================================
GROQ_API_KEY=your_groq_api_key_here

# ========================================
# SERVER CONFIGURATION
# ========================================
PORT=5000
NODE_ENV=development

# ========================================
# FRONTEND URL (IMPORTANT!)
# ========================================
# Local development:
FRONTEND_URL=http://localhost:5173

# Production (uncomment and update):
# FRONTEND_URL=https://your-frontend-domain.com

# ========================================
# BACKEND URL
# ========================================
# Local development:
BACKEND_URL=http://localhost:5000

# Production (uncomment and update):
# BACKEND_URL=https://work-automation-platform.onrender.com

# ========================================
# FACEBOOK OAUTH
# ========================================
FB_APP_ID=1256408305896903
FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
FB_WEBHOOK_VERIFY_TOKEN=create_a_secure_random_string_here

# ========================================
# OPTIONAL: CORS
# ========================================
# If you have CORS issues, add:
# CORS_ORIGIN=http://localhost:5173
```

## 🚀 Quick Fix Checklist

- [ ] Add `FB_APP_ID` to backend `.env`
- [ ] Add `FB_APP_SECRET` to backend `.env`
- [ ] Add `FB_WEBHOOK_VERIFY_TOKEN` to backend `.env`
- [ ] Add `FRONTEND_URL` to backend `.env` (e.g., `http://localhost:5173`)
- [ ] Add `BACKEND_URL` to backend `.env` (e.g., `http://localhost:5000`)
- [ ] Restart backend server
- [ ] Add OAuth redirect URI to Facebook App Settings
- [ ] Test the OAuth flow
- [ ] Check browser console for errors
- [ ] Check backend logs for redirect URL

## 🎯 Expected Flow

```
1. User clicks "Connect with Facebook"
   ↓
2. Frontend calls: GET /api/integrations/facebook/auth
   ↓
3. Backend generates OAuth URL with state parameter
   ↓
4. Frontend redirects to Facebook OAuth page
   ↓
5. User grants permissions
   ↓
6. Facebook redirects to: /api/integrations/facebook/callback?code=xxx&state=yyy
   ↓
7. Backend exchanges code for access token
   ↓
8. Backend saves integration to database
   ↓
9. Backend redirects to: ${FRONTEND_URL}/dashboard/integrations?success=facebook_connected
   ↓
10. Frontend shows success message
   ↓
11. Frontend fetches integration status
   ↓
12. Shows "Connected" badge
```

## 💡 Pro Tips

1. **Use ngrok for local testing:**
   ```bash
   ngrok http 5000
   # Use the ngrok URL in Facebook App settings
   ```

2. **Check backend logs:**
   ```bash
   # Look for these log messages:
   # "Facebook auth initiation error"
   # "Facebook callback error"
   # These will show you exactly what's failing
   ```

3. **Test with Facebook's OAuth Debugger:**
   - Go to: https://developers.facebook.com/tools/debug/accesstoken
   - Paste your OAuth URL
   - Check for errors

4. **Clear browser cache:**
   - Sometimes old OAuth state can cause issues
   - Clear cookies and localStorage
   - Try in incognito mode

## 📞 Still Having Issues?

If you're still having problems:

1. **Check backend logs** when clicking "Connect Facebook"
2. **Check browser console** for JavaScript errors
3. **Verify environment variables** are loaded:
   ```javascript
   // Add this temporarily to your backend route
   console.log('Environment check:', {
     FB_APP_ID: process.env.FB_APP_ID ? 'Set' : 'NOT SET',
     FRONTEND_URL: process.env.FRONTEND_URL,
     BACKEND_URL: process.env.BACKEND_URL
   });
   ```

4. **Test the callback URL directly:**
   ```
   http://localhost:5000/api/integrations/facebook/callback?error=test
   ```
   Should redirect to your frontend with error parameter

---

**This should fix your redirect issue!** The key is making sure `FRONTEND_URL` is set correctly in your backend environment variables.
