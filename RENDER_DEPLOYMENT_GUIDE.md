# 🚀 Deploy to Render - Complete Guide

## ✅ Prerequisites Completed

- ✅ Code pushed to GitHub: https://github.com/surya9634/Work-Flow-visual
- ✅ Deprecated Mongoose options fixed
- ✅ Render configuration file (`render.yaml`) ready
- ✅ All documentation included

---

## 📋 What You Need Before Deployment

### 1. **MongoDB Atlas Database** (Required)
You need a cloud MongoDB database. Follow these steps:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account (no credit card needed)
3. Create a **Free M0 Cluster** (512MB)
4. **Database Access** → Add user:
   - Username: `salesautomation`
   - Password: Create a strong password (save it!)
5. **Network Access** → Add IP:
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. **Database** → Connect → "Connect your application"
7. Copy the connection string, it looks like:
   ```
   mongodb+srv://salesautomation:<password>@cluster0.xxxxx.mongodb.net/sales-automation?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password

### 2. **Groq API Key** (Required for AI features)
1. Go to [Groq Console](https://console.groq.com)
2. Sign up for free account
3. Go to API Keys section
4. Click "Create API Key"
5. Copy your API key (starts with `gsk_...`)

### 3. **Facebook Credentials** (Optional - for Messenger integration)
- FB_APP_ID
- FB_APP_SECRET
- FB_WEBHOOK_VERIFY_TOKEN

---

## 🎯 Deployment Steps

### Step 1: Sign Up for Render

1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 2: Create New Blueprint

1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository: `surya9634/Work-Flow-visual`
3. Render will automatically detect the `render.yaml` file
4. Click **"Apply"**

### Step 3: Configure Environment Variables

Render will create two services:
- **sales-automation-backend** (Backend API)
- **sales-automation-frontend** (Frontend Static Site)

#### For Backend Service:

Click on **sales-automation-backend** and add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Auto-set |
| `PORT` | `10000` | Auto-set |
| `MONGODB_URI` | Your MongoDB Atlas connection string | **Required** |
| `JWT_SECRET` | Auto-generated | Auto-set |
| `GROQ_API_KEY` | Your Groq API key (gsk_...) | **Required** |
| `FRONTEND_URL` | `https://sales-automation-frontend.onrender.com` | Update after frontend deploys |
| `FB_APP_ID` | Your Facebook App ID | Optional |
| `FB_APP_SECRET` | Your Facebook App Secret | Optional |
| `FB_WEBHOOK_VERIFY_TOKEN` | Your custom token | Optional |

**Important**: After the frontend deploys, you'll get its URL. Come back and update `FRONTEND_URL` with the actual frontend URL.

#### For Frontend Service:

Click on **sales-automation-frontend** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://sales-automation-backend.onrender.com/api` | Update with actual backend URL |

**Important**: After the backend deploys, you'll get its URL. Update `VITE_API_URL` with the actual backend URL.

### Step 4: Deploy

1. Both services will start deploying automatically
2. **Backend** will take 5-10 minutes
3. **Frontend** will take 3-5 minutes
4. Watch the logs for any errors

### Step 5: Update URLs (Important!)

After both services are deployed:

1. **Get Backend URL**: 
   - Go to backend service
   - Copy the URL (e.g., `https://sales-automation-backend.onrender.com`)

2. **Update Frontend Environment**:
   - Go to frontend service → Environment
   - Update `VITE_API_URL` to: `https://your-backend-url.onrender.com/api`
   - Click "Save Changes"
   - Frontend will redeploy automatically

3. **Update Backend Environment**:
   - Go to backend service → Environment
   - Update `FRONTEND_URL` to: `https://your-frontend-url.onrender.com`
   - Click "Save Changes"
   - Backend will redeploy automatically

### Step 6: Test Your Application

1. Open your frontend URL: `https://sales-automation-frontend.onrender.com`
2. You should see the landing page
3. Try to sign up and create an account
4. Complete the onboarding process
5. Test the dashboard features

---

## 🔧 Troubleshooting

### Backend Won't Start

**Check Logs**:
- Go to backend service → Logs
- Look for error messages

**Common Issues**:
1. **MongoDB Connection Error**:
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
   - Verify database user credentials

2. **Missing Environment Variables**:
   - Ensure all required variables are set
   - `MONGODB_URI` and `GROQ_API_KEY` are mandatory

### Frontend Shows Blank Page

1. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for errors

2. **API Connection Issues**:
   - Verify `VITE_API_URL` is correct
   - Make sure it ends with `/api`
   - Test backend health: `https://your-backend-url.onrender.com/api/health`

3. **CORS Errors**:
   - Verify `FRONTEND_URL` in backend matches your actual frontend URL
   - Check backend logs for CORS errors

### Database Connection Issues

1. **MongoDB Atlas**:
   - Verify IP whitelist includes 0.0.0.0/0
   - Check database user has read/write permissions
   - Test connection string format

2. **Connection String Format**:
   ```
   mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?retryWrites=true&w=majority
   ```
   - No `<` or `>` brackets around password
   - Password should be URL-encoded if it contains special characters

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Frontend:

1. Go to frontend service → Settings
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `app.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update `FRONTEND_URL` in backend environment

### Add Custom Domain to Backend:

1. Go to backend service → Settings
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update `VITE_API_URL` in frontend environment

---

## 📊 Monitoring

### Check Service Health:

**Backend Health Check**:
```
https://your-backend-url.onrender.com/api/health
```
Should return: `{"status":"ok","message":"Server is running"}`

**Database Connection**:
- Check backend logs for "✅ MongoDB Connected"

**Frontend**:
- Open the URL and verify the landing page loads

### View Logs:

1. Go to service → Logs
2. Filter by:
   - All logs
   - Errors only
   - Custom search

---

## 💰 Free Tier Limitations

**Render Free Tier**:
- ✅ 750 hours/month per service
- ✅ Automatic HTTPS
- ✅ Continuous deployment from GitHub
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds

**MongoDB Atlas Free Tier**:
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ No credit card required

**Groq Free Tier**:
- ✅ Generous API limits
- ✅ All models included

---

## 🚀 Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] MongoDB connection working
- [ ] Environment variables configured
- [ ] URLs updated (FRONTEND_URL and VITE_API_URL)
- [ ] Landing page loads
- [ ] User registration works
- [ ] Onboarding flow works
- [ ] Dashboard accessible
- [ ] Leo AI responds (if Groq key added)
- [ ] Facebook integration (if credentials added)

---

## 🔄 Continuous Deployment

**Automatic Deployments**:
- Every push to `main` branch triggers automatic deployment
- Both frontend and backend will redeploy
- Check logs to verify successful deployment

**Manual Deployment**:
1. Go to service
2. Click "Manual Deploy" → "Deploy latest commit"

---

## 📝 Important URLs to Save

After deployment, save these URLs:

```
Frontend URL: https://sales-automation-frontend.onrender.com
Backend URL: https://sales-automation-backend.onrender.com
Backend Health: https://sales-automation-backend.onrender.com/api/health
GitHub Repo: https://github.com/surya9634/Work-Flow-visual
MongoDB Atlas: https://cloud.mongodb.com
Groq Console: https://console.groq.com
```

---

## 🎉 You're Live!

Your AI Sales Automation OS is now deployed and accessible worldwide!

**Share your app**:
- Send the frontend URL to users
- They can sign up and start using it immediately
- All data is stored in MongoDB Atlas
- AI features powered by Groq

---

## 🆘 Need Help?

**Check Logs First**:
- Backend logs show database and API errors
- Frontend logs show build and runtime errors

**Common Commands**:
```bash
# View backend logs
# Go to Render Dashboard → Backend Service → Logs

# View frontend logs
# Go to Render Dashboard → Frontend Service → Logs

# Test backend health
curl https://your-backend-url.onrender.com/api/health
```

**Resources**:
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Groq Documentation](https://console.groq.com/docs)

---

**Built with ❤️ - Now deployed and ready to scale!** 🚀
