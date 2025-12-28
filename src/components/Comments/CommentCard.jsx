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
        <div className="comment-card">
            <div className="comment-header">
                <div className="comment-author-info">
                    <div className="comment-avatar">
                        {getInitials(comment.author?.username || comment.author?.email)}
                    </div>
                    <div className="comment-meta">
                        <span className="comment-author-name">
                            {comment.author?.username || comment.author?.email || 'Anonymous'}
                        </span>
                        <span className="comment-timestamp">
                            {formatDate(comment.createdAt)}
                            {isEdited && <span className="edited-badge"> (edited)</span>}
                        </span>
                    </div>
                </div>

                {isAuthor && (
                    <div className="comment-actions">
                        <button
                            className="comment-action-btn edit-btn"
                            onClick={() => onEdit(comment)}
                            aria-label="Edit comment"
                            title="Edit comment"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                        <button
                            className="comment-action-btn delete-btn"
                            onClick={() => onDelete(comment.id)}
                            aria-label="Delete comment"
                            title="Delete comment"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <div className="comment-content">
                <p>{displayContent}</p>
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
