import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                    Welcome to Social Media App
                </h1>
                <p className="text-xl text-slate-600 mb-8">
                    Your social network is ready. Start connecting with friends and sharing moments.
                </p>
                <div className="text-sm text-slate-500">
                    More features coming soon...
                </div>
            </div>
        </div>
    );
};

export default Home;
