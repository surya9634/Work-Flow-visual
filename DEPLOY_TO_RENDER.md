# Deploy to Render - Quick Guide

## Prerequisites
1. GitHub Account - Sign up at github.com
2. Render Account - Sign up at render.com
3. MongoDB Atlas - Sign up at mongodb.com/cloud/atlas

## Step 1: Set Up MongoDB Atlas

1. Go to MongoDB Atlas and create FREE account
2. Create FREE M0 Cluster
3. Create Database User:
   - Username: salesautomation
   - Password: (create strong password and save it)
4. Allow Network Access:
   - Add IP Address: 0.0.0.0/0 (Allow from anywhere)
5. Get Connection String:
   - Click Connect on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace password placeholder with your actual password
   - Add database name: mongodb+srv://salesautomation:PASSWORD@cluster0.xxxxx.mongodb.net/sales-automation?retryWrites=true&w=majority

SAVE THIS CONNECTION STRING!

## Step 2: Push Code to GitHub

Navigate to your project folder and run:

```powershell
cd c:\Users\ssrss\Downloads\workflow-frontend-proto1\proto-1-main
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Replace YOUR_USERNAME and YOUR_REPO with your GitHub info.

## Step 3: Deploy to Render

1. Go to dashboard.render.com
2. Click "New +" then "Blueprint"
3. Connect your GitHub repository
4. Render will detect render.yaml file
5. You'll see 2 services:
   - sales-automation-backend
   - sales-automation-frontend

6. Configure Backend Environment Variables:
   - MONGODB_URI: Your MongoDB connection string from Step 1
   - FRONTEND_URL: Leave empty for now
   - GROQ_API_KEY: Optional (get from console.groq.com)

7. Configure Frontend Environment Variables:
   - VITE_API_URL: Leave empty for now

8. Click "Apply" to deploy

9. Wait 5-10 minutes for deployment

10. After deployment, update environment variables:
    
    Backend FRONTEND_URL:
    https://sales-automation-frontend.onrender.com
    
    Frontend VITE_API_URL:
    https://sales-automation-backend.onrender.com/api

11. Both services will auto-redeploy

12. Access your app at:
    https://sales-automation-frontend.onrender.com

## Important Notes

Free Tier:
- Services spin down after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Perfect for testing

For Production:
- Upgrade to paid plan (7 dollars per month per service)
- No spin-down, better performance

## Troubleshooting

If deployment fails:
- Check Logs tab in Render dashboard
- Verify MongoDB connection string is correct
- Ensure environment variables are set correctly
- Make sure GitHub repo is public

## Get Groq API Key (Optional)

1. Go to console.groq.com
2. Sign up for free
3. Create API key
4. Add to Render environment variables

This enables AI features in your app.
