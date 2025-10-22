# Facebook Messenger Integration - Quick Start Guide

## 🚀 Quick Fix for Your Issue

Your backend is **already fully functional**! The issue is just in the frontend OAuth flow. Here's the 3-step fix:

### Step 1: Add the Integration Component

Copy the `FacebookIntegration.jsx` component I created to your frontend integrations page:

```bash
# The component is located at:
frontend/src/components/FacebookIntegration.jsx
```

### Step 2: Use the Component in Your Integrations Page

```jsx
// In your Integrations.jsx or similar file
import FacebookIntegration from '../components/FacebookIntegration';

function Integrations() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Integrations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facebook Messenger Integration */}
        <FacebookIntegration />
        
        {/* Other integrations... */}
      </div>
    </div>
  );
}
```

### Step 3: Configure Environment Variables

Make sure your backend `.env` has:

```env
FB_APP_ID=1256408305896903
FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
FB_WEBHOOK_VERIFY_TOKEN=your_secure_token_here
BACKEND_URL=https://work-automation-platform.onrender.com
FRONTEND_URL=https://your-frontend-url.com
JWT_SECRET=your_jwt_secret
```

## ✅ What's Already Working in Your Backend

Your backend already has **complete Facebook Messenger automation**:

### 1. OAuth Integration (`routes/integrations.js`)
- ✅ `/api/integrations/facebook/auth` - Initiates OAuth
- ✅ `/api/integrations/facebook/callback` - Handles callback
- ✅ `/api/integrations/facebook/connect` - Manual connection
- ✅ `/api/integrations/facebook/disconnect` - Disconnect
- ✅ `/api/integrations/:platform/status` - Check status

### 2. Webhook Handler (`routes/webhooks.js` + `services/webhookService.js`)
- ✅ Receives incoming messages
- ✅ Creates/updates chat records
- ✅ Fetches customer profiles
- ✅ Handles postbacks (button clicks)
- ✅ Tracks message reads

### 3. AI-Powered Responses (`services/webhookService.js`)
- ✅ Generates contextual AI responses
- ✅ Maintains conversation history
- ✅ Adapts to campaign settings
- ✅ Automatic lead scoring
- ✅ Auto-qualifies leads at 60+ score

### 4. Messaging Service (`services/messagingService.js`)
- ✅ Send text messages
- ✅ Send quick replies
- ✅ Typing indicators
- ✅ Error handling

### 5. Chat Management (`routes/chats.js`)
- ✅ List all chats
- ✅ Get chat details
- ✅ Send manual messages
- ✅ Update chat status
- ✅ Mark conversions
- ✅ Track revenue

### 6. Analytics (`services/webhookService.js`)
- ✅ Conversation tracking
- ✅ Message counts
- ✅ Response rates
- ✅ Conversion tracking
- ✅ Hourly data
- ✅ Revenue tracking

## 🔧 Facebook App Configuration

### 1. Go to Facebook Developers Console
https://developers.facebook.com/apps/1256408305896903

### 2. Add Messenger Product
- Click "Add Product"
- Select "Messenger"

### 3. Configure OAuth Settings
**Settings > Basic > App Domains:**
- Add: `work-automation-platform.onrender.com`
- Add: `your-frontend-domain.com`

**Facebook Login > Settings > Valid OAuth Redirect URIs:**
```
https://work-automation-platform.onrender.com/api/integrations/facebook/callback
```

### 4. Setup Webhooks
**Messenger > Settings > Webhooks:**

**Callback URL:**
```
https://work-automation-platform.onrender.com/api/webhooks/facebook
```

**Verify Token:** (same as in your `.env`)
```
your_secure_token_here
```

**Subscription Fields:**
- ✅ messages
- ✅ messaging_postbacks
- ✅ messaging_optins
- ✅ message_reads
- ✅ message_deliveries

### 5. Request Permissions
**App Review > Permissions and Features:**

Request these permissions:
- `pages_manage_metadata`
- `pages_messaging`
- `pages_read_engagement`
- `pages_manage_posts`

## 🧪 Testing the Integration

### Test 1: Check Backend is Running
```bash
curl https://work-automation-platform.onrender.com/api/integrations/facebook/status
```

### Test 2: Test Webhook Verification
```bash
curl "https://work-automation-platform.onrender.com/api/webhooks/facebook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test123"
# Should return: test123
```

### Test 3: Connect Facebook
1. Open your frontend
2. Navigate to Integrations page
3. Click "Connect Facebook"
4. Grant permissions
5. Should redirect back with success message

### Test 4: Send Test Message
1. Go to your Facebook Page
2. Send a message to the page
3. Check backend logs - should see webhook received
4. Check database - chat should be created
5. Should receive AI response automatically

## 📊 Monitor Your Integration

### Check Logs
```bash
# If using Render
render logs -a work-automation-platform

# If running locally
npm run dev
```

### Check Database
```javascript
// In MongoDB Compass or shell
db.integrations.find({ platform: 'facebook' })
db.chats.find({ platform: 'facebook' })
db.analytics.find({ platform: 'facebook' })
```

### Check Real-time Events
Your backend uses Socket.io for real-time updates:
- New messages emit to `business-${userId}`
- Frontend should listen for `new-message` events

## 🐛 Common Issues & Solutions

### Issue: "Redirect URI Mismatch"
**Cause:** Facebook OAuth redirect URI doesn't match
**Fix:** 
1. Go to Facebook App Settings
2. Add exact URL: `https://work-automation-platform.onrender.com/api/integrations/facebook/callback`

### Issue: "Invalid Verify Token"
**Cause:** Webhook verify token mismatch
**Fix:** Ensure `.env` token matches Facebook webhook settings

### Issue: "No Pages Found"
**Cause:** User doesn't have a Facebook Page or isn't admin
**Fix:**
1. Create a Facebook Page
2. Make sure you're the admin
3. Try connecting again

### Issue: "Webhook Not Receiving Messages"
**Cause:** Webhook not subscribed or URL not accessible
**Fix:**
1. Check webhook URL is publicly accessible
2. Verify webhook subscription in Facebook App
3. Test with Facebook's webhook test tool
4. Check backend logs for errors

### Issue: "Token Expired"
**Cause:** Page access token expired
**Fix:**
1. Reconnect Facebook integration
2. Tokens are long-lived but may need refresh

## 🎯 Complete Flow Diagram

```
User clicks "Connect Facebook"
         ↓
Frontend calls /api/integrations/facebook/auth
         ↓
Backend generates OAuth URL with state
         ↓
User redirected to Facebook
         ↓
User grants permissions
         ↓
Facebook redirects to /api/integrations/facebook/callback
         ↓
Backend exchanges code for access token
         ↓
Backend gets user's pages
         ↓
Backend subscribes page to webhooks
         ↓
Backend saves integration to database
         ↓
Backend redirects to frontend with success
         ↓
Frontend shows success message
         ↓
Integration complete! 🎉

--- When customer sends message ---

Customer sends message to Facebook Page
         ↓
Facebook sends webhook to /api/webhooks/facebook
         ↓
Backend receives webhook event
         ↓
Backend finds/creates chat record
         ↓
Backend fetches customer profile
         ↓
Backend generates AI response
         ↓
Backend sends response via Messenger API
         ↓
Backend updates analytics
         ↓
Backend emits socket event to frontend
         ↓
Frontend shows new message in real-time
```

## 📝 Next Steps After Integration

### 1. Create a Campaign
```javascript
POST /api/campaigns
{
  "name": "Summer Sale",
  "targetPlatform": "facebook",
  "chatFlow": {
    "greeting": "Hi! Welcome to our Summer Sale! 🌞",
    "productInfo": "We have amazing deals...",
    "pricingInfo": "Prices start from $99"
  }
}
```

### 2. Monitor Conversations
```javascript
GET /api/chats?platform=facebook&status=active
```

### 3. View Analytics
```javascript
GET /api/analytics?platform=facebook
```

### 4. Send Manual Messages
```javascript
POST /api/chats/:chatId/messages
{
  "content": "Thanks for your interest!",
  "messageType": "text"
}
```

## 🚀 Advanced Features

### Custom Chat Flows
Configure different flows for different campaigns:
- Welcome messages
- Product information
- Pricing details
- Closing messages

### Lead Scoring
Automatic scoring based on:
- Message count (engagement)
- Keywords: "price", "buy", "purchase"
- Contact info sharing
- Time spent in conversation

### Quick Replies
Send messages with button options:
```javascript
await sendQuickReplies(
  'facebook',
  recipientId,
  'What interests you?',
  ['Pricing', 'Features', 'Demo'],
  userId
);
```

### Typing Indicators
Show "typing..." for better UX:
```javascript
await sendTypingIndicator('facebook', recipientId, userId, 'typing_on');
```

## 📚 API Reference

### Integration Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/integrations/facebook/auth` | Get OAuth URL |
| GET | `/api/integrations/facebook/callback` | OAuth callback |
| POST | `/api/integrations/facebook/connect` | Manual connect |
| POST | `/api/integrations/facebook/disconnect` | Disconnect |
| GET | `/api/integrations/:platform/status` | Check status |

### Chat Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chats` | List chats |
| GET | `/api/chats/:id` | Get chat details |
| POST | `/api/chats/:id/messages` | Send message |
| PATCH | `/api/chats/:id/status` | Update status |
| POST | `/api/chats/:id/conversion` | Mark converted |

### Webhook Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhooks/facebook` | Verify webhook |
| POST | `/api/webhooks/facebook` | Receive events |

## 💡 Pro Tips

1. **Test in Development First**
   - Use ngrok to expose local backend
   - Test webhook before deploying

2. **Monitor Logs**
   - Watch for webhook events
   - Check for API errors
   - Monitor response times

3. **Set Up Alerts**
   - Get notified of integration issues
   - Monitor webhook failures
   - Track response rates

4. **Optimize AI Responses**
   - Train with your product data
   - Use conversation history
   - A/B test different prompts

5. **Scale Gradually**
   - Start with one page
   - Monitor performance
   - Add more pages as needed

## 🎉 You're All Set!

Your backend is **production-ready** with:
- ✅ Complete OAuth flow
- ✅ Webhook handling
- ✅ AI automation
- ✅ Analytics tracking
- ✅ Real-time updates
- ✅ Lead scoring
- ✅ Campaign management

Just add the frontend component and configure Facebook App settings!

---

**Need Help?**
- Check backend logs for errors
- Verify Facebook App configuration
- Test webhook with Facebook's tools
- Review the comprehensive guide in `FACEBOOK_MESSENGER_FIX.md`
