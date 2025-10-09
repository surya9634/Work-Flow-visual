import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'whatsapp'],
    required: true
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error', 'pending'],
    default: 'pending'
  },
  credentials: {
    pageId: String,
    pageAccessToken: String,
    accountId: String,
    phoneNumberId: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Date
  },
  platformData: {
    pageName: String,
    pageUsername: String,
    profilePicture: String,
    followersCount: Number,
    category: String
  },
  webhookVerified: {
    type: Boolean,
    default: false
  },
  lastSync: Date,
  errorLog: [{
    error: String,
    timestamp: Date,
    resolved: Boolean
  }],
  settings: {
    autoReply: { type: Boolean, default: true },
    businessHours: {
      enabled: { type: Boolean, default: false },
      timezone: String,
      schedule: mongoose.Schema.Types.Mixed
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  connectedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

integrationSchema.index({ userId: 1, platform: 1 }, { unique: true });

integrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Integration', integrationSchema);
