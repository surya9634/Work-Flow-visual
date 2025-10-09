import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  date: {
    type: Date,
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'whatsapp', 'all'],
    default: 'all'
  },
  metrics: {
    // Message metrics
    messagesSent: { type: Number, default: 0 },
    messagesReceived: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    avgResponseTime: { type: Number, default: 0 }, // in seconds
    
    // Conversation metrics
    conversationsStarted: { type: Number, default: 0 },
    activeConversations: { type: Number, default: 0 },
    conversationsCompleted: { type: Number, default: 0 },
    
    // Lead metrics
    leadsGenerated: { type: Number, default: 0 },
    qualifiedLeads: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    
    // Revenue metrics
    revenue: { type: Number, default: 0 },
    avgOrderValue: { type: Number, default: 0 },
    
    // Engagement metrics
    engagementRate: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    
    // AI Performance
    aiAccuracy: { type: Number, default: 0 },
    aiHandoffRate: { type: Number, default: 0 }
  },
  hourlyData: [{
    hour: Number,
    messages: Number,
    conversations: Number,
    conversions: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

analyticsSchema.index({ userId: 1, date: -1 });
analyticsSchema.index({ campaignId: 1, date: -1 });
analyticsSchema.index({ date: -1, platform: 1 });

export default mongoose.model('Analytics', analyticsSchema);
