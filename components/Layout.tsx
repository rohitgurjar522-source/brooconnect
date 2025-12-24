
import React from 'react';
import { ViewState, UserRole } from '../types';
import { 
  LogOut, Home,
  UserCircle, Clapperboard, Trophy,
  GraduationCap
} from './Icons';

interface LayoutProps {
  currentView: ViewState;
  role: UserRole;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, role, onNavigate, onLogout, children }) => {
  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden font-chakra">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 hidden md:flex flex-col z-20">
        <div className="p-8 border-b border-gray-800">
           <h1 className="text-2xl font-black brand-font tracking-wider italic text-white">
             BROO <span className="text-yellow-500">CONNECT</span>
           </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
           {/* Desktop Nav Items */}
           <button onClick={() => onNavigate('home')} className="w-full text-left px-4 py-3 text-gray-400 hover:text-white flex items-center gap-2"><Home size={18}/> Home Feed</button>
           <button onClick={() => onNavigate('lakhpati')} className="w-full text-left px-4 py-3 text-gray-400 hover:text-white flex items-center gap-2"><Trophy size={18}/> Lakhpati Dashboard</button>
           <button onClick={() => onNavigate('feed')} className="w-full text-left px-4 py-3 text-gray-400 hover:text-white flex items-center gap-2"><Clapperboard size={18}/> Reels</button>
           <button onClick={() => onNavigate('learning')} className="w-full text-left px-4 py-3 text-gray-400 hover:text-white flex items-center gap-2"><GraduationCap size={18}/> Learning</button>
           <button onClick={() => onNavigate('profile')} className="w-full text-left px-4 py-3 text-gray-400 hover:text-white flex items-center gap-2"><UserCircle size={18}/> Profile</button>
           <button onClick={onLogout} className="w-full text-left px-4 py-3 text-red-500 flex items-center gap-2"><LogOut size={18}/> Logout</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
         
         {/* Main Scrollable Area */}
         <main className={`flex-1 overflow-y-auto z-10 scroll-smooth ${currentView === 'feed' ? 'pb-0 p-0' : 'p-4 md:p-8 pb-24'}`}>
            <div className={`${currentView === 'feed' || currentView === 'home' ? 'max-w-full h-full' : 'max-w-md mx-auto min-h-full'}`}>
              {children}
            </div>
         </main>

         {/* Mobile Bottom Navigation (Fixed) */}
         <div className="md:hidden absolute bottom-0 left-0 w-full bg-[#050505] border-t border-gray-800 px-4 py-2 flex justify-between items-end z-50 h-20">
             
             {/* 1. Home (Insta Feed) */}
             <button onClick={() => onNavigate('home')} className={`flex flex-col items-center gap-1 mb-2 w-1/5 ${currentView === 'home' ? 'text-yellow-500' : 'text-white'}`}>
                <Home size={22} strokeWidth={currentView === 'home' ? 2.5 : 2} />
                <span className={`text-[9px] font-bold tracking-wider uppercase ${currentView === 'home' ? 'text-yellow-500' : 'text-gray-400'}`}>Home</span>
             </button>
             
             {/* 2. Lakhpati (Dashboard) */}
             <button onClick={() => onNavigate('lakhpati')} className={`flex flex-col items-center gap-1 mb-2 w-1/5 ${currentView === 'lakhpati' || currentView === 'quiz' || currentView === 'wallet' || currentView === 'refer' ? 'text-yellow-500' : 'text-white'}`}>
                <Trophy size={22} strokeWidth={currentView === 'lakhpati' ? 2.5 : 2} />
                <span className={`text-[9px] font-bold tracking-wider uppercase ${currentView === 'lakhpati' ? 'text-yellow-500' : 'text-gray-400'}`}>Lakhpati</span>
             </button>
             
             {/* 3. Reels (Center) */}
             <div className="relative -top-6 w-1/5 flex justify-center">
               <button 
                 onClick={() => onNavigate('feed')}
                 className={`w-16 h-16 bg-gradient-to-b ${currentView === 'feed' ? 'from-yellow-400 to-yellow-600 scale-105' : 'from-yellow-600 to-yellow-700'} rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,184,0,0.3)] border-[6px] border-[#050505] active:scale-95 transition-transform`}
               >
                 <Clapperboard size={28} className="text-black" strokeWidth={3} />
               </button>
             </div>

             {/* 4. Learning (Was Tasks) */}
             <button onClick={() => onNavigate('learning')} className={`flex flex-col items-center gap-1 mb-2 w-1/5 ${currentView === 'learning' ? 'text-yellow-500' : 'text-white'}`}>
                <GraduationCap size={24} strokeWidth={currentView === 'learning' ? 2.5 : 2} />
                <span className={`text-[9px] font-bold tracking-wider uppercase ${currentView === 'learning' ? 'text-yellow-500' : 'text-gray-400'}`}>Learning</span>
             </button>
             
             {/* 5. Profile */}
             <button onClick={() => onNavigate('profile')} className={`flex flex-col items-center gap-1 mb-2 w-1/5 ${currentView === 'profile' ? 'text-yellow-500' : 'text-white'}`}>
                <UserCircle size={22} strokeWidth={currentView === 'profile' ? 2.5 : 2} />
                <span className={`text-[9px] font-bold tracking-wider uppercase ${currentView === 'profile' ? 'text-yellow-500' : 'text-gray-400'}`}>Profile</span>
             </button>
         </div>
      </div>
    </div>
  );
};

export default Layout;
