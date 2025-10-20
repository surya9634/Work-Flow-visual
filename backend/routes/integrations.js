import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import Integration from '../models/Integration.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Facebook OAuth configuration
const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const REDIRECT_URI = process.env.BACKEND_URL 
  ? `${process.env.BACKEND_URL}/api/integrations/facebook/callback`
  : 'http://localhost:5000/api/integrations/facebook/callback';

// @route   GET /api/integrations/facebook/auth
// @desc    Initiate Facebook OAuth flow
// @access  Private
router.get('/facebook/auth', protect, (req, res) => {
  try {
    if (!FB_APP_ID) {
      return res.status(500).json({ message: 'Facebook App ID not configured' });
    }

    // Store user ID in state parameter for callback
    const state = Buffer.from(JSON.stringify({ userId: req.user._id })).toString('base64');

    // Facebook OAuth URL with required permissions
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${FB_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&state=${state}` +
      `&scope=pages_manage_metadata,pages_messaging,pages_read_engagement,pages_manage_posts`;

    res.json({ authUrl });
  } catch (error) {
    console.error('Facebook auth initiation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/integrations/facebook/callback
// @desc    Handle Facebook OAuth callback
// @access  Public (Facebook redirects here)
router.get('/facebook/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/integrations?error=access_denied`);
    }

    // Decode state to get user ID
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());

    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        redirect_uri: REDIRECT_URI,
        code
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Get user's pages
    const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: {
        access_token: accessToken,
        fields: 'id,name,access_token,picture,followers_count,category'
      }
    });

    const pages = pagesResponse.data.data;

    if (!pages || pages.length === 0) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/integrations?error=no_pages`);
    }

    // Use the first page (or let user select later)
    const page = pages[0];

    // Subscribe page to webhooks
    await axios.post(
      `https://graph.facebook.com/v18.0/${page.id}/subscribed_apps`,
      {
        subscribed_fields: 'messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads'
      },
      {
        params: { access_token: page.access_token }
      }
    );

    // Save integration to database
    await Integration.findOneAndUpdate(
      { userId, platform: 'facebook' },
      {
        userId,
        platform: 'facebook',
        status: 'connected',
        credentials: {
          pageId: page.id,
          pageAccessToken: page.access_token
        },
        platformData: {
          pageName: page.name,
          profilePicture: page.picture?.data?.url,
          followersCount: page.followers_count,
          category: page.category
        },
        webhookVerified: true,
        connectedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Redirect back to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/integrations?success=facebook_connected`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/integrations?error=connection_failed`);
  }
});

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
