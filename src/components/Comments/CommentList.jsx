import { useState } from 'react';
import PropTypes from 'prop-types';
import { usePostComments, useDeleteComment } from '../../hooks/useComments';
import { useAuth } from '../../hooks/useAuth';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import DeleteCommentModal from './DeleteCommentModal';
import './CommentList.css';

/**
 * CommentList Component
 * Container for displaying all comments on a post
 *
 * @param {Object} props
 * @param {number} props.postId - ID of the post
 */
const CommentList = ({ postId }) => {
    const { user } = useAuth();
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    // Fetch comments
    const {
        data: comments = [],
        isLoading,
        isError,
        error,
    } = usePostComments(postId);

    // Delete mutation
    const deleteCommentMutation = useDeleteComment();

    // Handle edit
    const handleEdit = (comment) => {
        setEditingCommentId(comment.id);
    };

    // Handle edit success
    const handleEditSuccess = () => {
        setEditingCommentId(null);
    };

    // Handle edit cancel
    const handleEditCancel = () => {
        setEditingCommentId(null);
    };

    // Handle delete click
    const handleDeleteClick = (commentId) => {
        setDeletingCommentId(commentId);
    };

    // Handle delete confirm
    const handleDeleteConfirm = async () => {
        if (!deletingCommentId) return;

        try {
            await deleteCommentMutation.mutateAsync(deletingCommentId);
            setDeletingCommentId(null);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Handle delete cancel
    const handleDeleteCancel = () => {
        setDeletingCommentId(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="comment-list">
                <div className="comment-list-header">
                    <h3>Comments</h3>
                </div>
                <div className="loading-skeleton">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton-comment">
                            <div className="skeleton-avatar"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-line short"></div>
                                <div className="skeleton-line long"></div>
                                <div className="skeleton-line medium"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="comment-list">
                <div className="comment-list-header">
                    <h3>Comments</h3>
                </div>
                <div className="error-state">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>Failed to load comments</p>
                    <p className="error-message">{error?.message || 'Unknown error'}</p>
                </div>
            </div>
        );
    }

    // Defensive check: ensure comments is always an array
    const commentsList = Array.isArray(comments) ? comments : [];

    // Empty state
    if (commentsList.length === 0) {
        return (
            <div className="comment-list">
                <div className="comment-list-header">
                    <h3>Comments</h3>
                    <span className="comment-count">0</span>
                </div>
                <div className="empty-state">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <p>No comments yet</p>
                    <p className="empty-subtitle">Be the first to comment!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="comment-list">
            <div className="comment-list-header">
                <h3>Comments</h3>
                <span className="comment-count">{commentsList.length}</span>
            </div>

            <div className="comments-container">
                {commentsList.map((comment) => {
                    // Check if this comment is being edited
                    const isEditing = editingCommentId === comment.id;

                    return (
                        <div key={comment.id} className="comment-wrapper">
                            {isEditing ? (
                                <CommentForm
                                    postId={postId}
                                    initialData={comment}
                                    mode="edit"
                                    onSuccess={handleEditSuccess}
                                    onCancel={handleEditCancel}
                                />
                            ) : (
                                <CommentCard
                                    comment={comment}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                    currentUserId={user?.id}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Delete confirmation modal */}
            <DeleteCommentModal
                isOpen={!!deletingCommentId}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isDeleting={deleteCommentMutation.isPending}
            />
        </div>
    );
};

CommentList.propTypes = {
    postId: PropTypes.number.isRequired,
};

export default CommentList;
