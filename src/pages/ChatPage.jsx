import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiMessageSquare, FiInbox } from 'react-icons/fi';
import useChatStore from '../hooks/useChatStore';

const ChatPage = () => {
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversationId');
    const { conversations, selectConversation, fetchConversations, loading } = useChatStore();

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conv = conversations.find(c => c.id === parseInt(conversationId));
            if (conv) selectConversation(conv);
        }
    }, [conversationId, conversations]);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                        <FiMessageSquare size={40} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Messages</h1>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Your conversations are available in the chat sidebar on the right side of the screen.
                        Click on a contact to start messaging!
                    </p>
                    {conversationId && (
                        <div className="bg-indigo-50 px-6 py-3 rounded-2xl text-indigo-700 font-semibold border border-indigo-100 flex items-center gap-2">
                            <FiInbox /> Selecting conversation...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
