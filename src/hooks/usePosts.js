import { useState, useEffect, useCallback } from 'react';
import { postAPI } from '../services/postAPI';

/**
 * Custom hook for fetching paginated posts
 * @param {number} initialPage - Initial page number
 * @param {number} pageSize - Number of posts per page
 */
export const usePostList = (initialPage = 0, pageSize = 10) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await postAPI.getAll(page, pageSize);
            setPosts(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
            setTotalElements(response.data.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return {
        posts,
        loading,
        error,
        page,
        setPage,
        totalPages,
        totalElements,
        refetch: fetchPosts
    };
};

/**
 * Custom hook for fetching a single post
 * @param {number} id - Post ID
 */
export const usePost = (id) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPost = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            const response = await postAPI.getById(id);
            setPost(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch post');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    return { post, loading, error, refetch: fetchPost };
};

/**
 * Custom hook for creating a post
 */
export const useCreatePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPost = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await postAPI.create(data);
            return response.data.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to create post';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createPost, loading, error };
};

/**
 * Custom hook for updating a post
 */
export const useUpdatePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updatePost = async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await postAPI.update(id, data);
            return response.data.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update post';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updatePost, loading, error };
};

/**
 * Custom hook for deleting a post
 */
export const useDeletePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deletePost = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await postAPI.delete(id);
            return true;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to delete post';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deletePost, loading, error };
};

/**
 * Custom hook for searching posts
 * @param {string} initialQuery - Initial search query
 * @param {number} pageSize - Number of posts per page
 */
export const useSearchPosts = (initialQuery = '', pageSize = 10) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState(initialQuery);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const searchPosts = useCallback(async () => {
        if (!query.trim()) {
            setPosts([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await postAPI.search(query, page, pageSize);
            setPosts(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
            setTotalElements(response.data.data.totalElements);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to search posts');
        } finally {
            setLoading(false);
        }
    }, [query, page, pageSize]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            searchPosts();
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchPosts]);

    return {
        posts,
        loading,
        error,
        query,
        setQuery,
        page,
        setPage,
        totalPages,
        totalElements
    };
};
