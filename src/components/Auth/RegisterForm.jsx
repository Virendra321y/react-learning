import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiLoader } from 'react-icons/fi';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    email: z.string().email('Please enter a valid email address'),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain a special character (@, $, !, %, *, ?, &)')
        .regex(/^[a-zA-Z0-9@$!%*?&]+$/, 'Password contains invalid characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const RegisterForm = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        setError('');
        setIsLoading(true);
        try {
            // Omit confirmPassword from API call
            const { confirmPassword: _confirmPassword, ...registerData } = data;
            await registerUser(registerData);
            navigate('/'); // Redirect to home on success
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-black">Create Account</h2>
                    <p className="text-slate-500 mt-2">Join our learning community today</p>
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                            <div className="relative">
                                <input
                                    {...register('firstName')}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                        }`}
                                    placeholder="John"
                                />
                                <FiUser className="absolute left-3 top-3 text-slate-400 pointer-events-none" size={16} />
                            </div>
                            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                            <div className="relative">
                                <input
                                    {...register('lastName')}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                        }`}
                                    placeholder="Doe"
                                />
                                <FiUser className="absolute left-3 top-3 text-slate-400 pointer-events-none" size={16} />
                            </div>
                            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <div className="relative">
                            <input
                                {...register('username')}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.username ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                    }`}
                                placeholder="johndoe123"
                            />
                            <FiUser className="absolute left-3 top-3 text-slate-400 pointer-events-none" size={16} />
                        </div>
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <input
                                {...register('email')}
                                type="email"
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                    }`}
                                placeholder="you@example.com"
                            />
                            <FiMail className="absolute left-3 top-3 text-slate-400 pointer-events-none" size={16} />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                {...register('password')}
                                type="password"
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                    }`}
                                placeholder="••••••••"
                            />
                            <FiLock className="absolute left-3 top-3 text-slate-400 pointer-events-none" size={16} />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                    }`}
                                placeholder="••••••••"
                            />
                            <FiLock className="absolute left-3 top-3 text-slate-400 pointer-events-none" size={16} />
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 py-3.5 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <FiLoader className="animate-spin mr-2" /> : null}
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
