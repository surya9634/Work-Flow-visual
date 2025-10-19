# 🚀 DBMS Quick Reference Guide

## 📋 Table of Contents
- [Collections Overview](#collections-overview)
- [API Endpoints](#api-endpoints)
- [Common Queries](#common-queries)
- [Data Models](#data-models)
- [Security Rules](#security-rules)
- [Performance Tips](#performance-tips)

---

## 📊 Collections Overview

| Collection | Purpose | Count Endpoint | Key Fields |
|------------|---------|----------------|------------|
| **Users** | User accounts & business info | `/api/dbms/stats` | email, businessInfo, role |
| **Campaigns** | Product campaigns | `/api/dbms/stats` | name, product, status |
| **Chats** | Customer conversations | `/api/dbms/stats` | messages, status, leadScore |
| **Analytics** | Performance metrics | `/api/dbms/stats` | date, metrics, platform |
| **Integrations** | Platform connections | `/api/dbms/stats` | platform, status, credentials |

---

## 🔌 API Endpoints

### **DBMS Routes** (`/api/dbms`)

```javascript
// Get collection statistics
GET /api/dbms/stats
Response: { users: 1, campaigns: 5, chats: 23, analytics: 30, integrations: 2 }

// Get all documents from a collection
GET /api/dbms/:collection?limit=100&skip=0
Example: GET /api/dbms/campaigns?limit=50
Response: [{ _id, name, product, ... }, ...]

// Get single document
GET /api/dbms/:collection/:id
Example: GET /api/dbms/campaigns/507f1f77bcf86cd799439011
Response: { _id, name, product, ... }

// Delete document
DELETE /api/dbms/:collection/:id
Example: DELETE /api/dbms/campaigns/507f1f77bcf86cd799439011
Response: { message: "Record deleted successfully" }

// Bulk export
POST /api/dbms/export
Body: { collections: ["campaigns", "chats"] }
Response: { campaigns: [...], chats: [...] }

// Database health check
GET /api/dbms/health/check
Response: { status: "connected", database: "sales-automation", ... }

// Clear all user data (requires confirmation)
POST /api/dbms/clear-all
Body: { confirmation: "DELETE_ALL_MY_DATA" }
Response: { message: "All data cleared successfully" }
```

### **Authentication Required**
All DBMS endpoints require JWT token in header:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

---

## 🔍 Common Queries

### **JavaScript/Node.js Examples**

```javascript
// 1. Get all active campaigns
const campaigns = await Campaign.find({ 
  userId: req.user._id, 
  status: 'active' 
}).sort({ createdAt: -1 });

// 2. Get recent chats with high lead scores
const hotLeads = await Chat.find({ 
  userId: req.user._id,
  leadScore: { $gte: 70 },
  status: 'qualified'
}).sort({ lastMessageAt: -1 }).limit(10);

// 3. Get today's analytics
const today = new Date();
today.setHours(0, 0, 0, 0);
const analytics = await Analytics.findOne({ 
  userId: req.user._id,
  date: today 
});

// 4. Count conversions this month
const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const conversions = await Chat.countDocuments({
  userId: req.user._id,
  'conversion.converted': true,
  'conversion.convertedAt': { $gte: startOfMonth }
});

// 5. Get total revenue
const revenue = await Chat.aggregate([
  { $match: { 
      userId: mongoose.Types.ObjectId(req.user._id),
      'conversion.converted': true 
  }},
  { $group: { 
      _id: null, 
      total: { $sum: '$conversion.orderValue' } 
  }}
]);

// 6. Get connected integrations
const integrations = await Integration.find({ 
  userId: req.user._id,
  status: 'connected' 
});

// 7. Search chats by customer name
const results = await Chat.find({ 
  userId: req.user._id,
  customerName: { $regex: 'John', $options: 'i' }
});

// 8. Get campaign performance
const campaignStats = await Chat.aggregate([
  { $match: { userId: mongoose.Types.ObjectId(req.user._id) }},
  { $group: {
      _id: '$campaignId',
      totalChats: { $sum: 1 },
      conversions: { 
        $sum: { $cond: ['$conversion.converted', 1, 0] } 
      },
      revenue: { $sum: '$conversion.orderValue' }
  }},
  { $lookup: {
      from: 'campaigns',
      localField: '_id',
      foreignField: '_id',
      as: 'campaign'
  }}
]);

// 9. Update chat status
await Chat.updateOne(
  { _id: chatId, userId: req.user._id },
  { $set: { status: 'converted' } }
);

// 10. Add message to chat
await Chat.updateOne(
  { _id: chatId },
  { $push: { 
      messages: {
        sender: 'ai',
        content: 'Hello! How can I help?',
        timestamp: new Date(),
        messageType: 'text'
      }
  }}
);
```

---

## 📐 Data Models

### **User Model**
```javascript
{
  email: "user@example.com",
  password: "$2a$10$...", // hashed
  role: "user",
  onboardingCompleted: true,
  businessInfo: {
    businessName: "My Business",
    ownerName: "John Doe",
    industry: "E-commerce",
    description: "We sell products",
    website: "https://example.com",
    phone: "+1234567890"
  },
  globalAI: {
    trained: true,
    lastTrainedAt: "2025-01-10T10:00:00.000Z",
    knowledgeBase: "Business context..."
  }
}
```

### **Campaign Model**
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  name: "Summer Sale 2025",
  product: {
    name: "Premium Widget",
    description: "Best widget ever",
    price: 99.99,
    images: ["https://..."],
    features: ["Feature 1", "Feature 2"]
  },
  targetPlatform: "facebook",
  status: "active",
  chatFlow: {
    greeting: "Hi! Welcome to our store!",
    qualificationQuestions: [
      "What's your budget?",
      "When do you need it?"
    ],
    objectionHandling: [
      { objection: "too expensive", response: "We offer payment plans" }
    ],
    closingMessage: "Ready to order?"
  },
  stats: {
    messagesSet: 100,
    responses: 75,
    conversions: 15,
    revenue: 1499.85
  }
}
```

### **Chat Model**
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  campaignId: "507f1f77bcf86cd799439012",
  platform: "facebook",
  customerId: "FB_PSID_123456",
  customerName: "Jane Smith",
  messages: [
    {
      sender: "customer",
      content: "Hi, I'm interested",
      timestamp: "2025-01-10T10:00:00.000Z",
      messageType: "text"
    },
    {
      sender: "ai",
      content: "Great! What's your budget?",
      timestamp: "2025-01-10T10:00:05.000Z",
      messageType: "text"
    }
  ],
  status: "qualified",
  leadScore: 85,
  aiContext: {
    conversationSummary: "Customer interested in premium widget",
    customerIntent: "purchase",
    nextAction: "send_pricing"
  },
  conversion: {
    converted: true,
    convertedAt: "2025-01-10T10:30:00.000Z",
    orderValue: 99.99
  }
}
```

### **Analytics Model**
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  campaignId: "507f1f77bcf86cd799439012",
  date: "2025-01-10T00:00:00.000Z",
  platform: "facebook",
  metrics: {
    messagesSent: 150,
    messagesReceived: 120,
    responseRate: 80,
    avgResponseTime: 45,
    conversationsStarted: 50,
    activeConversations: 30,
    conversationsCompleted: 20,
    leadsGenerated: 40,
    qualifiedLeads: 25,
    conversions: 10,
    conversionRate: 25,
    revenue: 999.90,
    avgOrderValue: 99.99,
    engagementRate: 75,
    bounceRate: 10,
    aiAccuracy: 92,
    aiHandoffRate: 5
  },
  hourlyData: [
    { hour: 9, messages: 10, conversations: 5, conversions: 1 },
    { hour: 10, messages: 15, conversations: 8, conversions: 2 }
  ]
}
```

### **Integration Model**
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  platform: "facebook",
  status: "connected",
  credentials: {
    pageId: "123456789",
    pageAccessToken: "EAAxxxxx...",
    expiresAt: "2025-12-31T23:59:59.000Z"
  },
  platformData: {
    pageName: "My Business Page",
    pageUsername: "mybusiness",
    profilePicture: "https://...",
    followersCount: 5000,
    category: "E-commerce"
  },
  webhookVerified: true,
  lastSync: "2025-01-10T10:00:00.000Z",
  settings: {
    autoReply: true,
    businessHours: {
      enabled: true,
      timezone: "America/New_York",
      schedule: {
        monday: { start: "09:00", end: "17:00" }
      }
    }
  }
}
```

---

## 🔒 Security Rules

### **Access Control**

| Collection | User Access | Admin Access |
|------------|-------------|--------------|
| Users | Own profile only | All users |
| Campaigns | Own campaigns only | All campaigns |
| Chats | Own chats only | All chats |
| Analytics | Own analytics only | All analytics |
| Integrations | Own integrations only | All integrations |

### **Query Filters**

```javascript
// Regular user - always filter by userId
const query = { userId: req.user._id };

// Admin - can access all data
const query = req.user.role === 'admin' ? {} : { userId: req.user._id };

// Users collection - special case
if (collection === 'users') {
  query = req.user.role === 'admin' ? {} : { _id: req.user._id };
}
```

### **Protected Fields**

```javascript
// Never return password
.select('-password')

// Never expose sensitive credentials
.select('-credentials.pageAccessToken -credentials.accessToken')
```

### **Validation Rules**

```javascript
// Email must be unique and valid
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

// Enum validation
status: {
  type: String,
  enum: ['draft', 'active', 'paused', 'completed'],
  default: 'draft'
}

// Number range validation
leadScore: {
  type: Number,
  min: 0,
  max: 100,
  default: 0
}
```

---

## ⚡ Performance Tips

### **1. Use Indexes**

```javascript
// Create compound index for common queries
db.chats.createIndex({ userId: 1, status: 1 })
db.analytics.createIndex({ userId: 1, date: -1 })

// Check if query uses index
db.chats.find({ userId: "..." }).explain("executionStats")
```

### **2. Limit Results**

```javascript
// ❌ Bad - loads all documents
const chats = await Chat.find({ userId });

// ✅ Good - limits results
const chats = await Chat.find({ userId }).limit(50);

// ✅ Better - with pagination
const chats = await Chat.find({ userId })
  .skip((page - 1) * limit)
  .limit(limit);
```

### **3. Select Only Needed Fields**

```javascript
// ❌ Bad - returns all fields
const users = await User.find({});

// ✅ Good - returns only needed fields
const users = await User.find({}).select('email businessInfo.businessName');
```

### **4. Use Lean Queries**

```javascript
// ❌ Bad - returns Mongoose documents (slower)
const campaigns = await Campaign.find({ userId });

// ✅ Good - returns plain JavaScript objects (faster)
const campaigns = await Campaign.find({ userId }).lean();
```

### **5. Batch Operations**

```javascript
// ❌ Bad - multiple database calls
for (const id of chatIds) {
  await Chat.updateOne({ _id: id }, { status: 'archived' });
}

// ✅ Good - single database call
await Chat.updateMany(
  { _id: { $in: chatIds } },
  { status: 'archived' }
);
```

### **6. Aggregation for Complex Queries**

```javascript
// ❌ Bad - multiple queries + processing in code
const campaigns = await Campaign.find({ userId });
for (const campaign of campaigns) {
  const chats = await Chat.find({ campaignId: campaign._id });
  campaign.chatCount = chats.length;
}

// ✅ Good - single aggregation query
const campaigns = await Campaign.aggregate([
  { $match: { userId: mongoose.Types.ObjectId(userId) }},
  { $lookup: {
      from: 'chats',
      localField: '_id',
      foreignField: 'campaignId',
      as: 'chats'
  }},
  { $addFields: { chatCount: { $size: '$chats' } }},
  { $project: { chats: 0 } }
]);
```

### **7. Cache Frequently Accessed Data**

```javascript
// Use Redis or in-memory cache for stats
const cacheKey = `stats:${userId}`;
let stats = await redis.get(cacheKey);

if (!stats) {
  stats = await calculateStats(userId);
  await redis.set(cacheKey, JSON.stringify(stats), 'EX', 300); // 5 min
}
```

---

## 🛠️ Useful Commands

### **MongoDB Shell**

```javascript
// Connect to database
mongo mongodb://localhost:27017/sales-automation

// Show all collections
show collections

// Count documents
db.users.countDocuments()
db.campaigns.countDocuments({ status: 'active' })

// Find documents
db.chats.find({ userId: ObjectId("...") }).pretty()

// Update document
db.campaigns.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: 'active' } }
)

// Delete document
db.chats.deleteOne({ _id: ObjectId("...") })

// Create index
db.chats.createIndex({ userId: 1, platform: 1, customerId: 1 })

// List indexes
db.chats.getIndexes()

// Drop index
db.chats.dropIndex("userId_1_platform_1_customerId_1")

// Explain query
db.chats.find({ userId: ObjectId("...") }).explain("executionStats")

// Aggregate example
db.chats.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Backup database
mongodump --db sales-automation --out /backup

// Restore database
mongorestore --db sales-automation /backup/sales-automation
```

### **Mongoose Commands**

```javascript
// Find with populate
const chats = await Chat.find({ userId })
  .populate('campaignId', 'name product')
  .populate('userId', 'email businessInfo.businessName');

// Find one or create
let chat = await Chat.findOne({ userId, customerId });
if (!chat) {
  chat = await Chat.create({ userId, customerId, messages: [] });
}

// Update or create (upsert)
await Analytics.updateOne(
  { userId, date: today },
  { $inc: { 'metrics.messagesSent': 1 } },
  { upsert: true }
);

// Bulk write operations
await Chat.bulkWrite([
  { updateOne: { filter: { _id: id1 }, update: { status: 'archived' } }},
  { updateOne: { filter: { _id: id2 }, update: { status: 'archived' } }},
  { deleteOne: { filter: { _id: id3 } }}
]);

// Transaction example
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Campaign.updateOne({ _id: campaignId }, { status: 'completed' }, { session });
  await Chat.updateMany({ campaignId }, { status: 'archived' }, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## 📊 Frontend Usage

### **Fetch Data**

```javascript
// Get collection stats
const response = await axios.get(`${API_URL}/dbms/stats`, {
  headers: { Authorization: `Bearer ${token}` }
});
const stats = response.data;

// Get collection data
const response = await axios.get(`${API_URL}/dbms/campaigns?limit=50`, {
  headers: { Authorization: `Bearer ${token}` }
});
const campaigns = response.data;

// Get single document
const response = await axios.get(`${API_URL}/dbms/campaigns/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});
const campaign = response.data;
```

### **Delete Data**

```javascript
const handleDelete = async (id) => {
  if (!confirm('Are you sure?')) return;
  
  try {
    await axios.delete(`${API_URL}/dbms/campaigns/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Deleted successfully');
    fetchData(); // Refresh
  } catch (error) {
    toast.error('Failed to delete');
  }
};
```

### **Export Data**

```javascript
const handleExport = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/dbms/export`,
      { collections: ['campaigns', 'chats'] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${new Date().toISOString()}.json`;
    a.click();
  } catch (error) {
    toast.error('Export failed');
  }
};
```

---

## 🎯 Common Use Cases

### **1. Dashboard Stats**

```javascript
const stats = {
  totalCampaigns: await Campaign.countDocuments({ userId }),
  activeCampaigns: await Campaign.countDocuments({ userId, status: 'active' }),
  totalChats: await Chat.countDocuments({ userId }),
  activeChats: await Chat.countDocuments({ userId, status: 'active' }),
  conversions: await Chat.countDocuments({ userId, 'conversion.converted': true }),
  totalRevenue: (await Chat.aggregate([
    { $match: { userId, 'conversion.converted': true } },
    { $group: { _id: null, total: { $sum: '$conversion.orderValue' } } }
  ]))[0]?.total || 0
};
```

### **2. Recent Activity**

```javascript
const recentChats = await Chat.find({ userId })
  .sort({ lastMessageAt: -1 })
  .limit(10)
  .populate('campaignId', 'name');
```

### **3. Performance Analytics**

```javascript
const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const analytics = await Analytics.find({
  userId,
  date: { $gte: last7Days }
}).sort({ date: 1 });
```

### **4. Lead Management**

```javascript
// Get hot leads
const hotLeads = await Chat.find({
  userId,
  leadScore: { $gte: 70 },
  status: { $in: ['active', 'qualified'] }
}).sort({ leadScore: -1 });

// Get stale conversations
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
const staleChats = await Chat.find({
  userId,
  status: 'active',
  lastMessageAt: { $lt: threeDaysAgo }
});
```

### **5. Campaign Performance**

```javascript
const performance = await Chat.aggregate([
  { $match: { userId: mongoose.Types.ObjectId(userId) }},
  { $group: {
      _id: '$campaignId',
      totalChats: { $sum: 1 },
      conversions: { $sum: { $cond: ['$conversion.converted', 1, 0] } },
      revenue: { $sum: '$conversion.orderValue' },
      avgLeadScore: { $avg: '$leadScore' }
  }},
  { $lookup: {
      from: 'campaigns',
      localField: '_id',
      foreignField: '_id',
      as: 'campaign'
  }},
  { $unwind: '$campaign' },
  { $project: {
      campaignName: '$campaign.name',
      totalChats: 1,
      conversions: 1,
      revenue: 1,
      avgLeadScore: 1,
      conversionRate: { 
        $multiply: [{ $divide: ['$conversions', '$totalChats'] }, 100] 
      }
  }}
]);
```

---

## 🔗 Quick Links

- **Full Architecture:** [DBMS_ARCHITECTURE.md](./DBMS_ARCHITECTURE.md)
- **Visual Diagrams:** [DBMS_DIAGRAMS.md](./DBMS_DIAGRAMS.md)
- **Groq AI Setup:** [GROQ_SETUP.md](./GROQ_SETUP.md)
- **Main README:** [README.md](./README.md)

---

**Happy coding! 🚀**
