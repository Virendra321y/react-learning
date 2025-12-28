import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import PostForm from '../components/Posts/PostForm';
import { usePost, useUpdatePost } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';

/**
 * EditPost Page
 * Page for editing existing posts (author only)
 */
const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { post, loading: loadingPost, error: loadError } = usePost(id);
    const { updatePost, loading: updating, error: updateError } = useUpdatePost();
    const [successMessage, setSuccessMessage] = useState('');

    // Check if user is the author
    useEffect(() => {
        if (post && user && post.author.id !== user.id) {
            navigate('/posts');
        }
    }, [post, user, navigate]);

    const handleSubmit = async (data) => {
        try {
            await updatePost(id, data);
            setSuccessMessage('Post updated successfully!');
            setTimeout(() => {
                navigate(`/posts/${id}`);
            }, 1500);
        } catch (err) {
            console.error('Failed to update post:', err);
        }
    };

    if (loadingPost) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (loadError || !post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
                        <h3 className="font-semibold mb-2">Error loading post</h3>
                        <p>{loadError || 'Post not found'}</p>
                        <button
                            onClick={() => navigate('/posts')}
                            className="text-blue-600 hover:underline mt-4"
                        >
                            ← Back to Posts
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(`/posts/${id}`)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        <span>Back to Post</span>
                    </button>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                        Edit Post
                    </h1>
                    <p className="text-slate-600 mt-2">Update your post content</p>
                </motion.div>

                {/* Success Message */}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
                    >
                        {successMessage}
                    </motion.div>
                )}

                {/* Error Message */}
                {updateError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
                    >
                        {updateError}
                    </motion.div>
                )}

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <PostForm
                        initialData={{
                            title: post.title,
                            content: post.content,
                            status: post.status,
                        }}
                        onSubmit={handleSubmit}
                        submitLabel="Update Post"
                        loading={updating}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditPost;
