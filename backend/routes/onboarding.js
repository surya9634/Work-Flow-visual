import express from 'express';
import multer from 'multer';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { trainGlobalAI } from '../services/aiService.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST /api/onboarding/complete
// @desc    Complete onboarding process
// @access  Private
router.post('/complete', protect, async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      industry,
      description,
      website,
      phone
    } = req.body;

    const user = await User.findById(req.user._id);

    user.businessInfo = {
      ...user.businessInfo,
      businessName,
      ownerName,
      industry,
      description,
      website,
      phone
    };
    user.onboardingCompleted = true;

    await user.save();

    // Train Global AI with business information
    try {
      await trainGlobalAI(user._id, user.businessInfo);
      user.globalAI.trained = true;
      user.globalAI.lastTrainedAt = new Date();
      await user.save();
    } catch (aiError) {
      console.error('AI training error:', aiError);
      // Continue even if AI training fails
    }

    res.json({
      message: 'Onboarding completed successfully',
      user: {
        _id: user._id,
        email: user.email,
        businessInfo: user.businessInfo,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/onboarding/upload-document
// @desc    Upload business documents
// @access  Private
router.post('/upload-document', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);

    const document = {
      name: req.file.originalname,
      url: `/uploads/documents/${req.file.filename}`,
      uploadedAt: new Date()
    };

    user.businessInfo.documents = user.businessInfo.documents || [];
    user.businessInfo.documents.push(document);

    await user.save();

    // Retrain AI with new document
    try {
      await trainGlobalAI(user._id, user.businessInfo);
      user.globalAI.lastTrainedAt = new Date();
      await user.save();
    } catch (aiError) {
      console.error('AI retraining error:', aiError);
    }

    res.json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/onboarding/status
// @desc    Get onboarding status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('onboardingCompleted businessInfo');
    res.json(user);
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
