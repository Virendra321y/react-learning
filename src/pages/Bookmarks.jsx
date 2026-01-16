import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookmark, FiSearch, FiInbox } from 'react-icons/fi';
import { bookmarkAPI } from '../services/api';
import PostCard from '../components/Posts/PostCard';
import { toast } from 'react-hot-toast';

const Bookmarks = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchBookmarks = async (pageNum = 0) => {
        setLoading(true);
        try {
            const response = await bookmarkAPI.getBookmarkedPosts(pageNum, 9);
            const data = response.data.data;
            setPosts(data.content);
            setTotalPages(data.totalPages);
            setPage(data.page);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            toast.error('Failed to load bookmarks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const handleRemoveBookmark = async (postId) => {
        try {
            await bookmarkAPI.unbookmark(postId);
            setPosts(prev => prev.filter(p => p.id !== postId));
            toast.success('Removed from bookmarks');
        } catch (error) {
            console.error('Error removing bookmark:', error);
            toast.error('Failed to remove bookmark');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-extrabold text-slate-900 flex items-center gap-3"
                        >
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                                <FiBookmark size={32} />
                            </div>
                            My Bookmarks
                        </motion.h1>
                        <p className="mt-2 text-slate-500 text-lg">
                            Saved posts that you want to read later.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <>
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence>
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        customAction={
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveBookmark(post.id);
                                                }}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors ml-auto"
                                                title="Remove Bookmark"
                                            >
                                                <FiBookmark fill="currentColor" size={20} />
                                            </button>
                                        }
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => fetchBookmarks(i)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-2xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiInbox size={48} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No bookmarks yet</h2>
                        <p className="text-slate-500 mb-8">
                            You haven't saved any posts yet. Start browsing and bookmark interesting posts to see them here.
                        </p>
                        <button
                            onClick={() => navigate('/posts')}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            Explore Posts
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Bookmarks;
