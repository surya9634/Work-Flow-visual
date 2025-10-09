import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import Integration from '../models/Integration.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/integrations
// @desc    Get all integrations for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const integrations = await Integration.find({ userId: req.user._id });
    res.json(integrations);
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/integrations/facebook/connect
// @desc    Connect Facebook Messenger
// @access  Private
router.post('/facebook/connect', protect, async (req, res) => {
  try {
    const { pageId, pageAccessToken } = req.body;

    if (!pageId || !pageAccessToken) {
      return res.status(400).json({ message: 'Page ID and Access Token are required' });
    }

    // Verify the token with Facebook Graph API
    try {
      const response = await axios.get(`https://graph.facebook.com/v18.0/${pageId}`, {
        params: {
          fields: 'name,username,picture,followers_count,category',
          access_token: pageAccessToken
        }
      });

      const pageData = response.data;

      // Subscribe to webhooks
      await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps`,
        {
          subscribed_fields: 'messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads'
        },
        {
          params: { access_token: pageAccessToken }
        }
      );

      // Update or create integration
      let integration = await Integration.findOne({
        userId: req.user._id,
        platform: 'facebook'
      });

      if (integration) {
        integration.status = 'connected';
        integration.credentials.pageId = pageId;
        integration.credentials.pageAccessToken = pageAccessToken;
        integration.platformData = {
          pageName: pageData.name,
          pageUsername: pageData.username,
          profilePicture: pageData.picture?.data?.url,
          followersCount: pageData.followers_count,
          category: pageData.category
        };
        integration.webhookVerified = true;
        integration.connectedAt = new Date();
      } else {
        integration = await Integration.create({
          userId: req.user._id,
          platform: 'facebook',
          status: 'connected',
          credentials: {
            pageId,
            pageAccessToken
          },
          platformData: {
            pageName: pageData.name,
            pageUsername: pageData.username,
            profilePicture: pageData.picture?.data?.url,
            followersCount: pageData.followers_count,
            category: pageData.category
          },
          webhookVerified: true
        });
      }

      await integration.save();

      // Update user model
      const user = await User.findById(req.user._id);
      user.integrations.facebook = {
        connected: true,
        pageId,
        pageAccessToken,
        connectedAt: new Date()
      };
      await user.save();

      res.json({
        message: 'Facebook Messenger connected successfully',
        integration
      });
    } catch (fbError) {
      console.error('Facebook API error:', fbError.response?.data || fbError.message);
      return res.status(400).json({
        message: 'Failed to verify Facebook credentials',
        error: fbError.response?.data?.error?.message || fbError.message
      });
    }
  } catch (error) {
    console.error('Facebook connect error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/integrations/facebook/disconnect
// @desc    Disconnect Facebook Messenger
// @access  Private
router.post('/facebook/disconnect', protect, async (req, res) => {
  try {
    const integration = await Integration.findOne({
      userId: req.user._id,
      platform: 'facebook'
    });

    if (integration) {
      integration.status = 'disconnected';
      await integration.save();
    }

    const user = await User.findById(req.user._id);
    user.integrations.facebook.connected = false;
    await user.save();

    res.json({ message: 'Facebook Messenger disconnected successfully' });
  } catch (error) {
    console.error('Facebook disconnect error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/integrations/facebook/auth-url
// @desc    Get Facebook OAuth URL
// @access  Private
router.get('/facebook/auth-url', protect, (req, res) => {
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/integrations/facebook/callback`;
  const scope = 'pages_messaging,pages_manage_metadata,pages_read_engagement';
  
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
  
  res.json({ authUrl });
});

// @route   GET /api/integrations/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get('/facebook/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/integrations?error=no_code`);
    }

    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/integrations/facebook/callback`,
        code
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/integrations/facebook/complete?token=${accessToken}`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/integrations?error=auth_failed`);
  }
});

// @route   GET /api/integrations/:platform/status
// @desc    Get integration status
// @access  Private
router.get('/:platform/status', protect, async (req, res) => {
  try {
    const integration = await Integration.findOne({
      userId: req.user._id,
      platform: req.params.platform
    });

    if (!integration) {
      return res.json({ connected: false });
    }

    res.json({
      connected: integration.status === 'connected',
      status: integration.status,
      platformData: integration.platformData,
      connectedAt: integration.connectedAt
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
