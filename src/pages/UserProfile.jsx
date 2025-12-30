import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/userAPI';
import UserProfileHeader from '../components/Users/UserProfileHeader';
import UserStatsCard from '../components/Users/UserStatsCard';
import UserPostList from '../components/Users/UserPostList';
import { canChatWith } from '../services/chatApi';
import useChatStore from '../hooks/useChatStore';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { openChatWithUser, closeChat, isChatOpen, activeConversation } = useChatStore();

    // State
    const [profileUser, setProfileUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [canChat, setCanChat] = useState(false);
    const [error, setError] = useState(null);

    const handleMessageToggle = () => {
        if (isChatOpen && activeConversation?.otherUserId === profileUser?.id) {
            closeChat();
        } else {
            openChatWithUser(profileUser.id, profileUser.username, profileUser.avatar);
        }
    };

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                // Fetch User Info
                // Handle case where id might be undefined if route is wrong? No, routing handles it.
                // If id is "me", we might want to redirect or handle differently, but route is :id

                const userRes = await userAPI.getById(id);
                setProfileUser(userRes.data.data);

                // Fetch Stats
                const statsRes = await userAPI.getStatistics(id);
                setStats(statsRes.data.data);

                // Check Follow Status (only if not viewing own profile)
                if (currentUser && currentUser.id !== parseInt(id)) {
                    const followRes = await userAPI.checkFollowStatus(id);
                    setIsFollowing(followRes.data.data);

                    // Also check if we can chat (mutual follow)
                    try {
                        const chatRes = await canChatWith(id);
                        setCanChat(chatRes.data);
                    } catch (e) {
                        setCanChat(false);
                    }
                }

            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("User not found or error loading profile.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfile();
    }, [id, currentUser]);

    const handleFollowToggle = async (targetId, shouldFollow) => {
        try {
            if (shouldFollow) {
                await userAPI.follow(targetId);
                setIsFollowing(true);
                // Update local stats
                setStats(prev => ({
                    ...prev,
                    followersCount: (prev?.followersCount || 0) + 1
                }));
            } else {
                await userAPI.unfollow(targetId);
                setIsFollowing(false);
                setStats(prev => ({
                    ...prev,
                    followersCount: Math.max(0, (prev?.followersCount || 1) - 1)
                }));
            }
        } catch (e) {
            console.error("Follow action failed:", e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !profileUser) {
        return (
            <div className="min-h-screen py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-800">User not found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-purple-600 hover:underline">Go Back</button>
            </div>
        );
    }

    const isOwnProfile = currentUser && currentUser.id === profileUser.id;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <UserProfileHeader
                user={profileUser}
                isFollowing={isFollowing}
                onFollowToggle={handleFollowToggle}
                isOwnProfile={isOwnProfile}
                canChat={canChat}
                onMessageClick={handleMessageToggle}
                isChatVisible={isChatOpen && activeConversation?.otherUserId === profileUser.id}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Stats */}
                <UserStatsCard stats={stats} />

                {/* Posts Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
                    <UserPostList userId={profileUser.id} isOwnProfile={isOwnProfile} />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
