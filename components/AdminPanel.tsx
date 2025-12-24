import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, ViewState } from '../types';
import { ADMIN_EMAIL } from './constants';
import { ShieldCheck, Users, Settings, Download, Film, BookOpen, Trophy, Wallet, Bell } from './Icons';

// Add onNavigate to AdminPanelProps
interface AdminPanelProps {
  user: User;
  platformProfit: number;
  totalUsers: number;
  onNavigate: (view: ViewState) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onNavigate, platformProfit, totalUsers }) => {
  const [stats, setStats] = useState({
      totalUsers: 0,
      totalRevenue: 0, // Mock for now or sum from transactions
      withdrawals: 0
  });

  useEffect(() => {
     const fetchStats = async () => {
         const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
         setStats(prev => ({ ...prev, totalUsers: count || 0 }));
     };
     fetchStats();
  }, []);

  // Security Check
  if (!user || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="bg-red-900/20 border border-red-500 text-red-500 p-6 rounded-xl text-center">
          <ShieldCheck size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold uppercase">Access Denied</h2>
          <p className="text-sm mt-2">This panel is restricted to the owner: {ADMIN_EMAIL}</p>
        </div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    alert(`${action} - Coming Soon`);
  };

  const handleDownloadZip = () => {
    alert("Project Compression Started... Downloading ZIP.");
  };

  return (
    <div className="p-6 pb-24 animate-fade-in font-chakra max-w-2xl mx-auto">
      <div className="text-center mb-8 border-b border-yellow-800/30 pb-6">
        <h1 className="text-3xl brand-font text-yellow-500 uppercase tracking-widest mb-2">
          🔥 ADMIN PANEL
        </h1>
        <p className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase">
          MASTER CONTROL • {user.email}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="bg-[#111] border border-gray-800 p-4 rounded-xl text-center">
             <h3 className="text-2xl text-white font-bold">{stats.totalUsers}</h3>
             <p className="text-[10px] text-gray-500 uppercase">Total Users</p>
         </div>
         <div className="bg-[#111] border border-gray-800 p-4 rounded-xl text-center">
             <h3 className="text-2xl text-green-500 font-bold">Live</h3>
             <p className="text-[10px] text-gray-500 uppercase">System Status</p>
         </div>
      </div>

      <div className="space-y-4">
        <AdminButton 
            icon={<Users size={20}/>} 
            label="Manage Users" 
            onClick={() => handleAction("User Management")} 
        />
        
        <AdminButton 
            icon={<Wallet size={20}/>} 
            label="Add Cash / Withdraw Control" 
            onClick={() => handleAction("Wallet Control")} 
        />

        <AdminButton 
            icon={<Bell size={20}/>} 
            label="Push Notifications" 
            onClick={() => handleAction("Notifications")} 
        />

        <AdminButton 
            icon={<Film size={20}/>} 
            label="Approve Reels / Feed Posts" 
            onClick={() => handleAction("Content Moderation")} 
        />

        <AdminButton 
            icon={<BookOpen size={20}/>} 
            label="Courses / Learning Hub Control" 
            onClick={() => handleAction("Learning Hub")} 
        />

        <AdminButton 
            icon={<Trophy size={20}/>} 
            label="Lakhpati Quiz Control" 
            onClick={() => handleAction("Quiz Settings")} 
        />

        <div className="pt-4 border-t border-gray-800 mt-6">
            <button 
                onClick={handleDownloadZip}
                className="w-full bg-[#111] border border-yellow-600 text-yellow-500 hover:bg-yellow-600 hover:text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.1)] uppercase tracking-wide text-sm"
            >
                <Download size={20} />
                Download Full Project ZIP
            </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-600 text-[10px] uppercase font-bold tracking-widest">
         Broo Connect System v1.0 (Live Supabase)
      </div>
    </div>
  );
};

// Helper Component for consistent button styling
const AdminButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl flex items-center justify-between px-6 transition-all active:scale-95 shadow-lg group"
  >
    <div className="flex items-center gap-3">
        <div className="bg-black/10 p-2 rounded-lg group-hover:bg-black/20 transition-colors">
            {icon}
        </div>
        <span className="uppercase tracking-wide text-sm">{label}</span>
    </div>
    <Settings size={18} className="opacity-50" />
  </button>
);

export default AdminPanel;