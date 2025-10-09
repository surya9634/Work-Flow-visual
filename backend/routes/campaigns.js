import express from 'express';
import Campaign from '../models/Campaign.js';
import { protect } from '../middleware/auth.js';
import { updateGlobalAIWithCampaign } from '../services/aiService.js';

const router = express.Router();

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      product,
      targetPlatform,
      chatFlow,
      targetAudience,
      outreachMessage
    } = req.body;

    const campaign = await Campaign.create({
      userId: req.user._id,
      name,
      product,
      targetPlatform,
      chatFlow,
      targetAudience,
      outreachMessage,
      status: 'draft'
    });

    // Update Global AI with campaign information
    try {
      await updateGlobalAIWithCampaign(req.user._id, campaign);
    } catch (aiError) {
      console.error('AI update error:', aiError);
    }

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/campaigns
// @desc    Get all campaigns for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Get single campaign
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update campaign
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    Object.assign(campaign, req.body);
    await campaign.save();

    // Update Global AI
    try {
      await updateGlobalAIWithCampaign(req.user._id, campaign);
    } catch (aiError) {
      console.error('AI update error:', aiError);
    }

    res.json(campaign);
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete campaign
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.deleteOne();
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/campaigns/:id/status
// @desc    Update campaign status
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.status = status;
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/campaigns/:id/stats
// @desc    Get campaign statistics
// @access  Private
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign.stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
