import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User Store
export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      updateUser: (updates) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updates } : null 
      })),
    }),
    {
      name: 'user-storage',
    }
  )
);

// Campaign Store
export const useCampaignStore = create((set) => ({
  campaigns: [],
  selectedCampaign: null,
  setCampaigns: (campaigns) => set({ campaigns }),
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  addCampaign: (campaign) => set((state) => ({ 
    campaigns: [...state.campaigns, campaign] 
  })),
  updateCampaign: (id, updates) => set((state) => ({
    campaigns: state.campaigns.map(c => c._id === id ? { ...c, ...updates } : c),
    selectedCampaign: state.selectedCampaign?._id === id 
      ? { ...state.selectedCampaign, ...updates } 
      : state.selectedCampaign
  })),
  deleteCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.filter(c => c._id !== id),
    selectedCampaign: state.selectedCampaign?._id === id ? null : state.selectedCampaign
  })),
}));

// Chat Store
export const useChatStore = create((set) => ({
  chats: [],
  selectedChat: null,
  unreadCount: 0,
  setChats: (chats) => set({ chats }),
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  addChat: (chat) => set((state) => ({ 
    chats: [chat, ...state.chats] 
  })),
  updateChat: (id, updates) => set((state) => ({
    chats: state.chats.map(c => c._id === id ? { ...c, ...updates } : c),
    selectedChat: state.selectedChat?._id === id 
      ? { ...state.selectedChat, ...updates } 
      : state.selectedChat
  })),
  addMessage: (chatId, message) => set((state) => ({
    chats: state.chats.map(c => 
      c._id === chatId 
        ? { ...c, messages: [...(c.messages || []), message], lastMessageAt: message.timestamp }
        : c
    ),
    selectedChat: state.selectedChat?._id === chatId
      ? { ...state.selectedChat, messages: [...(state.selectedChat.messages || []), message] }
      : state.selectedChat
  })),
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));

// Analytics Store
export const useAnalyticsStore = create((set) => ({
  dashboardData: null,
  realTimeData: null,
  campaignAnalytics: [],
  setDashboardData: (data) => set({ dashboardData: data }),
  setRealTimeData: (data) => set({ realTimeData: data }),
  setCampaignAnalytics: (data) => set({ campaignAnalytics: data }),
}));

// Integration Store
export const useIntegrationStore = create((set) => ({
  integrations: [],
  setIntegrations: (integrations) => set({ integrations }),
  updateIntegration: (platform, updates) => set((state) => ({
    integrations: state.integrations.map(i => 
      i.platform === platform ? { ...i, ...updates } : i
    )
  })),
}));

// UI Store
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  assistantOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleAssistant: () => set((state) => ({ assistantOpen: !state.assistantOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setAssistantOpen: (open) => set({ assistantOpen: open }),
}));
