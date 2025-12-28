import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { useCreateComment, useUpdateComment } from '../../hooks/useComments';
import './CommentForm.css';

// Validation schema
const commentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, 'Comment cannot be empty')
        .max(500, 'Comment must be less than 500 characters'),
});

/**
 * CommentForm Component
 * Reusable form for creating and editing comments
 *
 * @param {Object} props
 * @param {number} props.postId - ID of the post
 * @param {Object} props.initialData - Initial data for edit mode
 * @param {string} props.mode - 'create' or 'edit'
 * @param {Function} props.onSuccess - Callback on successful submission
 * @param {Function} props.onCancel - Callback when cancel is clicked
 */
const CommentForm = ({
    postId,
    initialData = null,
    mode = 'create',
    onSuccess,
    onCancel,
}) => {
    const isEditMode = mode === 'edit';

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setFocus,
    } = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: initialData?.content || '',
        },
    });

    // Mutations
    const createCommentMutation = useCreateComment();
    const updateCommentMutation = useUpdateComment();

    const isLoading = createCommentMutation.isPending || updateCommentMutation.isPending;

    // Watch content for character count
    const content = watch('content');
    const characterCount = content?.length || 0;
    const maxCharacters = 500;

    // Auto-focus on mount
    useEffect(() => {
        setFocus('content');
    }, [setFocus]);

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await updateCommentMutation.mutateAsync({
                    commentId: initialData.id,
                    data,
                });
            } else {
                await createCommentMutation.mutateAsync({
                    postId,
                    data,
                });
            }

            // Reset form and call success callback
            reset();
            onSuccess?.();
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        reset();
        onCancel?.();
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="comment-form-field">
                <textarea
                    {...register('content')}
                    className={`comment-textarea ${errors.content ? 'error' : ''}`}
                    placeholder={
                        isEditMode ? 'Edit your comment...' : 'Write a comment...'
                    }
                    rows={3}
                    disabled={isLoading}
                />
                <div className="comment-form-footer">
                    <div className="character-count">
                        <span className={characterCount > maxCharacters ? 'error' : ''}>
                            {characterCount}
                        </span>
                        <span className="separator">/</span>
                        <span>{maxCharacters}</span>
                    </div>
                    {errors.content && (
                        <span className="error-message">{errors.content.message}</span>
                    )}
                </div>
            </div>

            <div className="comment-form-actions">
                {isEditMode && onCancel && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || characterCount === 0}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            {isEditMode ? 'Updating...' : 'Posting...'}
                        </>
                    ) : (
                        <>{isEditMode ? 'Update Comment' : 'Post Comment'}</>
                    )}
                </button>
            </div>
        </form>
    );
};

CommentForm.propTypes = {
    postId: PropTypes.number.isRequired,
    initialData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
    }),
    mode: PropTypes.oneOf(['create', 'edit']),
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
};

export default CommentForm;
