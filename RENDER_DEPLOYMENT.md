# 🚀 Render Deployment Guide

This guide will help you deploy your AI Sales Automation OS to Render.

## Prerequisites

- GitHub account
- Render account (free tier available at [render.com](https://render.com))
- MongoDB Atlas account (for cloud database)

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"
```

### 1.2 Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Render
5. Get your connection string:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/sales-automation?retryWrites=true&w=majority
   ```

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Blueprint"

2. **Connect Your Repository**
   - Select your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**
   
   For **Backend Service**, add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sales-automation
   JWT_SECRET=your_secure_random_jwt_secret_here
   FRONTEND_URL=https://your-frontend-name.onrender.com
   GROQ_API_KEY=your_groq_api_key (optional)
   FB_APP_ID=your_facebook_app_id (optional)
   FB_APP_SECRET=your_facebook_app_secret (optional)
   FB_WEBHOOK_VERIFY_TOKEN=your_webhook_token (optional)
   ```

   For **Frontend Service**, add:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com/api
   ```

4. **Deploy**
   - Click "Apply" to deploy both services
   - Wait for deployment to complete (5-10 minutes)

### Option B: Manual Deployment

#### Deploy Backend

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `sales-automation-backend`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Runtime**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Plan**: Free

2. **Add Environment Variables** (same as above)

3. **Deploy** - Click "Create Web Service"

#### Deploy Frontend

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `sales-automation-frontend`
     - **Branch**: `main`
     - **Root Directory**: Leave empty
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `./frontend/dist`
     - **Plan**: Free

2. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com/api
   ```

3. **Deploy** - Click "Create Static Site"

## Step 4: Update Environment Variables

After both services are deployed:

1. **Update Backend's FRONTEND_URL**
   - Go to backend service settings
   - Update `FRONTEND_URL` to your frontend URL:
     ```
     https://your-frontend-name.onrender.com
     ```

2. **Update Frontend's VITE_API_URL**
   - Go to frontend service settings
   - Ensure `VITE_API_URL` points to your backend:
     ```
     https://your-backend-name.onrender.com/api
     ```

3. **Trigger Redeploy**
   - Redeploy both services for changes to take effect

## Step 5: Configure Facebook Webhook (Optional)

If using Facebook Messenger integration:

1. Go to your Facebook App settings
2. Update webhook URL to:
   ```
   https://your-backend-name.onrender.com/api/webhooks/facebook
   ```
3. Use your `FB_WEBHOOK_VERIFY_TOKEN` for verification

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- 750 hours/month free (enough for one service 24/7)

### Production Recommendations
1. **Upgrade to Paid Plan** for:
   - No spin-down
   - Better performance
   - Custom domains

2. **Environment Variables Security**
   - Never commit `.env` files
   - Use Render's environment variable management
   - Rotate secrets regularly

3. **Database**
   - Use MongoDB Atlas (included in free tier)
   - Enable backups
   - Monitor usage

### Troubleshooting

**Build Fails**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

**Backend Not Connecting to Database**
- Verify MongoDB Atlas connection string
- Check IP whitelist (should include 0.0.0.0/0)
- Ensure database user has correct permissions

**Frontend Can't Reach Backend**
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running (check logs)

**Socket.IO Issues**
- Verify `FRONTEND_URL` in backend matches frontend URL
- Check WebSocket support in Render (should work by default)

## Monitoring

1. **View Logs**
   - Go to service → "Logs" tab
   - Monitor for errors and performance

2. **Check Health**
   - Backend: `https://your-backend-name.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

3. **Set Up Alerts** (Paid plans)
   - Configure email alerts for downtime
   - Monitor resource usage

## Updating Your App

```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push origin main

# Render will automatically redeploy
```

## Custom Domain (Optional)

1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate is automatically provisioned

## Cost Optimization

**Free Tier Strategy:**
- Deploy backend on Render free tier
- Deploy frontend on Netlify/Vercel (also free)
- Use MongoDB Atlas free tier
- Total cost: $0/month

**Paid Tier (Recommended for Production):**
- Render Starter: $7/month per service
- MongoDB Atlas: $9/month (M2 cluster)
- Total: ~$23/month for production-ready setup

## Support

- Render Docs: [render.com/docs](https://render.com/docs)
- MongoDB Atlas Docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Project Issues: Open an issue on GitHub

---

**Your app will be live at:**
- Frontend: `https://your-frontend-name.onrender.com`
- Backend API: `https://your-backend-name.onrender.com/api`

🎉 **Congratulations! Your AI Sales Automation OS is now live!**
