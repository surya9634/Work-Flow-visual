# Complete Facebook Messenger Integration Setup

## 🎯 Overview

This guide will help you set up Facebook Messenger automation for your AI-powered sales automation platform. Your Global AI will automatically respond to customer messages on Facebook Messenger based on the campaigns you create.

## 📋 Prerequisites

1. ✅ Facebook Developer Account
2. ✅ Facebook Page (where customers will message)
3. ✅ Facebook App created
4. ✅ Your backend and frontend running

## 🔧 Step-by-Step Setup

### Step 1: Update Backend Environment Variables

**Edit `backend/.env` file:**

```env
# Replace these placeholder values with REAL credentials:

# Facebook App Credentials
FB_APP_ID=1256408305896903
FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
FB_WEBHOOK_VERIFY_TOKEN=WORKFLOW_VERIFY_TOKEN_2024_SECURE

# URLs (IMPORTANT!)
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# For production, use your actual domains:
# FRONTEND_URL=https://your-frontend.vercel.app
# BACKEND_URL=https://work-automation-platform.onrender.com
```

**⚠️ CRITICAL:** Make sure you're using the REAL values, not placeholders like `your_facebook_app_id`!

### Step 2: Configure Facebook App Settings

#### A. Go to Facebook Developers Console
https://developers.facebook.com/apps/1256408305896903

#### B. Basic Settings
1. Click **Settings** > **Basic**
2. **App Domains:** Add `localhost` (for development)
3. **Privacy Policy URL:** Add your privacy policy URL
4. **Terms of Service URL:** Add your terms URL

#### C. Facebook Login Settings
1. Click **Facebook Login** > **Settings**
2. **Valid OAuth Redirect URIs:** Add these EXACT URLs:
   ```
   http://localhost:5000/api/integrations/facebook/callback
   https://work-automation-platform.onrender.com/api/integrations/facebook/callback
   ```

#### D. Messenger Settings
1. Click **Messenger** > **Settings**
2. **Webhooks:**
   - Callback URL: `http://localhost:5000/api/webhooks/facebook`
   - For production: `https://work-automation-platform.onrender.com/api/webhooks/facebook`
   - Verify Token: `WORKFLOW_VERIFY_TOKEN_2024_SECURE` (same as in .env)
   - Subscribe to fields:
     - ✅ messages
     - ✅ messaging_postbacks
     - ✅ messaging_optins
     - ✅ message_reads
     - ✅ message_deliveries

3. **Access Tokens:**
   - Select your Facebook Page
   - Generate Page Access Token (this happens automatically during OAuth)

#### E. App Review (For Production)
1. Request these permissions:
   - `pages_manage_metadata`
   - `pages_messaging`
   - `pages_read_engagement`
   - `pages_manage_posts`

### Step 3: Local Development with ngrok (Required for Webhooks)

Since Facebook webhooks need a public URL, use ngrok for local testing:

```bash
# Install ngrok
# Download from: https://ngrok.com/download

# Run ngrok
ngrok http 5000

# You'll get a URL like: https://abc123.ngrok.io
```

**Update Facebook App webhook URL to:**
```
https://abc123.ngrok.io/api/webhooks/facebook
```

**Update your backend/.env:**
```env
BACKEND_URL=https://abc123.ngrok.io
```

### Step 4: Restart Your Backend

```bash
cd backend
npm run dev
```

Check the logs - you should see:
```
✅ All required environment variables are set
🚀 Server running on port 5000
```

### Step 5: Test the Integration

1. **Open your frontend:** `http://localhost:5173`
2. **Login** to your account
3. **Go to Integrations page**
4. **Click "Connect with Facebook"**
5. **Grant permissions** on Facebook
6. **You should be redirected back** with success message
7. **Check integration status** - should show "Connected"

### Step 6: Create a Campaign

Now that Facebook is connected, create a campaign:

1. **Go to Campaigns page**
2. **Click "Create Campaign"**
3. **Fill in details:**
   - Campaign Name: "Summer Sale"
   - Product Name: "Premium Widget"
   - Product Description: "Amazing product that solves X problem"
   - Price: "$99"
   - Target Platform: **Facebook** ✅
4. **Configure Chat Flow:**
   - Greeting: "Hi! 👋 Thanks for messaging us about our Summer Sale!"
   - Product Info: "Our Premium Widget helps you..."
   - Pricing Info: "Special price: $99 (normally $149)"
5. **Save Campaign**

### Step 7: Test Automated Messaging

1. **Go to your Facebook Page**
2. **Send a message** as a customer (use a different account)
3. **Message:** "Hi, I'm interested in your product"
4. **Check backend logs** - you should see:
   ```
   📨 Webhook event received
   📨 Message from [user_id]: Hi, I'm interested in your product
   🤖 Generating AI response...
   ✅ AI response sent
   ```
5. **Customer receives** automated AI response based on your campaign!

## 🎯 How It Works

### Complete Flow:

```
1. Customer messages your Facebook Page
         ↓
2. Facebook sends webhook to your backend
         ↓
3. Backend receives message and finds active campaign
         ↓
4. Global AI generates response using:
   - Campaign product info
   - Business onboarding data
   - Conversation history
   - Customer intent
         ↓
5. Backend sends AI response via Facebook API
         ↓
6. Customer receives instant, personalized response
         ↓
7. Conversation continues automatically
         ↓
8. Lead scoring happens in background
         ↓
9. When lead score > 60, marked as "Qualified"
         ↓
10. Business sees conversation in dashboard
         ↓
11. Analytics updated in real-time
```

### Global AI Context:

Your Global AI has access to:
- ✅ **Business Info** (from onboarding)
- ✅ **Product Details** (from campaigns)
- ✅ **Conversation History** (last 10 messages)
- ✅ **Customer Profile** (from Facebook)
- ✅ **Campaign Goals** (from campaign settings)

## 📊 Viewing Results

### Analytics Page
- **Conversations Started:** Total chats initiated
- **Messages Sent/Received:** Message volume
- **Response Rate:** How quickly AI responds
- **Lead Qualification Rate:** % of qualified leads
- **Conversion Rate:** % of sales closed
- **Revenue:** Total sales from platform

### Chats Page
- **View all conversations** in real-time
- **See AI responses** and customer messages
- **Lead scores** for each conversation
- **Manual override** - send custom messages
- **Mark as converted** - track sales

### Dashboard
- **Graphs and charts** showing performance
- **Campaign performance** comparison
- **Hourly activity** patterns
- **Revenue tracking**

## 🔐 Security Best Practices

1. **Never commit .env files** to Git
2. **Use strong verify tokens** for webhooks
3. **Rotate access tokens** regularly
4. **Validate webhook signatures** (already implemented)
5. **Use HTTPS** in production
6. **Implement rate limiting** (already implemented)

## 🐛 Troubleshooting

### Issue: "Facebook App ID not configured"

**Solution:**
```bash
# Check your backend/.env file
cat backend/.env | grep FB_APP_ID

# Should show: FB_APP_ID=1256408305896903
# NOT: FB_APP_ID=your_facebook_app_id
```

### Issue: "Redirect URI Mismatch"

**Solution:**
1. Check exact error message from Facebook
2. Copy the redirect URI from error
3. Add it to Facebook App Settings > Facebook Login > Valid OAuth Redirect URIs

### Issue: "Webhook not receiving messages"

**Solution:**
1. Check ngrok is running: `ngrok http 5000`
2. Update Facebook webhook URL with ngrok URL
3. Test webhook: Send test message from Facebook
4. Check backend logs for webhook events

### Issue: "No pages found"

**Solution:**
1. Create a Facebook Page first
2. Make sure you're the admin of the page
3. Try OAuth flow again

### Issue: "Still redirecting to landing page"

**Solution:**
```bash
# Run diagnostic script
cd backend
node check-facebook-config.js

# Check all variables are set correctly
# Restart backend after fixing
```

## 🚀 Production Deployment

### Backend (Render)

1. **Set environment variables** in Render dashboard:
   ```
   FB_APP_ID=1256408305896903
   FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
   FB_WEBHOOK_VERIFY_TOKEN=WORKFLOW_VERIFY_TOKEN_2024_SECURE
   FRONTEND_URL=https://your-frontend.vercel.app
   BACKEND_URL=https://work-automation-platform.onrender.com
   ```

2. **Update Facebook App** webhook URL:
   ```
   https://work-automation-platform.onrender.com/api/webhooks/facebook
   ```

3. **Update OAuth redirect URI:**
   ```
   https://work-automation-platform.onrender.com/api/integrations/facebook/callback
   ```

### Frontend (Vercel/Netlify)

1. **Set environment variables:**
   ```
   VITE_API_URL=https://work-automation-platform.onrender.com
   ```

2. **Deploy** and test

## 📝 Testing Checklist

- [ ] Backend .env has real FB credentials (not placeholders)
- [ ] Backend is running without errors
- [ ] Frontend is running
- [ ] ngrok is running (for local dev)
- [ ] Facebook App OAuth redirect URI is set
- [ ] Facebook App webhook URL is set
- [ ] Webhook verify token matches .env
- [ ] Can click "Connect Facebook" without errors
- [ ] OAuth redirects to Facebook
- [ ] After granting permissions, redirects back to integrations page
- [ ] Integration shows "Connected" status
- [ ] Campaign is created with Facebook as target platform
- [ ] Test message sent to Facebook Page
- [ ] Webhook receives message (check logs)
- [ ] AI response is sent automatically
- [ ] Conversation appears in Chats page
- [ ] Analytics are updated

## 🎉 Success!

Once everything is working:

1. ✅ **Facebook Messenger connected**
2. ✅ **Campaigns created**
3. ✅ **Global AI responding automatically**
4. ✅ **Leads being qualified**
5. ✅ **Analytics tracking everything**
6. ✅ **Real-time dashboard updates**

Your AI-powered sales automation platform is now live! 🚀

## 📞 Need Help?

1. Check backend logs for detailed error messages
2. Check browser console for frontend errors
3. Use diagnostic script: `node backend/check-facebook-config.js`
4. Review Facebook App settings
5. Test webhook with Facebook's test tool

---

**Remember:** The key to success is making sure your `.env` file has REAL credentials, not placeholder values!
