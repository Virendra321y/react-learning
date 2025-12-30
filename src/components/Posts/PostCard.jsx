import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FiUser, FiCalendar, FiEdit, FiTrash2, FiEye, FiMessageSquare, FiBookmark } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { bookmarkAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

/**
 * PostCard Component
 * Displays a single post in card format
 */
const PostCard = ({ post, onDelete, customAction }) => {
    const { user, isAuthenticated } = useAuth();
    const [isBookmarked, setIsBookmarked] = React.useState(false);
    const [loadingBookmark, setLoadingBookmark] = React.useState(false);

    const isAuthor = user?.id === post?.author?.id;

    React.useEffect(() => {
        if (isAuthenticated && post?.id) {
            checkBookmarkStatus();
        }
    }, [isAuthenticated, post?.id]);

    const checkBookmarkStatus = async () => {
        try {
            const response = await bookmarkAPI.getStatus(post.id);
            setIsBookmarked(response.data.data);
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    const toggleBookmark = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please login to bookmark posts');
            return;
        }

        setLoadingBookmark(true);
        try {
            if (isBookmarked) {
                await bookmarkAPI.unbookmark(post.id);
                setIsBookmarked(false);
                toast.success('Removed from bookmarks');
            } else {
                await bookmarkAPI.bookmark(post.id);
                setIsBookmarked(true);
                toast.success('Added to bookmarks');
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            toast.error('Failed to update bookmark');
        } finally {
            setLoadingBookmark(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800';
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200"
        >
            <div className="p-6">
                {/* Header with status badge */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-800 flex-1 line-clamp-2">
                        {post.title}
                    </h3>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(post.status)}`}>
                        {post.status}
                    </span>
                </div>

                {/* Content preview */}
                <p className="text-slate-600 mb-4 line-clamp-3">
                    {post.content}
                </p>

                {/* Author and date */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                        <FiUser size={14} />
                        <span>{post.author?.firstName} {post.author?.lastName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiMessageSquare size={14} />
                        <span>{post.commentCount || 0} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <Link
                        to={`/posts/${post.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                    >
                        <FiEye size={16} />
                        View
                    </Link>

                    {isAuthenticated && (
                        <button
                            onClick={toggleBookmark}
                            disabled={loadingBookmark}
                            className={clsx(
                                "p-2 rounded-lg transition-all",
                                isBookmarked
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            )}
                        >
                            <FiBookmark fill={isBookmarked ? "currentColor" : "none"} size={18} />
                        </button>
                    )}

                    {customAction}

                    {isAuthor && (
                        <>
                            <Link
                                to={`/posts/${post.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-sm font-medium"
                            >
                                <FiEdit size={16} />
                                Edit
                            </Link>
                            <button
                                onClick={() => onDelete(post.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium ml-auto"
                            >
                                <FiTrash2 size={16} />
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;
