import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMail, FiLock, FiAlertCircle, FiLoader } from 'react-icons/fi';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setError('');
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            navigate('/'); // Redirect to home on success
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-black">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Sign in to continue your learning journey</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center text-sm"
                    >
                        <FiAlertCircle className="mr-2 flex-shrink-0" size={18} />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                            <input
                                {...register('email')}
                                type="email"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors outline-none ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                    }`}
                                placeholder="you@example.com"
                            />
                            <FiMail className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                {...register('password')}
                                type="password"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors outline-none ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                    }`}
                                placeholder="••••••••"
                            />
                            <FiLock className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <FiLoader className="animate-spin mr-2" /> : null}
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
