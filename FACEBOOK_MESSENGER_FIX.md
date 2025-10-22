# Facebook Messenger Integration Fix Guide

## Problem Identified

When clicking "Connect Facebook" in the integration tab, users get redirected to the landing page instead of staying on the integrations page with a successful connection.

## Root Causes

1. **Frontend not handling OAuth callback properly** - The frontend needs to handle the callback URL with the temp token
2. **Missing frontend integration button logic** - The "Connect Facebook" button needs to call the correct backend endpoint
3. **OAuth flow state management** - Need to properly handle the OAuth state parameter

## Solution: Complete Facebook Messenger Automation Setup

### Step 1: Update Frontend Integration Component

Your frontend needs to properly initiate the Facebook OAuth flow. Here's what the integration button should do:

```javascript
// In your frontend integrations page (e.g., Integrations.jsx or similar)

const connectFacebook = async () => {
  try {
    setLoading(true);
    
    // Call backend to get Facebook OAuth URL
    const response = await fetch('/api/integrations/facebook/auth', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`, // Your JWT token
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.authUrl) {
      // Redirect to Facebook OAuth
      window.location.href = data.authUrl;
    } else {
      throw new Error('Failed to get Facebook auth URL');
    }
  } catch (error) {
    console.error('Facebook connection error:', error);
    alert('Failed to connect Facebook. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Step 2: Handle OAuth Callback in Frontend

Add a callback handler in your integrations page to process the OAuth callback:

```javascript
// In your Integrations component useEffect

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const error = urlParams.get('error');
  const tempToken = urlParams.get('token');
  
  if (success === 'facebook_connected') {
    // Show success message
    toast.success('Facebook Messenger connected successfully!');
    
    // Refresh integrations list
    fetchIntegrations();
    
    // Clean URL
    window.history.replaceState({}, '', '/dashboard/integrations');
  }
  
  if (error) {
    let errorMessage = 'Failed to connect Facebook';
    
    switch(error) {
      case 'access_denied':
        errorMessage = 'Access denied. Please grant permissions to continue.';
        break;
      case 'no_pages':
        errorMessage = 'No Facebook pages found. Please create a page first.';
        break;
      case 'connection_failed':
        errorMessage = 'Connection failed. Please try again.';
        break;
    }
    
    toast.error(errorMessage);
    window.history.replaceState({}, '', '/dashboard/integrations');
  }
}, []);
```

### Step 3: Environment Variables Setup

Make sure your `.env` file has these variables:

```env
# Facebook App Configuration
FB_APP_ID=1256408305896903
FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9
FB_WEBHOOK_VERIFY_TOKEN=your_secure_verify_token_here

# Backend URL (for OAuth callback)
BACKEND_URL=https://work-automation-platform.onrender.com

# Frontend URL (for redirect after OAuth)
FRONTEND_URL=https://your-frontend-domain.com

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

### Step 4: Facebook App Configuration

1. **Go to Facebook Developers Console** (https://developers.facebook.com)
2. **Select your app** (App ID: 1256408305896903)
3. **Add Messenger Product** if not already added
4. **Configure OAuth Redirect URIs**:
   - Add: `https://work-automation-platform.onrender.com/api/integrations/facebook/callback`
5. **Configure Webhooks**:
   - Callback URL: `https://work-automation-platform.onrender.com/api/webhooks/facebook`
   - Verify Token: Use the same token from your `.env` file
   - Subscribe to fields: `messages`, `messaging_postbacks`, `messaging_optins`, `message_reads`
6. **Request Permissions**:
   - `pages_manage_metadata`
   - `pages_messaging`
   - `pages_read_engagement`
   - `pages_manage_posts`

### Step 5: Test the Integration Flow

1. **Start your backend server**
2. **Open your frontend**
3. **Navigate to Integrations page**
4. **Click "Connect Facebook"**
5. **You should be redirected to Facebook OAuth**
6. **Grant permissions**
7. **You should be redirected back to your integrations page with success message**

### Step 6: Verify Webhook Connection

After connecting, verify your webhook is working:

```bash
# Test webhook verification
curl -X GET "https://work-automation-platform.onrender.com/api/webhooks/facebook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test_challenge"

# Should return: test_challenge
```

## Complete Facebook Messenger Automation Features

Once connected, your system will automatically:

### 1. **Receive Messages**
- Webhook receives incoming messages from customers
- Creates or updates chat records in database
- Stores customer profile information

### 2. **AI-Powered Responses**
- Generates contextual AI responses using your AI service
- Maintains conversation history
- Adapts responses based on campaign settings

### 3. **Lead Scoring**
- Automatically calculates lead scores based on conversation
- Qualifies leads when score reaches threshold (60+)
- Tracks buying signals (price, buy, delivery, etc.)

### 4. **Analytics Tracking**
- Tracks conversations started
- Monitors message sent/received
- Calculates response rates
- Tracks conversions

### 5. **Real-time Updates**
- Socket.io integration for live chat updates
- Business dashboard receives real-time notifications
- Typing indicators for better UX

## API Endpoints Available

### Integration Management
- `GET /api/integrations/facebook/auth` - Initiate OAuth
- `GET /api/integrations/facebook/callback` - OAuth callback
- `POST /api/integrations/facebook/connect` - Manual connection
- `POST /api/integrations/facebook/disconnect` - Disconnect
- `GET /api/integrations/:platform/status` - Check status

### Chat Management
- `GET /api/chats` - Get all chats
- `GET /api/chats/:id` - Get single chat
- `POST /api/chats/:id/messages` - Send manual message
- `PATCH /api/chats/:id/status` - Update chat status
- `POST /api/chats/:id/conversion` - Mark as converted

### Webhooks
- `GET /api/webhooks/facebook` - Webhook verification
- `POST /api/webhooks/facebook` - Receive webhook events

## Troubleshooting

### Issue: "Redirect URI Mismatch"
**Solution**: Make sure the redirect URI in Facebook App Settings exactly matches:
```
https://work-automation-platform.onrender.com/api/integrations/facebook/callback
```

### Issue: "Invalid Verify Token"
**Solution**: Ensure `FB_WEBHOOK_VERIFY_TOKEN` in `.env` matches the token in Facebook webhook settings

### Issue: "No Pages Found"
**Solution**: 
1. Create a Facebook Page first
2. Make sure you're an admin of the page
3. Grant page permissions during OAuth

### Issue: "Webhook Not Receiving Messages"
**Solution**:
1. Verify webhook subscription in Facebook App Dashboard
2. Check webhook URL is accessible publicly
3. Ensure page is subscribed to your app
4. Test webhook with Facebook's test tool

## Testing Your Integration

### 1. Test OAuth Flow
```javascript
// In browser console on your integrations page
fetch('/api/integrations/facebook/auth', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
}).then(r => r.json()).then(console.log);
```

### 2. Test Sending Message
```javascript
// After integration is connected
fetch('/api/chats/CHAT_ID/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Test message',
    messageType: 'text'
  })
}).then(r => r.json()).then(console.log);
```

### 3. Test Webhook
Send a test message from Facebook Messenger to your page and check:
- Backend logs show webhook received
- Chat created in database
- AI response sent back
- Analytics updated

## Advanced Features

### Custom Chat Flows
Configure custom chat flows in your campaigns:

```javascript
const campaign = {
  name: 'Summer Sale',
  chatFlow: {
    greeting: 'Hi! 👋 Welcome to our Summer Sale!',
    productInfo: 'We have amazing deals on...',
    pricingInfo: 'Prices start from $99',
    closingMessage: 'Thanks for your interest!'
  }
};
```

### Quick Replies
Send messages with quick reply buttons:

```javascript
import { sendQuickReplies } from '../services/messagingService.js';

await sendQuickReplies(
  'facebook',
  recipientId,
  'What would you like to know?',
  ['Pricing', 'Features', 'Demo'],
  userId
);
```

### Typing Indicators
Show typing indicator for better UX:

```javascript
import { sendTypingIndicator } from '../services/messagingService.js';

await sendTypingIndicator('facebook', recipientId, userId, 'typing_on');
// Generate response...
await sendTypingIndicator('facebook', recipientId, userId, 'typing_off');
```

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Validate webhook signatures** - Verify requests are from Facebook
3. **Use HTTPS** - Required for webhooks
4. **Rotate tokens regularly** - Update access tokens periodically
5. **Implement rate limiting** - Prevent abuse
6. **Sanitize user input** - Prevent injection attacks

## Next Steps

1. ✅ Fix frontend OAuth flow
2. ✅ Configure Facebook App settings
3. ✅ Test webhook integration
4. ✅ Create test campaign
5. ✅ Send test messages
6. ✅ Monitor analytics
7. ✅ Scale to production

## Support

If you encounter issues:
1. Check backend logs for errors
2. Verify Facebook App configuration
3. Test webhook with Facebook's tools
4. Check database for integration records
5. Verify environment variables are set

---

**Your backend is already fully set up!** You just need to:
1. Fix the frontend OAuth button
2. Configure Facebook App settings
3. Set environment variables
4. Test the flow

The backend has all the necessary endpoints, webhook handlers, AI integration, and analytics tracking already implemented! 🚀
