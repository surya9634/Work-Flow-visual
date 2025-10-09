# 📘 Facebook Messenger Setup Guide

Complete guide to connect Facebook Messenger to your AI Sales Automation platform.

## 🎯 What You'll Need

- Facebook account
- Facebook Page (business page)
- Facebook Developer account
- Your app running locally or on a server

## 📝 Step-by-Step Setup

### Part 1: Create Facebook App (10 minutes)

#### 1. Go to Facebook Developers
```
https://developers.facebook.com
```

#### 2. Create New App
- Click **"My Apps"** → **"Create App"**
- Choose **"Business"** type
- Fill in details:
  - **App Name**: "My Sales Automation" (or your choice)
  - **App Contact Email**: Your email
  - **Business Account**: Select or create one
- Click **"Create App"**

#### 3. Add Messenger Product
- In your app dashboard, find **"Add Products"**
- Find **"Messenger"** and click **"Set Up"**
- You'll be taken to Messenger Settings

### Part 2: Get Credentials (5 minutes)

#### 1. Get Page Access Token
- In Messenger Settings, scroll to **"Access Tokens"**
- Click **"Add or Remove Pages"**
- Select your Facebook Page
- Grant all permissions
- Click **"Generate Token"** for your page
- **Copy this token** - this is your `PAGE_ACCESS_TOKEN`
- ⚠️ **Important**: Keep this token secret!

#### 2. Get Page ID
Two ways to get it:

**Method A - From Token Section:**
- The Page ID is shown next to your page name
- Copy the number

**Method B - From Page Settings:**
- Go to your Facebook Page
- Click **"Settings"**
- Click **"Page Info"**
- Find **"Page ID"**
- Copy the number

#### 3. Get App ID and Secret
- In your app dashboard, go to **"Settings"** → **"Basic"**
- **App ID**: Copy this number
- **App Secret**: Click **"Show"** and copy
- ⚠️ **Important**: Keep the secret... secret!

### Part 3: Configure Webhook (15 minutes)

#### 1. Prepare Your Backend

Make sure your backend is running and accessible. For local development, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start your backend first
cd backend
npm run dev

# In new terminal, start ngrok
ngrok http 5000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:5000
```

Copy the `https://` URL (e.g., `https://abc123.ngrok.io`)

#### 2. Set Up Webhook in Facebook

- In Messenger Settings, scroll to **"Webhooks"**
- Click **"Add Callback URL"**

Fill in:
- **Callback URL**: `https://your-ngrok-url.ngrok.io/api/webhooks/facebook`
  - Example: `https://abc123.ngrok.io/api/webhooks/facebook`
- **Verify Token**: Create a custom token (e.g., `my_verify_token_12345`)
  - This must match `FB_WEBHOOK_VERIFY_TOKEN` in your `.env`

Click **"Verify and Save"**

#### 3. Subscribe to Events

After webhook is verified:
- Click **"Add Subscriptions"**
- Select these fields:
  - ✅ `messages`
  - ✅ `messaging_postbacks`
  - ✅ `messaging_optins`
  - ✅ `message_deliveries`
  - ✅ `message_reads`
- Click **"Save"**

#### 4. Subscribe Page to Webhook

- Scroll down to **"Webhooks"** section
- Find your page
- Click **"Subscribe"**

### Part 4: Configure Your App (5 minutes)

#### 1. Update Backend .env

Edit `backend/.env`:

```env
# Facebook App Credentials
FB_APP_ID=123456789012345
FB_APP_SECRET=abc123def456ghi789jkl012mno345pq
FB_WEBHOOK_VERIFY_TOKEN=my_verify_token_12345

# Optional - for better AI responses
OPENAI_API_KEY=sk-your-openai-key-here
```

#### 2. Restart Backend

```bash
# Stop backend (Ctrl+C)
# Start again
npm run dev
```

### Part 5: Connect in Your App (2 minutes)

#### 1. Open Your App
```
http://localhost:5173
```

#### 2. Go to Integrations Page
- Login to your account
- Navigate to **"Integrations"**

#### 3. Connect Facebook
- Click **"Connect"** on Facebook Messenger card
- Enter your **Page ID**
- Enter your **Page Access Token**
- Click **"Connect"**

You should see:
- ✅ **"Connected"** status
- Page name displayed
- Connection date shown

### Part 6: Test the Integration (5 minutes)

#### 1. Create Active Campaign

- Go to **"Campaigns"** page
- Create a campaign if you haven't
- Make sure status is **"Active"**

#### 2. Send Test Message

- Open Facebook Messenger
- Go to your Facebook Page
- Send a message: "Hello"

#### 3. Check Backend Console

You should see:
```
📨 Webhook event received: { sender: {...}, message: {...} }
📨 Message from 1234567890: Hello
✅ AI response sent to 1234567890
```

#### 4. Check Dashboard

- Go to **"Chats"** page
- You should see new conversation
- Message from customer
- AI response

#### 5. Verify Response

- Check Facebook Messenger
- You should receive AI response
- Response should be contextual to your campaign

## 🎯 What Should Happen

### When Customer Messages:

```
1. Customer sends: "Hi, how much is this?"
2. Facebook sends webhook to your backend
3. Backend receives message
4. Global AI generates response using:
   - Your business info
   - Campaign details
   - Product information
   - Conversation history
5. Backend sends response via Facebook API
6. Customer receives: "Great question! [Product] is priced at $99.99..."
7. Dashboard updates in real-time
8. Analytics tracked automatically
```

## 🔧 Environment Variables Reference

```env
# Your Facebook App ID (from App Dashboard → Settings → Basic)
FB_APP_ID=123456789012345

# Your Facebook App Secret (from App Dashboard → Settings → Basic)
FB_APP_SECRET=abc123def456ghi789jkl012mno345pq

# Custom token you create (must match in Facebook webhook settings)
FB_WEBHOOK_VERIFY_TOKEN=my_verify_token_12345

# Optional - for better AI responses
OPENAI_API_KEY=sk-your-openai-key-here
```

## 🐛 Troubleshooting

### Webhook Verification Failed

**Problem**: Facebook says "The URL couldn't be validated"

**Solutions**:
1. Make sure backend is running
2. Check ngrok is forwarding to port 5000
3. Verify `FB_WEBHOOK_VERIFY_TOKEN` matches in:
   - `backend/.env`
   - Facebook webhook settings
4. Try the webhook URL in browser:
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/facebook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test
   ```
   Should return: `test`

### Not Receiving Messages

**Problem**: Messages sent but webhook not triggered

**Solutions**:
1. Check webhook is subscribed to page
2. Verify page is subscribed to webhook
3. Check backend console for errors
4. Verify ngrok is still running
5. Check Facebook App is not in restricted mode

### AI Not Responding

**Problem**: Webhook received but no response sent

**Solutions**:
1. Check campaign is "Active"
2. Verify Page Access Token is valid
3. Check backend logs for errors
4. Test token with Graph API Explorer:
   ```
   https://developers.facebook.com/tools/explorer/
   ```

### Invalid Token Error

**Problem**: "Invalid OAuth access token"

**Solutions**:
1. Token may have expired - generate new one
2. Make sure you copied the full token
3. Check for extra spaces in .env file
4. Verify token has correct permissions

### Connection Failed in App

**Problem**: "Failed to connect Facebook"

**Solutions**:
1. Verify Page ID is correct (numbers only)
2. Check Page Access Token is complete
3. Make sure backend is running
4. Check backend .env has FB credentials
5. Look at browser console for errors

## 📱 Testing Checklist

- [ ] Facebook App created
- [ ] Messenger product added
- [ ] Page Access Token obtained
- [ ] Page ID obtained
- [ ] Webhook configured and verified
- [ ] Events subscribed
- [ ] Page subscribed to webhook
- [ ] Backend .env updated
- [ ] Backend restarted
- [ ] Connected in app UI
- [ ] Campaign created and active
- [ ] Test message sent
- [ ] Webhook received (check logs)
- [ ] AI response generated
- [ ] Response sent to customer
- [ ] Conversation appears in dashboard
- [ ] Analytics updated

## 🎯 Production Deployment

### For Production (not localhost):

1. **Deploy Backend**
   - Use Heroku, AWS, DigitalOcean, etc.
   - Must have HTTPS (required by Facebook)
   - Update webhook URL to production domain

2. **Update Environment**
   ```env
   NODE_ENV=production
   BACKEND_URL=https://your-domain.com
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Update Facebook Webhook**
   - Change callback URL to production
   - Re-verify webhook

4. **Switch App Mode**
   - In Facebook App settings
   - Switch from "Development" to "Live"

## 🔐 Security Best Practices

1. **Never commit tokens to git**
   - Keep .env in .gitignore
   - Use environment variables

2. **Rotate tokens regularly**
   - Generate new tokens periodically
   - Update in app when changed

3. **Use HTTPS in production**
   - Required by Facebook
   - Protects webhook data

4. **Validate webhook signatures**
   - Already implemented in code
   - Verifies requests from Facebook

5. **Limit token permissions**
   - Only grant necessary permissions
   - Review regularly

## 📚 Additional Resources

- [Facebook Messenger Platform Docs](https://developers.facebook.com/docs/messenger-platform)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Webhook Setup Guide](https://developers.facebook.com/docs/messenger-platform/webhooks)
- [ngrok Documentation](https://ngrok.com/docs)

## 🎉 Success!

Once everything is working:
- ✅ Customers can message your page
- ✅ AI responds automatically
- ✅ Conversations tracked in dashboard
- ✅ Analytics updated in real-time
- ✅ Lead scoring calculated
- ✅ Conversions tracked

**You're now automating sales with AI! 🚀**

---

**Need help? Check the troubleshooting section or review backend logs for detailed error messages.**
