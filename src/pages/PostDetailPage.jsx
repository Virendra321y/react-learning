import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit, FiTrash2, FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { usePost, useDeletePost } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import DeleteConfirmModal from '../components/Posts/DeleteConfirmModal';
import CommentForm from '../components/Comments/CommentForm';
import CommentList from '../components/Comments/CommentList';

/**
 * PostDetailPage
 * Individual post view with full content
 */
const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { post, loading, error } = usePost(id);
    const { deletePost, loading: deleting } = useDeletePost();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const isAuthor = user?.id === post?.author?.id;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost(id);
            navigate('/posts');
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
                        <h3 className="font-semibold mb-2">Error loading post</h3>
                        <p>{error || 'Post not found'}</p>
                        <Link to="/posts" className="text-blue-600 hover:underline mt-4 inline-block">
                            ← Back to Posts
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <button
                        onClick={() => navigate('/posts')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        <span>Back to Posts</span>
                    </button>
                </motion.div>

                {/* Post Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-slate-100">
                        <div className="flex items-start justify-between mb-4">
                            <h1 className="text-4xl font-bold text-slate-800 flex-1">
                                {post.title}
                            </h1>
                            <span className={`ml-4 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(post.status)}`}>
                                {post.status}
                            </span>
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-slate-600">
                            <div className="flex items-center gap-2">
                                <FiUser size={18} />
                                <span className="font-medium">
                                    {post.author?.firstName} {post.author?.lastName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiCalendar size={18} />
                                <span>Created: {formatDate(post.createdAt)}</span>
                            </div>
                            {post.updatedAt !== post.createdAt && (
                                <div className="flex items-center gap-2">
                                    <FiClock size={18} />
                                    <span>Updated: {formatDate(post.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </p>
                        </div>
                    </div>

                    {/* Actions (Author Only) */}
                    {isAuthor && (
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                            <Link
                                to={`/posts/${post.id}/edit`}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                            >
                                <FiEdit size={18} />
                                Edit Post
                            </Link>
                            <button
                                onClick={() => setDeleteModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all border border-red-200"
                            >
                                <FiTrash2 size={18} />
                                Delete Post
                            </button>
                        </div>
                    )}
                </motion.article>

                {/* Comments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-white rounded-xl shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Add a Comment</h2>
                    <CommentForm postId={parseInt(id)} onSuccess={() => { }} />

                    <CommentList postId={parseInt(id)} />
                </motion.div>

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    loading={deleting}
                    postTitle={post.title}
                />
            </div>
        </div>
    );
};

export default PostDetailPage;
