import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'whatsapp'],
    required: true
  },
  customerId: {
    type: String,
    required: true // Platform-specific customer ID (PSID for FB, etc.)
  },
  customerName: String,
  customerProfile: {
    profilePic: String,
    email: String,
    phone: String
  },
  messages: [{
    sender: {
      type: String,
      enum: ['customer', 'ai', 'business'],
      required: true
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'quick_reply'],
      default: 'text'
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  status: {
    type: String,
    enum: ['active', 'qualified', 'converted', 'closed', 'archived'],
    default: 'active'
  },
  leadScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  aiContext: {
    conversationSummary: String,
    customerIntent: String,
    qualificationAnswers: mongoose.Schema.Types.Mixed,
    objections: [String],
    nextAction: String
  },
  conversion: {
    converted: { type: Boolean, default: false },
    convertedAt: Date,
    orderValue: Number,
    orderDetails: mongoose.Schema.Types.Mixed
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

chatSchema.index({ userId: 1, platform: 1, customerId: 1 });
chatSchema.index({ campaignId: 1, status: 1 });
chatSchema.index({ lastMessageAt: -1 });

chatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

export default mongoose.model('Chat', chatSchema);
