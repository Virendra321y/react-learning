import { useState } from 'react';
import PropTypes from 'prop-types';
import './CommentCard.css';

/**
 * CommentCard Component
 * Displays an individual comment with author info and action buttons
 *
 * @param {Object} props
 * @param {Object} props.comment - Comment object
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {number} props.currentUserId - ID of the currently logged-in user
 */
const CommentCard = ({ comment, onEdit, onDelete, currentUserId }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if current user is the author
    const isAuthor = currentUserId === comment.author?.id;

    // Debug log (can be removed after verification)
    console.debug('Comment Author Check:', {
        commentId: comment.id,
        commentAuthorId: comment.author?.id,
        currentUserId,
        isAuthor
    });

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Check if comment was edited
    const isEdited =
        comment.updatedAt &&
        new Date(comment.updatedAt) > new Date(comment.createdAt);

    // Truncate long comments
    const MAX_LENGTH = 200;
    const shouldTruncate = comment.content?.length > MAX_LENGTH;
    const displayContent =
        shouldTruncate && !isExpanded
            ? `${comment.content.substring(0, MAX_LENGTH)}...`
            : comment.content;

    return (
        <div className="comment-item">
            <div className="comment-avatar-container">
                <div className="comment-avatar">
                    {getInitials(comment.author?.username || comment.author?.email)}
                </div>
            </div>

            <div className="comment-body">
                <div className="comment-bubble">
                    <span className="comment-author-name">
                        {comment.author?.username || comment.author?.email || 'Anonymous'}
                    </span>
                    <span className="comment-text">{displayContent}</span>
                </div>

                <div className="comment-footer">
                    <span className="comment-timestamp">
                        {formatDate(comment.createdAt)}
                    </span>
                    {isEdited && <span className="edited-badge">Edited</span>}

                    {isAuthor && (
                        <div className="comment-actions">
                            <button
                                className="comment-action-link"
                                onClick={() => onEdit(comment)}
                            >
                                Edit
                            </button>
                            <button
                                className="comment-action-link delete"
                                onClick={() => onDelete(comment.id)}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {shouldTruncate && (
                    <button
                        className="read-more-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>
        </div>
    );
};

CommentCard.propTypes = {
    comment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        author: PropTypes.shape({
            id: PropTypes.number.isRequired,
            username: PropTypes.string,
            email: PropTypes.string,
        }),
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    currentUserId: PropTypes.number.isRequired,
};

export default CommentCard;
