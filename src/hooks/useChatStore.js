import { create } from 'zustand';
import websocketService from '../services/websocketService';
import * as chatApi from '../services/chatApi';

/**
 * Chat Store
 * Manages chat state including conversations, messages, and WebSocket connection
 */
const useChatStore = create((set, get) => ({
    // State
    conversations: [],
    activeConversation: null,
    messages: {},
    unreadCount: 0,
    isConnected: false,
    isChatOpen: false,
    isLoading: false,

    // Actions
    setConversations: (conversations) => set({ conversations }),

    setActiveConversation: (conversation) => set({ activeConversation: conversation }),

    addMessage: (conversationId, message) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [conversationId]: [...(state.messages[conversationId] || []), message],
            },
        })),

    setMessages: (conversationId, messages) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [conversationId]: messages,
            },
        })),

    updateUnreadCount: (count) => set({ unreadCount: count }),

    setConnected: (connected) => set({ isConnected: connected }),

    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

    openChat: () => set({ isChatOpen: true }),

    closeChat: () => set({ isChatOpen: false, activeConversation: null }),

    setLoading: (loading) => set({ isLoading: loading }),

    // Fetch conversations
    fetchConversations: async () => {
        try {
            set({ isLoading: true });
            const response = await chatApi.getConversations();
            if (response.success) {
                set({ conversations: response.data.content });
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch messages for a conversation
    fetchMessages: async (conversationId) => {
        try {
            set({ isLoading: true });
            const response = await chatApi.getMessages(conversationId);
            if (response.success) {
                get().setMessages(conversationId, response.data.content);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Mark conversation as read
    markAsRead: async (conversationId) => {
        try {
            await chatApi.markAsRead(conversationId);
            await get().fetchUnreadCount();
            await get().fetchConversations();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    },

    // Fetch unread count
    fetchUnreadCount: async () => {
        try {
            const response = await chatApi.getUnreadCount();
            if (response.success) {
                set({ unreadCount: response.data });
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    },

    // Send message via WebSocket
    sendMessage: (receiverId, content) => {
        console.log('useChatStore.sendMessage called for receiver:', receiverId);
        try {
            if (!get().isConnected) {
                console.error('Cant send message: Not connected');
                throw new Error('Not connected to chat server');
            }
            websocketService.sendMessage(receiverId, content);
            console.log('Message handed over to websocketService');
        } catch (error) {
            console.error('Error in useChatStore.sendMessage:', error);
            throw error;
        }
    },

    // Connect to WebSocket
    connect: (token) => {
        const handleMessage = (notification) => {
            const { message, conversationId } = notification;
            const currentActive = get().activeConversation;

            // Add message to store
            get().addMessage(conversationId, message);

            // If this message belongs to the current "new" conversation (no ID yet)
            // or if it's the active conversation, sync it
            if (currentActive &&
                ((currentActive.id === null && currentActive.otherUserId === message.senderId) ||
                    (currentActive.id === null && currentActive.otherUserId === message.receiverId) ||
                    (currentActive.id === conversationId))) {

                // If it was a new conversation, it now has an ID
                if (currentActive.id === null) {
                    set({
                        activeConversation: { ...currentActive, id: conversationId }
                    });
                    // Fetch all messages for this brand new conversation to be safe
                    get().fetchMessages(conversationId);
                }
            }

            // Update conversation list to show latest message/preview
            get().fetchConversations();

            // Update unread count if not in active conversation
            if (get().activeConversation?.id !== conversationId) {
                get().fetchUnreadCount();
            } else {
                // If it is the active conversation, mark it as read immediately
                get().markAsRead(conversationId);
            }
        };

        const handleReadReceipt = (receipt) => {
            const { conversationId } = receipt;
            console.log('Handling read receipt for conversation:', conversationId);

            set((state) => {
                const conversationMessages = state.messages[conversationId] || [];
                // Only update if there are messages and some might need updating
                if (conversationMessages.length > 0) {
                    const updatedMessages = conversationMessages.map(msg => ({
                        ...msg,
                        readStatus: true
                    }));

                    return {
                        messages: {
                            ...state.messages,
                            [conversationId]: updatedMessages
                        }
                    };
                }
                return state;
            });
        };

        const handleConnectionChange = (connected) => {
            set({ isConnected: connected });
            if (connected) {
                // Fetch initial data when connected
                get().fetchConversations();
                get().fetchUnreadCount();
            }
        };

        websocketService.clearHandlers();
        websocketService.onMessage(handleMessage);
        websocketService.onReadReceipt(handleReadReceipt);
        websocketService.onConnectionChange(handleConnectionChange);
        websocketService.connect(token);
    },

    // Disconnect from WebSocket
    disconnect: () => {
        websocketService.disconnect();
        set({
            isConnected: false,
            conversations: [],
            activeConversation: null,
            messages: {},
            unreadCount: 0,
            isChatOpen: false,
        });
    },

    // Open chat with specific user
    openChatWithUser: async (userId, userName, userAvatar) => {
        // Check if conversation exists
        const existingConv = get().conversations.find(
            (conv) => conv.otherUserId === userId
        );

        if (existingConv) {
            set({ activeConversation: existingConv, isChatOpen: true });
            await get().fetchMessages(existingConv.id);
            await get().markAsRead(existingConv.id);
        } else {
            // Create temporary conversation object
            const tempConv = {
                id: null,
                otherUserId: userId,
                otherUserName: userName,
                otherUserAvatar: userAvatar,
                lastMessage: null,
                lastMessageTime: null,
                unreadCount: 0,
            };
            set({ activeConversation: tempConv, isChatOpen: true });
        }
    },
}));

export default useChatStore;
