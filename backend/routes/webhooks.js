import express from 'express';
import { handleFacebookWebhook } from '../services/webhookService.js';

const router = express.Router();

// @route   GET /api/webhooks/facebook
// @desc    Verify Facebook webhook
// @access  Public
router.get('/facebook', (req, res) => {
  const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Facebook webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Facebook webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// @route   POST /api/webhooks/facebook
// @desc    Receive Facebook webhook events
// @access  Public
router.post('/facebook', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    // Return 200 OK immediately
    res.status(200).send('EVENT_RECEIVED');

    // Process webhook events asynchronously
    body.entry.forEach(async (entry) => {
      const webhookEvent = entry.messaging[0];
      console.log('📨 Webhook event received:', webhookEvent);

      try {
        await handleFacebookWebhook(webhookEvent, req.app.get('io'));
      } catch (error) {
        console.error('❌ Error processing webhook:', error);
      }
    });
  } else {
    res.sendStatus(404);
  }
});

// @route   GET /api/webhooks/instagram
// @desc    Verify Instagram webhook
// @access  Public
router.get('/instagram', (req, res) => {
  const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Instagram webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Instagram webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// @route   POST /api/webhooks/instagram
// @desc    Receive Instagram webhook events
// @access  Public
router.post('/instagram', async (req, res) => {
  const body = req.body;

  if (body.object === 'instagram') {
    res.status(200).send('EVENT_RECEIVED');

    // Process Instagram events (similar to Facebook)
    body.entry.forEach(async (entry) => {
      const webhookEvent = entry.messaging?.[0] || entry.changes?.[0];
      console.log('📨 Instagram webhook event:', webhookEvent);

      // Handle Instagram messages
      // TODO: Implement Instagram message handling
    });
  } else {
    res.sendStatus(404);
  }
});

export default router;
