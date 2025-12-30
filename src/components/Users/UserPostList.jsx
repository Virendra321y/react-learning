import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../Posts/PostCard'; // Reusing existing component
import { postAPI } from '../../services/postAPI';
import { FiInbox } from 'react-icons/fi';

const UserPostList = ({ userId, isOwnProfile = false }) => { // Added isOwnProfile prop
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return; // Added check

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await postAPI.getByUserId(userId);
                setPosts(response.data.data.content);
            } catch (err) {
                console.error("Failed to fetch user posts:", err);
                setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userId]);

    if (loading) {
        return <div className="py-10 text-center text-slate-500">Loading posts...</div>;
    }

    if (posts.length === 0) {
        return (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <FiInbox className="mx-auto text-4xl text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-600">No posts yet</h3>
                <p className="text-slate-400">
                    {isOwnProfile
                        ? "You haven't published anything yet."
                        : "This user hasn't published anything, or you need to be mutual followers to view their posts."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Posts</h3>
            <div className="grid gap-6">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <PostCard post={post} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserPostList;
