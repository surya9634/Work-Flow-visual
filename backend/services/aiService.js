import Groq from 'groq-sdk';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

// Initialize Groq only if API key is available
let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    defaultHeaders: {
      "Groq-Model-Version": "latest"
    }
  });
  console.log('✅ Groq AI initialized');
} else {
  console.log('⚠️  Groq API key not found - using fallback responses');
}

/**
 * Train Global AI with business information
 */
export const trainGlobalAI = async (userId, businessInfo) => {
  try {
    const campaigns = await Campaign.find({ userId });

    // Create knowledge base from business info and campaigns
    const knowledgeBase = {
      business: {
        name: businessInfo.businessName,
        owner: businessInfo.ownerName,
        industry: businessInfo.industry,
        description: businessInfo.description,
        website: businessInfo.website,
        phone: businessInfo.phone
      },
      campaigns: campaigns.map(c => ({
        name: c.name,
        product: c.product,
        targetPlatform: c.targetPlatform,
        chatFlow: c.chatFlow
      }))
    };

    // Store knowledge base in user document
    const user = await User.findById(userId);
    user.globalAI.knowledgeBase = JSON.stringify(knowledgeBase);
    await user.save();

    console.log(`✅ Global AI trained for user ${userId}`);
    return knowledgeBase;
  } catch (error) {
    console.error('Train Global AI error:', error);
    throw error;
  }
};

/**
 * Update Global AI with new campaign
 */
export const updateGlobalAIWithCampaign = async (userId, campaign) => {
  try {
    const user = await User.findById(userId);
    
    if (user.globalAI.knowledgeBase) {
      const knowledgeBase = JSON.parse(user.globalAI.knowledgeBase);
      
      // Update or add campaign
      const existingIndex = knowledgeBase.campaigns.findIndex(
        c => c._id?.toString() === campaign._id.toString()
      );

      const campaignData = {
        _id: campaign._id,
        name: campaign.name,
        product: campaign.product,
        targetPlatform: campaign.targetPlatform,
        chatFlow: campaign.chatFlow
      };

      if (existingIndex >= 0) {
        knowledgeBase.campaigns[existingIndex] = campaignData;
      } else {
        knowledgeBase.campaigns.push(campaignData);
      }

      user.globalAI.knowledgeBase = JSON.stringify(knowledgeBase);
      user.globalAI.lastTrainedAt = new Date();
      await user.save();
    }

    console.log(`✅ Global AI updated with campaign ${campaign._id}`);
  } catch (error) {
    console.error('Update Global AI error:', error);
    throw error;
  }
};

/**
 * Generate AI response for customer message with Groq (Web Search + Advanced Tools)
 */
export const generateAIResponse = async (customerMessage, campaign, conversationHistory = [], user = null) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return generateFallbackResponse(customerMessage, campaign);
    }

    // Get user's knowledge base for context
    let businessContext = '';
    if (user) {
      const userData = await User.findById(user._id || user);
      if (userData?.globalAI?.knowledgeBase) {
        const kb = JSON.parse(userData.globalAI.knowledgeBase);
        businessContext = `\n\nBusiness Context:\n- Company: ${kb.business?.name}\n- Industry: ${kb.business?.industry}\n- Description: ${kb.business?.description}`;
      }
    }

    const systemPrompt = `You are an advanced AI sales assistant for ${campaign.product.name}. You have access to web search, code interpreter, and website visiting tools to provide the most accurate and helpful responses.

🎯 YOUR MISSION:
Help customers make informed purchase decisions by providing accurate, helpful, and persuasive information.

📦 PRODUCT INFORMATION:
- Name: ${campaign.product.name}
- Description: ${campaign.product.description}
- Price: $${campaign.product.price}
- Features: ${campaign.product.features?.join(', ') || 'Premium quality product'}
${businessContext}

💬 CHAT FLOW GUIDELINES:
- Greeting: ${campaign.chatFlow?.greeting || 'Hello! How can I help you today?'}
- Closing: ${campaign.chatFlow?.closingMessage || 'Thank you for your interest!'}

🔧 YOUR CAPABILITIES:
1. **Web Search**: Use this to find latest information, reviews, comparisons, or market data
2. **Code Interpreter**: Use this to calculate pricing, discounts, ROI, or analyze data
3. **Visit Website**: Use this to get real-time information from specific URLs

📋 RESPONSE STRATEGY:
1. Understand customer intent (browsing, comparing, ready to buy)
2. Use web search if customer asks about comparisons, reviews, or market trends
3. Provide specific, data-backed answers
4. Guide towards purchase naturally
5. Handle objections professionally
6. Always be helpful, friendly, and professional

🎯 LEAD QUALIFICATION:
- Ask qualifying questions naturally
- Understand budget, timeline, and needs
- Score leads based on buying signals

Remember: You're not just answering questions - you're building trust and guiding customers to make the best decision!`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'customer' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: customerMessage }
    ];

    const completion = await groq.chat.completions.create({
      model: "groq/compound",
      messages,
      temperature: 0.8,
      max_completion_tokens: 1024,
      top_p: 0.95,
      stream: false,
      compound_custom: {
        tools: {
          enabled_tools: ["web_search", "code_interpreter", "visit_website"]
        }
      }
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Generate AI response error:', error);
    return generateFallbackResponse(customerMessage, campaign);
  }
};

/**
 * Fallback response when OpenAI is not available
 */
const generateFallbackResponse = (customerMessage, campaign) => {
  const lowerMessage = customerMessage.toLowerCase();

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return `Great question! ${campaign.product.name} is priced at $${campaign.product.price}. It's a great value for all the features you get. Would you like to know more about what's included?`;
  }

  if (lowerMessage.includes('feature') || lowerMessage.includes('what does it do')) {
    return `${campaign.product.name} comes with amazing features including ${campaign.product.features?.slice(0, 3).join(', ')}. Would you like me to explain any of these in detail?`;
  }

  if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('order')) {
    return `Excellent! I'd be happy to help you purchase ${campaign.product.name}. To complete your order, I'll need a few details. What's the best email address to send your order confirmation to?`;
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return campaign.chatFlow?.greeting || `Hello! Thanks for your interest in ${campaign.product.name}. How can I help you today?`;
  }

  return `Thank you for your message! I'd be happy to help you learn more about ${campaign.product.name}. ${campaign.product.description} Is there anything specific you'd like to know?`;
};

/**
 * Get Leo AI response (business assistant) with Groq Advanced Tools
 */
export const getLeoAIResponse = async (message, conversationHistory, user, campaigns) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return getLeoFallbackResponse(message, user, campaigns);
    }

    // Get full business context
    let knowledgeBase = {};
    if (user.globalAI?.knowledgeBase) {
      try {
        knowledgeBase = JSON.parse(user.globalAI.knowledgeBase);
      } catch (e) {
        console.error('Parse knowledge base error:', e);
      }
    }

    const systemPrompt = `You are Leo, an advanced AI business assistant for ${user.businessInfo?.businessName || 'the business'}. You have access to web search, code interpreter, and website visiting tools to provide comprehensive business insights.

🏢 BUSINESS PROFILE:
- Name: ${user.businessInfo?.businessName || 'Not set'}
- Owner: ${user.businessInfo?.ownerName || 'Not set'}
- Industry: ${user.businessInfo?.industry || 'Not set'}
- Description: ${user.businessInfo?.description || 'Not set'}
- Website: ${user.businessInfo?.website || 'Not set'}
- Phone: ${user.businessInfo?.phone || 'Not set'}

📊 CURRENT CAMPAIGNS (${campaigns.length} total):
${campaigns.map(c => `
• ${c.name} (${c.status})
  - Product: ${c.product.name}
  - Price: $${c.product.price}
  - Platform: ${c.targetPlatform}
  - Stats: ${c.stats?.messagesSet || 0} messages, ${c.stats?.conversions || 0} conversions, $${c.stats?.revenue || 0} revenue
`).join('\n')}

🎯 YOUR ROLE & CAPABILITIES:
You are a strategic business advisor with access to:
1. **Web Search**: Research market trends, competitors, best practices, industry insights
2. **Code Interpreter**: Analyze data, calculate metrics, forecast trends, compute ROI
3. **Visit Website**: Check competitor sites, verify information, gather real-time data

💡 WHAT YOU HELP WITH:
- **Analytics & Performance**: Interpret metrics, identify trends, suggest improvements
- **Campaign Strategy**: Optimize campaigns, suggest new products, improve messaging
- **Sales Optimization**: Increase conversions, improve response rates, maximize revenue
- **Market Research**: Competitor analysis, industry trends, customer insights
- **Platform Guidance**: How to use features, best practices, troubleshooting
- **Business Growth**: Scaling strategies, automation tips, efficiency improvements

📋 RESPONSE GUIDELINES:
1. **Be Proactive**: Don't just answer - provide insights and recommendations
2. **Use Data**: Reference actual campaign stats and business metrics
3. **Be Specific**: Give actionable advice with clear next steps
4. **Use Tools**: 
   - Web search for market research and trends
   - Code interpreter for calculations and analysis
   - Visit website for competitor research
5. **Be Concise**: Clear, actionable responses (not too long)
6. **Think Strategically**: Focus on business growth and ROI

🔍 ANALYSIS CAPABILITIES:
- Calculate conversion rates, ROI, customer lifetime value
- Analyze campaign performance and suggest optimizations
- Research competitors and market positioning
- Forecast revenue and growth trends
- Identify bottlenecks and opportunities

Remember: You're not just a chatbot - you're a strategic business partner helping grow ${user.businessInfo?.businessName || 'this business'}!`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-15),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: "groq/compound",
      messages,
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 0.9,
      stream: false,
      compound_custom: {
        tools: {
          enabled_tools: ["web_search", "code_interpreter", "visit_website"]
        }
      }
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Leo AI response error:', error);
    return getLeoFallbackResponse(message, user, campaigns);
  }
};

/**
 * Leo AI fallback response
 */
const getLeoFallbackResponse = (message, user, campaigns) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('campaign') || lowerMessage.includes('product')) {
    return `You currently have ${campaigns.length} campaign(s) set up. ${campaigns.length > 0 ? `Your campaigns are: ${campaigns.map(c => c.name).join(', ')}.` : 'You can create a new campaign to start selling your products!'} Would you like help creating or managing a campaign?`;
  }

  if (lowerMessage.includes('analytics') || lowerMessage.includes('performance') || lowerMessage.includes('stats')) {
    return `I can help you understand your analytics! Check your dashboard for detailed metrics on messages, conversions, and revenue. Is there a specific metric you'd like to improve?`;
  }

  if (lowerMessage.includes('integration') || lowerMessage.includes('facebook') || lowerMessage.includes('messenger')) {
    return `To automate your sales on Facebook Messenger, you'll need to connect your Facebook page in the Integrations section. Once connected, your Global AI will handle all customer conversations automatically!`;
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return `I'm here to help! I can assist you with:
- Creating and managing campaigns
- Understanding your analytics
- Setting up integrations
- Optimizing your sales automation
What would you like to know more about?`;
  }

  return `Thanks for reaching out! I'm Leo, your AI assistant for ${user.businessInfo?.businessName || 'your business'}. I can help you with campaigns, analytics, integrations, and more. What would you like to know?`;
};

/**
 * Get Global AI status
 */
export const getGlobalAIStatus = async (userId) => {
  try {
    const user = await User.findById(userId).select('globalAI');
    return {
      trained: user.globalAI.trained,
      lastTrainedAt: user.globalAI.lastTrainedAt
    };
  } catch (error) {
    console.error('Get AI status error:', error);
    throw error;
  }
};

/**
 * Retrain Global AI
 */
export const retrainGlobalAI = async (userId, businessInfo) => {
  return await trainGlobalAI(userId, businessInfo);
};

export default {
  trainGlobalAI,
  updateGlobalAIWithCampaign,
  generateAIResponse,
  getLeoAIResponse,
  getGlobalAIStatus,
  retrainGlobalAI
};
