import React from 'react';
import { User, ViewState } from '../types';
import { ArrowDownLeft, ArrowUpRight, Zap, Trophy } from './Icons';
import Quiz from './Quiz';

interface LakhpatiProps {
  user: User;
  onNavigate: (view: ViewState) => void;
  onJoinQuiz: (fee: number) => void;
}

const Lakhpati: React.FC<LakhpatiProps> = ({ user, onNavigate, onJoinQuiz }) => {
  return (
    <div className="space-y-6 pb-24 animate-fade-in font-chakra pt-6">
      
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl brand-font text-white flex items-center gap-2">
           <Trophy className="text-yellow-500" /> DASHBOARD
        </h2>
        <div className="text-[10px] font-bold text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-800">
           ELITE MEMBER
        </div>
      </div>

      {/* Detailed Wallet Box */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl p-0 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full blur-2xl"></div>
          
          <div className="p-5 grid grid-cols-2 gap-4 border-b border-gray-800/50 bg-gradient-to-b from-[#1a1a1a] to-[#111]">
            <div>
                <p className="text-green-500 text-[10px] font-bold tracking-widest uppercase mb-1">TOTAL EARNINGS</p>
                <h2 className="text-2xl brand-font text-white">₹{user.totalEarnings.toLocaleString()}</h2>
            </div>
            <div className="text-right">
                <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">WALLET BALANCE</p>
                <h2 className="text-3xl brand-font text-yellow-500">₹{user.walletBalance.toLocaleString()}</h2>
            </div>
          </div>
          
          <div className="p-3 bg-black/40 flex gap-3">
            <button 
                onClick={() => onNavigate('wallet')}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black font-black py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 text-xs uppercase tracking-wide shadow-lg"
            >
                <ArrowDownLeft size={16} /> ADD CASH
            </button>
            <button 
                onClick={() => onNavigate('wallet')}
                className="flex-1 bg-[#222] border border-gray-700 hover:bg-[#333] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 text-xs uppercase tracking-wide"
            >
                <ArrowUpRight size={16} /> WITHDRAW
            </button>
          </div>
      </div>

      {/* Refer & Earn Box */}
      <div className="bg-gradient-to-r from-[#111] to-[#161616] border border-gray-800 rounded-2xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-yellow-600/30 transition-colors">
          <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500"></div>
          <div>
            <h3 className="text-white font-black brand-font text-lg uppercase flex items-center gap-2">
                REFER & EARN <Zap size={16} className="text-yellow-500 fill-current"/>
            </h3>
            <p className="text-gray-400 text-[11px] mt-1 font-medium">Earn <span className="text-yellow-500 font-bold">₹500</span> per invite instantly</p>
          </div>
          <button 
            onClick={() => onNavigate('refer')}
            className="bg-[#222] border border-gray-700 text-white hover:text-yellow-500 text-xs font-black px-5 py-2.5 rounded-lg uppercase tracking-wide transition-colors"
          >
            INVITE
          </button>
      </div>

      {/* Lakhpati Levels List */}
      <div className="mt-8">
          <div className="flex items-center justify-between mb-4 pl-1">
             <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">LAKHPATI LEVELS</h3>
             <span className="text-[10px] text-green-500 font-bold animate-pulse">● LIVE CONTESTS</span>
          </div>
          {/* Pass onNavigate to Quiz component to satisfy required props */}
          <Quiz userBalance={user.walletBalance} onJoinQuiz={onJoinQuiz} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default Lakhpati;