import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Megaphone, 
  Settings,
  Plug,
  Database
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Overview from '../components/DashboardSections/Overview';
import Chats from '../components/DashboardSections/Chats';
import Analytics from '../components/DashboardSections/Analytics';
import Campaigns from '../components/DashboardSections/Campaigns';
import Integrations from '../components/DashboardSections/Integrations';
import DatabaseManager from './DatabaseManager';
import socketService from '../services/socket';
import { useChatStore } from '../store/useStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const { addMessage, incrementUnread } = useChatStore();

  useEffect(() => {
    // Get user from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      
      // Connect to socket
      socketService.connect(user._id);

      // Listen for new messages
      socketService.on('new-message', (data) => {
        console.log('New message received:', data);
        addMessage(data.chatId, data.message);
        
        // Increment unread if message is from customer
        if (data.message.sender === 'customer') {
          incrementUnread();
        }
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [addMessage, incrementUnread]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'chats', label: 'Chats', icon: MessageSquare, path: '/dashboard/chats' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/dashboard/campaigns' },
    { id: 'integrations', label: 'Integrations', icon: Plug, path: '/dashboard/integrations' },
    { id: 'database', label: 'Database', icon: Database, path: '/dashboard/database' },
  ];

  const handleNavigation = (item) => {
    setActiveSection(item.id);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-black/20 backdrop-blur-lg border-r border-white/10 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/database" element={<DatabaseManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
