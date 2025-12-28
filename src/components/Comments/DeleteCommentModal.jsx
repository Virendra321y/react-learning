import PropTypes from 'prop-types';
import './DeleteCommentModal.css';

/**
 * DeleteCommentModal Component
 * Confirmation modal for deleting comments
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onConfirm - Callback to confirm deletion
 * @param {boolean} props.isDeleting - Whether deletion is in progress
 */
const DeleteCommentModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen) return null;

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isDeleting) {
            onClose();
        }
    };

    // Handle keyboard events
    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !isDeleting) {
            onClose();
        }
    };

    return (
        <div
            className="modal-backdrop"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h3 id="modal-title">Delete Comment</h3>
                    {!isDeleting && (
                        <button
                            className="modal-close-btn"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="modal-body">
                    <div className="warning-icon">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <p className="modal-message">
                        Are you sure you want to delete this comment? This action cannot be
                        undone.
                    </p>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <span className="spinner"></span>
                                Deleting...
                            </>
                        ) : (
                            'Delete Comment'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

DeleteCommentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isDeleting: PropTypes.bool.isRequired,
};

export default DeleteCommentModal;
