import Chat from '../models/Chat.js';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import { generateAIResponse } from './aiService.js';
import { sendMessage } from './messagingService.js';

/**
 * Handle Facebook Messenger webhook events
 */
export const handleFacebookWebhook = async (webhookEvent, io) => {
  try {
    const senderId = webhookEvent.sender.id;
    const recipientId = webhookEvent.recipient.id;

    // Find user by page ID
    const user = await User.findOne({
      'integrations.facebook.pageId': recipientId
    });

    if (!user) {
      console.log('❌ No user found for page ID:', recipientId);
      return;
    }

    // Handle message event
    if (webhookEvent.message) {
      await handleIncomingMessage(webhookEvent, user, io);
    }

    // Handle postback event (button clicks)
    if (webhookEvent.postback) {
      await handlePostback(webhookEvent, user, io);
    }

    // Handle message read event
    if (webhookEvent.read) {
      await handleMessageRead(webhookEvent, user);
    }
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    throw error;
  }
};

/**
 * Handle incoming message from customer
 */
const handleIncomingMessage = async (webhookEvent, user, io) => {
  try {
    const senderId = webhookEvent.sender.id;
    const messageText = webhookEvent.message.text;
    const timestamp = new Date(webhookEvent.timestamp);

    console.log(`📨 Message from ${senderId}: ${messageText}`);

    // Find or create chat
    let chat = await Chat.findOne({
      userId: user._id,
      platform: 'facebook',
      customerId: senderId
    });

    if (!chat) {
      // New conversation - find active campaign
      const activeCampaign = await Campaign.findOne({
        userId: user._id,
        status: 'active',
        targetPlatform: { $in: ['facebook', 'all'] }
      });

      if (!activeCampaign) {
        console.log('❌ No active campaign found for user:', user._id);
        return;
      }

      // Get customer profile from Facebook
      const customerProfile = await getCustomerProfile(senderId, user);

      chat = await Chat.create({
        userId: user._id,
        campaignId: activeCampaign._id,
        platform: 'facebook',
        customerId: senderId,
        customerName: customerProfile.name,
        customerProfile: {
          profilePic: customerProfile.profile_pic
        },
        messages: [],
        status: 'active'
      });

      // Update analytics
      await updateAnalytics(user._id, activeCampaign._id, 'conversationStarted');
      
      // Update campaign stats
      activeCampaign.stats.messagesSet += 1;
      await activeCampaign.save();
    }

    // Add customer message to chat
    const customerMessage = {
      sender: 'customer',
      content: messageText,
      timestamp,
      messageType: 'text'
    };

    chat.messages.push(customerMessage);
    await chat.save();

    // Update analytics
    await updateAnalytics(user._id, chat.campaignId, 'messageReceived');

    // Emit socket event to business
    io.to(`business-${user._id}`).emit('new-message', {
      chatId: chat._id,
      message: customerMessage
    });

    // Generate AI response
    const campaign = await Campaign.findById(chat.campaignId);
    const conversationHistory = chat.messages.slice(-10); // Last 10 messages for context

    const aiResponse = await generateAIResponse(messageText, campaign, conversationHistory);

    // Send AI response
    await sendMessage('facebook', senderId, aiResponse, user._id);

    // Add AI message to chat
    const aiMessage = {
      sender: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      messageType: 'text'
    };

    chat.messages.push(aiMessage);
    
    // Update lead score based on conversation
    chat.leadScore = calculateLeadScore(chat.messages);
    
    // Auto-qualify leads
    if (chat.leadScore >= 60 && chat.status === 'active') {
      chat.status = 'qualified';
      await updateAnalytics(user._id, chat.campaignId, 'leadQualified');
    }

    await chat.save();

    // Update analytics
    await updateAnalytics(user._id, chat.campaignId, 'messageSent');

    // Emit AI response to business
    io.to(`business-${user._id}`).emit('new-message', {
      chatId: chat._id,
      message: aiMessage
    });

    console.log(`✅ AI response sent to ${senderId}`);
  } catch (error) {
    console.error('❌ Handle incoming message error:', error);
    throw error;
  }
};

/**
 * Handle postback (button clicks)
 */
const handlePostback = async (webhookEvent, user, io) => {
  try {
    const senderId = webhookEvent.sender.id;
    const payload = webhookEvent.postback.payload;

    console.log(`🔘 Postback from ${senderId}: ${payload}`);

    // Handle different postback payloads
    if (payload === 'GET_STARTED') {
      // Send welcome message
      const campaign = await Campaign.findOne({
        userId: user._id,
        status: 'active',
        targetPlatform: { $in: ['facebook', 'all'] }
      });

      if (campaign && campaign.chatFlow?.greeting) {
        await sendMessage('facebook', senderId, campaign.chatFlow.greeting, user._id);
      }
    }
  } catch (error) {
    console.error('❌ Handle postback error:', error);
  }
};

/**
 * Handle message read event
 */
const handleMessageRead = async (webhookEvent, user) => {
  try {
    const senderId = webhookEvent.sender.id;
    console.log(`👁️ Message read by ${senderId}`);

    // Update chat read status if needed
    // This can be used for analytics
  } catch (error) {
    console.error('❌ Handle message read error:', error);
  }
};

/**
 * Get customer profile from Facebook
 */
const getCustomerProfile = async (senderId, user) => {
  try {
    const axios = (await import('axios')).default;
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${senderId}`,
      {
        params: {
          fields: 'name,profile_pic',
          access_token: user.integrations.facebook.pageAccessToken
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Get customer profile error:', error);
    return { name: 'Customer', profile_pic: '' };
  }
};

/**
 * Calculate lead score based on conversation
 */
const calculateLeadScore = (messages) => {
  let score = 0;

  // More messages = more engaged
  score += Math.min(messages.length * 5, 30);

  // Check for buying signals
  const allText = messages.map(m => m.content.toLowerCase()).join(' ');
  
  if (allText.includes('price') || allText.includes('cost')) score += 15;
  if (allText.includes('buy') || allText.includes('purchase')) score += 25;
  if (allText.includes('when') || allText.includes('delivery')) score += 15;
  if (allText.includes('yes') || allText.includes('interested')) score += 10;
  if (allText.includes('email') || allText.includes('phone')) score += 20;

  return Math.min(score, 100);
};

/**
 * Update analytics
 */
const updateAnalytics = async (userId, campaignId, eventType) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await Analytics.findOne({
      userId,
      campaignId,
      date: today
    });

    if (!analytics) {
      analytics = await Analytics.create({
        userId,
        campaignId,
        date: today,
        platform: 'facebook',
        metrics: {},
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          messages: 0,
          conversations: 0,
          conversions: 0
        }))
      });
    }

    const currentHour = new Date().getHours();

    switch (eventType) {
      case 'conversationStarted':
        analytics.metrics.conversationsStarted += 1;
        analytics.metrics.activeConversations += 1;
        analytics.metrics.leadsGenerated += 1;
        analytics.hourlyData[currentHour].conversations += 1;
        break;
      case 'messageSent':
        analytics.metrics.messagesSent += 1;
        analytics.hourlyData[currentHour].messages += 1;
        break;
      case 'messageReceived':
        analytics.metrics.messagesReceived += 1;
        analytics.hourlyData[currentHour].messages += 1;
        break;
      case 'leadQualified':
        analytics.metrics.qualifiedLeads += 1;
        break;
      case 'conversion':
        analytics.metrics.conversions += 1;
        analytics.hourlyData[currentHour].conversions += 1;
        break;
    }

    // Calculate rates
    if (analytics.metrics.messagesSent > 0) {
      analytics.metrics.responseRate = 
        (analytics.metrics.messagesReceived / analytics.metrics.messagesSent) * 100;
    }

    if (analytics.metrics.leadsGenerated > 0) {
      analytics.metrics.conversionRate = 
        (analytics.metrics.conversions / analytics.metrics.leadsGenerated) * 100;
    }

    await analytics.save();
  } catch (error) {
    console.error('❌ Update analytics error:', error);
  }
};

export default {
  handleFacebookWebhook
};
