'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Bot, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { login, forgotPassword as forgotPassApi } from '../../services/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isForgotMode, setIsForgotMode] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            const errorDetail = err.response?.data?.error || err.response?.data?.message || err.message;
            setError(errorDetail === 'Network Error' ? 'Backend unreachable. Check deployment status.' : errorDetail);
        }
 finally {
            setLoading(false);
        }
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await forgotPassApi(email);
            setMessage('A reset link has been sent to your email.');
            setTimeout(() => setIsForgotMode(false), 3000);
        } catch (err: any) {
            setError('Failed to process request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden selection:bg-blue-500/30">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[450px] relative z-10"
            >
                {/* Logo Area */}
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20"
                    >
                        <Bot size={40} className="text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Abelops Intelligence</h1>
                    <p className="text-zinc-500 text-sm">Elite AI Operations & Sales Engine</p>
                </div>

                <div className="bg-[#18181b]/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50"></div>
                    
                    <form onSubmit={isForgotMode ? handleForgot : handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        {!isForgotMode && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] ml-1">Security Key</label>
                                    <button 
                                        type="button"
                                        onClick={() => setIsForgotMode(true)}
                                        className="text-[10px] uppercase font-black text-blue-500 tracking-[0.1em] hover:text-blue-400 transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {message && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs py-3 px-4 rounded-xl text-center"
                            >
                                {message}
                            </motion.div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-2xl text-white font-bold flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <span>{loading ? 'Authenticating...' : isForgotMode ? 'Send Reset Link' : 'Initialize Access'}</span>
                            {!loading && <ArrowRight size={18} />}
                        </button>

                        {isForgotMode && (
                            <button 
                                type="button"
                                onClick={() => setIsForgotMode(false)}
                                className="w-full text-zinc-500 text-xs font-medium hover:text-white transition-colors text-center"
                            >
                                Back to login
                            </button>
                        )}
                    </form>
                </div>

                <div className="mt-12 flex items-center justify-center space-x-8">
                    <div className="flex items-center space-x-2">
                        <Shield size={14} className="text-emerald-500" />
                        <span className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.2em]">Encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Zap size={14} className="text-blue-500" />
                        <span className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.2em]">Real-time</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
