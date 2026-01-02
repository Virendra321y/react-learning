import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit, FiTrash2, FiUser, FiCalendar, FiClock, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { usePost, useDeletePost } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import DeleteConfirmModal from '../components/Posts/DeleteConfirmModal';
import CommentForm from '../components/Comments/CommentForm';
import CommentList from '../components/Comments/CommentList';
import { postAPI } from '../services/postAPI';
import { toast } from 'react-hot-toast';

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
    const [showComments, setShowComments] = useState(false);

    // Initial state for likes
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Update local state when post data loads
    useEffect(() => {
        if (post) {
            setIsLiked(post.isLiked || false);
            setLikeCount(post.likeCount || 0);
        }
    }, [post]);

    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like posts');
            return;
        }

        // Optimistic update
        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!previousLiked);
        setLikeCount(prev => previousLiked ? prev - 1 : prev + 1);

        try {
            await postAPI.toggleLike(id);
        } catch (error) {
            // Revert on error
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
            toast.error('Failed to update like');
        }
    };


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
                                <Link to={`/users/${post.author?.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                                        {post.author?.avatar ? (
                                            <img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <FiUser size={16} className="text-slate-400" />
                                        )}
                                    </div>
                                    <span className="font-medium text-slate-800 hover:text-indigo-600 transition-colors">
                                        {post.author?.firstName} {post.author?.lastName}
                                    </span>
                                </Link>
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

                            {/* Like & Comment Counts */}
                            <div className="flex items-center gap-4 ml-auto">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-1 font-medium transition-colors ${isLiked ? 'text-pink-600' : 'text-slate-400 hover:text-pink-600'}`}
                                >
                                    <FiHeart size={20} fill={isLiked ? "currentColor" : "none"} />
                                    <span>{likeCount}</span>
                                </button>
                                <div className="flex items-center gap-1 text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors" onClick={() => setShowComments(!showComments)}>
                                    <FiMessageSquare size={20} />
                                    <span>{post.commentCount || 0}</span>
                                </div>
                            </div>
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

                {/* Comments Section Toggle */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-full shadow-md hover:shadow-lg hover:bg-slate-50 transition-all font-medium border border-slate-200"
                    >
                        <FiMessageSquare size={20} />
                        <span>{showComments ? 'Hide Comments' : `Show Comments (${post.commentCount || 0})`}</span>
                    </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-6 bg-white rounded-xl shadow-lg p-8"
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Comments</h2>
                        <CommentForm postId={parseInt(id)} onSuccess={() => { }} />

                        <CommentList postId={parseInt(id)} />
                    </motion.div>
                )}

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
