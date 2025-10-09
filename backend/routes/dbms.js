import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';
import Chat from '../models/Chat.js';
import Analytics from '../models/Analytics.js';
import Integration from '../models/Integration.js';

const router = express.Router();

// Get collection stats
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = {
      users: await User.countDocuments({ _id: userId }),
      campaigns: await Campaign.countDocuments({ userId }),
      chats: await Chat.countDocuments({ userId }),
      analytics: await Analytics.countDocuments({ userId }),
      integrations: await Integration.countDocuments({ userId })
    };

    // If admin, show all
    if (req.user.role === 'admin') {
      stats.users = await User.countDocuments();
      stats.campaigns = await Campaign.countDocuments();
      stats.chats = await Chat.countDocuments();
      stats.analytics = await Analytics.countDocuments();
      stats.integrations = await Integration.countDocuments();
    }

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get data from collection
router.get('/:collection', protect, async (req, res) => {
  try {
    const { collection } = req.params;
    const userId = req.user._id;
    const { limit = 100, skip = 0 } = req.query;

    let Model;
    let query = {};

    switch (collection) {
      case 'users':
        Model = User;
        query = req.user.role === 'admin' ? {} : { _id: userId };
        break;
      case 'campaigns':
        Model = Campaign;
        query = { userId };
        break;
      case 'chats':
        Model = Chat;
        query = { userId };
        break;
      case 'analytics':
        Model = Analytics;
        query = { userId };
        break;
      case 'integrations':
        Model = Integration;
        query = { userId };
        break;
      default:
        return res.status(400).json({ message: 'Invalid collection' });
    }

    const data = await Model.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 })
      .select('-password'); // Never return passwords

    res.json(data);
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single document
router.get('/:collection/:id', protect, async (req, res) => {
  try {
    const { collection, id } = req.params;
    const userId = req.user._id;

    let Model;
    let query = { _id: id };

    switch (collection) {
      case 'users':
        Model = User;
        if (req.user.role !== 'admin') query.userId = userId;
        break;
      case 'campaigns':
        Model = Campaign;
        query.userId = userId;
        break;
      case 'chats':
        Model = Chat;
        query.userId = userId;
        break;
      case 'analytics':
        Model = Analytics;
        query.userId = userId;
        break;
      case 'integrations':
        Model = Integration;
        query.userId = userId;
        break;
      default:
        return res.status(400).json({ message: 'Invalid collection' });
    }

    const data = await Model.findOne(query).select('-password');

    if (!data) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete document
router.delete('/:collection/:id', protect, async (req, res) => {
  try {
    const { collection, id } = req.params;
    const userId = req.user._id;

    let Model;
    let query = { _id: id };

    switch (collection) {
      case 'users':
        return res.status(403).json({ message: 'Cannot delete users via DBMS' });
      case 'campaigns':
        Model = Campaign;
        query.userId = userId;
        break;
      case 'chats':
        Model = Chat;
        query.userId = userId;
        break;
      case 'analytics':
        Model = Analytics;
        query.userId = userId;
        break;
      case 'integrations':
        Model = Integration;
        query.userId = userId;
        break;
      default:
        return res.status(400).json({ message: 'Invalid collection' });
    }

    const result = await Model.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk export
router.post('/export', protect, async (req, res) => {
  try {
    const { collections } = req.body;
    const userId = req.user._id;

    const exportData = {};

    for (const collection of collections) {
      let Model;
      let query = {};

      switch (collection) {
        case 'users':
          Model = User;
          query = { _id: userId };
          break;
        case 'campaigns':
          Model = Campaign;
          query = { userId };
          break;
        case 'chats':
          Model = Chat;
          query = { userId };
          break;
        case 'analytics':
          Model = Analytics;
          query = { userId };
          break;
        case 'integrations':
          Model = Integration;
          query = { userId };
          break;
        default:
          continue;
      }

      exportData[collection] = await Model.find(query).select('-password');
    }

    res.json(exportData);
  } catch (error) {
    console.error('Bulk export error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Database health check
router.get('/health/check', protect, async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    
    const health = {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      collections: await mongoose.connection.db.listCollections().toArray(),
      stats: {
        users: await User.countDocuments(),
        campaigns: await Campaign.countDocuments(),
        chats: await Chat.countDocuments(),
        analytics: await Analytics.countDocuments(),
        integrations: await Integration.countDocuments()
      }
    };

    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear all user data (dangerous - requires confirmation)
router.post('/clear-all', protect, async (req, res) => {
  try {
    const { confirmation } = req.body;
    
    if (confirmation !== 'DELETE_ALL_MY_DATA') {
      return res.status(400).json({ message: 'Invalid confirmation' });
    }

    const userId = req.user._id;

    await Promise.all([
      Campaign.deleteMany({ userId }),
      Chat.deleteMany({ userId }),
      Analytics.deleteMany({ userId }),
      Integration.deleteMany({ userId })
    ]);

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    console.error('Clear all error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
