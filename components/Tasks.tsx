import React from 'react';
import { Share2, Smartphone, PlayCircle, Headphones, Smartphone as PhoneIcon } from './Icons';
import { Task, ViewState } from '../types';

// Add onNavigate to TasksProps
interface TasksProps {
  onCompleteTask: (task: Task) => void;
  onNavigate: (view: ViewState) => void;
}

const Tasks: React.FC<TasksProps> = ({ onCompleteTask, onNavigate }) => {
  const operations = [
    { id: '1', title: 'Share Promoted Reel', credits: 10, icon: Share2, color: 'text-blue-500', bg: 'bg-blue-900/20' },
    { id: '2', title: 'Install Flipkart App', credits: 50, icon: Smartphone, color: 'text-green-500', bg: 'bg-green-900/20' },
    { id: '3', title: 'Watch Ad Video', credits: 5, icon: PlayCircle, color: 'text-red-500', bg: 'bg-red-900/20' },
    { id: '4', title: 'Follow Broo on Insta', credits: 15, icon: Share2, color: 'text-pink-500', bg: 'bg-pink-900/20' },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in font-chakra">
       
       <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-6">DAILY OPERATIONS</h3>

       <div className="space-y-3">
         {operations.map((op) => (
           <div key={op.id} className="bg-[#111] border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-xl ${op.bg} flex items-center justify-center ${op.color} border border-white/5`}>
                    <op.icon size={20} />
                 </div>
                 <div>
                    <h4 className="text-white font-bold">{op.title}</h4>
                    <p className="text-xs text-yellow-600 font-bold">$ {op.credits} Credits</p>
                 </div>
              </div>
              <button 
                onClick={() => onCompleteTask({ id: op.id, title: op.title, reward: op.credits, type: 'video', completed: false })}
                className="bg-white hover:bg-gray-200 text-black font-black px-6 py-2 rounded-lg text-xs tracking-wide transition-colors active:scale-95"
              >
                START
              </button>
           </div>
         ))}
       </div>

       <div className="mt-8">
         <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">AFFILIATE MARKETPLACE</h3>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
               <Headphones size={40} className="text-gray-500 group-hover:text-white transition-colors"/>
               <span className="text-xs text-gray-500 font-bold uppercase group-hover:text-yellow-500 transition-colors">Headphones</span>
            </div>
            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
               <PhoneIcon size={40} className="text-gray-500 group-hover:text-white transition-colors"/>
               <span className="text-xs text-gray-500 font-bold uppercase group-hover:text-yellow-500 transition-colors">Smart Phones</span>
            </div>
         </div>
       </div>
    </div>
  );
};

export default Tasks;