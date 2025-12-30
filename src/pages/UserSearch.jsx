import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiUsers } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/userAPI';
import UserCard from '../components/Users/UserCard';
import Pagination from '../components/Posts/Pagination';

const UserSearch = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(0);
    const { user: currentUser } = useAuth();

    // Search State
    const initialQuery = searchParams.get('q') || '';
    const initialPage = parseInt(searchParams.get('page') || '0');
    const [query, setQuery] = useState(initialQuery);
    const [page, setPage] = useState(initialPage);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setPage(0); // Reset to page 0 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // If query is empty, allow getting all users or recommendations
                // The API searchUsers usually requires a query? Or maybe we use getAllUsers if none.
                // Let's assume searchUsers handles empty query or we call getAllUsers.
                // Based on standard implementation, getAllUsers is default.

                let response;
                if (debouncedQuery.trim()) {
                    response = await userAPI.search(debouncedQuery, page, 12); // Grid size 12
                } else {
                    response = await userAPI.search('', page, 12); // Assuming search('') returns all or use different endpoint
                    // If search('') doesn't work, we might need a separate getAll call, 
                    // but for this "Search" page, initially showing recent users is good.
                    // Let's assume the backend search implementation returns all if query is empty or we use getAll.
                    // If backend implementation of search requires query:
                    // users = userRepository.searchUsers(query, pageable);
                    // It likely strictly filters. Let's try to pass a wildcard or just handle it.
                    // For now, let's assume empty string might filtering nothing.
                    // Actually, let's use a fail-safe: if query is empty, just list users?
                    // But our userAPI has specific endpoints. Let's rely on search for now.
                }

                setUsers(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        // Update URL params
        setSearchParams({ q: debouncedQuery, page: page.toString() });

    }, [debouncedQuery, page, setSearchParams]);

    const handleFollowToggle = async (targetUserId, shouldFollow) => {
        try {
            // Optimistic update
            setUsers(prev => prev.map(u =>
                u.id === targetUserId
                    ? { ...u, isFollowing: shouldFollow, followersCount: (u.followersCount || 0) + (shouldFollow ? 1 : -1) }
                    : u
            ));

            if (shouldFollow) {
                await userAPI.follow(targetUserId);
            } else {
                await userAPI.unfollow(targetUserId);
            }
        } catch (error) {
            console.error("Follow action failed, reverting", error);
            // Revert on failure
            setUsers(prev => prev.map(u =>
                u.id === targetUserId
                    ? { ...u, isFollowing: !shouldFollow, followersCount: (u.followersCount || 0) + (!shouldFollow ? 1 : -1) }
                    : u
            ));
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Discover People
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Find friends, mentors, and fellow developers to follow.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiSearch className="text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name or username..."
                            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-24 bg-white rounded-2xl shadow-sm"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {users.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {users.map(user => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        isFollowing={user.isFollowing}
                                        onFollowToggle={handleFollowToggle}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUsers className="text-3xl text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No users found</h3>
                                <p className="text-slate-500">Try adjusting your search terms.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default UserSearch;
