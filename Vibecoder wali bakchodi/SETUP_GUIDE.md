# AI-Powered Sales Automation OS - Complete Setup Guide

This guide will help you set up and run your AI-powered sales automation platform with Facebook Messenger integration.

## 🎯 What This App Does

Your app is an **AI-powered sales automation OS** that:

1. **Onboarding**: Businesses register and provide their information
2. **Global AI Training**: AI learns about the business and products
3. **Campaign System**: Businesses add products they want to sell
4. **Facebook Messenger Integration**: Connects to Facebook pages
5. **Automated Conversations**: Global AI handles all customer chats automatically
6. **Real-time Analytics**: Tracks messages, conversions, and revenue
7. **Leo AI Assistant**: Helps businesses manage the platform

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Facebook Developer Account
- OpenAI API Key (optional, has fallback)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000

MONGODB_URI=mongodb://localhost:27017/sales-automation
JWT_SECRET=your_super_secret_jwt_key_change_this

# Facebook App Credentials (from Facebook Developers)
FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret
FB_WEBHOOK_VERIFY_TOKEN=my_custom_verify_token_12345

# OpenAI API Key (optional - has fallback)
OPENAI_API_KEY=sk-your-openai-api-key

FRONTEND_URL=http://localhost:5173
```

Start MongoDB:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔧 Facebook Messenger Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" type
4. Fill in app details and create

### Step 2: Add Messenger Product

1. In your app dashboard, click "Add Product"
2. Find "Messenger" and click "Set Up"
3. In Messenger Settings, scroll to "Access Tokens"
4. Select your Facebook Page
5. Copy the **Page Access Token**
6. Copy your **Page ID** (from page settings)

### Step 3: Configure Webhook

1. In Messenger Settings, find "Webhooks"
2. Click "Add Callback URL"
3. Enter:
   - **Callback URL**: `http://your-domain.com/api/webhooks/facebook`
   - **Verify Token**: Same as `FB_WEBHOOK_VERIFY_TOKEN` in your .env
4. Subscribe to these fields:
   - `messages`
   - `messaging_postbacks`
   - `messaging_optins`
   - `message_deliveries`
   - `message_reads`

### Step 4: Test Locally with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 5000

# Use the ngrok URL for webhook
# Example: https://abc123.ngrok.io/api/webhooks/facebook
```

### Step 5: Connect in App

1. Log in to your app
2. Go to Integrations page
3. Click "Connect" on Facebook Messenger
4. Enter your **Page ID** and **Page Access Token**
5. Click "Connect"

## 📱 How to Use the App

### For Businesses:

1. **Sign Up**: Create an account with business email
2. **Onboarding**: Fill in business information
   - Business name
   - Owner name
   - Industry
   - Description
   - Upload documents (optional)
3. **Create Campaign**: Add your first product
   - Product name, description, price
   - Features
   - Chat flow (greeting, questions, closing)
   - Target platform (Facebook)
4. **Connect Facebook**: Link your Facebook page
5. **Activate Campaign**: Set campaign to "Active"
6. **AI Takes Over**: Global AI now handles all customer messages automatically!

### For Customers:

1. Message your Facebook page
2. Global AI responds automatically
3. AI qualifies leads and handles objections
4. Conversations tracked in real-time
5. Business sees everything in dashboard

## 🎨 App Structure

### Pages:

- **Landing Page** (`/`): Login/Signup
- **Onboarding** (`/onboarding`): Business information collection
- **Dashboard** (`/dashboard`): Main dashboard
  - **Overview**: Real-time stats and charts
  - **Chats**: View and manage conversations
  - **Analytics**: Detailed performance metrics
  - **Campaigns**: Create and manage campaigns
  - **Integrations**: Connect social platforms

### Key Features:

1. **Global AI**:
   - Learns from business info and campaigns
   - Automatically responds to customers
   - Qualifies leads based on conversation
   - Handles objections intelligently

2. **Leo AI Assistant**:
   - Helps businesses understand analytics
   - Answers questions about the platform
   - Provides recommendations
   - Available via chat sidebar

3. **Real-time Updates**:
   - Socket.IO for live message updates
   - Real-time analytics refresh
   - Instant notifications

4. **Analytics Dashboard**:
   - Message counts and response rates
   - Conversion tracking
   - Revenue metrics
   - Campaign performance
   - AI performance metrics

## 🔑 Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection | `mongodb://localhost:27017/sales-automation` |
| `JWT_SECRET` | JWT signing key | `your_secret_key` |
| `FB_APP_ID` | Facebook App ID | `123456789012345` |
| `FB_APP_SECRET` | Facebook App Secret | `abc123def456...` |
| `FB_WEBHOOK_VERIFY_TOKEN` | Webhook verify token | `my_verify_token` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |
| `BACKEND_URL` | Backend URL | `http://localhost:5000` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🧪 Testing the System

### Test Facebook Webhook:

1. Make sure backend is running
2. Send a message to your Facebook page
3. Check backend console for webhook events
4. Check dashboard for new conversation

### Test AI Responses:

1. Create an active campaign
2. Message your page from a test account
3. Global AI should respond automatically
4. Check conversation in Chats section

### Test Leo AI:

1. Click Leo AI icon in dashboard
2. Ask questions like:
   - "Show me my analytics"
   - "How are my campaigns performing?"
   - "What's my conversion rate?"

## 🐛 Troubleshooting

### Backend won't start:
- Check if MongoDB is running
- Verify .env file exists and has correct values
- Check port 5000 is not in use

### Frontend won't connect:
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Clear browser cache

### Facebook webhook not working:
- Verify webhook URL is accessible (use ngrok for local)
- Check FB_WEBHOOK_VERIFY_TOKEN matches
- Verify webhook subscriptions are active
- Check Facebook App is not in Development Mode restrictions

### Messages not appearing:
- Check Socket.IO connection in browser console
- Verify user is logged in
- Check backend logs for errors

### AI not responding:
- Check if campaign is "active"
- Verify Facebook integration is connected
- Check backend logs for AI service errors
- If OpenAI key is invalid, fallback responses will be used

## 📊 Database Collections

- **users**: User accounts and business info
- **campaigns**: Product campaigns
- **chats**: Customer conversations with messages
- **analytics**: Daily analytics data
- **integrations**: Platform integration credentials

## 🔒 Security Notes

1. **Never commit .env files** to version control
2. **Change JWT_SECRET** in production
3. **Use HTTPS** in production
4. **Rotate Facebook tokens** regularly
5. **Validate webhook signatures** (implemented)
6. **Use environment-specific configs**

## 🚀 Production Deployment

### Backend:

1. Use production MongoDB (MongoDB Atlas)
2. Set `NODE_ENV=production`
3. Use PM2 for process management:
   ```bash
   pm2 start server.js --name sales-automation
   pm2 save
   pm2 startup
   ```
4. Set up SSL/HTTPS (required for Facebook webhooks)
5. Use a reverse proxy (nginx)

### Frontend:

1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy to Vercel, Netlify, or your server
3. Update VITE_API_URL to production backend URL

### Facebook:

1. Switch app from Development to Live mode
2. Update webhook URL to production domain
3. Submit app for review if needed

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs: `backend/logs/`
3. Check browser console for frontend errors
4. Verify all environment variables are set

## 🎉 You're All Set!

Your AI-powered sales automation OS is ready to:
- ✅ Automate customer conversations
- ✅ Qualify leads automatically
- ✅ Track conversions and revenue
- ✅ Scale your sales with AI

Start by creating your first campaign and connecting Facebook Messenger!
