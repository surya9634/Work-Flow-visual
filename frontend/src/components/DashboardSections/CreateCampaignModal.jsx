import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, DollarSign, MessageSquare, Target } from 'lucide-react';
import { campaignAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CreateCampaignModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    product: {
      name: '',
      description: '',
      price: '',
      features: ['']
    },
    targetPlatform: 'facebook',
    chatFlow: {
      greeting: '',
      qualificationQuestions: [''],
      closingMessage: ''
    },
    targetAudience: {
      demographics: {
        ageRange: '',
        location: [''],
        interests: ['']
      }
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (parent, field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: prev[parent][field].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addArrayItem = (parent, field) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: [...prev[parent][field], '']
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await campaignAPI.create({
        ...formData,
        product: {
          ...formData.product,
          price: parseFloat(formData.product.price),
          features: formData.product.features.filter(f => f.trim() !== '')
        }
      });
      toast.success('Campaign created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Create campaign error:', error);
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Create New Campaign</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-purple-600' : 'bg-white/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-white' : 'text-gray-400'}>Product Info</span>
              <span className={step >= 2 ? 'text-white' : 'text-gray-400'}>Chat Flow</span>
              <span className={step >= 3 ? 'text-white' : 'text-gray-400'}>Target Audience</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Summer Sale Campaign"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.product.name}
                    onChange={(e) => handleNestedChange('product', 'name', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Premium Widget"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.product.description}
                    onChange={(e) => handleNestedChange('product', 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.product.price}
                    onChange={(e) => handleNestedChange('product', 'price', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="99.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Features
                  </label>
                  {formData.product.features.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('product', 'features', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                      placeholder={`Feature ${index + 1}`}
                    />
                  ))}
                  <button
                    onClick={() => addArrayItem('product', 'features')}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Target Platform
                  </label>
                  <select
                    value={formData.targetPlatform}
                    onChange={(e) => handleChange('targetPlatform', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="facebook">Facebook Messenger</option>
                    <option value="instagram">Instagram DM</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="all">All Platforms</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Greeting Message
                  </label>
                  <textarea
                    value={formData.chatFlow.greeting}
                    onChange={(e) => handleNestedChange('chatFlow', 'greeting', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Hi! Thanks for your interest in our product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Qualification Questions
                  </label>
                  {formData.chatFlow.qualificationQuestions.map((question, index) => (
                    <input
                      key={index}
                      type="text"
                      value={question}
                      onChange={(e) => handleArrayChange('chatFlow', 'qualificationQuestions', index, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                      placeholder={`Question ${index + 1}`}
                    />
                  ))}
                  <button
                    onClick={() => addArrayItem('chatFlow', 'qualificationQuestions')}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    + Add Question
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Closing Message
                  </label>
                  <textarea
                    value={formData.chatFlow.closingMessage}
                    onChange={(e) => handleNestedChange('chatFlow', 'closingMessage', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Thank you for your purchase! We'll send you a confirmation email..."
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Age Range
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience.demographics.ageRange}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        demographics: {
                          ...prev.targetAudience.demographics,
                          ageRange: e.target.value
                        }
                      }
                    }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="25-45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Target Locations
                  </label>
                  {formData.targetAudience.demographics.location.map((loc, index) => (
                    <input
                      key={index}
                      type="text"
                      value={loc}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          demographics: {
                            ...prev.targetAudience.demographics,
                            location: prev.targetAudience.demographics.location.map((l, i) => 
                              i === index ? e.target.value : l
                            )
                          }
                        }
                      }))}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                      placeholder="United States"
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Interests
                  </label>
                  {formData.targetAudience.demographics.interests.map((interest, index) => (
                    <input
                      key={index}
                      type="text"
                      value={interest}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          demographics: {
                            ...prev.targetAudience.demographics,
                            interests: prev.targetAudience.demographics.interests.map((i, idx) => 
                              idx === index ? e.target.value : i
                            )
                          }
                        }
                      }))}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                      placeholder="Technology, Business"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateCampaignModal;
