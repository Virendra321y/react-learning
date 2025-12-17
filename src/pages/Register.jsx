import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import { motion } from 'framer-motion';

const Register = () => {
    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[50rem] h-[50rem] rounded-full bg-blue-200/40 blur-3xl" />
                <div className="absolute top-[60%] -left-[10%] w-[40rem] h-[40rem] rounded-full bg-indigo-200/40 blur-3xl" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 inline-block">
                        Start Learning
                    </h1>
                </div>
                <RegisterForm />
                <p className="mt-8 text-center text-xs text-slate-500 font-medium">
                    © {new Date().getFullYear()} React Learning Platform. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
