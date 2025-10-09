# ✅ Setup Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Setup

- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] Code editor ready (VS Code recommended)
- [ ] Terminal/Command Prompt ready

## 🔧 Backend Setup

### Installation
- [ ] Navigate to `backend` folder
- [ ] Run `npm install`
- [ ] Wait for all dependencies to install

### Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `MONGODB_URI` (default: `mongodb://localhost:27017/sales-automation`)
- [ ] Set `JWT_SECRET` (change to something secure)
- [ ] Set `FRONTEND_URL` (default: `http://localhost:5173`)
- [ ] Set `BACKEND_URL` (default: `http://localhost:5000`)

### Optional (for Facebook integration)
- [ ] Set `FB_APP_ID`
- [ ] Set `FB_APP_SECRET`
- [ ] Set `FB_WEBHOOK_VERIFY_TOKEN`
- [ ] Set `OPENAI_API_KEY` (optional, has fallback)

### Start Backend
- [ ] Run `npm run dev`
- [ ] Check for "Server running on port 5000" message
- [ ] Check for "MongoDB Connected" message
- [ ] Test: Open `http://localhost:5000/api/health` in browser
- [ ] Should see: `{"status":"ok","message":"Server is running"}`

## 🎨 Frontend Setup

### Installation
- [ ] Navigate to `frontend` folder
- [ ] Run `npm install`
- [ ] Wait for all dependencies to install

### Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `VITE_API_URL` (default: `http://localhost:5000/api`)

### Start Frontend
- [ ] Run `npm run dev`
- [ ] Check for "Local: http://localhost:5173" message
- [ ] Open `http://localhost:5173` in browser
- [ ] Should see landing page

## 🧪 Test Basic Functionality

### User Registration
- [ ] Click "Get Started" or "Sign Up"
- [ ] Enter email and password
- [ ] Enter business name
- [ ] Click "Create Account"
- [ ] Should redirect to onboarding

### Onboarding
- [ ] Fill in business information:
  - [ ] Business name
  - [ ] Owner name
  - [ ] Industry
  - [ ] Description
  - [ ] Website (optional)
  - [ ] Phone (optional)
- [ ] Click "Complete Onboarding"
- [ ] Should redirect to dashboard

### Dashboard Access
- [ ] Should see dashboard with sidebar
- [ ] Check Overview page loads
- [ ] Check stats cards display (may show 0)
- [ ] Check charts render

### Navigation
- [ ] Click "Chats" - should load chats page
- [ ] Click "Analytics" - should load analytics page
- [ ] Click "Campaigns" - should load campaigns page
- [ ] Click "Integrations" - should load integrations page

### Campaign Creation
- [ ] Go to Campaigns page
- [ ] Click "Create Campaign"
- [ ] Fill in Step 1 (Product Info):
  - [ ] Campaign name
  - [ ] Product name
  - [ ] Description
  - [ ] Price
  - [ ] Features
  - [ ] Target platform
- [ ] Click "Next"
- [ ] Fill in Step 2 (Chat Flow):
  - [ ] Greeting message
  - [ ] Questions
  - [ ] Closing message
- [ ] Click "Next"
- [ ] Fill in Step 3 (Target Audience):
  - [ ] Age range
  - [ ] Locations
  - [ ] Interests
- [ ] Click "Create Campaign"
- [ ] Should see campaign in list

### Leo AI
- [ ] Click Leo AI icon (if visible)
- [ ] Type a message: "Hello"
- [ ] Should get AI response
- [ ] Try: "Show me my analytics"
- [ ] Should get relevant response

## 🔌 Facebook Integration (Optional)

### Facebook App Setup
- [ ] Go to [developers.facebook.com](https://developers.facebook.com)
- [ ] Create new app (Business type)
- [ ] Add Messenger product
- [ ] Get Page Access Token
- [ ] Get Page ID
- [ ] Note both values

### Connect in App
- [ ] Go to Integrations page
- [ ] Click "Connect" on Facebook Messenger
- [ ] Enter Page ID
- [ ] Enter Page Access Token
- [ ] Click "Connect"
- [ ] Should see "Connected" status

### Webhook Setup (for real messages)
- [ ] Install ngrok: `npm install -g ngrok`
- [ ] Run: `ngrok http 5000`
- [ ] Copy ngrok URL (e.g., `https://abc123.ngrok.io`)
- [ ] In Facebook App → Messenger → Webhooks:
  - [ ] Callback URL: `<ngrok-url>/api/webhooks/facebook`
  - [ ] Verify Token: Same as in `.env`
  - [ ] Subscribe to: messages, messaging_postbacks
- [ ] Click "Verify and Save"
- [ ] Should see "Verified" status

### Test Real Messages
- [ ] Make sure campaign is "Active"
- [ ] Send message to your Facebook page
- [ ] Check backend console for webhook event
- [ ] Should see AI response sent
- [ ] Check Chats page for new conversation
- [ ] Should see message and AI response

## 🐛 Troubleshooting

### Backend Issues
- [ ] MongoDB running? Check with `mongosh` or MongoDB Compass
- [ ] Port 5000 available? Check with `netstat -ano | findstr :5000`
- [ ] .env file exists in backend folder?
- [ ] All required env variables set?

### Frontend Issues
- [ ] Backend running on port 5000?
- [ ] VITE_API_URL correct in frontend/.env?
- [ ] Browser console shows errors? (F12)
- [ ] Try clearing browser cache

### Connection Issues
- [ ] Backend health endpoint working? `http://localhost:5000/api/health`
- [ ] CORS errors? Check FRONTEND_URL in backend/.env
- [ ] Network tab shows 404? Check API_URL

### Facebook Issues
- [ ] Webhook URL accessible? (must be HTTPS for production)
- [ ] Verify token matches in Facebook and .env?
- [ ] Page Access Token valid?
- [ ] App in Development Mode? (may need to add test users)

## ✅ Success Criteria

You're all set when:
- [ ] Backend running without errors
- [ ] Frontend loads at localhost:5173
- [ ] Can register and login
- [ ] Can complete onboarding
- [ ] Dashboard displays correctly
- [ ] Can create campaigns
- [ ] Can navigate all pages
- [ ] Leo AI responds to messages
- [ ] (Optional) Facebook connected
- [ ] (Optional) Receiving real messages

## 🎉 Next Steps After Setup

1. **Create Multiple Campaigns**
   - Add different products
   - Test different chat flows
   - Try different platforms

2. **Customize Chat Flows**
   - Write engaging greetings
   - Add qualification questions
   - Create compelling closing messages

3. **Monitor Analytics**
   - Check real-time stats
   - Review campaign performance
   - Track conversion rates

4. **Test with Real Customers**
   - Connect Facebook page
   - Let AI handle conversations
   - Monitor chat quality

5. **Optimize Performance**
   - Review AI responses
   - Adjust chat flows
   - Improve lead scoring

## 📚 Resources

- **Quick Start**: `QUICK_START.md`
- **Full Setup**: `SETUP_GUIDE.md`
- **Architecture**: `ARCHITECTURE.md`
- **API Docs**: `backend/README.md`
- **Summary**: `PROJECT_SUMMARY.md`

## 🆘 Still Having Issues?

1. Check all checkboxes above
2. Review error messages in:
   - Backend terminal
   - Frontend terminal
   - Browser console (F12)
3. Verify all environment variables
4. Restart both servers
5. Check MongoDB is running
6. Try the troubleshooting section

## 💡 Pro Tips

- Use MongoDB Compass to view database
- Use Postman to test API endpoints
- Check backend logs for webhook events
- Use browser DevTools Network tab
- Keep both terminals visible
- Test with incognito mode for fresh state

---

**Once all checkboxes are complete, you're ready to automate sales! 🚀**
