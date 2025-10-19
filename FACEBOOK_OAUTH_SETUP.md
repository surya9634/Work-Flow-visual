# 📘 Facebook Messenger OAuth Setup Guide

## 🎯 Overview

Your app uses **multi-tenant Facebook OAuth**, which means:
- **You** (app owner) provide YOUR Facebook App credentials once
- **Users** can connect THEIR Facebook pages through OAuth
- Each user's Facebook messages are automated independently

---

## 🏗️ Architecture

```
Your Facebook App (One Time Setup)
        ↓
Your Render App (FB_APP_ID, FB_APP_SECRET)
        ↓
User clicks "Connect Facebook" in Integrations
        ↓
OAuth Flow → User authorizes their Facebook page
        ↓
User's page access token stored in database
        ↓
AI automates messages for that user's page
```

**Key Point:** You create ONE Facebook App. All your users connect through it.

---

## 📋 Step-by-Step Setup

### **Step 1: Create Facebook App**

1. Go to https://developers.facebook.com
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** type
4. Fill in:
   - **App Name**: `Sales Automation OS` (or your app name)
   - **App Contact Email**: Your email
   - **Business Account**: Optional (can skip)
5. Click **"Create App"**

---

### **Step 2: Add Messenger Product**

1. In your Facebook App dashboard
2. Click **"Add Product"**
3. Find **"Messenger"** and click **"Set Up"**
4. Messenger is now added to your app

---

### **Step 3: Get App Credentials**

1. Go to **Settings** → **Basic**
2. Copy these values:
   - **App ID**: `1234567890123456`
   - **App Secret**: Click "Show" and copy

**Save these! You'll need them for Render.**

---

### **Step 4: Configure OAuth Settings**

1. Go to **Messenger** → **Settings**
2. Scroll to **"Webhooks"** section
3. Click **"Add Callback URL"**

**Callback URL:**
```
https://your-app-url.onrender.com/api/integrations/facebook/callback
```

**Verify Token:** (create any random string)
```
my_webhook_verify_token_2024
```

4. Subscribe to these webhook fields:
   - ✅ `messages`
   - ✅ `messaging_postbacks`
   - ✅ `messaging_optins`
   - ✅ `message_deliveries`
   - ✅ `message_reads`

5. Click **"Verify and Save"**

---

### **Step 5: Add OAuth Redirect URIs**

1. Go to **Settings** → **Basic**
2. Scroll to **"App Domains"**
3. Add your domain:
   ```
   your-app-url.onrender.com
   ```

4. Scroll to **"Website"**
5. Add site URL:
   ```
   https://your-app-url.onrender.com
   ```

6. Click **"Save Changes"**

---

### **Step 6: Add to Render Environment Variables**

In your Render service, add these 3 environment variables:

```env
FB_APP_ID=your_app_id_here
FB_APP_SECRET=your_app_secret_here
FB_WEBHOOK_VERIFY_TOKEN=my_webhook_verify_token_2024
```

**Example:**
```env
FB_APP_ID=1234567890123456
FB_APP_SECRET=abc123def456ghi789jkl012mno345pq
FB_WEBHOOK_VERIFY_TOKEN=my_webhook_verify_token_2024
```

Click **"Save Changes"** - Your app will redeploy.

---

### **Step 7: Make App Public (Important!)**

1. Go to **App Review** → **Permissions and Features**
2. Request these permissions:
   - `pages_messaging`
   - `pages_manage_metadata`
   - `pages_read_engagement`

3. Go to **Settings** → **Basic**
4. Toggle **"App Mode"** from "Development" to **"Live"**

**Note:** For testing, you can keep it in Development mode and add test users.

---

## 🎯 How Users Connect Their Pages

### **User Flow:**

1. User logs into your app
2. Goes to **Integrations** page
3. Clicks **"Connect Facebook Messenger"**
4. Redirected to Facebook OAuth
5. Selects which Facebook page to connect
6. Grants permissions
7. Redirected back to your app
8. Facebook page is now connected!

### **What Happens Behind the Scenes:**

```javascript
// 1. User clicks "Connect Facebook"
GET /api/integrations/facebook/auth-url
→ Returns Facebook OAuth URL

// 2. User authorizes on Facebook
→ Facebook redirects to your callback

// 3. Your backend exchanges code for token
GET /api/integrations/facebook/callback?code=...
→ Exchanges code for page access token
→ Stores token in database for that user

// 4. User's page is connected
→ Webhooks receive messages
→ AI responds automatically
```

---

## 🔧 Testing the Integration

### **Test with Your Own Page:**

1. Deploy your app with FB credentials
2. Create a test Facebook page (or use existing)
3. Log into your app
4. Go to Integrations → Connect Facebook
5. Select your test page
6. Send a message to your page
7. Check if AI responds

### **Webhook Testing:**

1. Go to Facebook App → Messenger → Webhooks
2. Click **"Test"** button
3. Send test message
4. Check your Render logs for webhook receipt

---

## 🐛 Troubleshooting

### **OAuth Redirect Error**

**Error:** `redirect_uri_mismatch`

**Fix:**
1. Check callback URL matches exactly:
   ```
   https://your-app-url.onrender.com/api/integrations/facebook/callback
   ```
2. No trailing slash
3. Must be HTTPS (not HTTP)
4. Added in Facebook App → Settings → Basic → App Domains

---

### **Webhook Verification Failed**

**Error:** `Webhook verification failed`

**Fix:**
1. Check `FB_WEBHOOK_VERIFY_TOKEN` in Render matches what you entered in Facebook
2. Check webhook URL is correct
3. Check app is deployed and running
4. Test health endpoint: `/api/health`

---

### **Permission Denied**

**Error:** `(#200) Requires pages_messaging permission`

**Fix:**
1. Go to App Review → Request permissions
2. Or add test users in Development mode
3. Make sure app is Live (not Development) for public use

---

### **Messages Not Received**

**Checklist:**
- [ ] Webhook subscribed to `messages` field
- [ ] Page subscribed to app
- [ ] User's page access token is valid
- [ ] Webhook URL is accessible
- [ ] Check Render logs for incoming webhooks

---

## 📊 Multi-Tenant Architecture

### **Database Structure:**

```javascript
// User Model
{
  _id: "user123",
  email: "user@example.com",
  integrations: {
    facebook: {
      connected: true,
      pageId: "page123",
      pageAccessToken: "token_for_this_user",
      connectedAt: "2024-01-01"
    }
  }
}

// Integration Model
{
  userId: "user123",
  platform: "facebook",
  status: "connected",
  credentials: {
    pageId: "page123",
    pageAccessToken: "token_for_this_user"
  },
  platformData: {
    pageName: "User's Business Page",
    followersCount: 1500
  }
}
```

### **How It Scales:**

- ✅ One Facebook App (yours)
- ✅ Unlimited users can connect
- ✅ Each user has their own page token
- ✅ Each user's messages handled separately
- ✅ AI responses customized per user's business

---

## 🔐 Security Best Practices

1. **Never expose App Secret**
   - Keep in environment variables only
   - Never commit to Git
   - Never send to frontend

2. **Validate Webhook Signatures**
   - Already implemented in `webhookService.js`
   - Verifies requests are from Facebook

3. **Token Storage**
   - Page access tokens stored encrypted in MongoDB
   - Only accessible by that user

4. **Permissions**
   - Request only necessary permissions
   - `pages_messaging` - Send/receive messages
   - `pages_manage_metadata` - Manage page settings
   - `pages_read_engagement` - Read page metrics

---

## 📝 Environment Variables Summary

**Required for Facebook OAuth:**
```env
FB_APP_ID=1234567890123456
FB_APP_SECRET=abc123def456ghi789
FB_WEBHOOK_VERIFY_TOKEN=my_custom_token
```

**Optional (auto-set):**
```env
BACKEND_URL=https://your-app.onrender.com
FRONTEND_URL=https://your-app.onrender.com
```

---

## 🎉 You're Done!

Once configured:
- ✅ Users can connect their Facebook pages
- ✅ OAuth flow handles authentication
- ✅ Each user's messages are automated
- ✅ AI responds based on their business data
- ✅ Scales to unlimited users

---

## 📚 Additional Resources

- [Facebook Messenger Platform Docs](https://developers.facebook.com/docs/messenger-platform)
- [Facebook OAuth Documentation](https://developers.facebook.com/docs/facebook-login)
- [Webhook Reference](https://developers.facebook.com/docs/messenger-platform/webhooks)
- [Page Access Tokens](https://developers.facebook.com/docs/pages/access-tokens)

---

**Your multi-tenant Facebook Messenger integration is ready! 🚀**
