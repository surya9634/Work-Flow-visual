# 🗄️ Database Management System (DBMS) Guide

## 🎯 What is the DBMS?

A built-in **Database Management System** that lets you:
- ✅ View all your data collections
- ✅ Search and filter records
- ✅ Export data to JSON
- ✅ Delete records
- ✅ See real-time statistics
- ✅ Monitor database health

## 📊 How to Access

### Option 1: Via Dashboard
```
Login → Dashboard → Database (in sidebar)
```

### Option 2: Direct URL
```
http://localhost:5173/dashboard/database
```

## 🗂️ Collections You Can Manage

### 1. **Users Collection** 👤
**What it stores**:
- User accounts
- Email addresses
- Business information
- Onboarding data
- Integration credentials
- Global AI knowledge base

**What you see**:
- Email
- Business name
- Onboarding status
- Created date

**Use cases**:
- View your account info
- Check business details
- See integration status

---

### 2. **Campaigns Collection** 🎯
**What it stores**:
- Campaign names
- Product details (name, description, price, features)
- Chat flows (greeting, questions, closing)
- Target platforms
- Campaign status
- Performance stats

**What you see**:
- Campaign name
- Product name and price
- Status (active/paused/draft)
- Stats (messages, conversions, revenue)

**Use cases**:
- View all campaigns
- Check campaign details
- Export campaign data
- Delete old campaigns

---

### 3. **Chats Collection** 💬
**What it stores**:
- Customer conversations
- All messages (customer, AI, business)
- Customer profiles
- Lead scores
- Conversation status
- Conversion data

**What you see**:
- Customer name
- Number of messages
- Conversation status
- Platform (facebook/instagram/whatsapp)

**Use cases**:
- View all conversations
- Search for specific chats
- Export conversation data
- Delete old chats

---

### 4. **Analytics Collection** 📊
**What it stores**:
- Daily metrics
- Message counts
- Conversion rates
- Revenue data
- Hourly breakdowns
- AI performance metrics

**What you see**:
- Date
- Metrics summary
- Conversions
- Revenue

**Use cases**:
- View historical data
- Export analytics
- Track performance over time

---

### 5. **Integrations Collection** 🔌
**What it stores**:
- Platform connections (Facebook, Instagram, WhatsApp)
- Access tokens
- Page/Account IDs
- Connection status
- Platform data (page name, followers, etc.)
- Error logs

**What you see**:
- Platform name
- Connection status
- Connected date

**Use cases**:
- Check integration status
- View platform details
- Monitor connection health

---

## 🎨 DBMS Features

### **Search** 🔍
- Search across all fields in selected collection
- Real-time filtering
- Case-insensitive

### **View** 👁️
- Click eye icon to see full record
- JSON format with all fields
- Easy to read

### **Export** 📥
- Export entire collection to JSON
- Download to your computer
- Timestamped filename
- Use for backups or analysis

### **Delete** 🗑️
- Delete individual records
- Confirmation required
- Cannot delete users (safety)

### **Refresh** 🔄
- Reload data from database
- See latest updates
- Real-time sync

### **Statistics** 📊
- See record count for each collection
- Click collection to view data
- Visual cards with icons

---

## 🚀 How to Use

### 1. Access DBMS
```
Dashboard → Click "Database" in sidebar
```

### 2. Select Collection
```
Click on any collection card:
- 👤 Users
- 🎯 Campaigns
- 💬 Chats
- 📊 Analytics
- 🔌 Integrations
```

### 3. View Data
```
- See all records in table format
- Each row shows key information
- Sorted by newest first
```

### 4. Search
```
- Type in search box
- Searches all fields
- Results filter instantly
```

### 5. View Details
```
- Click eye icon (👁️) on any record
- See full JSON data
- All fields visible
```

### 6. Export Data
```
- Click "Export" button
- Downloads JSON file
- Filename: collection_timestamp.json
```

### 7. Delete Record
```
- Click trash icon (🗑️)
- Confirm deletion
- Record removed from database
```

---

## 📊 Example Use Cases

### **Track Your Growth**
```
1. Go to Analytics collection
2. Export data
3. Analyze trends in Excel/Google Sheets
4. Make data-driven decisions
```

### **Audit Conversations**
```
1. Go to Chats collection
2. Search for customer name
3. View full conversation
4. Export for records
```

### **Manage Campaigns**
```
1. Go to Campaigns collection
2. See all campaigns
3. Check performance stats
4. Delete underperforming campaigns
```

### **Monitor Integrations**
```
1. Go to Integrations collection
2. Check connection status
3. View error logs
4. Verify credentials
```

---

## 🔒 Security Features

### **User Isolation**
- You only see YOUR data
- Cannot access other users' data
- Filtered by userId automatically

### **Admin Access**
- Admins can see all data
- Regular users see only their data
- Role-based access control

### **Password Protection**
- Passwords never displayed
- Automatically filtered out
- Secure storage

### **Safe Deletion**
- Cannot delete user accounts via DBMS
- Confirmation required
- Only your data can be deleted

---

## 🎯 API Endpoints

### Get Collection Stats
```
GET /api/dbms/stats
```

### Get Collection Data
```
GET /api/dbms/:collection?limit=100&skip=0
```

### Get Single Document
```
GET /api/dbms/:collection/:id
```

### Delete Document
```
DELETE /api/dbms/:collection/:id
```

### Bulk Export
```
POST /api/dbms/export
Body: { collections: ['users', 'campaigns', 'chats'] }
```

### Database Health
```
GET /api/dbms/health/check
```

---

## 💡 Pro Tips

### **Regular Exports**
- Export data weekly for backups
- Keep historical records
- Analyze trends offline

### **Search Effectively**
- Search by customer name
- Search by campaign name
- Search by date
- Search by status

### **Monitor Health**
- Check record counts regularly
- Watch for unusual patterns
- Track growth over time

### **Clean Up**
- Delete old test data
- Remove closed conversations
- Archive completed campaigns

---

## 🎨 DBMS Interface

```
┌─────────────────────────────────────────────────┐
│  🗄️ DATABASE MANAGEMENT SYSTEM                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ 👤     │ │ 🎯     │ │ 💬     │ │ 📊     │  │
│  │ Users  │ │Campaigns│ │ Chats  │ │Analytics│  │
│  │   1    │ │   5    │ │  150   │ │   30   │  │
│  └────────┘ └────────┘ └────────┘ └────────┘  │
│                                                  │
│  [🔍 Search...]  [🔄 Refresh]  [📥 Export]     │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │ ID       │ Data          │ Created │ ⚙️ │   │
│  ├─────────────────────────────────────────┤   │
│  │ 507f1f77 │ Campaign 1... │ Oct 9   │👁️🗑️│   │
│  │ 507f1f78 │ Campaign 2... │ Oct 8   │👁️🗑️│   │
│  │ 507f1f79 │ Campaign 3... │ Oct 7   │👁️🗑️│   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Step 1: Start Your App
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Step 2: Login
```
http://localhost:5173
```

### Step 3: Go to Database
```
Dashboard → Database (in sidebar)
```

### Step 4: Explore!
- Click different collections
- Search for data
- View records
- Export data

---

## 🎉 Benefits of Built-in DBMS

### **No External Tools Needed**
- ❌ No need for MongoDB Compass
- ❌ No need for command line
- ❌ No need for database clients
- ✅ Everything in your dashboard!

### **User-Friendly**
- Beautiful UI
- Easy to navigate
- Visual representation
- No technical knowledge needed

### **Secure**
- Only your data
- Protected routes
- Role-based access
- Safe operations

### **Integrated**
- Part of your app
- Same login
- Real-time updates
- Consistent design

---

## 📚 Related Documentation

- **ARCHITECTURE.md** - Database schema details
- **PROJECT_SUMMARY.md** - What's in each collection
- **SETUP_GUIDE.md** - MongoDB setup

---

## 🎊 You Now Have

✅ Complete sales automation platform  
✅ Built-in database management system  
✅ Visual data explorer  
✅ Export capabilities  
✅ Search and filter  
✅ Real-time statistics  

**Manage all your data without leaving your dashboard!** 🚀
