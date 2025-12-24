import React, { useState } from 'react';
import { User } from '../types';
import { Settings, Grid, PlayCircle, PlusSquare, Camera, Edit, LogOut } from './Icons';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('reels');

  const handleUpload = () => {
    // Simulation of upload functionality
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*,image/*';
    input.onchange = (e) => {
      alert("Opening Camera/Gallery... Video selected for upload!");
    };
    input.click();
  };

  return (
    <div className="pb-24 animate-fade-in font-chakra relative">
      {/* Header */}
      <div className="flex justify-between items-center py-4 px-2">
        <h2 className="text-xl font-black brand-font text-white">{user.name}</h2>
        <div className="flex gap-4">
           <button onClick={handleUpload} className="text-white hover:text-yellow-500 transition-colors">
              <PlusSquare size={26} />
           </button>
           <button onClick={onLogout} className="text-red-500 hover:text-red-400 transition-colors">
              <LogOut size={26} />
           </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex items-center gap-6 mb-6 mt-2">
         <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-300 p-[2px]">
               <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-700">{user.name[0]}</span>
               </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-black text-white">
               <Camera size={12} />
            </button>
         </div>
         
         <div className="flex-1 flex justify-around text-center">
            <div>
               <h4 className="text-white font-bold text-lg">{user.posts || 12}</h4>
               <p className="text-gray-500 text-xs">Posts</p>
            </div>
            <div>
               <h4 className="text-white font-bold text-lg">{user.followers || '1.2k'}</h4>
               <p className="text-gray-500 text-xs">Followers</p>
            </div>
            <div>
               <h4 className="text-white font-bold text-lg">{user.following || 45}</h4>
               <p className="text-gray-500 text-xs">Following</p>
            </div>
         </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
         <p className="text-white font-bold text-sm">Elite Member 💎</p>
         <p className="text-gray-400 text-xs mt-1">Lakhpati Quiz Champion 🏆 | Earning Daily</p>
         <p className="text-blue-400 text-xs mt-1">@broo_connect_official</p>
         
         <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-[#222] text-white text-xs font-bold py-2 rounded-lg border border-gray-800 hover:bg-[#333]">Edit Profile</button>
            <button className="flex-1 bg-[#222] text-white text-xs font-bold py-2 rounded-lg border border-gray-800 hover:bg-[#333]">Share Profile</button>
         </div>
      </div>

      {/* Upload Feature Highlight */}
      <div className="mb-6 p-4 bg-yellow-900/10 border border-yellow-600/30 rounded-xl flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                <PlayCircle size={20} />
             </div>
             <div>
                <h4 className="text-white text-sm font-bold">Upload Your Feel</h4>
                <p className="text-gray-500 text-[10px]">Share your earning journey</p>
             </div>
         </div>
         <button onClick={handleUpload} className="px-4 py-2 bg-yellow-600 rounded-lg text-black font-bold text-xs uppercase hover:bg-yellow-500">
            Upload
         </button>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-gray-800 mb-1">
         <button 
           onClick={() => setActiveTab('posts')} 
           className={`flex-1 py-3 flex items-center justify-center ${activeTab === 'posts' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
         >
            <Grid size={20} />
         </button>
         <button 
           onClick={() => setActiveTab('reels')} 
           className={`flex-1 py-3 flex items-center justify-center ${activeTab === 'reels' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
         >
            <PlayCircle size={20} />
         </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-1">
         {[1,2,3,4,5,6,7,8,9].map((i) => (
            <div key={i} className="aspect-square bg-[#111] relative group overflow-hidden cursor-pointer">
               <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray-800 opacity-50"></div>
               {activeTab === 'reels' && (
                  <div className="absolute top-2 right-2 text-white drop-shadow-md">
                     <PlayCircle size={16} fill="white" className="text-transparent opacity-80" />
                  </div>
               )}
               <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold flex items-center gap-1">
                  <PlayCircle size={10} /> {1200 + i * 55}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Profile;