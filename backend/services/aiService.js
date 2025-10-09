import OpenAI from 'openai';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
 * Generate AI response for customer message
 */
export const generateAIResponse = async (customerMessage, campaign, conversationHistory = []) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      // Fallback response when OpenAI is not configured
      return generateFallbackResponse(customerMessage, campaign);
    }

    const systemPrompt = `You are a sales AI assistant for ${campaign.product.name}. 
Your goal is to help customers and guide them towards making a purchase.

Product Information:
- Name: ${campaign.product.name}
- Description: ${campaign.product.description}
- Price: $${campaign.product.price}
- Features: ${campaign.product.features?.join(', ')}

Chat Flow:
- Greeting: ${campaign.chatFlow?.greeting}
- Closing: ${campaign.chatFlow?.closingMessage}

Be friendly, helpful, and professional. Answer questions about the product and guide customers through the buying process.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.sender === 'customer' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: customerMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 200
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
 * Get Leo AI response (business assistant)
 */
export const getLeoAIResponse = async (message, conversationHistory, user, campaigns) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return getLeoFallbackResponse(message, user, campaigns);
    }

    const systemPrompt = `You are Leo, an AI assistant helping ${user.businessInfo?.businessName || 'the business'} manage their sales automation platform.

Business Information:
- Business Name: ${user.businessInfo?.businessName}
- Industry: ${user.businessInfo?.industry}
- Description: ${user.businessInfo?.description}

Active Campaigns: ${campaigns.length}
${campaigns.map(c => `- ${c.name}: ${c.product.name} (${c.status})`).join('\n')}

You help with:
- Understanding analytics and performance
- Managing campaigns
- Optimizing sales strategies
- Answering questions about the platform
- Providing insights and recommendations

Be helpful, concise, and actionable.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 300
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
