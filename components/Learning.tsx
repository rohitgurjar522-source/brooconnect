import React from 'react';
import { BookOpen, PlayCircle, Lock, GraduationCap } from './Icons';
import { ViewState } from '../types';

// Add LearningProps to fix type error in App.tsx
interface LearningProps {
  onNavigate: (view: ViewState) => void;
}

const COURSES = [
  { id: 1, title: 'Crypto Trading Basics', lessons: 12, duration: '2h 30m', category: 'Finance', unlocked: true, thumb: 'bg-blue-900' },
  { id: 2, title: 'Affiliate Marketing Mastery', lessons: 8, duration: '1h 45m', category: 'Marketing', unlocked: true, thumb: 'bg-green-900' },
  { id: 3, title: 'Stock Market Analysis', lessons: 15, duration: '3h 15m', category: 'Finance', unlocked: false, thumb: 'bg-purple-900' },
  { id: 4, title: 'Content Creation 101', lessons: 10, duration: '2h 00m', category: 'Creative', unlocked: false, thumb: 'bg-red-900' },
];

const Learning: React.FC<LearningProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-24 animate-fade-in font-chakra pt-6">
       
       <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-500 border border-yellow-600/50">
             <GraduationCap size={24} />
          </div>
          <div>
             <h2 className="text-2xl brand-font text-white">STUDENT HUB</h2>
             <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">LEARN & EARN</p>
          </div>
       </div>

       {/* Featured Course */}
       <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
          <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white font-bold uppercase mb-3 inline-block">Featured</span>
          <h3 className="text-xl font-bold text-white mb-2">Financial Freedom 2025</h3>
          <p className="text-gray-400 text-xs mb-4">Master the art of passive income and investment strategies.</p>
          <button className="bg-white text-black font-black px-6 py-2 rounded-lg text-xs uppercase tracking-wide hover:bg-gray-200">Start Now</button>
       </div>

       <div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">AVAILABLE COURSES</h3>
          <div className="space-y-4">
             {COURSES.map(course => (
                <div key={course.id} className={`bg-[#111] border border-gray-800 rounded-xl p-3 flex gap-4 transition-all ${course.unlocked ? 'hover:border-gray-600 cursor-pointer' : 'opacity-70 grayscale'}`}>
                   <div className={`w-24 h-24 rounded-lg ${course.thumb} flex items-center justify-center relative`}>
                      {course.unlocked ? <PlayCircle size={24} className="text-white/80"/> : <Lock size={20} className="text-gray-400"/>}
                   </div>
                   <div className="flex-1 py-1">
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-[10px] text-yellow-600 font-bold uppercase border border-yellow-900/50 px-1.5 rounded">{course.category}</span>
                         {!course.unlocked && <span className="text-[10px] text-gray-500 font-bold uppercase">LOCKED</span>}
                      </div>
                      <h4 className="text-white font-bold text-sm mb-1 leading-tight">{course.title}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500">
                         <span className="flex items-center gap-1"><BookOpen size={12}/> {course.lessons} Lessons</span>
                         <span>•</span>
                         <span>{course.duration}</span>
                      </div>
                      {course.unlocked && (
                         <div className="mt-2 w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-yellow-600 h-full w-1/3"></div>
                         </div>
                      )}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default Learning;