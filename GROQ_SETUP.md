# 🚀 Groq AI Integration - Advanced Setup Guide

## 🎯 What's New?

Your AI Sales Automation OS now uses **Groq AI** with advanced capabilities:

✅ **Web Search** - AI can search the internet for real-time information  
✅ **Code Interpreter** - AI can calculate, analyze data, and compute metrics  
✅ **Visit Website** - AI can visit URLs to get current information  
✅ **Compound Model** - Latest Groq compound model for best performance  

---

## 🔑 Get Your Groq API Key

### Step 1: Create Groq Account
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Verify your email

### Step 2: Generate API Key
1. Go to API Keys section
2. Click "Create API Key"
3. Copy your API key (starts with `gsk_...`)
4. Save it securely!

---

## ⚙️ Configure Your App

### Update `backend/.env`:

```env
# Groq API (for Global AI & Leo AI with Web Search)
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

**Example**:
```env
GROQ_API_KEY=gsk_abc123def456ghi789jkl012mno345pqrst
```

---

## 🎨 What Changed?

### **1. Package Updated**
- ❌ Removed: `openai` package
- ✅ Added: `groq-sdk` package

### **2. AI Service Enhanced**
File: `backend/services/aiService.js`

**New Features**:
- Web search for product comparisons, reviews, market data
- Code interpreter for pricing calculations, ROI analysis
- Website visiting for competitor research
- Advanced system prompts for better responses

### **3. Better Context**
- AI now reads your full business profile
- AI knows all your campaigns and their stats
- AI can access onboarding data
- AI provides data-driven insights

---

## 🤖 How It Works Now

### **Customer AI (Sales Assistant)**

When a customer messages:
```
Customer: "How does this compare to competitors?"
    ↓
AI uses WEB SEARCH to find competitor info
    ↓
AI provides data-backed comparison
    ↓
Customer gets informed, accurate answer
```

**Capabilities**:
- 🔍 Search for product reviews
- 📊 Calculate pricing and discounts
- 🌐 Visit competitor websites
- 💡 Provide market insights
- 🎯 Handle complex objections

### **Leo AI (Business Assistant)**

When you ask Leo:
```
You: "How can I improve my conversion rate?"
    ↓
AI uses CODE INTERPRETER to analyze your data
AI uses WEB SEARCH for industry benchmarks
    ↓
Leo provides specific, actionable recommendations
```

**Capabilities**:
- 📈 Analyze campaign performance
- 🔍 Research market trends
- 💰 Calculate ROI and forecasts
- 🎯 Suggest optimizations
- 🌐 Check competitor strategies

---

## 📊 System Prompts

### **Customer AI Prompt** (Highlights):

```
🎯 YOUR MISSION:
Help customers make informed purchase decisions

🔧 YOUR CAPABILITIES:
1. Web Search - Find reviews, comparisons, market data
2. Code Interpreter - Calculate pricing, ROI
3. Visit Website - Get real-time information

📋 RESPONSE STRATEGY:
- Understand customer intent
- Use web search for comparisons
- Provide data-backed answers
- Guide towards purchase
- Handle objections professionally
```

### **Leo AI Prompt** (Highlights):

```
🏢 BUSINESS PROFILE:
- Full business information
- All campaigns with stats
- Revenue and conversion data

🎯 YOUR ROLE:
Strategic business advisor with:
- Web Search for market research
- Code Interpreter for data analysis
- Website visiting for competitor intel

💡 WHAT YOU HELP WITH:
- Analytics & Performance
- Campaign Strategy
- Sales Optimization
- Market Research
- Business Growth
```

---

## 🚀 Install Dependencies

```bash
cd backend
npm install
```

This will install `groq-sdk` package.

---

## ✅ Test It Works

### **1. Start Your App**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### **2. Test Customer AI**
1. Connect Facebook Messenger
2. Send a message: "How does this compare to other products?"
3. AI will use web search to provide comparison!

### **3. Test Leo AI**
1. Open Leo AI in dashboard
2. Ask: "What are the latest trends in my industry?"
3. Leo will search the web and provide insights!

---

## 🎯 Advanced Features

### **Web Search Examples**

Customer asks:
- "What do reviews say about this?"
- "How does this compare to [competitor]?"
- "Is this a good price?"
- "What's trending in this category?"

AI will:
1. Search the web
2. Find relevant information
3. Provide accurate, current answers

### **Code Interpreter Examples**

Customer asks:
- "What's the monthly cost if I buy 5?"
- "What's my ROI over 2 years?"
- "How much do I save with bulk pricing?"

AI will:
1. Use code interpreter
2. Calculate exact numbers
3. Show clear breakdown

### **Visit Website Examples**

Leo asks:
- "Check competitor pricing at [URL]"
- "What's on our website?"
- "Verify this information at [URL]"

AI will:
1. Visit the URL
2. Extract relevant info
3. Provide summary

---

## 🔧 Configuration Options

### **Model Settings** (in aiService.js):

```javascript
// Customer AI
model: "groq/compound"
temperature: 0.8        // Creative but focused
max_completion_tokens: 1024
top_p: 0.95
enabled_tools: ["web_search", "code_interpreter", "visit_website"]

// Leo AI
model: "groq/compound"
temperature: 0.7        // Balanced
max_completion_tokens: 1024
top_p: 0.9
enabled_tools: ["web_search", "code_interpreter", "visit_website"]
```

### **Customize Tools**:

You can enable/disable tools:
```javascript
compound_custom: {
  tools: {
    enabled_tools: [
      "web_search",           // Enable web search
      "code_interpreter",     // Enable calculations
      "visit_website"         // Enable URL visiting
    ]
  }
}
```

---

## 💡 Pro Tips

### **1. Better Prompts = Better Results**
The system prompts are already optimized, but you can customize them in `aiService.js`

### **2. Context Matters**
- AI reads your business profile
- AI knows your campaigns
- AI sees conversation history
- More context = better responses

### **3. Monitor Usage**
- Check Groq console for API usage
- Free tier is generous
- Upgrade if needed

### **4. Test Thoroughly**
- Test with different customer questions
- Try complex scenarios
- Verify web search works
- Check calculations are accurate

---

## 🐛 Troubleshooting

### **AI Not Responding?**
```bash
# Check .env has GROQ_API_KEY
cat backend/.env | grep GROQ

# Check backend logs for errors
# Look for "Generate AI response error"
```

### **Web Search Not Working?**
- Verify API key is valid
- Check Groq console for limits
- Ensure `enabled_tools` includes "web_search"

### **Fallback Responses?**
If you see simple responses, AI is using fallback (no Groq key detected)
- Add GROQ_API_KEY to .env
- Restart backend

---

## 📊 Comparison: Before vs After

### **Before (OpenAI)**:
- ❌ No web search
- ❌ No code interpreter
- ❌ No website visiting
- ❌ Limited context
- ✅ Basic responses

### **After (Groq)**:
- ✅ Web search enabled
- ✅ Code interpreter
- ✅ Website visiting
- ✅ Full business context
- ✅ Advanced responses
- ✅ Data-driven insights
- ✅ Real-time information

---

## 🎊 You're Ready!

Your AI is now **10x more powerful** with:

✅ Web search for current information  
✅ Code interpreter for calculations  
✅ Website visiting for research  
✅ Full business context  
✅ Advanced system prompts  

**Just add your GROQ_API_KEY and watch the magic happen!** 🚀

---

## 📚 Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Groq API Reference](https://console.groq.com/docs/api-reference)
- [Compound Model Info](https://console.groq.com/docs/models)

---

**Need help? Check backend logs for detailed error messages!**
