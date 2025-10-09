# Sales Automation OS - Backend

AI-powered sales automation platform backend with Facebook Messenger integration, Global AI, and real-time analytics.

## Features

- **Authentication & Onboarding**: User registration, login, and business onboarding
- **Campaign Management**: Create and manage product campaigns with AI-powered chat flows
- **Facebook Messenger Integration**: Automated chat handling via webhooks
- **Global AI**: Learns about your business and automates all customer conversations
- **Leo AI Assistant**: Business assistant that helps with platform management
- **Real-time Analytics**: Track messages, conversions, revenue, and AI performance
- **Chat Management**: View and manage all customer conversations
- **Socket.IO**: Real-time updates for new messages and events

## Tech Stack

- **Node.js** + **Express**: Server framework
- **MongoDB** + **Mongoose**: Database
- **OpenAI GPT**: AI conversation generation
- **Socket.IO**: Real-time communication
- **Facebook Graph API**: Messenger integration
- **JWT**: Authentication
- **Multer**: File uploads

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FB_APP_ID`: Facebook App ID
- `FB_APP_SECRET`: Facebook App Secret
- `FB_WEBHOOK_VERIFY_TOKEN`: Custom token for webhook verification
- `OPENAI_API_KEY`: OpenAI API key (optional, has fallback)
- `FRONTEND_URL`: Frontend URL for CORS

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### 4. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## Facebook Messenger Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Business type)
3. Add "Messenger" product
4. Get your App ID and App Secret

### 2. Configure Webhook

1. In Facebook App Dashboard → Messenger → Settings
2. Set Webhook URL: `https://your-domain.com/api/webhooks/facebook`
3. Set Verify Token: Same as `FB_WEBHOOK_VERIFY_TOKEN` in .env
4. Subscribe to: `messages`, `messaging_postbacks`, `messaging_optins`

### 3. Connect Facebook Page

1. In the app, go to Integrations page
2. Click "Connect Facebook Messenger"
3. Select your Facebook page
4. Grant required permissions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Onboarding
- `POST /api/onboarding/complete` - Complete onboarding
- `POST /api/onboarding/upload-document` - Upload business documents
- `GET /api/onboarding/status` - Get onboarding status

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get single campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `PATCH /api/campaigns/:id/status` - Update campaign status

### Integrations
- `GET /api/integrations` - Get all integrations
- `POST /api/integrations/facebook/connect` - Connect Facebook
- `POST /api/integrations/facebook/disconnect` - Disconnect Facebook
- `GET /api/integrations/:platform/status` - Get integration status

### Chats
- `GET /api/chats` - Get all chats
- `GET /api/chats/:id` - Get single chat
- `POST /api/chats/:id/messages` - Send message (manual)
- `PATCH /api/chats/:id/status` - Update chat status
- `POST /api/chats/:id/conversion` - Mark as converted
- `GET /api/chats/stats/overview` - Get chat statistics

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/campaigns` - Get campaign analytics
- `GET /api/analytics/real-time` - Get real-time metrics
- `GET /api/analytics/performance` - Get AI performance
- `GET /api/analytics/hourly` - Get hourly breakdown

### AI
- `POST /api/ai/leo/chat` - Chat with Leo AI
- `GET /api/ai/global/status` - Get Global AI status
- `POST /api/ai/global/retrain` - Retrain Global AI
- `POST /api/ai/analyze-conversation` - Analyze conversation
- `POST /api/ai/generate-response` - Generate AI response

### Webhooks
- `GET /api/webhooks/facebook` - Verify Facebook webhook
- `POST /api/webhooks/facebook` - Receive Facebook events

## Architecture

### Models
- **User**: User accounts with business info and integrations
- **Campaign**: Product campaigns with chat flows
- **Chat**: Customer conversations with messages
- **Analytics**: Daily analytics data
- **Integration**: Platform integration credentials

### Services
- **aiService**: Global AI training and Leo AI responses
- **webhookService**: Handle Facebook webhook events
- **messagingService**: Send messages to platforms

### Middleware
- **auth**: JWT authentication and authorization

## How It Works

1. **Onboarding**: Business signs up and provides business information
2. **Global AI Training**: AI learns about the business and products
3. **Campaign Creation**: Business creates campaigns with products
4. **Integration**: Business connects Facebook Messenger
5. **Automation**: When customers message on Facebook:
   - Webhook receives the message
   - Global AI generates contextual response
   - Response is sent automatically
   - Conversation is tracked and analyzed
   - Analytics are updated in real-time
6. **Leo AI**: Business can ask Leo for insights and help

## Socket.IO Events

### Client → Server
- `join-business` - Join business room for real-time updates

### Server → Client
- `new-message` - New message in a chat
- `chat-status-changed` - Chat status updated
- `analytics-updated` - Analytics data updated

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Campaign.js          # Campaign model
│   ├── Chat.js              # Chat model
│   ├── Analytics.js         # Analytics model
│   └── Integration.js       # Integration model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── onboarding.js        # Onboarding routes
│   ├── campaigns.js         # Campaign routes
│   ├── integrations.js      # Integration routes
│   ├── chats.js             # Chat routes
│   ├── analytics.js         # Analytics routes
│   ├── ai.js                # AI routes
│   └── webhooks.js          # Webhook routes
├── services/
│   ├── aiService.js         # AI logic
│   ├── webhookService.js    # Webhook handling
│   └── messagingService.js  # Message sending
├── uploads/
│   └── documents/           # Uploaded files
├── .env.example             # Environment variables template
├── package.json             # Dependencies
└── server.js                # Main server file
```

## Testing

Test webhook locally using ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 5000

# Use the ngrok URL for Facebook webhook
```

## Production Deployment

1. Set `NODE_ENV=production` in .env
2. Use a production MongoDB instance
3. Set up SSL/HTTPS
4. Use a process manager (PM2):

```bash
npm install -g pm2
pm2 start server.js --name sales-automation
pm2 save
pm2 startup
```

## Support

For issues or questions, please check the documentation or contact support.
