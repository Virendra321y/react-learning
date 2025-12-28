import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
                <div className="mb-6">
                    <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl mb-4">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-4 animate-pulse">
                    Welcome to SocialApp
                </h1>
                <p className="text-2xl text-slate-700 mb-8 font-medium">
                    Your social network is ready. Start connecting with friends and sharing moments.
                </p>
                <div className="flex gap-4 justify-center">
                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                        Get Started
                    </button>
                    <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-purple-200">
                        Learn More
                    </button>
                </div>
                <div className="mt-12 text-sm text-slate-500">
                    More features coming soon...
                </div>
            </div>
        </div>
    );
};

export default Home;
