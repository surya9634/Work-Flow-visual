# 🌐 MongoDB Atlas Setup Guide (Free Cloud Database)

No need to install MongoDB locally! Use MongoDB Atlas for a free, public cloud database.

---

## 📋 Step-by-Step Setup

### **1. Create Account**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email (no credit card required)
3. Complete email verification

---

### **2. Create Free Cluster**
1. Click **"Build a Database"** or **"Create"**
2. Choose **"M0 FREE"** tier (512MB storage)
3. Select a cloud provider (AWS/Google/Azure - any is fine)
4. Choose a region close to you
5. Cluster Name: `Cluster0` (default is fine)
6. Click **"Create Cluster"** (takes 3-5 minutes)

---

### **3. Create Database User**
1. In left sidebar → **"Database Access"**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `salesautomation`
5. Password: Click **"Autogenerate Secure Password"** (SAVE THIS!)
   - Or create your own strong password
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

---

### **4. Allow Network Access (Make it Public)**
1. In left sidebar → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (accessible from any IP)
   - ⚠️ Safe for development, but use specific IPs in production
4. Click **"Confirm"**

---

### **5. Get Connection String**
1. In left sidebar → **"Database"**
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string:
   ```
   mongodb+srv://salesautomation:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### **6. Update Your `.env` File**

1. Open `backend/.env` in your project
2. Replace the `MONGODB_URI` line with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://salesautomation:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/sales-automation?retryWrites=true&w=majority
   ```

**Important:**
- Replace `<password>` with your actual password (remove `<` and `>`)
- Replace `cluster0.xxxxx` with your actual cluster URL
- Add `/sales-automation` before the `?` to specify the database name

**Example:**
```env
MONGODB_URI=mongodb+srv://salesautomation:MyP@ssw0rd123@cluster0.abc123.mongodb.net/sales-automation?retryWrites=true&w=majority
```

---

## ✅ Verify Connection

After updating `.env`, start your backend:

```powershell
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

## 🔍 View Your Data

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"** on your cluster
3. You'll see your `sales-automation` database
4. Collections will appear as you use the app:
   - `users`
   - `campaigns`
   - `chats`
   - `analytics`
   - `integrations`

---

## 🎯 Benefits of MongoDB Atlas

✅ **No installation needed** - Works from anywhere  
✅ **Free tier** - 512MB storage (enough for development)  
✅ **Automatic backups** - Data is safe  
✅ **Public access** - Can connect from any device  
✅ **Easy scaling** - Upgrade when needed  

---

## 🔒 Security Tips

For production:
1. Use specific IP addresses instead of "Allow from Anywhere"
2. Use strong passwords
3. Enable 2FA on your Atlas account
4. Never commit `.env` file to Git (already in `.gitignore`)

---

## 🆘 Troubleshooting

**"Authentication failed"**
- Check password is correct in `.env`
- Make sure you removed `<` and `>` from password

**"Connection timeout"**
- Check Network Access allows `0.0.0.0/0`
- Check your internet connection

**"Database not found"**
- Make sure you added `/sales-automation` in the connection string

---

You're all set! 🚀
