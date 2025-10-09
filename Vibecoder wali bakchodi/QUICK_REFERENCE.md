# 🎯 Quick Reference Card

## 🚀 To Start Your App (3 Commands)

```bash
# Terminal 1 - Backend
cd backend
npm install  # First time only
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install  # First time only
npm run dev

# Open browser
http://localhost:5173
```

## 🔑 Required Environment Variables

### **backend/.env** (MUST HAVE):
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sales-automation
JWT_SECRET=your_secret_key_here
```

### **frontend/.env** (Already Set):
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 What Works Without APIs

✅ Full UI and dashboard  
✅ User accounts  
✅ Campaign creation  
✅ Leo AI (basic)  
✅ All pages  

## 🔌 Optional APIs (For Full Features)

### Facebook Messenger:
```env
FB_APP_ID=123456789
FB_APP_SECRET=abc123def...
FB_WEBHOOK_VERIFY_TOKEN=my_token
```
**Enables**: Real message automation

### OpenAI:
```env
OPENAI_API_KEY=sk-proj-xxx...
```
**Enables**: Smart AI responses

## 📁 Project Structure

```
proto-1-main/
├── backend/          ← API server
│   ├── .env         ← Add MongoDB here!
│   ├── models/      ← Database schemas
│   ├── routes/      ← API endpoints
│   └── services/    ← Business logic
│
├── frontend/        ← React UI
│   ├── .env         ← Already configured
│   └── src/
│       ├── pages/   ← Dashboard pages
│       └── services/← API calls
│
└── Documentation/   ← All guides
```

## 🗄️ Database Collections

1. **users** - Accounts & business info
2. **campaigns** - Product campaigns  
3. **chats** - Conversations
4. **analytics** - Metrics
5. **integrations** - Platform connections

## 🎯 First Steps After Starting

1. **Sign Up** → Create account
2. **Onboarding** → Fill business info
3. **Dashboard** → Explore interface
4. **Create Campaign** → Add product
5. **Chat with Leo** → Test AI
6. **Connect Facebook** → (Optional) Enable automation

## 🔧 Common Commands

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check if frontend is running
# Open: http://localhost:5173

# Restart backend
# Ctrl+C then: npm run dev

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🐛 Quick Fixes

### Backend won't start?
- Check MongoDB connection string
- Verify port 5000 is free
- Check .env file exists

### Frontend won't connect?
- Verify backend is running
- Check VITE_API_URL in .env
- Clear browser cache

### MongoDB error?
- Check connection string format
- Verify IP is whitelisted
- Test connection in MongoDB Compass

## 📞 Where to Get Help

1. **SETUP_INSTRUCTIONS.md** - Detailed setup
2. **QUICK_START.md** - 5-minute guide
3. **FACEBOOK_SETUP.md** - FB integration
4. **CHECKLIST.md** - Step-by-step

## 🎉 Success Indicators

✅ Backend: "MongoDB Connected"  
✅ Frontend: "Local: http://localhost:5173"  
✅ Browser: Landing page loads  
✅ Can sign up and login  
✅ Dashboard displays  

## 💡 Pro Tips

- Start without Facebook first
- Use MongoDB Compass to view data
- Keep both terminals visible
- Test with Leo AI
- Check browser console (F12)

## 🔥 Most Important

**YOU ONLY NEED**:
1. MongoDB connection string
2. Run `npm install` 
3. Run `npm run dev`
4. Open browser

**Everything else is optional!**

---

**Your app is 100% complete and ready!** 🚀
