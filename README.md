# 🤖 AI Sales Automation OS

A complete AI-powered sales automation platform with Facebook Messenger integration, real-time analytics, and built-in database management system.

## 🚀 Features

- **AI Chat Automation** - Automatic responses to customer messages
- **Campaign Management** - Create and manage product campaigns
- **Facebook Messenger Integration** - Connect and automate Facebook messages
- **Real-time Analytics** - Track performance with beautiful charts
- **Lead Scoring** - Automatic lead qualification
- **Built-in DBMS** - Visual database management
- **Leo AI Assistant** - Built-in AI helper
- **Socket.IO Real-time Updates** - Live message notifications

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- OpenAI GPT API
- Facebook Graph API
- JWT Authentication

### Frontend
- React + Vite
- TailwindCSS
- Zustand (State Management)
- Chart.js
- Framer Motion
- Lucide Icons

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd proto-1-main
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

4. **Configure Environment Variables**

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sales-automation
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Optional - Facebook Integration
FB_APP_ID=your_facebook_app_id
FB_APP_SECRET=your_facebook_app_secret
FB_WEBHOOK_VERIFY_TOKEN=your_verify_token

# Optional - OpenAI
OPENAI_API_KEY=sk-your-openai-key
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start the Application**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

6. **Open Browser**
```
http://localhost:5173
```

## 📊 Project Structure

```
proto-1-main/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   └── store/       # State management
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Chats
- `GET /api/chats` - Get all conversations
- `POST /api/chats/:id/messages` - Send message
- `PATCH /api/chats/:id/status` - Update chat status

### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/real-time` - Real-time stats

### Integrations
- `POST /api/integrations/facebook/connect` - Connect Facebook
- `POST /api/integrations/facebook/disconnect` - Disconnect Facebook

### DBMS
- `GET /api/dbms/stats` - Database statistics
- `GET /api/dbms/:collection` - Get collection data

## 🔌 Integrations

### Facebook Messenger
1. Create Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Add Messenger product
3. Get Page Access Token
4. Configure webhook
5. Add credentials to `.env`

### OpenAI (Optional)
1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add to `.env`
3. Enables intelligent AI responses

## 🗄️ Database Collections

- **users** - User accounts and business info
- **campaigns** - Product campaigns
- **chats** - Customer conversations
- **analytics** - Performance metrics
- **integrations** - Platform connections

## 🎨 Features Overview

### Dashboard Pages
- **Overview** - Real-time statistics
- **Chats** - Conversation management
- **Analytics** - Performance charts
- **Campaigns** - Campaign management
- **Integrations** - Platform connections
- **Database** - Built-in DBMS

### AI Features
- **Global AI** - Learns from your business
- **Leo AI** - Built-in assistant
- **Auto-responses** - Automatic customer replies
- **Lead Scoring** - Automatic qualification

## 🔒 Security

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Environment variables for secrets
- CORS configuration
- Input validation

## 📱 Responsive Design

- Mobile-friendly interface
- Tablet optimized
- Desktop full experience
- Modern glassmorphism UI

## 🚀 Deployment

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Deploy backend
3. Update `BACKEND_URL`

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Update `VITE_API_URL`

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update `MONGODB_URI`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- OpenAI for GPT API
- Facebook for Graph API
- All open-source libraries used

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for businesses that want to scale with AI**
