import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

/**
 * WebSocket Service
 * Manages WebSocket connection for real-time chat
 */
class WebSocketService {
    constructor() {
        this.client = null;
        this.connected = false;
        this.messageHandlers = [];
        this.connectionHandlers = [];
        this.readReceiptHandlers = [];
        this.notificationHandlers = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Clear all handlers
     */
    clearHandlers() {
        this.messageHandlers = [];
        this.connectionHandlers = [];
        this.readReceiptHandlers = [];
        this.notificationHandlers = [];
    }

    /**
     * Connect to WebSocket server
     */
    connect(token) {
        if (this.connected) {
            console.log('WebSocket already connected');
            return;
        }

        const wsUrl = 'http://localhost:8080/ws'; // In production, this would be relative or based on env
        const socket = new SockJS(wsUrl);

        this.client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
            console.log('WebSocket Connected:', frame);
            this.connected = true;
            this.reconnectAttempts = 0;

            // Subscribe to user-specific message queue (standard Spring User Destination)
            this.client.subscribe('/user/queue/messages', (message) => {
                const notification = JSON.parse(message.body);
                console.log('Received message:', notification);
                this.notifyMessageHandlers(notification);
            });

            this.client.subscribe('/user/queue/read-receipts', (message) => {
                const receipt = JSON.parse(message.body);
                console.log('Received read receipt:', receipt);
                this.notifyReadReceiptHandlers(receipt);
            });

            this.client.subscribe('/user/queue/notifications', (message) => {
                const notification = JSON.parse(message.body);
                console.log('Received notification:', notification);
                this.notifyNotificationHandlers(notification);
            });

            // Subscribe to error queue
            this.client.subscribe('/user/queue/errors', (message) => {
                console.error('WebSocket error:', message.body);
            });

            // Notify connection handlers
            this.notifyConnectionHandlers(true);
        };

        this.client.onStompError = (frame) => {
            console.error('broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            this.connected = false;
            this.notifyConnectionHandlers(false);
        };

        this.client.onWebSocketClose = () => {
            console.log('WebSocket connection closed');
            this.connected = false;
            this.notifyConnectionHandlers(false);
        };

        this.client.activate();
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.connected = false;
            this.messageHandlers = [];
            this.connectionHandlers = [];
            console.log('WebSocket deactivated');
        }
    }


    /**
     * Send a message via WebSocket
     */
    sendMessage(receiverId, content) {
        if (!this.connected || !this.client) {
            console.error('WebSocket not connected');
            throw new Error('WebSocket not connected');
        }

        const message = {
            receiverId,
            content,
        };

        this.client.publish({
            destination: '/app/chat.send',
            body: JSON.stringify(message),
        });

        console.log('Message sent:', message);
    }

    /**
     * Register a handler for incoming messages
     */
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }

    /**
     * Register a handler for connection status changes
     */
    onConnectionChange(handler) {
        this.connectionHandlers.push(handler);
    }

    /**
     * Register a handler for read receipts
     */
    onReadReceipt(handler) {
        this.readReceiptHandlers.push(handler);
    }

    /**
     * Register a handler for notifications
     */
    onNotification(handler) {
        this.notificationHandlers.push(handler);
    }

    /**
     * Remove a notification handler
     */
    removeNotificationHandler(handler) {
        this.notificationHandlers = this.notificationHandlers.filter((h) => h !== handler);
    }

    /**
     * Notify all notification handlers
     */
    notifyNotificationHandlers(notification) {
        this.notificationHandlers.forEach((handler) => {
            try {
                handler(notification);
            } catch (error) {
                console.error('Error in notification handler:', error);
            }
        });
    }

    /**
     * Remove a message handler
     */
    removeMessageHandler(handler) {
        this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    }

    /**
     * Remove a connection handler
     */
    removeConnectionHandler(handler) {
        this.connectionHandlers = this.connectionHandlers.filter((h) => h !== handler);
    }

    /**
     * Check if connected
     */
    isConnected() {
        return this.connected;
    }

    /**
     * Notify all message handlers
     */
    notifyMessageHandlers(notification) {
        this.messageHandlers.forEach((handler) => {
            try {
                handler(notification);
            } catch (error) {
                console.error('Error in message handler:', error);
            }
        });
    }

    /**
     * Notify all connection handlers
     */
    notifyConnectionHandlers(connected) {
        this.connectionHandlers.forEach((handler) => {
            try {
                handler(connected);
            } catch (error) {
                console.error('Error in connection handler:', error);
            }
        });
    }

    /**
     * Notify all read receipt handlers
     */
    notifyReadReceiptHandlers(receipt) {
        this.readReceiptHandlers.forEach((handler) => {
            try {
                handler(receipt);
            } catch (error) {
                console.error('Error in read receipt handler:', error);
            }
        });
    }

    /**
     * Extract user ID from JWT token
     */
    getUserIdFromToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.sub;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
