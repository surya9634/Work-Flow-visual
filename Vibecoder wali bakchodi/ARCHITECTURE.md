# System Architecture

## Overview

This is an AI-powered sales automation platform that uses Global AI to automate customer conversations on social media platforms (starting with Facebook Messenger).

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Landing  │  │Onboarding│  │Dashboard │  │  Leo AI  │       │
│  │   Page   │  │   Flow   │  │  Pages   │  │Assistant │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│         │              │              │              │          │
│         └──────────────┴──────────────┴──────────────┘          │
│                          │                                       │
│                    API Service Layer                             │
│                    Socket.IO Client                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP/WebSocket
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    API Routes                           │    │
│  │  /auth  /onboarding  /campaigns  /chats  /analytics    │    │
│  │  /integrations  /ai  /webhooks                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   Services Layer                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │   AI     │  │ Webhook  │  │Messaging │            │    │
│  │  │ Service  │  │ Service  │  │ Service  │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘            │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Database Models                        │    │
│  │  User  Campaign  Chat  Analytics  Integration          │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                    Socket.IO Server                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      MongoDB Database                            │
│  ┌──────┐  ┌────────┐  ┌──────┐  ┌─────────┐  ┌──────────┐   │
│  │Users │  │Campaigns│  │Chats │  │Analytics│  │Integration│   │
│  └──────┘  └────────┘  └──────┘  └─────────┘  └──────────┘   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    External Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Facebook   │  │    OpenAI    │  │  Instagram   │          │
│  │  Graph API   │  │   GPT API    │  │   (Future)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Onboarding Flow

```
User Signs Up → Onboarding Form → Business Info Collected
                                         ↓
                              Global AI Training Initiated
                                         ↓
                              Knowledge Base Created
                                         ↓
                              User Redirected to Dashboard
```

### 2. Campaign Creation Flow

```
User Creates Campaign → Product Info + Chat Flow Defined
                                    ↓
                        Global AI Knowledge Base Updated
                                    ↓
                        Campaign Status: Draft → Active
                                    ↓
                        Ready to Handle Customer Messages
```

### 3. Facebook Messenger Integration Flow

```
User Connects Facebook → Page ID + Access Token Provided
                                    ↓
                        Verify with Facebook Graph API
                                    ↓
                        Subscribe to Webhook Events
                                    ↓
                        Integration Status: Connected
                                    ↓
                        Ready to Receive Messages
```

### 4. Customer Message Automation Flow

```
Customer Messages on Facebook
         ↓
Facebook Webhook → Backend Receives Event
         ↓
Find/Create Chat Record
         ↓
Extract Customer Message
         ↓
Global AI Generates Response
    (using campaign context + conversation history)
         ↓
Send Response via Facebook API
         ↓
Update Chat Record + Analytics
         ↓
Emit Socket Event to Business Dashboard
         ↓
Business Sees Real-time Update
```

### 5. Analytics Tracking Flow

```
Every Message/Event → Update Analytics Collection
                              ↓
                    Aggregate by Day/Hour/Campaign
                              ↓
                    Calculate Metrics (rates, scores)
                              ↓
                    Store in Database
                              ↓
                    Dashboard Queries Analytics
                              ↓
                    Display Charts and Stats
```

## Component Details

### Backend Services

#### 1. AI Service (`aiService.js`)
- **Purpose**: Manages Global AI and Leo AI
- **Functions**:
  - `trainGlobalAI()`: Creates knowledge base from business info
  - `updateGlobalAIWithCampaign()`: Updates AI with new campaigns
  - `generateAIResponse()`: Generates responses for customers
  - `getLeoAIResponse()`: Powers Leo AI assistant
- **AI Logic**:
  - Uses OpenAI GPT-3.5 for intelligent responses
  - Falls back to rule-based responses if API unavailable
  - Context-aware using conversation history
  - Campaign-specific knowledge

#### 2. Webhook Service (`webhookService.js`)
- **Purpose**: Handles Facebook webhook events
- **Functions**:
  - `handleFacebookWebhook()`: Main webhook handler
  - `handleIncomingMessage()`: Processes customer messages
  - `handlePostback()`: Handles button clicks
  - `calculateLeadScore()`: Scores leads based on conversation
  - `updateAnalytics()`: Tracks metrics
- **Flow**:
  1. Receive webhook event
  2. Find/create chat record
  3. Generate AI response
  4. Send response to customer
  5. Update analytics
  6. Emit real-time update

#### 3. Messaging Service (`messagingService.js`)
- **Purpose**: Sends messages to platforms
- **Functions**:
  - `sendMessage()`: Universal message sender
  - `sendFacebookMessage()`: Facebook-specific
  - `sendQuickReplies()`: Send quick reply buttons
  - `sendTypingIndicator()`: Show typing status

### Database Models

#### 1. User Model
```javascript
{
  email: String,
  password: String (hashed),
  role: String,
  onboardingCompleted: Boolean,
  businessInfo: {
    businessName, ownerName, industry, description,
    website, phone, documents[]
  },
  integrations: {
    facebook: { connected, pageId, pageAccessToken },
    instagram: { ... },
    whatsapp: { ... }
  },
  globalAI: {
    trained: Boolean,
    lastTrainedAt: Date,
    knowledgeBase: String (JSON)
  }
}
```

#### 2. Campaign Model
```javascript
{
  userId: ObjectId,
  name: String,
  product: {
    name, description, price, images[], features[]
  },
  targetPlatform: String,
  status: String (draft/active/paused/completed),
  chatFlow: {
    greeting, qualificationQuestions[], closingMessage
  },
  stats: {
    messagesSet, responses, conversions, revenue
  }
}
```

#### 3. Chat Model
```javascript
{
  userId: ObjectId,
  campaignId: ObjectId,
  platform: String,
  customerId: String,
  customerName: String,
  messages: [{
    sender: String (customer/ai/business),
    content: String,
    timestamp: Date
  }],
  status: String (active/qualified/converted/closed),
  leadScore: Number (0-100),
  conversion: {
    converted: Boolean,
    orderValue: Number
  }
}
```

#### 4. Analytics Model
```javascript
{
  userId: ObjectId,
  campaignId: ObjectId,
  date: Date,
  platform: String,
  metrics: {
    messagesSent, messagesReceived, responseRate,
    conversationsStarted, leadsGenerated,
    conversions, conversionRate, revenue
  },
  hourlyData: [{ hour, messages, conversations, conversions }]
}
```

### Frontend Architecture

#### State Management (Zustand)
- **useUserStore**: User authentication and profile
- **useCampaignStore**: Campaign data
- **useChatStore**: Conversations and messages
- **useAnalyticsStore**: Analytics data
- **useIntegrationStore**: Platform connections
- **useUIStore**: UI state (sidebar, modals)

#### API Service Layer
- Centralized API calls
- Automatic token injection
- Error handling
- Response interceptors

#### Socket.IO Integration
- Real-time message updates
- Live analytics refresh
- Connection management
- Event listeners

## Security

### Authentication
- JWT tokens for API authentication
- Tokens stored in localStorage
- Automatic token refresh
- Protected routes

### Facebook Integration
- Webhook signature verification
- Token validation with Facebook API
- Secure credential storage
- HTTPS required in production

### Data Protection
- Password hashing (bcrypt)
- Environment variable secrets
- Input validation
- SQL injection prevention (MongoDB)

## Scalability Considerations

### Current Architecture
- Single server deployment
- MongoDB for data persistence
- Socket.IO for real-time updates

### Future Scaling Options
1. **Horizontal Scaling**:
   - Load balancer
   - Multiple backend instances
   - Redis for Socket.IO adapter
   - Session store

2. **Database Scaling**:
   - MongoDB sharding
   - Read replicas
   - Caching layer (Redis)

3. **Microservices**:
   - Separate AI service
   - Separate webhook service
   - Message queue (RabbitMQ/Kafka)

## Performance Optimizations

1. **Database Indexing**:
   - User email index
   - Chat queries indexed
   - Analytics date indexes

2. **Caching**:
   - Campaign data caching
   - Analytics aggregation caching
   - AI knowledge base caching

3. **Async Processing**:
   - Webhook processing async
   - Analytics updates async
   - AI training background jobs

## Monitoring & Logging

### Backend Logging
- Console logs for development
- Error tracking
- Webhook event logging
- API request logging

### Frontend Logging
- Error boundaries
- Console errors
- API error tracking

### Metrics to Monitor
- Response times
- Webhook processing time
- AI response generation time
- Database query performance
- Socket.IO connection count
- Active conversations
- Message throughput

## Future Enhancements

1. **Additional Platforms**:
   - Instagram DM automation
   - WhatsApp Business API
   - Telegram integration

2. **Advanced AI Features**:
   - Sentiment analysis
   - Intent classification
   - Multilingual support
   - Voice message handling

3. **Business Features**:
   - Team collaboration
   - Role-based access
   - Custom workflows
   - A/B testing campaigns

4. **Analytics Enhancements**:
   - Predictive analytics
   - Customer segmentation
   - Funnel analysis
   - Export reports

5. **Automation**:
   - Scheduled campaigns
   - Auto-follow-ups
   - Drip campaigns
   - Smart routing
