# 🗄️ Database Management System (DBMS) - Complete Architecture

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Sales Automation OS                        │
│                     DBMS Architecture                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         MongoDB Database                 │
        │    (NoSQL Document Database)             │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────┐                          ┌──────────────┐
│   Backend    │                          │   Frontend   │
│  (Node.js)   │◄────────────────────────►│   (React)    │
│   Express    │      REST API + Socket   │    Vite      │
└──────────────┘                          └──────────────┘
```

---

## 🏗️ Database Collections Architecture

### **Collection Relationships**

```
┌─────────────┐
│    User     │ (1)
└──────┬──────┘
       │
       │ owns
       │
       ├──────────────────────────────────────────┐
       │                                          │
       ▼ (many)                                   ▼ (many)
┌─────────────┐                          ┌──────────────┐
│  Campaign   │                          │ Integration  │
└──────┬──────┘                          └──────────────┘
       │
       │ generates
       │
       ▼ (many)
┌─────────────┐
│    Chat     │
└──────┬──────┘
       │
       │ tracks
       │
       ▼ (many)
┌─────────────┐
│  Analytics  │
└─────────────┘
```

---

## 📋 Collection Schemas

### 1️⃣ **Users Collection**

**Purpose:** Store user accounts, business information, and authentication data

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: "user" | "admin",
  onboardingCompleted: Boolean,
  
  businessInfo: {
    businessName: String,
    ownerName: String,
    industry: String,
    description: String,
    website: String,
    phone: String,
    documents: [{
      name: String,
      url: String,
      uploadedAt: Date
    }]
  },
  
  integrations: {
    facebook: {
      connected: Boolean,
      pageId: String,
      pageAccessToken: String,
      connectedAt: Date
    },
    instagram: { ... },
    whatsapp: { ... }
  },
  
  globalAI: {
    trained: Boolean,
    lastTrainedAt: Date,
    knowledgeBase: String
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `createdAt` (descending)

**Security:**
- Password hashed with bcrypt (10 rounds)
- JWT token authentication
- Password never returned in API responses

---

### 2️⃣ **Campaigns Collection**

**Purpose:** Store product campaigns and marketing automation settings

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  name: String (required),
  
  product: {
    name: String (required),
    description: String,
    price: Number,
    images: [String],
    features: [String]
  },
  
  targetPlatform: "facebook" | "instagram" | "whatsapp" | "all",
  status: "draft" | "active" | "paused" | "completed",
  
  chatFlow: {
    greeting: String,
    qualificationQuestions: [String],
    objectionHandling: [{
      objection: String,
      response: String
    }],
    closingMessage: String
  },
  
  targetAudience: {
    demographics: {
      ageRange: String,
      location: [String],
      interests: [String]
    },
    persona: String
  },
  
  outreachMessage: String,
  
  stats: {
    messagesSet: Number (default: 0),
    responses: Number (default: 0),
    conversions: Number (default: 0),
    revenue: Number (default: 0)
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` + `status`
- `createdAt` (descending)

**Relationships:**
- Belongs to User (userId)
- Has many Chats
- Has many Analytics

---

### 3️⃣ **Chats Collection**

**Purpose:** Store customer conversations and AI context

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  campaignId: ObjectId (ref: Campaign, required),
  platform: "facebook" | "instagram" | "whatsapp",
  customerId: String (required), // Platform-specific ID
  customerName: String,
  
  customerProfile: {
    profilePic: String,
    email: String,
    phone: String
  },
  
  messages: [{
    sender: "customer" | "ai" | "business",
    content: String,
    timestamp: Date,
    messageType: "text" | "image" | "file" | "quick_reply",
    metadata: Mixed
  }],
  
  status: "active" | "qualified" | "converted" | "closed" | "archived",
  leadScore: Number (0-100),
  
  aiContext: {
    conversationSummary: String,
    customerIntent: String,
    qualificationAnswers: Mixed,
    objections: [String],
    nextAction: String
  },
  
  conversion: {
    converted: Boolean,
    convertedAt: Date,
    orderValue: Number,
    orderDetails: Mixed
  },
  
  lastMessageAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` + `platform` + `customerId` (compound)
- `campaignId` + `status` (compound)
- `lastMessageAt` (descending)

**Relationships:**
- Belongs to User (userId)
- Belongs to Campaign (campaignId)
- Generates Analytics

---

### 4️⃣ **Analytics Collection**

**Purpose:** Track performance metrics and statistics

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  campaignId: ObjectId (ref: Campaign),
  date: Date (required),
  platform: "facebook" | "instagram" | "whatsapp" | "all",
  
  metrics: {
    // Message metrics
    messagesSent: Number,
    messagesReceived: Number,
    responseRate: Number,
    avgResponseTime: Number, // seconds
    
    // Conversation metrics
    conversationsStarted: Number,
    activeConversations: Number,
    conversationsCompleted: Number,
    
    // Lead metrics
    leadsGenerated: Number,
    qualifiedLeads: Number,
    conversions: Number,
    conversionRate: Number,
    
    // Revenue metrics
    revenue: Number,
    avgOrderValue: Number,
    
    // Engagement metrics
    engagementRate: Number,
    bounceRate: Number,
    
    // AI Performance
    aiAccuracy: Number,
    aiHandoffRate: Number
  },
  
  hourlyData: [{
    hour: Number (0-23),
    messages: Number,
    conversations: Number,
    conversions: Number
  }],
  
  createdAt: Date
}
```

**Indexes:**
- `userId` + `date` (descending)
- `campaignId` + `date` (descending)
- `date` + `platform` (compound)

**Relationships:**
- Belongs to User (userId)
- Belongs to Campaign (campaignId)

---

### 5️⃣ **Integrations Collection**

**Purpose:** Store platform connection credentials and settings

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  platform: "facebook" | "instagram" | "whatsapp",
  status: "connected" | "disconnected" | "error" | "pending",
  
  credentials: {
    pageId: String,
    pageAccessToken: String,
    accountId: String,
    phoneNumberId: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Date
  },
  
  platformData: {
    pageName: String,
    pageUsername: String,
    profilePicture: String,
    followersCount: Number,
    category: String
  },
  
  webhookVerified: Boolean,
  lastSync: Date,
  
  errorLog: [{
    error: String,
    timestamp: Date,
    resolved: Boolean
  }],
  
  settings: {
    autoReply: Boolean,
    businessHours: {
      enabled: Boolean,
      timezone: String,
      schedule: Mixed
    },
    notifications: {
      email: Boolean,
      push: Boolean
    }
  },
  
  connectedAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` + `platform` (unique compound)

**Relationships:**
- Belongs to User (userId)

---

## 🔄 Data Flow Architecture

### **User Journey Flow**

```
┌──────────────┐
│ User Signs Up│
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Create User Doc  │ ──► Users Collection
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Complete         │ ──► Update User.businessInfo
│ Onboarding       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Connect Platform │ ──► Create Integration Doc
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Create Campaign  │ ──► Create Campaign Doc
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Customer         │ ──► Create Chat Doc
│ Messages         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Track Analytics  │ ──► Create/Update Analytics Doc
└──────────────────┘
```

### **Message Processing Flow**

```
┌─────────────────┐
│ Customer sends  │
│ message on      │
│ Facebook/IG/WA  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Webhook receives│
│ message         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Find/Create     │ ──► Chats Collection
│ Chat document   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Add message to  │
│ messages array  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Groq AI         │ ──► Uses User.globalAI.knowledgeBase
│ processes       │     + Campaign.chatFlow
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate AI     │
│ response        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Save AI message │ ──► Update Chat.messages
│ Update context  │     Update Chat.aiContext
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send response   │
│ to customer     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Analytics│ ──► Analytics Collection
└─────────────────┘
```

---

## 🛡️ Security Architecture

### **Authentication Flow**

```
┌──────────────┐
│ User Login   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Check email      │ ──► Query Users Collection
│ in database      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Compare password │ ──► bcrypt.compare()
│ with hash        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Generate JWT     │ ──► jwt.sign()
│ token            │     Payload: { userId, email, role }
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Return token     │
│ to client        │
└──────────────────┘
```

### **API Request Flow**

```
┌──────────────────┐
│ Client sends     │
│ API request      │
│ with JWT token   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Middleware       │ ──► Verify JWT token
│ validates token  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Attach user      │ ──► req.user = decoded
│ to request       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Check userId     │ ──► Ensure user can only access
│ ownership        │     their own data
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Process request  │
│ and return data  │
└──────────────────┘
```

---

## 📡 API Endpoints

### **DBMS Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dbms/stats` | Get collection statistics | ✅ |
| GET | `/api/dbms/:collection` | Get all documents from collection | ✅ |
| GET | `/api/dbms/:collection/:id` | Get single document | ✅ |
| DELETE | `/api/dbms/:collection/:id` | Delete document | ✅ |
| POST | `/api/dbms/export` | Bulk export collections | ✅ |
| GET | `/api/dbms/health/check` | Database health check | ✅ |
| POST | `/api/dbms/clear-all` | Clear all user data | ✅ |

### **Collection Access Rules**

```javascript
// Users can only access their own data
Query Filter: { userId: req.user._id }

// Admins can access all data
if (req.user.role === 'admin') {
  Query Filter: {} // No filter
}

// Users collection special rule
if (collection === 'users') {
  Query Filter: { _id: req.user._id } // Only own profile
}
```

---

## 🎨 Frontend DBMS Interface

### **Component Structure**

```
DatabaseManager.jsx
│
├── Header Section
│   ├── Title + Icon
│   └── Description
│
├── Stats Cards (5 cards)
│   ├── Users Card
│   ├── Campaigns Card
│   ├── Chats Card
│   ├── Analytics Card
│   └── Integrations Card
│
├── Controls Bar
│   ├── Search Input
│   ├── Refresh Button
│   └── Export Button
│
├── Data Table
│   ├── Table Header
│   ├── Table Body
│   │   ├── ID Column
│   │   ├── Data Preview Column
│   │   ├── Created Date Column
│   │   └── Actions Column (View, Delete)
│   └── Loading/Empty States
│
└── View Modal
    ├── Modal Header
    ├── JSON Preview
    └── Close Button
```

### **Features**

✅ **Real-time Stats** - Live count of documents in each collection  
✅ **Search** - Filter data across all fields  
✅ **Export** - Download collection data as JSON  
✅ **View** - See full document details in modal  
✅ **Delete** - Remove documents with confirmation  
✅ **Refresh** - Reload data from database  
✅ **Responsive** - Works on mobile, tablet, desktop  
✅ **Glassmorphism UI** - Modern, beautiful design  

---

## 🔧 Database Operations

### **CRUD Operations**

#### **Create (Insert)**
```javascript
// Example: Create new campaign
const campaign = new Campaign({
  userId: req.user._id,
  name: "Summer Sale",
  product: { name: "Product A", price: 99.99 },
  targetPlatform: "facebook",
  status: "draft"
});
await campaign.save();
```

#### **Read (Query)**
```javascript
// Get all user's campaigns
const campaigns = await Campaign.find({ userId: req.user._id })
  .sort({ createdAt: -1 })
  .limit(100);

// Get single campaign
const campaign = await Campaign.findOne({ 
  _id: campaignId, 
  userId: req.user._id 
});
```

#### **Update**
```javascript
// Update campaign status
await Campaign.updateOne(
  { _id: campaignId, userId: req.user._id },
  { $set: { status: "active" } }
);

// Add message to chat
await Chat.updateOne(
  { _id: chatId },
  { $push: { messages: newMessage } }
);
```

#### **Delete**
```javascript
// Delete campaign
await Campaign.deleteOne({ 
  _id: campaignId, 
  userId: req.user._id 
});

// Delete all user data
await Promise.all([
  Campaign.deleteMany({ userId }),
  Chat.deleteMany({ userId }),
  Analytics.deleteMany({ userId }),
  Integration.deleteMany({ userId })
]);
```

---

## 📊 Performance Optimization

### **Indexes Strategy**

```javascript
// Compound indexes for common queries
Chat.index({ userId: 1, platform: 1, customerId: 1 });
Chat.index({ campaignId: 1, status: 1 });
Analytics.index({ userId: 1, date: -1 });

// Single field indexes
User.index({ email: 1 }, { unique: true });
Chat.index({ lastMessageAt: -1 });
```

### **Query Optimization**

```javascript
// ✅ Good - Uses index
await Chat.find({ userId, status: "active" })
  .sort({ lastMessageAt: -1 })
  .limit(50);

// ❌ Bad - Full collection scan
await Chat.find({ "messages.content": /keyword/ });

// ✅ Better - Use text index
Chat.index({ "messages.content": "text" });
await Chat.find({ $text: { $search: "keyword" } });
```

### **Pagination**

```javascript
// Implement pagination for large datasets
const page = 1;
const limit = 50;
const skip = (page - 1) * limit;

const data = await Collection.find(query)
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });

const total = await Collection.countDocuments(query);
const totalPages = Math.ceil(total / limit);
```

---

## 🚀 Scaling Considerations

### **Current Architecture**
- Single MongoDB instance
- Direct database connections
- In-memory session storage

### **Future Scaling Options**

```
┌─────────────────────────────────────────────┐
│           Load Balancer (Nginx)              │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│  Backend 1  │  │  Backend 2  │
└──────┬──────┘  └──────┬──────┘
       │                │
       └────────┬───────┘
                │
                ▼
       ┌─────────────────┐
       │  Redis Cache    │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ MongoDB Cluster │
       │  (Replica Set)  │
       └─────────────────┘
```

### **Recommended Improvements**

1. **Redis Caching**
   - Cache frequently accessed data
   - Session storage
   - Rate limiting

2. **MongoDB Replica Set**
   - High availability
   - Automatic failover
   - Read scaling

3. **Sharding**
   - Horizontal scaling
   - Distribute data across servers
   - Shard key: `userId`

4. **CDN for Assets**
   - Store images/files in S3
   - CloudFront for delivery
   - Reduce database load

---

## 🔍 Monitoring & Maintenance

### **Health Checks**

```javascript
// Database connection status
const health = {
  status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  database: mongoose.connection.name,
  host: mongoose.connection.host,
  collections: await mongoose.connection.db.listCollections().toArray()
};
```

### **Backup Strategy**

```bash
# Daily automated backups
mongodump --uri="mongodb://localhost:27017/sales-automation" --out=/backups/$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/sales-automation" /backups/20250110
```

### **Monitoring Metrics**

- Database size and growth rate
- Query execution times
- Index usage statistics
- Connection pool status
- Error rates and types
- Document counts per collection

---

## 📈 Analytics & Reporting

### **Real-time Metrics**

```javascript
// Dashboard statistics
const stats = {
  totalCampaigns: await Campaign.countDocuments({ userId }),
  activeCampaigns: await Campaign.countDocuments({ userId, status: 'active' }),
  totalChats: await Chat.countDocuments({ userId }),
  conversions: await Chat.countDocuments({ userId, 'conversion.converted': true }),
  revenue: await Chat.aggregate([
    { $match: { userId, 'conversion.converted': true } },
    { $group: { _id: null, total: { $sum: '$conversion.orderValue' } } }
  ])
};
```

### **Time-series Analytics**

```javascript
// Get last 30 days analytics
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const analytics = await Analytics.find({
  userId,
  date: { $gte: thirtyDaysAgo }
}).sort({ date: 1 });
```

---

## 🎯 Best Practices

### **Data Modeling**

✅ **Do:**
- Embed related data that's always accessed together
- Use references for large or frequently updated data
- Index fields used in queries
- Validate data at schema level

❌ **Don't:**
- Store large arrays (>1000 items)
- Create circular references
- Duplicate data unnecessarily
- Ignore index performance

### **Security**

✅ **Do:**
- Hash passwords with bcrypt
- Use JWT for authentication
- Validate all user input
- Implement rate limiting
- Use HTTPS in production
- Store secrets in environment variables

❌ **Don't:**
- Return passwords in API responses
- Trust client-side validation
- Hardcode API keys
- Allow direct database access
- Skip authorization checks

### **Performance**

✅ **Do:**
- Use lean() for read-only queries
- Implement pagination
- Cache frequently accessed data
- Use projection to limit fields
- Monitor slow queries

❌ **Don't:**
- Load entire collections
- Use regex without indexes
- Perform N+1 queries
- Skip error handling
- Ignore memory leaks

---

## 🛠️ Development Tools

### **Useful MongoDB Commands**

```javascript
// Show all databases
show dbs

// Use database
use sales-automation

// Show collections
show collections

// Count documents
db.users.countDocuments()

// Find with pretty print
db.campaigns.find().pretty()

// Explain query plan
db.chats.find({ userId: ObjectId("...") }).explain("executionStats")

// Create index
db.chats.createIndex({ userId: 1, status: 1 })

// Drop collection
db.analytics.drop()
```

### **Testing Queries**

```javascript
// Test in MongoDB Shell or Compass
db.chats.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: { 
      _id: "$status", 
      count: { $sum: 1 } 
  }},
  { $sort: { count: -1 } }
])
```

---

## 📚 Resources

### **Documentation**
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)

### **Tools**
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing
- **MongoDB Atlas** - Cloud database
- **Studio 3T** - Advanced MongoDB IDE

---

## 🎓 Summary

### **Key Features**

✅ 5 Core Collections (Users, Campaigns, Chats, Analytics, Integrations)  
✅ RESTful API with JWT Authentication  
✅ Real-time Updates with Socket.IO  
✅ Visual Database Management Interface  
✅ Export/Import Functionality  
✅ Advanced Search & Filtering  
✅ Performance Optimized Indexes  
✅ Secure Data Access Controls  
✅ Comprehensive Analytics Tracking  
✅ Scalable Architecture  

### **Technology Stack**

- **Database:** MongoDB (NoSQL)
- **ODM:** Mongoose
- **Backend:** Node.js + Express
- **Frontend:** React + Vite
- **Auth:** JWT + bcrypt
- **Real-time:** Socket.IO
- **AI:** Groq SDK
- **Styling:** TailwindCSS

---

**Built with ❤️ for scalable AI-powered sales automation**
