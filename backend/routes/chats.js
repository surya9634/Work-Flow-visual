import express from 'express';
import Chat from '../models/Chat.js';
import Campaign from '../models/Campaign.js';
import { protect } from '../middleware/auth.js';
import { sendMessage } from '../services/messagingService.js';

const router = express.Router();

// @route   GET /api/chats
// @desc    Get all chats for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, platform, campaignId } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status) query.status = status;
    if (platform) query.platform = platform;
    if (campaignId) query.campaignId = campaignId;

    const chats = await Chat.find(query)
      .populate('campaignId', 'name product')
      .sort({ lastMessageAt: -1 })
      .limit(100);

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/chats/:id
// @desc    Get single chat with full message history
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('campaignId', 'name product chatFlow');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/chats/:id/messages
// @desc    Send a message in a chat (manual override)
// @access  Private
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { content, messageType = 'text' } = req.body;

    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add message to chat
    const message = {
      sender: 'business',
      content,
      messageType,
      timestamp: new Date()
    };

    chat.messages.push(message);
    await chat.save();

    // Send message via platform
    try {
      await sendMessage(chat.platform, chat.customerId, content, req.user._id);
    } catch (sendError) {
      console.error('Send message error:', sendError);
      return res.status(500).json({ message: 'Failed to send message', error: sendError.message });
    }

    // Emit socket event
    const io = req.app.get('io');
    io.to(`business-${req.user._id}`).emit('new-message', {
      chatId: chat._id,
      message
    });

    res.json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/chats/:id/status
// @desc    Update chat status
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.status = status;

    // If marking as converted, update campaign stats
    if (status === 'converted' && !chat.conversion.converted) {
      chat.conversion.converted = true;
      chat.conversion.convertedAt = new Date();

      const campaign = await Campaign.findById(chat.campaignId);
      if (campaign) {
        campaign.stats.conversions += 1;
        if (chat.conversion.orderValue) {
          campaign.stats.revenue += chat.conversion.orderValue;
        }
        await campaign.save();
      }
    }

    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error('Update chat status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/chats/stats/overview
// @desc    Get chat statistics overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const totalChats = await Chat.countDocuments({ userId: req.user._id });
    const activeChats = await Chat.countDocuments({ userId: req.user._id, status: 'active' });
    const qualifiedLeads = await Chat.countDocuments({ userId: req.user._id, status: 'qualified' });
    const conversions = await Chat.countDocuments({ userId: req.user._id, status: 'converted' });

    const conversionData = await Chat.find({
      userId: req.user._id,
      'conversion.converted': true
    }).select('conversion.orderValue');

    const totalRevenue = conversionData.reduce((sum, chat) => sum + (chat.conversion.orderValue || 0), 0);

    res.json({
      totalChats,
      activeChats,
      qualifiedLeads,
      conversions,
      totalRevenue,
      conversionRate: totalChats > 0 ? ((conversions / totalChats) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/chats/:id/conversion
// @desc    Mark chat as converted with order details
// @access  Private
router.post('/:id/conversion', protect, async (req, res) => {
  try {
    const { orderValue, orderDetails } = req.body;

    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.status = 'converted';
    chat.conversion = {
      converted: true,
      convertedAt: new Date(),
      orderValue,
      orderDetails
    };

    await chat.save();

    // Update campaign stats
    const campaign = await Campaign.findById(chat.campaignId);
    if (campaign) {
      campaign.stats.conversions += 1;
      campaign.stats.revenue += orderValue || 0;
      await campaign.save();
    }

    res.json({ message: 'Conversion recorded successfully', chat });
  } catch (error) {
    console.error('Record conversion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
