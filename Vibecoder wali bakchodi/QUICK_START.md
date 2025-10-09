# 🚀 Quick Start Guide

Get your AI-powered sales automation platform running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

## Step 2: Start MongoDB

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod

# Or use MongoDB Compass to start
```

## Step 3: Configure Environment

### Backend (.env)
```bash
cd backend
cp .env.example .env
```

**Minimum required (to start):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sales-automation
JWT_SECRET=change_this_to_something_secure_12345
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Add these later when you have them
FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret
FB_WEBHOOK_VERIFY_TOKEN=my_verify_token
OPENAI_API_KEY=your_openai_key_optional
```

### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Start the Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

## Step 5: Test the App

1. Open browser: `http://localhost:5173`
2. Click "Get Started"
3. Sign up with email and password
4. Complete onboarding form
5. You're in! 🎉

## Step 6: Create Your First Campaign

1. Go to **Campaigns** page
2. Click **"Create Campaign"**
3. Fill in product details:
   - Campaign name: "Summer Sale"
   - Product name: "Premium Widget"
   - Description: "Amazing product"
   - Price: 99.99
   - Add features
4. Set up chat flow:
   - Greeting message
   - Questions to ask
   - Closing message
5. Choose target platform: **Facebook**
6. Click **"Create Campaign"**

## Step 7: Connect Facebook (Optional)

### Get Facebook Credentials

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create app → Business type
3. Add Messenger product
4. Get Page Access Token
5. Get Page ID

### Connect in App

1. Go to **Integrations** page
2. Click **"Connect"** on Facebook
3. Enter Page ID and Access Token
4. Click **"Connect"**

### Set Up Webhook (for production)

Use ngrok for local testing:
```bash
npm install -g ngrok
ngrok http 5000
```

In Facebook App:
- Webhook URL: `https://your-ngrok-url.ngrok.io/api/webhooks/facebook`
- Verify Token: Same as in your .env

## 🎯 What You Can Do Now

### Without Facebook Connected:
- ✅ View dashboard with analytics
- ✅ Create and manage campaigns
- ✅ Chat with Leo AI assistant
- ✅ Explore all features

### With Facebook Connected:
- ✅ All of the above, plus:
- ✅ Receive real customer messages
- ✅ AI responds automatically
- ✅ Track real conversations
- ✅ See live analytics

## 📊 Test the Dashboard

### Overview Page
- See real-time stats
- View activity charts
- Quick actions

### Chats Page
- View all conversations
- Send manual messages
- Update lead status

### Analytics Page
- Performance metrics
- Campaign analytics
- AI performance stats

### Campaigns Page
- Manage campaigns
- Activate/pause campaigns
- View campaign stats

### Integrations Page
- Connect platforms
- View connection status
- Setup instructions

## 🤖 Chat with Leo AI

1. Click the Leo AI icon (bottom right)
2. Ask questions:
   - "Show me my analytics"
   - "How are my campaigns performing?"
   - "Help me create a campaign"
   - "What's my conversion rate?"

## 🐛 Common Issues

### Backend won't start
```bash
# Check if port 5000 is in use
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000

# Kill the process or change PORT in .env
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/sales-automation
```

### Frontend can't connect to backend
```bash
# Check backend is running on port 5000
# Check VITE_API_URL in frontend/.env
# Try: http://localhost:5000/api/health
```

### CORS errors
```bash
# Make sure FRONTEND_URL in backend/.env matches frontend URL
FRONTEND_URL=http://localhost:5173
```

## 🎉 You're Ready!

Your AI-powered sales automation platform is now running!

### Next Steps:
1. ✅ Create more campaigns
2. ✅ Connect Facebook Messenger
3. ✅ Test with real customers
4. ✅ Monitor analytics
5. ✅ Scale your sales!

## 📚 More Resources

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Backend API**: See `backend/README.md`

## 💡 Pro Tips

1. **Use real business info** in onboarding for better AI responses
2. **Create detailed campaigns** with specific product features
3. **Test chat flows** before going live
4. **Monitor analytics** to optimize performance
5. **Use Leo AI** for insights and help

## 🆘 Need Help?

1. Check the logs:
   - Backend: Terminal running `npm run dev`
   - Frontend: Browser console (F12)

2. Common fixes:
   - Restart both servers
   - Clear browser cache
   - Check .env files
   - Verify MongoDB is running

3. Test endpoints:
   - Backend health: `http://localhost:5000/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

---

**Happy Automating! 🚀**
