import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { integrationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Integrations = () => {
  const [integrations, setIntegrations] = useState({
    facebook: { connected: false, loading: false },
    instagram: { connected: false, loading: false },
    whatsapp: { connected: false, loading: false }
  });
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [facebookCredentials, setFacebookCredentials] = useState({
    pageId: '',
    pageAccessToken: ''
  });

  useEffect(() => {
    fetchIntegrationStatus();
  }, []);

  const fetchIntegrationStatus = async () => {
    try {
      const platforms = ['facebook', 'instagram', 'whatsapp'];
      const statuses = await Promise.all(
        platforms.map(platform => integrationAPI.getStatus(platform))
      );

      const newIntegrations = {};
      platforms.forEach((platform, index) => {
        newIntegrations[platform] = {
          connected: statuses[index].data.connected,
          loading: false,
          ...statuses[index].data
        };
      });

      setIntegrations(newIntegrations);
    } catch (error) {
      console.error('Fetch integration status error:', error);
    }
  };

  const handleFacebookConnect = async () => {
    setIntegrations(prev => ({
      ...prev,
      facebook: { ...prev.facebook, loading: true }
    }));

    try {
      // Get OAuth URL from backend
      const response = await integrationAPI.getFacebookAuthUrl();
      const { authUrl } = response.data;
      
      // Redirect to Facebook OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Facebook connect error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate Facebook connection');
      setIntegrations(prev => ({
        ...prev,
        facebook: { ...prev.facebook, loading: false }
      }));
    }
  };

  const handleFacebookDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Facebook Messenger?')) return;

    try {
      await integrationAPI.disconnectFacebook();
      toast.success('Facebook Messenger disconnected');
      fetchIntegrationStatus();
    } catch (error) {
      console.error('Facebook disconnect error:', error);
      toast.error('Failed to disconnect Facebook');
    }
  };

  const platformCards = [
    {
      id: 'facebook',
      name: 'Facebook Messenger',
      icon: Facebook,
      color: 'from-blue-500 to-blue-600',
      description: 'Automate conversations on Facebook Messenger',
      status: integrations.facebook.connected,
      available: true
    },
    {
      id: 'instagram',
      name: 'Instagram DM',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      description: 'Automate Instagram direct messages',
      status: integrations.instagram.connected,
      available: false
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      description: 'Automate WhatsApp Business messages',
      status: integrations.whatsapp.connected,
      available: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
        <p className="text-gray-400">Connect your social media platforms to automate conversations</p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platformCards.map((platform, index) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              {/* Icon and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${platform.color}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                {platform.status ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Not Connected</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{platform.description}</p>

              {/* Connection Details */}
              {platform.status && integrations[platform.id].platformData && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <strong>Page:</strong> {integrations[platform.id].platformData.pageName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Connected {new Date(integrations[platform.id].connectedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Action Button */}
              {platform.available ? (
                platform.status ? (
                  <button
                    onClick={() => platform.id === 'facebook' && handleFacebookDisconnect()}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => platform.id === 'facebook' && handleFacebookConnect()}
                    disabled={integrations[platform.id].loading}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {integrations[platform.id].loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting to Facebook...
                      </>
                    ) : (
                      'Connect with Facebook'
                    )}
                  </button>
                )
              ) : (
                <button
                  disabled
                  className="w-full py-2 bg-gray-600 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Setup Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Setup Instructions</h3>
        <div className="space-y-4 text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Facebook Messenger Setup:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Facebook Developers</a></li>
              <li>Create a new app or use an existing one</li>
              <li>Add the Messenger product to your app</li>
              <li>Generate a Page Access Token for your Facebook Page</li>
              <li>Copy your Page ID and Access Token</li>
              <li>Click "Connect" above and paste your credentials</li>
            </ol>
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-200">
              <strong>Note:</strong> Make sure to set up the webhook URL in your Facebook App settings:
              <code className="block mt-2 p-2 bg-black/30 rounded text-xs">
                {window.location.origin.replace('5173', '5000')}/api/webhooks/facebook
              </code>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Facebook Connection Modal */}
      {showFacebookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-white/20 max-w-md w-full p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Connect Facebook Messenger</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Facebook Page ID
                </label>
                <input
                  type="text"
                  value={facebookCredentials.pageId}
                  onChange={(e) => setFacebookCredentials(prev => ({ ...prev, pageId: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="123456789012345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Page Access Token
                </label>
                <textarea
                  value={facebookCredentials.pageAccessToken}
                  onChange={(e) => setFacebookCredentials(prev => ({ ...prev, pageAccessToken: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="EAAxxxxxxxxxx..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFacebookModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleFacebookConnect}
                disabled={integrations.facebook.loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                {integrations.facebook.loading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
