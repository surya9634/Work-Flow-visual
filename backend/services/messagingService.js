import axios from 'axios';
import User from '../models/User.js';

/**
 * Send message to customer via platform
 */
export const sendMessage = async (platform, recipientId, message, userId) => {
  try {
    switch (platform) {
      case 'facebook':
        return await sendFacebookMessage(recipientId, message, userId);
      case 'instagram':
        return await sendInstagramMessage(recipientId, message, userId);
      case 'whatsapp':
        return await sendWhatsAppMessage(recipientId, message, userId);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error(`❌ Send message error (${platform}):`, error);
    throw error;
  }
};

/**
 * Send Facebook Messenger message
 */
const sendFacebookMessage = async (recipientId, message, userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.integrations.facebook.connected) {
      throw new Error('Facebook not connected');
    }

    const pageAccessToken = user.integrations.facebook.pageAccessToken;

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message },
        messaging_type: 'RESPONSE'
      },
      {
        params: { access_token: pageAccessToken }
      }
    );

    console.log(`✅ Facebook message sent to ${recipientId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Facebook send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send Instagram message
 */
const sendInstagramMessage = async (recipientId, message, userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.integrations.instagram.connected) {
      throw new Error('Instagram not connected');
    }

    const accessToken = user.integrations.instagram.accessToken;

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message }
      },
      {
        params: { access_token: accessToken }
      }
    );

    console.log(`✅ Instagram message sent to ${recipientId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Instagram send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send WhatsApp message
 */
const sendWhatsAppMessage = async (recipientId, message, userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.integrations.whatsapp.connected) {
      throw new Error('WhatsApp not connected');
    }

    const phoneNumberId = user.integrations.whatsapp.phoneNumberId;
    const accessToken = user.integrations.whatsapp.accessToken;

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientId,
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ WhatsApp message sent to ${recipientId}`);
    return response.data;
  } catch (error) {
    console.error('❌ WhatsApp send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send message with quick replies
 */
export const sendQuickReplies = async (platform, recipientId, message, quickReplies, userId) => {
  try {
    const user = await User.findById(userId);

    if (platform === 'facebook') {
      const pageAccessToken = user.integrations.facebook.pageAccessToken;

      const response = await axios.post(
        `https://graph.facebook.com/v18.0/me/messages`,
        {
          recipient: { id: recipientId },
          message: {
            text: message,
            quick_replies: quickReplies.map((reply, index) => ({
              content_type: 'text',
              title: reply,
              payload: `QUICK_REPLY_${index}`
            }))
          }
        },
        {
          params: { access_token: pageAccessToken }
        }
      );

      return response.data;
    }

    // For other platforms, send as regular message
    return await sendMessage(platform, recipientId, message, userId);
  } catch (error) {
    console.error('❌ Send quick replies error:', error);
    throw error;
  }
};

/**
 * Send typing indicator
 */
export const sendTypingIndicator = async (platform, recipientId, userId, action = 'typing_on') => {
  try {
    if (platform === 'facebook') {
      const user = await User.findById(userId);
      const pageAccessToken = user.integrations.facebook.pageAccessToken;

      await axios.post(
        `https://graph.facebook.com/v18.0/me/messages`,
        {
          recipient: { id: recipientId },
          sender_action: action
        },
        {
          params: { access_token: pageAccessToken }
        }
      );
    }
  } catch (error) {
    console.error('❌ Send typing indicator error:', error);
  }
};

export default {
  sendMessage,
  sendQuickReplies,
  sendTypingIndicator
};
