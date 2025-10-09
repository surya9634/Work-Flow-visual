import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState(null);
  const [campaignAnalytics, setCampaignAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const [dashboardRes, campaignsRes] = await Promise.all([
        analyticsAPI.getDashboard({ startDate, endDate }),
        analyticsAPI.getCampaigns()
      ]);

      setDashboardData(dashboardRes.data);
      setCampaignAnalytics(campaignsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch analytics error:', error);
      toast.error('Failed to load analytics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const timeSeriesData = dashboardData?.timeSeries ? {
    labels: dashboardData.timeSeries.map(d => 
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Messages',
        data: dashboardData.timeSeries.map(d => d.messages),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
      },
      {
        label: 'Conversions',
        data: dashboardData.timeSeries.map(d => d.conversions),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
      }
    ]
  } : null;

  const revenueData = dashboardData?.timeSeries ? {
    labels: dashboardData.timeSeries.map(d => 
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      label: 'Revenue ($)',
      data: dashboardData.timeSeries.map(d => d.revenue),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    }]
  } : null;

  const campaignPerformanceData = campaignAnalytics.length > 0 ? {
    labels: campaignAnalytics.map(c => c.name),
    datasets: [{
      label: 'Conversions',
      data: campaignAnalytics.map(c => c.stats.conversions),
      backgroundColor: [
        'rgba(147, 51, 234, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
    }]
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Track your performance and insights</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Messages</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {dashboardData?.summary?.messagesSent + dashboardData?.summary?.messagesReceived || 0}
          </p>
          <p className="text-sm text-green-400">+{dashboardData?.summary?.responseRate || 0}% response rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Conversations</h3>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {dashboardData?.summary?.conversationsStarted || 0}
          </p>
          <p className="text-sm text-blue-400">New leads generated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Conversions</h3>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {dashboardData?.summary?.conversions || 0}
          </p>
          <p className="text-sm text-purple-400">{dashboardData?.summary?.conversionRate || 0}% conversion rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Revenue</h3>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${dashboardData?.summary?.revenue?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-yellow-400">${dashboardData?.summary?.avgOrderValue || 0} avg order</p>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Activity Trend</h3>
          {timeSeriesData && (
            <Line
              data={timeSeriesData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    labels: { color: 'white' }
                  }
                },
                scales: {
                  x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  },
                  y: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  }
                }
              }}
            />
          )}
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Revenue Over Time</h3>
          {revenueData && (
            <Bar
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    labels: { color: 'white' }
                  }
                },
                scales: {
                  x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  },
                  y: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  }
                }
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Campaign Performance</h3>
          {campaignPerformanceData && (
            <Doughnut
              data={campaignPerformanceData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: 'white', padding: 10 }
                  }
                }
              }}
            />
          )}
        </motion.div>

        {/* Top Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Campaigns</h3>
          <div className="space-y-3">
            {campaignAnalytics.slice(0, 5).map((campaign, index) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{campaign.name}</h4>
                    <p className="text-sm text-gray-400">{campaign.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${campaign.stats.revenue}</p>
                  <p className="text-sm text-gray-400">{campaign.stats.conversions} conversions</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">AI Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Response Rate</p>
            <p className="text-2xl font-bold text-white">{dashboardData?.summary?.responseRate || 0}%</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Avg Response Time</p>
            <p className="text-2xl font-bold text-white">&lt;2s</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">AI Accuracy</p>
            <p className="text-2xl font-bold text-white">94%</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Automation Rate</p>
            <p className="text-2xl font-bold text-white">98%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
