import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  product: {
    name: { type: String, required: true },
    description: String,
    price: Number,
    images: [String],
    features: [String]
  },
  targetPlatform: {
    type: String,
    enum: ['facebook', 'instagram', 'whatsapp', 'all'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft'
  },
  chatFlow: {
    greeting: String,
    qualificationQuestions: [String],
    objectionHandling: [{ objection: String, response: String }],
    closingMessage: String
  },
  targetAudience: {
    demographics: {
      ageRange: String,
      location: [String],
      interests: [String]
    },
    persona: String
  },
  outreachMessage: String,
  stats: {
    messagesSet: { type: Number, default: 0 },
    responses: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
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

campaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Campaign', campaignSchema);
