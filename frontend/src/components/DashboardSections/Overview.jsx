import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  DollarSign,
  Activity,
  Zap
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { analyticsAPI, chatAPI } from '../../services/api';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Refresh real-time data every 30 seconds
    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, realTimeRes, dashboardRes] = await Promise.all([
        chatAPI.getStats(),
        analyticsAPI.getRealTime(),
        analyticsAPI.getDashboard({
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        })
      ]);

      setStats(statsRes.data);
      setRealTimeData(realTimeRes.data);
      
      // Prepare chart data
      if (dashboardRes.data.timeSeries) {
        const labels = dashboardRes.data.timeSeries.map(d => 
          new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Messages',
              data: dashboardRes.data.timeSeries.map(d => d.messages),
              borderColor: 'rgb(147, 51, 234)',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              fill: true,
            },
            {
              label: 'Conversions',
              data: dashboardRes.data.timeSeries.map(d => d.conversions),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
            }
          ]
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Fetch data error:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const res = await analyticsAPI.getRealTime();
      setRealTimeData(res.data);
    } catch (error) {
      console.error('Fetch real-time data error:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Chats',
      value: stats?.totalChats || 0,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      change: '+12%'
    },
    {
      title: 'Active Conversations',
      value: realTimeData?.activeChats || 0,
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      change: 'Live'
    },
    {
      title: 'Conversions',
      value: stats?.conversions || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: `${stats?.conversionRate || 0}%`
    },
    {
      title: 'Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      change: '+18%'
    }
  ];

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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-400 font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Activity Trend</h3>
          {chartData && (
            <Line
              data={chartData}
              options={{
                responsive: true,
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

        {/* Real-time Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Real-time Activity</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Messages (Last Hour)</p>
                  <p className="text-sm text-gray-400">Automated responses</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                {realTimeData?.messagesLastHour || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Conversions Today</p>
                  <p className="text-sm text-gray-400">Successful sales</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                {realTimeData?.conversionsToday || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Revenue Today</p>
                  <p className="text-sm text-gray-400">Total earnings</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                ${realTimeData?.revenueToday?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
            Create New Campaign
          </button>
          <button className="p-4 bg-white/10 rounded-lg text-white font-semibold hover:bg-white/20 transition-all border border-white/20">
            View All Chats
          </button>
          <button className="p-4 bg-white/10 rounded-lg text-white font-semibold hover:bg-white/20 transition-all border border-white/20">
            Connect Platform
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
