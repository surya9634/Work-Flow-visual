import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  businessInfo: {
    businessName: String,
    ownerName: String,
    industry: String,
    description: String,
    website: String,
    phone: String,
    documents: [{
      name: String,
      url: String,
      uploadedAt: Date
    }]
  },
  integrations: {
    facebook: {
      connected: { type: Boolean, default: false },
      pageId: String,
      pageAccessToken: String,
      connectedAt: Date
    },
    instagram: {
      connected: { type: Boolean, default: false },
      accountId: String,
      accessToken: String,
      connectedAt: Date
    },
    whatsapp: {
      connected: { type: Boolean, default: false },
      phoneNumberId: String,
      accessToken: String,
      connectedAt: Date
    }
  },
  globalAI: {
    trained: { type: Boolean, default: false },
    lastTrainedAt: Date,
    knowledgeBase: String // Stores processed business info for AI
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('User', userSchema);
