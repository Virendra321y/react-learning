import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';
import { usePostList, useDeletePost } from '../hooks/usePosts';
import PostCard from '../components/Posts/PostCard';
import Pagination from '../components/Posts/Pagination';
import PostSearch from '../components/Posts/PostSearch';
import DeleteConfirmModal from '../components/Posts/DeleteConfirmModal';

/**
 * Posts Page
 * Main posts listing page with pagination and search
 */
const Posts = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const { posts, loading, error, page, setPage, totalPages, totalElements, refetch } = usePostList(0, 9);
    const { deletePost, loading: deleting } = useDeletePost();

    const handleDeleteClick = (postId) => {
        const post = posts.find(p => p.id === postId);
        setPostToDelete(post);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deletePost(postToDelete.id);
            setDeleteModalOpen(false);
            setPostToDelete(null);
            refetch();
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                                Posts
                            </h1>
                            <p className="text-slate-600 mt-2">
                                {totalElements} {totalElements === 1 ? 'post' : 'posts'} available
                            </p>
                        </div>
                        <Link
                            to="/posts/create"
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <FiPlus size={20} />
                            Create Post
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <PostSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onClear={() => setSearchQuery('')}
                    />
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3 text-red-800"
                    >
                        <FiAlertCircle size={24} />
                        <div>
                            <h3 className="font-semibold">Error loading posts</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Posts Grid */}
                {!loading && !error && (
                    <>
                        {filteredPosts.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence>
                                    {filteredPosts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            onDelete={handleDeleteClick}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-4">
                                    <FiAlertCircle size={48} className="text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-700 mb-2">
                                    {searchQuery ? 'No posts found' : 'No posts yet'}
                                </h3>
                                <p className="text-slate-500 mb-6">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'Be the first to create a post!'}
                                </p>
                                {!searchQuery && (
                                    <Link
                                        to="/posts/create"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                    >
                                        <FiPlus size={20} />
                                        Create Your First Post
                                    </Link>
                                )}
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {!searchQuery && filteredPosts.length > 0 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        )}
                    </>
                )}

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setPostToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    loading={deleting}
                    postTitle={postToDelete?.title}
                />
            </div>
        </div>
    );
};

export default Posts;
