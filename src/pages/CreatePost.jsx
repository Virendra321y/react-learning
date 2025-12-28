import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import PostForm from '../components/Posts/PostForm';
import { useCreatePost } from '../hooks/usePosts';

/**
 * CreatePost Page
 * Page for creating new posts
 */
const CreatePost = () => {
    const navigate = useNavigate();
    const { createPost, loading, error } = useCreatePost();
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (data) => {
        try {
            const newPost = await createPost(data);
            setSuccessMessage('Post created successfully!');
            setTimeout(() => {
                navigate(`/posts/${newPost.id}`);
            }, 1500);
        } catch (err) {
            // Error is handled by the hook
            console.error('Failed to create post:', err);
        }
    };

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
                        onClick={() => navigate('/posts')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        <span>Back to Posts</span>
                    </button>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                        Create New Post
                    </h1>
                    <p className="text-slate-600 mt-2">Share your thoughts with the community</p>
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
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <PostForm
                        onSubmit={handleSubmit}
                        submitLabel="Create Post"
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
