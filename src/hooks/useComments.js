import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPostComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
} from '../services/commentAPI';

/**
 * Custom hooks for managing comments using React Query
 */

// Query keys for cache management
export const commentKeys = {
    all: ['comments'],
    postComments: (postId) => ['comments', 'post', postId],
    detail: (commentId) => ['comments', commentId],
};

/**
 * Hook to fetch all comments for a specific post
 * @param {number} postId - The ID of the post
 * @param {Object} options - React Query options
 * @returns {Object} Query result with comments data, loading, and error states
 */
export const usePostComments = (postId, options = {}) => {
    return useQuery({
        queryKey: commentKeys.postComments(postId),
        queryFn: () => getPostComments(postId),
        enabled: !!postId,
        staleTime: 30000, // 30 seconds
        cacheTime: 300000, // 5 minutes
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook to fetch a single comment by ID
 * @param {number} commentId - The ID of the comment
 * @param {Object} options - React Query options
 * @returns {Object} Query result with comment data, loading, and error states
 */
export const useComment = (commentId, options = {}) => {
    return useQuery({
        queryKey: commentKeys.detail(commentId),
        queryFn: () => getCommentById(commentId),
        enabled: !!commentId,
        staleTime: 30000,
        cacheTime: 300000,
        ...options,
    });
};

/**
 * Hook to create a new comment
 * @returns {Object} Mutation object with mutate function and states
 */
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, data }) => createComment(postId, data),
        onSuccess: (newComment, { postId }) => {
            // Invalidate and refetch post comments
            queryClient.invalidateQueries({
                queryKey: commentKeys.postComments(postId),
            });

            // Optionally update cache optimistically
            queryClient.setQueryData(commentKeys.postComments(postId), (old) => {
                if (!old) return [newComment];
                return [newComment, ...old];
            });
        },
        onError: (error) => {
            console.error('Error creating comment:', error);
        },
    });
};

/**
 * Hook to update an existing comment
 * @returns {Object} Mutation object with mutate function and states
 */
export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, data }) => updateComment(commentId, data),
        onMutate: async ({ commentId, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: commentKeys.detail(commentId),
            });

            // Snapshot previous value
            const previousComment = queryClient.getQueryData(
                commentKeys.detail(commentId)
            );

            // Optimistically update
            queryClient.setQueryData(commentKeys.detail(commentId), (old) => ({
                ...old,
                ...data,
            }));

            return { previousComment };
        },
        onError: (error, { commentId }, context) => {
            // Rollback on error
            if (context?.previousComment) {
                queryClient.setQueryData(
                    commentKeys.detail(commentId),
                    context.previousComment
                );
            }
            console.error('Error updating comment:', error);
        },
        onSuccess: (updatedComment, { commentId }) => {
            // Update the comment in detail cache
            queryClient.setQueryData(commentKeys.detail(commentId), updatedComment);

            // Invalidate all comment queries to ensure lists are updated
            queryClient.invalidateQueries({
                queryKey: commentKeys.all,
            });
        },
    });
};

/**
 * Hook to delete a comment
 * @returns {Object} Mutation object with mutate function and states
 */
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId) => deleteComment(commentId),
        onMutate: async (commentId) => {
            // Optimistically remove from all post comment lists
            const queries = queryClient.getQueriesData({
                queryKey: commentKeys.all,
            });

            queries.forEach(([queryKey, data]) => {
                if (Array.isArray(data)) {
                    queryClient.setQueryData(
                        queryKey,
                        data.filter((comment) => comment.id !== commentId)
                    );
                }
            });

            return { commentId };
        },
        onError: (error, commentId) => {
            // Refetch on error to restore correct state
            queryClient.invalidateQueries({
                queryKey: commentKeys.all,
            });
            console.error('Error deleting comment:', error);
        },
        onSuccess: () => {
            // Invalidate all comment queries to ensure consistency across the app
            queryClient.invalidateQueries({
                queryKey: commentKeys.all,
            });
        },
    });
};

export default {
    usePostComments,
    useComment,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
};
