'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Settings, 
    Zap, 
    Shield, 
    Plus, 
    Edit2, 
    ExternalLink, 
    LayoutDashboard,
    Key,
    MessageCircle,
    BarChart3,
    ArrowLeft
} from 'lucide-react';
import api from '../../services/api';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<any>(null);
    const router = useRouter();

    // Form states
    const [orgForm, setOrgForm] = useState({
        name: '',
        whatsapp_phone_id: '',
        whatsapp_token: '',
        openai_token: '',
        message_limit: 1000
    });

    const [userForm, setUserForm] = useState({
        email: '',
        password: '',
        name: '',
        organization_id: '',
        role: 'USER'
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const res = await api.get('/admin/organizations');
            setOrganizations(res.data);
        } catch (err) {
            console.error('Failed to fetch orgs');
        }
    };

    const handleOrgSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (selectedOrg) {
                await api.put(`/admin/organizations/${selectedOrg.id}`, orgForm);
            } else {
                await api.post('/admin/organizations', orgForm);
            }
            setIsOrgModalOpen(false);
            fetchOrganizations();
            setOrgForm({ name: '', whatsapp_phone_id: '', whatsapp_token: '', openai_token: '', message_limit: 1000 });
            setSelectedOrg(null);
        } catch (err) {
            alert('Failed to save organization');
        } finally {
            setLoading(false);
        }
    };

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/users', userForm);
            setIsUserModalOpen(false);
            setUserForm({ email: '', password: '', name: '', organization_id: '', role: 'USER' });
            alert('User created successfully');
        } catch (err) {
            alert('Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-400 font-inter">
            {/* Header */}
            <header className="h-[80px] border-b border-white/5 px-12 flex items-center justify-between backdrop-blur-xl bg-[#09090b]/80 sticky top-0 z-50">
                <div className="flex items-center space-x-6">
                    <button onClick={() => router.push('/dashboard')} className="p-2.5 hover:bg-white/5 rounded-2xl transition-all border border-white/5 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">System Authority</h1>
                        <p className="text-[10px] uppercase font-black text-blue-500 tracking-[0.2em]">Management Console</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setIsOrgModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={16} />
                        <span>Create Client</span>
                    </button>
                    <button 
                        onClick={() => setIsUserModalOpen(true)}
                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-xs font-bold border border-white/5 transition-all"
                    >
                        <span>Add Operator</span>
                    </button>
                </div>
            </header>

            <main className="p-12 max-w-[1400px] mx-auto">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Active Clients', value: organizations.length, icon: Users, color: 'text-blue-500' },
                        { label: 'Total Engagement', value: organizations.reduce((acc, o) => acc + (o._count?.messages || 0), 0), icon: BarChart3, color: 'text-emerald-500' },
                        { label: 'System Uptime', value: '99.9%', icon: Zap, color: 'text-amber-500' },
                        { label: 'Security Level', value: 'Elite', icon: Shield, color: 'text-indigo-500' },
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#18181b] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                            <stat.icon className={`${stat.color} mb-4`} size={24} />
                            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Clients Table */}
                <div className="bg-[#18181b] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] uppercase font-black tracking-widest">Client Name</th>
                                <th className="px-8 py-6 text-[10px] uppercase font-black tracking-widest">WhatsApp ID</th>
                                <th className="px-8 py-6 text-[10px] uppercase font-black tracking-widest">Quota Info</th>
                                <th className="px-8 py-6 text-[10px] uppercase font-black tracking-widest">AI Status</th>
                                <th className="px-8 py-6 text-[10px] uppercase font-black tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {organizations.map((org) => (
                                <tr key={org.id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20">
                                                {org.name[0]}
                                            </div>
                                            <span className="text-white font-bold">{org.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-zinc-500 font-mono text-xs">{org.whatsapp_phone_id}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className="text-zinc-500">{org.message_count} / {org.message_limit} MSGS</span>
                                                <span className="text-blue-500">{Math.round((org.message_count / org.message_limit) * 100)}%</span>
                                            </div>
                                            <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
                                                    style={{ width: `${Math.min((org.message_count / org.message_limit) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {org.openai_token ? (
                                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-lg border border-emerald-500/20 tracking-widest">ACTIVE</span>
                                        ) : (
                                            <span className="bg-zinc-500/10 text-zinc-500 text-[10px] font-black px-3 py-1 rounded-lg border border-white/10 tracking-widest">DEFAULT</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedOrg(org);
                                                setOrgForm({
                                                    name: org.name,
                                                    whatsapp_phone_id: org.whatsapp_phone_id,
                                                    whatsapp_token: org.whatsapp_token,
                                                    openai_token: org.openai_token || '',
                                                    message_limit: org.message_limit
                                                });
                                                setIsOrgModalOpen(true);
                                            }}
                                            className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-zinc-600 hover:text-white"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Org Modal */}
            <AnimatePresence>
                {isOrgModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#09090b]/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#18181b] border border-white/5 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50"></div>
                            
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedOrg ? 'Refine Client' : 'New Client Integration'}</h2>
                            <p className="text-zinc-500 text-sm mb-8">Set up infrastructure for a new business partner.</p>

                            <form onSubmit={handleOrgSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Business Name</label>
                                        <input 
                                            required
                                            value={orgForm.name}
                                            onChange={(e) => setOrgForm({...orgForm, name: e.target.value})}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 transition-all font-light"
                                            placeholder="e.g. Abelops Global"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Meta Phone ID</label>
                                        <input 
                                            required
                                            value={orgForm.whatsapp_phone_id}
                                            onChange={(e) => setOrgForm({...orgForm, whatsapp_phone_id: e.target.value})}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono text-sm outline-none focus:border-blue-500/50 transition-all"
                                            placeholder="XXXXXX"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Message Limit</label>
                                        <input 
                                            type="number"
                                            required
                                            value={orgForm.message_limit}
                                            onChange={(e) => setOrgForm({...orgForm, message_limit: parseInt(e.target.value)})}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Meta Access Token</label>
                                        <textarea 
                                            required
                                            value={orgForm.whatsapp_token}
                                            onChange={(e) => setOrgForm({...orgForm, whatsapp_token: e.target.value})}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white font-mono text-xs outline-none focus:border-blue-500/50 transition-all h-24 no-scrollbar"
                                            placeholder="EAAS..."
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1 text-blue-500">Custom AI Token (Optional)</label>
                                        <input 
                                            value={orgForm.openai_token}
                                            onChange={(e) => setOrgForm({...orgForm, openai_token: e.target.value})}
                                            className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl py-4 px-4 text-white font-mono text-xs outline-none focus:border-blue-500/50 transition-all"
                                            placeholder="sk-..."
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 pt-4">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                    >
                                        {loading ? 'Processing...' : selectedOrg ? 'Update Infrastructure' : 'Authorize Integration'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsOrgModalOpen(false);
                                            setSelectedOrg(null);
                                            setOrgForm({ name: '', whatsapp_phone_id: '', whatsapp_token: '', openai_token: '', message_limit: 1000 });
                                        }}
                                        className="px-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold py-4 rounded-2xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Operator Modal */}
            <AnimatePresence>
                {isUserModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#09090b]/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#18181b] border border-white/5 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">New Operator Access</h2>
                            <p className="text-zinc-500 text-sm mb-8">Grant dashboard access to a client representative.</p>

                            <form onSubmit={handleUserSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Operator Name</label>
                                    <input 
                                        required
                                        value={userForm.name}
                                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 transition-all font-light"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Email Address</label>
                                    <input 
                                        type="email"
                                        required
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 transition-all font-light"
                                        placeholder="operator@company.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Account Secret</label>
                                    <input 
                                        type="password"
                                        required
                                        value={userForm.password}
                                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Assign to Client</label>
                                    <select 
                                        required
                                        value={userForm.organization_id}
                                        onChange={(e) => setUserForm({...userForm, organization_id: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled className="bg-[#18181b]">Select an Organization</option>
                                        {organizations.map(org => (
                                            <option key={org.id} value={org.id} className="bg-[#18181b]">{org.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center space-x-4 pt-4">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-white text-[#09090b] font-bold py-4 rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all shadow-xl shadow-white/5"
                                    >
                                        {loading ? 'Creating...' : 'Grant Access'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsUserModalOpen(false)}
                                        className="px-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold py-4 rounded-2xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
