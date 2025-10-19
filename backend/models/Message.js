import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'whatsapp'],
    required: true
  },
  platformMessageId: String,
  sender: {
    type: String,
    enum: ['customer', 'ai', 'business'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  metadata: {
    customerName: String,
    customerPlatformId: String,
    sentiment: String,
    intent: String,
    aiConfidence: Number
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, platform: 1 });

export default mongoose.model('Message', messageSchema);
