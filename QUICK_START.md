# ⚡ Quick Start Guide

## 🎯 Your Code is on GitHub!

✅ **Repository**: https://github.com/surya9634/Work-Flow-visual

All your code has been pushed and is ready for deployment!

---

## 🚀 Deploy to Render (Recommended)

Follow the complete guide: **RENDER_DEPLOYMENT_GUIDE.md**

**Quick Steps**:
1. Sign up at [Render.com](https://render.com) with GitHub
2. Create New Blueprint
3. Connect repository: `surya9634/Work-Flow-visual`
4. Add environment variables (MongoDB URI, Groq API Key)
5. Deploy!

---

## 💻 Run Locally (Optional)

### Prerequisites:
- Node.js installed
- MongoDB (Atlas or local)
- Groq API key

### Step 1: Install Dependencies

```powershell
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend** - Edit `backend\.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Create `frontend\.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Servers

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 4: Open Browser
```
http://localhost:5173
```

---

## 📋 What's Fixed

✅ Deprecated Mongoose options removed
✅ All code pushed to GitHub
✅ Render deployment configuration ready
✅ Comprehensive documentation included
✅ Environment variable templates provided

---

## 🎯 Next Steps

1. **Deploy to Render** (15 minutes)
   - Follow RENDER_DEPLOYMENT_GUIDE.md
   - Get MongoDB Atlas connection string
   - Get Groq API key
   - Deploy!

2. **Test Your App**
   - Sign up
   - Complete onboarding
   - Create campaigns
   - Test Leo AI

3. **Optional Integrations**
   - Facebook Messenger (for customer automation)
   - Custom domain
   - Analytics tracking

---

## 📚 Documentation Files

- **RENDER_DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **HOW_TO_RUN.md** - Local development setup
- **GROQ_SETUP.md** - AI configuration
- **MONGODB_ATLAS_SETUP.md** - Database setup
- **README.md** - Project overview

---

## 🆘 Need Help?

**For Deployment Issues**:
- Check RENDER_DEPLOYMENT_GUIDE.md
- View Render service logs
- Verify environment variables

**For Local Development**:
- Check HOW_TO_RUN.md
- Ensure MongoDB is running
- Verify .env files are configured

---

**You're ready to deploy! 🚀**
