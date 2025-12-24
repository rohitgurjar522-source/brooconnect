import React from 'react';
import { Share2, Users, ArrowUpRight, Copy } from './Icons';

interface ReferralProps {
  referralCode: string;
  earnings: number;
}

const Referral: React.FC<ReferralProps> = ({ referralCode, earnings }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Code copied!");
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in font-chakra">
       
       <h2 className="text-3xl brand-font text-white uppercase mt-4">Refer & Earn</h2>

       {/* Total Team Earnings */}
       <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/5 rounded-full blur-3xl"></div>
          
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">TOTAL TEAM EARNINGS</p>
          <h2 className="text-5xl brand-font text-yellow-500 mb-8 drop-shadow-[0_0_10px_rgba(234,179,8,0.2)]">₹{earnings}</h2>

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 max-w-sm mx-auto">
             <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">YOUR EXCLUSIVE CODE</p>
             <div className="flex gap-2">
                <div className="flex-1 bg-[#050505] rounded-lg border border-gray-700 flex items-center justify-center text-white font-mono text-xl tracking-wider font-bold">
                   {referralCode}
                </div>
                <button onClick={copyToClipboard} className="w-14 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-black hover:bg-yellow-500 active:scale-95 transition-all shadow-lg">
                   <Share2 size={20} />
                </button>
             </div>
          </div>
       </div>

       {/* System Mechanics */}
       <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
             <span className="text-yellow-500">⚡</span> SYSTEM MECHANICS
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-orange-900/20 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-3">
                   <Users size={20} />
                </div>
                <h4 className="text-white font-bold mb-1">Direct</h4>
                <p className="text-xs text-gray-500 font-medium">₹500 per friend instantly.</p>
             </div>
             <div className="bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-yellow-900/20 border border-yellow-500/30 flex items-center justify-center text-yellow-500 mb-3">
                   <ArrowUpRight size={20} />
                </div>
                <h4 className="text-white font-bold mb-1">Indirect</h4>
                <p className="text-xs text-gray-500 font-medium">10% Commission from network.</p>
             </div>
          </div>
       </div>

       {/* Top Earners */}
       <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Top Earners</h3>
          <div className="space-y-3">
             {[
               { rank: 1, name: 'User_9001', role: 'Diamond Member', amt: 50000 },
               { rank: 2, name: 'User_9002', role: 'Diamond Member', amt: 25000 },
               { rank: 3, name: 'User_9003', role: 'Diamond Member', amt: 16667 },
               { rank: 4, name: 'User_9004', role: 'Diamond Member', amt: 12500 },
               { rank: 5, name: 'User_9005', role: 'Diamond Member', amt: 10000 },
             ].map((earner) => (
               <div key={earner.rank} className="bg-[#111] border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-black ${earner.rank === 1 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'bg-[#222] text-gray-500 border border-gray-700'}`}>
                        {earner.rank}
                     </div>
                     <div>
                        <h4 className="text-white font-bold">{earner.name}</h4>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{earner.role}</p>
                     </div>
                  </div>
                  <span className="text-yellow-500 font-bold font-mono tracking-tight">₹{earner.amt}</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default Referral;