import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Table, Search, Download, Upload, Trash2, RefreshCw, Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DatabaseManager = () => {
  const [selectedCollection, setSelectedCollection] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({});

  const collections = [
    { name: 'users', icon: '👤', label: 'Users' },
    { name: 'campaigns', icon: '🎯', label: 'Campaigns' },
    { name: 'chats', icon: '💬', label: 'Chats' },
    { name: 'analytics', icon: '📊', label: 'Analytics' },
    { name: 'integrations', icon: '🔌', label: 'Integrations' }
  ];

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [selectedCollection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get(`${API_URL}/dbms/${selectedCollection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get(`${API_URL}/dbms/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await axios.delete(`${API_URL}/dbms/${selectedCollection}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Record deleted');
      fetchData();
      fetchStats();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete record');
    }
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCollection}_${new Date().toISOString()}.json`;
    a.click();
    toast.success('Data exported');
  };

  const filteredData = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">Database Management System</h1>
        </div>
        <p className="text-gray-400">View and manage all your data collections</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {collections.map((col) => (
          <motion.div
            key={col.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedCollection === col.name
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400'
                : 'bg-white/10 backdrop-blur-lg border-white/20 hover:border-purple-400'
            }`}
            onClick={() => setSelectedCollection(col.name)}
          >
            <div className="text-3xl mb-2">{col.icon}</div>
            <h3 className="text-white font-semibold">{col.label}</h3>
            <p className="text-2xl font-bold text-white mt-2">
              {stats[col.name] || 0}
            </p>
            <p className="text-xs text-gray-300">records</p>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in data..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Table className="w-6 h-6" />
              {collections.find(c => c.name === selectedCollection)?.label} Collection
            </h2>
            <span className="text-gray-400">
              {filteredData.length} records
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Database className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">No data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Data</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Created</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-white/10 hover:bg-white/5 transition-all"
                  >
                    <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                      {item._id?.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      <DataPreview data={item} collection={selectedCollection} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            const modal = document.getElementById('view-modal');
                            modal.dataset.item = JSON.stringify(item, null, 2);
                            modal.classList.remove('hidden');
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      <div id="view-modal" className="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">View Record</h3>
            <button
              onClick={() => document.getElementById('view-modal').classList.add('hidden')}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-white"
            >
              ✕
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
            <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-lg overflow-x-auto">
              {document.getElementById('view-modal')?.dataset?.item || '{}'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataPreview = ({ data, collection }) => {
  switch (collection) {
    case 'users':
      return (
        <div>
          <p className="font-semibold">{data.email}</p>
          <p className="text-xs text-gray-400">{data.businessInfo?.businessName || 'No business name'}</p>
        </div>
      );
    case 'campaigns':
      return (
        <div>
          <p className="font-semibold">{data.name}</p>
          <p className="text-xs text-gray-400">{data.product?.name} - ${data.product?.price}</p>
        </div>
      );
    case 'chats':
      return (
        <div>
          <p className="font-semibold">{data.customerName || 'Unknown'}</p>
          <p className="text-xs text-gray-400">{data.messages?.length || 0} messages - {data.status}</p>
        </div>
      );
    case 'analytics':
      return (
        <div>
          <p className="font-semibold">{new Date(data.date).toLocaleDateString()}</p>
          <p className="text-xs text-gray-400">{data.metrics?.conversions || 0} conversions</p>
        </div>
      );
    case 'integrations':
      return (
        <div>
          <p className="font-semibold capitalize">{data.platform}</p>
          <p className="text-xs text-gray-400">{data.status}</p>
        </div>
      );
    default:
      return <p className="text-gray-400">Data record</p>;
  }
};

export default DatabaseManager;
