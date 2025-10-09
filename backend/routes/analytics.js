import express from 'express';
import Analytics from '../models/Analytics.js';
import Chat from '../models/Chat.js';
import Campaign from '../models/Campaign.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const { startDate, endDate, platform = 'all' } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const query = { userId: req.user._id };
    if (Object.keys(dateFilter).length > 0) query.date = dateFilter;
    if (platform !== 'all') query.platform = platform;

    const analytics = await Analytics.find(query).sort({ date: -1 });

    // Aggregate data
    const aggregated = analytics.reduce((acc, day) => {
      acc.messagesSent += day.metrics.messagesSent;
      acc.messagesReceived += day.metrics.messagesReceived;
      acc.conversationsStarted += day.metrics.conversationsStarted;
      acc.leadsGenerated += day.metrics.leadsGenerated;
      acc.qualifiedLeads += day.metrics.qualifiedLeads;
      acc.conversions += day.metrics.conversions;
      acc.revenue += day.metrics.revenue;
      return acc;
    }, {
      messagesSent: 0,
      messagesReceived: 0,
      conversationsStarted: 0,
      leadsGenerated: 0,
      qualifiedLeads: 0,
      conversions: 0,
      revenue: 0
    });

    // Calculate rates
    aggregated.responseRate = aggregated.messagesSent > 0 
      ? ((aggregated.messagesReceived / aggregated.messagesSent) * 100).toFixed(2)
      : 0;
    
    aggregated.conversionRate = aggregated.leadsGenerated > 0
      ? ((aggregated.conversions / aggregated.leadsGenerated) * 100).toFixed(2)
      : 0;

    aggregated.avgOrderValue = aggregated.conversions > 0
      ? (aggregated.revenue / aggregated.conversions).toFixed(2)
      : 0;

    // Get time series data
    const timeSeriesData = analytics.map(day => ({
      date: day.date,
      messages: day.metrics.messagesSent + day.metrics.messagesReceived,
      conversations: day.metrics.conversationsStarted,
      conversions: day.metrics.conversions,
      revenue: day.metrics.revenue
    }));

    res.json({
      summary: aggregated,
      timeSeries: timeSeriesData,
      period: {
        startDate: startDate || analytics[analytics.length - 1]?.date,
        endDate: endDate || analytics[0]?.date
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/analytics/campaigns
// @desc    Get campaign analytics
// @access  Private
router.get('/campaigns', protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.user._id })
      .select('name product targetPlatform status stats createdAt')
      .sort({ 'stats.revenue': -1 });

    const campaignAnalytics = campaigns.map(campaign => ({
      id: campaign._id,
      name: campaign.name,
      product: campaign.product.name,
      platform: campaign.targetPlatform,
      status: campaign.status,
      stats: campaign.stats,
      roi: campaign.stats.revenue > 0 ? ((campaign.stats.revenue / 1000) * 100).toFixed(2) : 0, // Simplified ROI
      conversionRate: campaign.stats.messagesSet > 0
        ? ((campaign.stats.conversions / campaign.stats.messagesSet) * 100).toFixed(2)
        : 0,
      createdAt: campaign.createdAt
    }));

    res.json(campaignAnalytics);
  } catch (error) {
    console.error('Get campaign analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/analytics/real-time
// @desc    Get real-time analytics
// @access  Private
router.get('/real-time', protect, async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Active chats in last 24 hours
    const activeChats = await Chat.countDocuments({
      userId: req.user._id,
      lastMessageAt: { $gte: last24Hours },
      status: 'active'
    });

    // Messages in last hour
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const recentChats = await Chat.find({
      userId: req.user._id,
      lastMessageAt: { $gte: lastHour }
    });

    let messagesLastHour = 0;
    recentChats.forEach(chat => {
      const recentMessages = chat.messages.filter(
        msg => new Date(msg.timestamp) >= lastHour
      );
      messagesLastHour += recentMessages.length;
    });

    // Conversions today
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const conversionsToday = await Chat.countDocuments({
      userId: req.user._id,
      'conversion.converted': true,
      'conversion.convertedAt': { $gte: startOfDay }
    });

    // Revenue today
    const conversionsData = await Chat.find({
      userId: req.user._id,
      'conversion.converted': true,
      'conversion.convertedAt': { $gte: startOfDay }
    }).select('conversion.orderValue');

    const revenueToday = conversionsData.reduce(
      (sum, chat) => sum + (chat.conversion.orderValue || 0),
      0
    );

    res.json({
      activeChats,
      messagesLastHour,
      conversionsToday,
      revenueToday,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get real-time analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/analytics/performance
// @desc    Get AI performance metrics
// @access  Private
router.get('/performance', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const query = { userId: req.user._id };
    if (Object.keys(dateFilter).length > 0) query.date = dateFilter;

    const analytics = await Analytics.find(query);

    const performance = analytics.reduce((acc, day) => {
      acc.totalMessages += day.metrics.messagesSent;
      acc.totalResponses += day.metrics.messagesReceived;
      acc.totalConversions += day.metrics.conversions;
      acc.aiAccuracySum += day.metrics.aiAccuracy || 0;
      acc.days += 1;
      return acc;
    }, {
      totalMessages: 0,
      totalResponses: 0,
      totalConversions: 0,
      aiAccuracySum: 0,
      days: 0
    });

    const avgAiAccuracy = performance.days > 0
      ? (performance.aiAccuracySum / performance.days).toFixed(2)
      : 0;

    const responseRate = performance.totalMessages > 0
      ? ((performance.totalResponses / performance.totalMessages) * 100).toFixed(2)
      : 0;

    res.json({
      avgAiAccuracy,
      responseRate,
      totalConversions: performance.totalConversions,
      messagesProcessed: performance.totalMessages
    });
  } catch (error) {
    console.error('Get performance analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/analytics/hourly
// @desc    Get hourly breakdown for today
// @access  Private
router.get('/hourly', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await Analytics.findOne({
      userId: req.user._id,
      date: today
    });

    if (!analytics || !analytics.hourlyData) {
      // Generate empty hourly data
      const emptyHourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        messages: 0,
        conversations: 0,
        conversions: 0
      }));
      return res.json(emptyHourlyData);
    }

    res.json(analytics.hourlyData);
  } catch (error) {
    console.error('Get hourly analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
