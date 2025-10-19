# 🚀 How to Run the Sales Automation OS

Your app has **Frontend** (React) and **Backend** (Node.js + Express) already built!

## 📁 Project Structure

```
proto-1-main/
├── frontend/          # React app (Vite)
└── backend/           # Node.js API + Socket.IO
```

---

## ⚙️ Setup Instructions

### **Step 1: Setup MongoDB**

The backend needs MongoDB to store data.

**Option A: MongoDB Atlas (Cloud - Recommended, No Installation):**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account (no credit card needed)
3. Create a **Free M0 Cluster** (512MB)
4. **Database Access** → Add user (username: `salesautomation`, set password)
5. **Network Access** → Add IP → "Allow Access from Anywhere" (0.0.0.0/0)
6. **Database** → Connect → "Connect your application" → Copy connection string
7. Connection string looks like: `mongodb+srv://salesautomation:<password>@cluster0.xxxxx.mongodb.net/sales-automation`

**Option B: Local MongoDB (Windows):**
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install it (keep default settings)
3. MongoDB will start automatically as a service
4. Use connection string: `mongodb://localhost:27017/sales-automation`

---

### **Step 2: Configure Backend**

1. **Navigate to backend folder:**
   ```powershell
   cd backend
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Edit `.env` file** with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Atlas (replace <password> and cluster URL with yours)
   MONGODB_URI=mongodb+srv://salesautomation:<password>@cluster0.xxxxx.mongodb.net/sales-automation?retryWrites=true&w=majority
   
   # Or Local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/sales-automation
   
   JWT_SECRET=your_super_secret_jwt_key_change_this
   
   # Groq API (Get free key from https://console.groq.com/)
   GROQ_API_KEY=your_groq_api_key_here
   
   # Facebook (optional - add later when setting up Messenger)
   FB_APP_ID=your_facebook_app_id
   FB_APP_SECRET=your_facebook_app_secret
   FB_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
   
   FRONTEND_URL=http://localhost:5173
   ```

4. **Install dependencies:**
   ```powershell
   npm install
   ```

5. **Start the backend:**
   ```powershell
   npm run dev
   ```

   ✅ Backend should now be running on `http://localhost:5000`

---

### **Step 3: Run Frontend**

1. **Open a NEW terminal** (keep backend running)

2. **Navigate to frontend folder:**
   ```powershell
   cd frontend
   ```

3. **Install dependencies** (if not already done):
   ```powershell
   npm install
   ```

4. **Start the frontend:**
   ```powershell
   npm run dev
   ```

   ✅ Frontend should now be running on `http://localhost:5173`

---

## 🎯 Access the App

1. Open browser: **http://localhost:5173**
2. You'll see the Landing Page
3. Click "Get Started" to sign up
4. Complete onboarding
5. Start using the dashboard!

---

## 📱 Facebook Messenger Integration (Optional)

To connect Facebook Messenger for automated chats:

### 1. Create Facebook App
1. Go to https://developers.facebook.com/
2. Create new app (Business type)
3. Add "Messenger" product
4. Copy your **App ID** and **App Secret**

### 2. Set Up Webhook
1. You need a public URL (use ngrok for testing):
   ```powershell
   # Install ngrok
   npm install -g ngrok
   
   # Start ngrok tunnel
   ngrok http 5000
   ```

2. In Facebook App Dashboard → Messenger → Settings:
   - Webhook URL: `https://your-ngrok-url.ngrok.io/api/webhooks/facebook`
   - Verify Token: Same as `FB_WEBHOOK_VERIFY_TOKEN` in `.env`
   - Subscribe to: `messages`, `messaging_postbacks`

### 3. Connect in App
1. Login to your app
2. Go to **Integrations** page
3. Click "Connect Facebook Messenger"
4. Follow the OAuth flow

---

## 🔧 Troubleshooting

### Backend won't start
- **Check MongoDB is running:**
  ```powershell
  # Windows
  net start MongoDB
  ```
- **Check port 5000 is free:**
  ```powershell
  netstat -ano | findstr :5000
  ```

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify CORS settings in backend

### Database errors
- Make sure MongoDB is installed and running
- Check `MONGODB_URI` in `.env` is correct

---

## 🎨 What's Already Built

### Frontend Features:
✅ Landing page with auth
✅ Onboarding flow
✅ Dashboard with sidebar navigation
✅ Campaign creation system
✅ Analytics with charts
✅ Chat management
✅ Integration pages
✅ Leo AI assistant sidebar
✅ User profile

### Backend Features:
✅ Authentication (JWT)
✅ Onboarding APIs
✅ Campaign CRUD operations
✅ Facebook Messenger webhook
✅ Global AI chat automation
✅ Leo AI assistant
✅ Real-time analytics
✅ Socket.IO for live updates
✅ Chat management APIs

---

## 📝 Quick Commands Reference

```powershell
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server
npm start            # Start production server

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production

# Both (run in separate terminals)
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

---

## 🎉 You're Ready!

Both frontend and backend are complete. Just:
1. Install MongoDB
2. Configure `.env` in backend
3. Run backend (`npm run dev`)
4. Run frontend (`npm run dev`)
5. Open http://localhost:5173

Enjoy your AI-powered sales automation OS! 🚀
