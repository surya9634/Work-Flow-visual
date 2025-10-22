import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Facebook Messenger Integration Component
 * 
 * This component handles:
 * - Facebook OAuth connection flow
 * - Integration status display
 * - Disconnection
 * - OAuth callback handling
 */
const FacebookIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [integration, setIntegration] = useState(null);
  const [checking, setChecking] = useState(true);

  // Get auth token from your auth context/store
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fetch integration status on component mount
  useEffect(() => {
    checkIntegrationStatus();
    handleOAuthCallback();
  }, []);

  /**
   * Check if Facebook is already connected
   */
  const checkIntegrationStatus = async () => {
    try {
      setChecking(true);
      const token = getAuthToken();
      
      const response = await fetch('/api/integrations/facebook/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIntegration(data.connected ? data : null);
      }
    } catch (error) {
      console.error('Error checking integration status:', error);
    } finally {
      setChecking(false);
    }
  };

  /**
   * Handle OAuth callback from Facebook
   */
  const handleOAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const tempToken = urlParams.get('token');
    
    if (success === 'facebook_connected') {
      toast.success('🎉 Facebook Messenger connected successfully!');
      
      // If temp token is provided, update auth token
      if (tempToken) {
        // Optionally re-authenticate with temp token
        // This ensures the session is still valid after OAuth redirect
      }
      
      // Refresh integration status
      checkIntegrationStatus();
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    if (error) {
      let errorMessage = 'Failed to connect Facebook Messenger';
      
      switch(error) {
        case 'access_denied':
          errorMessage = 'Access denied. Please grant the required permissions to continue.';
          break;
        case 'no_pages':
          errorMessage = 'No Facebook pages found. Please create a Facebook page first.';
          break;
        case 'connection_failed':
          errorMessage = 'Connection failed. Please try again or check your Facebook app settings.';
          break;
      }
      
      toast.error(errorMessage);
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  /**
   * Initiate Facebook OAuth connection
   */
  const connectFacebook = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        toast.error('Please log in first');
        return;
      }
      
      // Call backend to get Facebook OAuth URL
      const response = await fetch('/api/integrations/facebook/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to initiate Facebook connection');
      }

      const data = await response.json();
      
      if (data.authUrl) {
        // Show loading toast
        toast.loading('Redirecting to Facebook...', { duration: 2000 });
        
        // Redirect to Facebook OAuth
        setTimeout(() => {
          window.location.href = data.authUrl;
        }, 500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Facebook connection error:', error);
      toast.error('Failed to connect Facebook. Please try again.');
      setLoading(false);
    }
  };

  /**
   * Disconnect Facebook integration
   */
  const disconnectFacebook = async () => {
    if (!confirm('Are you sure you want to disconnect Facebook Messenger?')) {
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch('/api/integrations/facebook/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Facebook Messenger disconnected');
        setIntegration(null);
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Checking Facebook connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Facebook Messenger</h3>
            <p className="text-sm text-gray-600">
              {integration ? 'Connected' : 'Automate customer conversations on Facebook'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          {integration ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              Not Connected
            </span>
          )}
        </div>
      </div>

      {integration && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {integration.platformData?.pageName || 'Facebook Page'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Connected on {new Date(integration.connectedAt).toLocaleDateString()}
              </p>
              {integration.platformData?.followersCount && (
                <p className="text-xs text-gray-600">
                  {integration.platformData.followersCount.toLocaleString()} followers
                </p>
              )}
            </div>
            {integration.platformData?.profilePicture && (
              <img 
                src={integration.platformData.profilePicture} 
                alt="Page" 
                className="w-12 h-12 rounded-full"
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm text-gray-700">AI-powered automated responses</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm text-gray-700">Real-time message notifications</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm text-gray-700">Automatic lead qualification</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm text-gray-700">Conversation analytics & insights</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 flex gap-3">
        {integration ? (
          <>
            <button
              onClick={disconnectFacebook}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Disconnecting...' : 'Disconnect'}
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/chats?platform=facebook'}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Conversations
            </button>
          </>
        ) : (
          <button
            onClick={connectFacebook}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Connect Facebook
              </>
            )}
          </button>
        )}
      </div>

      {!integration && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> You'll need a Facebook Page to use Messenger automation. 
            Make sure you're an admin of the page you want to connect.
          </p>
        </div>
      )}
    </div>
  );
};

export default FacebookIntegration;
