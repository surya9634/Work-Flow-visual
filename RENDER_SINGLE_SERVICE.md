# 🚀 Deploy to Render - Single Service (Recommended)

## ✨ What's New?

Your app now deploys as **ONE service** on Render:
- ✅ Backend and Frontend together
- ✅ Single URL for everything
- ✅ Simpler configuration
- ✅ No CORS issues
- ✅ Easier to manage

---

## 📋 How It Works

1. **Build Phase**: 
   - Builds frontend React app → creates `frontend/dist`
   - Installs backend dependencies

2. **Runtime**:
   - Backend serves API routes at `/api/*`
   - Backend serves frontend static files for all other routes
   - Single Node.js process handles everything

---

## 🎯 Deployment Commands

### **Build Command:**
```bash
cd frontend && npm install && npm run build && cd ../backend && npm install
```

### **Start Command:**
```bash
cd backend && npm run start:prod
```

---

## 🔑 Environment Variables (Required)

Only need to set these for the single service:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sales-automation?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**Optional (for Facebook Messenger):**
```env
FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret
FB_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

---

## 🚀 Step-by-Step Deployment

### **Step 1: Get Required API Keys**

#### **MongoDB Atlas** (Required)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create M0 cluster (free)
3. Database Access → Add user (username: `salesautomation`, set password)
4. Network Access → Add IP → "Allow from Anywhere" (0.0.0.0/0)
5. Database → Connect → "Connect your application"
6. Copy connection string:
   ```
   mongodb+srv://salesautomation:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/sales-automation?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password

#### **Groq API Key** (Required for AI)
1. Go to https://console.groq.com
2. Sign up for free
3. API Keys → Create API Key
4. Copy key (starts with `gsk_...`)

---

### **Step 2: Deploy on Render**

#### **Option A: Using Blueprint (Easiest)**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect GitHub repository: `surya9634/Work-Flow-visual`
4. Render detects `render.yaml` automatically
5. Click **"Apply"**
6. Service `sales-automation-app` will be created

#### **Option B: Manual Setup**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository: `surya9634/Work-Flow-visual`
4. Configure:
   - **Name**: `sales-automation-app`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     cd frontend && npm install && npm run build && cd ../backend && npm install
     ```
   - **Start Command**: 
     ```bash
     cd backend && npm run start:prod
     ```
   - **Plan**: `Free`

---

### **Step 3: Add Environment Variables**

In your Render service, go to **Environment** tab and add:

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `10000` | `10000` |
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Any random 32+ character string | `my_super_secret_jwt_key_2024` |
| `GROQ_API_KEY` | Your Groq API key | `gsk_abc123...` |

**Optional:**
| Variable | Value |
|----------|-------|
| `FB_APP_ID` | Your Facebook App ID |
| `FB_APP_SECRET` | Your Facebook App Secret |
| `FB_WEBHOOK_VERIFY_TOKEN` | Your custom token |

Click **"Save Changes"** - Service will redeploy automatically.

---

### **Step 4: Wait for Deployment**

- Build takes 5-10 minutes
- Watch the logs for progress
- Look for: `✅ MongoDB Connected` and `🚀 Server running on port 10000`

---

### **Step 5: Access Your App**

Your app will be live at:
```
https://sales-automation-app.onrender.com
```

- Landing page loads at root URL
- API available at `/api/*`
- Everything works from one URL!

---

## ✅ Testing Your Deployment

### **1. Check Health Endpoint**
```bash
curl https://your-app-url.onrender.com/api/health
```
Should return: `{"status":"ok","message":"Server is running"}`

### **2. Open Landing Page**
Visit: `https://your-app-url.onrender.com`
- Should see the landing page
- Click "Get Started" to sign up

### **3. Test Sign Up**
- Create an account
- Complete onboarding
- Access dashboard

### **4. Test AI Features**
- Open Leo AI assistant
- Ask a question
- Should get AI response (if Groq key is set)

---

## 🔧 Troubleshooting

### **Build Fails**

**Check Logs** for errors:
- `npm install` failures → Check package.json
- `npm run build` failures → Check frontend code
- Permission errors → Check file paths

**Common Issues:**
```bash
# If frontend build fails
cd frontend && npm install && npm run build

# If backend install fails
cd backend && npm install
```

### **App Loads but API Fails**

1. **Check MongoDB Connection**:
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist (0.0.0.0/0)
   - Look for "MongoDB Connected" in logs

2. **Check Environment Variables**:
   - All required variables set?
   - No typos in variable names?
   - Values are correct?

3. **Check Logs**:
   - Go to service → Logs
   - Look for error messages
   - Check for missing dependencies

### **Frontend Shows Blank Page**

1. **Check Browser Console** (F12):
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify Build**:
   - Check logs for "npm run build" success
   - Should see "frontend/dist" created

3. **Check API Calls**:
   - Should go to `/api/*` (same domain)
   - No CORS errors (since same origin)

---

## 📊 Architecture

```
User Request
    ↓
Render (https://your-app.onrender.com)
    ↓
Node.js Server (server-production.js)
    ↓
    ├─→ /api/* → Express API Routes → MongoDB
    └─→ /* → Static Files (frontend/dist)
```

**Benefits:**
- ✅ Single URL
- ✅ No CORS issues
- ✅ Simpler deployment
- ✅ One service to manage
- ✅ Faster (no extra network hop)

---

## 🎨 Custom Domain (Optional)

1. Go to service → **Settings**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `app.yourdomain.com`)
4. Follow DNS configuration instructions
5. SSL certificate auto-generated by Render

---

## 💰 Free Tier Info

**Render Free Tier:**
- ✅ 750 hours/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold start: 30-60 seconds

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ No credit card required

**Groq Free Tier:**
- ✅ Generous API limits
- ✅ All models included

---

## 🔄 Continuous Deployment

**Automatic:**
- Push to `main` branch → Auto-deploys
- Render pulls latest code
- Runs build command
- Restarts service

**Manual:**
1. Go to service
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

---

## 📝 Environment Variables Summary

**Minimum Required:**
```env
MONGODB_URI=mongodb+srv://...
GROQ_API_KEY=gsk_...
JWT_SECRET=your_secret
```

**Auto-Set by Render:**
```env
NODE_ENV=production
PORT=10000
```

**Optional:**
```env
FB_APP_ID=...
FB_APP_SECRET=...
FB_WEBHOOK_VERIFY_TOKEN=...
```

---

## 🎯 Post-Deployment Checklist

- [ ] Service deployed successfully
- [ ] MongoDB connection working (check logs)
- [ ] Landing page loads
- [ ] Sign up works
- [ ] Onboarding flow works
- [ ] Dashboard accessible
- [ ] Leo AI responds
- [ ] Campaigns can be created
- [ ] Analytics show data
- [ ] Real-time features work (Socket.IO)

---

## 🆘 Quick Commands

### **View Logs:**
```
Render Dashboard → Service → Logs
```

### **Test Health:**
```bash
curl https://your-app.onrender.com/api/health
```

### **Restart Service:**
```
Render Dashboard → Service → Manual Deploy → Clear build cache & deploy
```

### **Check MongoDB:**
```
Look for "✅ MongoDB Connected" in logs
```

---

## 📚 Important URLs

After deployment, save these:

```
App URL: https://sales-automation-app.onrender.com
API Health: https://sales-automation-app.onrender.com/api/health
GitHub: https://github.com/surya9634/Work-Flow-visual
MongoDB Atlas: https://cloud.mongodb.com
Groq Console: https://console.groq.com
Render Dashboard: https://dashboard.render.com
```

---

## 🎉 You're Live!

Your full-stack AI Sales Automation OS is now:
- ✅ Deployed on Render
- ✅ Accessible worldwide
- ✅ Auto-deploys on git push
- ✅ Running on free tier
- ✅ HTTPS enabled
- ✅ MongoDB connected
- ✅ AI powered by Groq

**Share your app URL and start automating sales! 🚀**

---

## 💡 Pro Tips

1. **Monitor Usage**: Check Render dashboard for usage stats
2. **Keep Alive**: Use a service like UptimeRobot to ping your app every 5 minutes (prevents cold starts)
3. **Logs**: Regularly check logs for errors
4. **Backups**: MongoDB Atlas has automatic backups
5. **Updates**: Push to GitHub → Auto-deploys to Render

---

**Need help? Check the logs first - they show everything!** 📊
