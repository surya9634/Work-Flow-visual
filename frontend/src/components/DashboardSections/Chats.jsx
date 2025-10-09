import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { chatAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useChatStore } from '../../store/useStore';

const Chats = () => {
  const { chats, selectedChat, setChats, setSelectedChat, addMessage } = useChatStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getAll();
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch chats error:', error);
      toast.error('Failed to load chats');
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    try {
      const response = await chatAPI.getOne(chat._id);
      setSelectedChat(response.data);
    } catch (error) {
      console.error('Fetch chat error:', error);
      toast.error('Failed to load chat details');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    setSending(true);
    try {
      await chatAPI.sendMessage(selectedChat._id, {
        content: messageInput,
        messageType: 'text'
      });

      setMessageInput('');
      toast.success('Message sent');
      
      // Refresh chat
      const response = await chatAPI.getOne(selectedChat._id);
      setSelectedChat(response.data);
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedChat) return;

    try {
      await chatAPI.updateStatus(selectedChat._id, status);
      toast.success(`Chat marked as ${status}`);
      
      // Refresh chats
      fetchChats();
      const response = await chatAPI.getOne(selectedChat._id);
      setSelectedChat(response.data);
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'qualified': return 'bg-green-500';
      case 'converted': return 'bg-purple-500';
      case 'closed': return 'bg-gray-500';
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
    <div className="h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-bold text-white mb-6">Conversations</h1>

      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Chat List */}
        <div className="col-span-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="w-12 h-12 mb-2" />
                <p>No conversations yet</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full p-4 border-b border-white/10 hover:bg-white/5 transition-all text-left ${
                    selectedChat?._id === chat._id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-semibold truncate">
                          {chat.customerName || 'Customer'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(chat.status)}`}>
                          {chat.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {chat.messages?.[chat.messages.length - 1]?.content || 'No messages'}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(chat.lastMessageAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-span-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {selectedChat.customerName || 'Customer'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Lead Score: {selectedChat.leadScore}/100
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus('qualified')}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Qualify
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('closed')}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Close
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages?.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'customer'
                          ? 'bg-white/20 text-white'
                          : message.sender === 'ai'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="text-sm mb-1">{message.content}</p>
                      <div className="flex items-center justify-between gap-2 text-xs opacity-70">
                        <span>{message.sender === 'ai' ? '🤖 AI' : message.sender}</span>
                        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageInput.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4" />
              <p className="text-lg">Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
