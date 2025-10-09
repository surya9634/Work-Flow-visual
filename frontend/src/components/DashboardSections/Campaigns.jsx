import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Play, Pause, BarChart } from 'lucide-react';
import { campaignAPI } from '../../services/api';
import toast from 'react-hot-toast';
import CreateCampaignModal from './CreateCampaignModal';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignAPI.getAll();
      setCampaigns(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch campaigns error:', error);
      toast.error('Failed to load campaigns');
      setLoading(false);
    }
  };

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      await campaignAPI.updateStatus(campaignId, newStatus);
      toast.success(`Campaign ${newStatus}`);
      fetchCampaigns();
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update campaign status');
    }
  };

  const handleDelete = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await campaignAPI.delete(campaignId);
      toast.success('Campaign deleted');
      fetchCampaigns();
    } catch (error) {
      console.error('Delete campaign error:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-gray-400">Manage your product campaigns and sales automation</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No campaigns yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first campaign to start automating your sales with AI
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create Your First Campaign
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all"
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs text-white font-semibold ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
                <span className="text-sm text-gray-400">{campaign.targetPlatform}</span>
              </div>

              {/* Campaign Info */}
              <h3 className="text-xl font-bold text-white mb-2">{campaign.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {campaign.product.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Messages</p>
                  <p className="text-lg font-bold text-white">{campaign.stats.messagesSet}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Conversions</p>
                  <p className="text-lg font-bold text-white">{campaign.stats.conversions}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Revenue</p>
                  <p className="text-lg font-bold text-white">${campaign.stats.revenue}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Rate</p>
                  <p className="text-lg font-bold text-white">
                    {campaign.stats.messagesSet > 0 
                      ? ((campaign.stats.conversions / campaign.stats.messagesSet) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {campaign.status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange(campaign._id, 'paused')}
                    className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(campaign._id, 'active')}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                  >
                    <Play className="w-4 h-4" />
                    Activate
                  </button>
                )}
                <button
                  onClick={() => handleDelete(campaign._id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchCampaigns();
          }}
        />
      )}
    </div>
  );
};

export default Campaigns;
