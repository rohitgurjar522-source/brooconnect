
import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, PlayCircle, Trophy } from './Icons';

interface VideoPost {
  id: number;
  username: string;
  desc: string;
  likes: number;
  comments: number;
  color: string; // Placeholder for video background
}

const FEED_DATA: VideoPost[] = [
  { id: 1, username: 'BrooOfficial', desc: 'Welcome to the future of earning! 🚀 #BrooConnect #EarnMoney', likes: 1240, comments: 45, color: 'bg-gradient-to-br from-purple-900 to-black' },
  { id: 2, username: 'CryptoKing', desc: 'Lakhpati Quiz Strategy Revealed 🤫💰', likes: 890, comments: 120, color: 'bg-gradient-to-br from-blue-900 to-black' },
  { id: 3, username: 'EarningTips', desc: 'How to complete tasks in 5 minutes! ⚡', likes: 3500, comments: 230, color: 'bg-gradient-to-br from-green-900 to-black' },
  { id: 4, username: 'BrooUpdates', desc: 'New Level Unlocked! Join now. 🏆', likes: 5600, comments: 800, color: 'bg-gradient-to-br from-red-900 to-black' },
];

const Feed: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [likedVideos, setLikedVideos] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect which video is in view
  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActiveVideo(index);
        }
      });
    }, options);

    const elements = document.querySelectorAll('.video-card');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleLike = (id: number) => {
    if (likedVideos.includes(id)) {
      setLikedVideos(prev => prev.filter(v => v !== id));
    } else {
      setLikedVideos(prev => [...prev, id]);
    }
  };

  const handleAction = (action: string) => {
    alert(`${action} - Action triggered!`);
  };

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-5rem)] w-full overflow-y-scroll snap-y snap-mandatory bg-black no-scrollbar"
      style={{ scrollBehavior: 'smooth' }}
    >
      {FEED_DATA.map((post, index) => (
        <div 
          key={post.id} 
          data-index={index}
          className={`video-card w-full h-full snap-start relative flex items-center justify-center ${post.color}`}
          onDoubleClick={() => toggleLike(post.id)}
        >
          {/* Simulated Video Content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Play Button Animation to simulate playing */}
            {activeVideo === index && (
               <div className="animate-pulse">
                  <PlayCircle size={64} className="text-white/20" />
               </div>
            )}
            <h2 className="text-4xl font-black text-white/10 uppercase -rotate-12 absolute brand-font">BROO FEED</h2>
          </div>

          {/* Overlay UI */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/50 to-transparent pb-24">
             <div className="flex items-end justify-between">
                <div className="flex-1 pr-12">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold border border-white">
                         {post.username[0]}
                      </div>
                      <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{post.username}</span>
                      <button onClick={() => handleAction(`Follow ${post.username}`)} className="bg-transparent border border-white/50 text-white text-[10px] px-2 py-0.5 rounded ml-2 backdrop-blur-sm">Follow</button>
                   </div>
                   <p className="text-white text-sm drop-shadow-md">{post.desc}</p>
                   <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-gray-800/80 px-2 py-1 rounded text-white flex items-center gap-1"><Trophy size={10} className="text-yellow-500"/> Promoted</span>
                   </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex flex-col items-center gap-6">
                   <div className="flex flex-col items-center gap-1">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-90"
                      >
                         <Heart 
                           size={32} 
                           className={`transition-colors drop-shadow-lg ${likedVideos.includes(post.id) ? 'text-red-500 fill-current' : 'text-white hover:text-red-500'}`} 
                         />
                      </button>
                      <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{post.likes + (likedVideos.includes(post.id) ? 1 : 0)}</span>
                   </div>

                   <div className="flex flex-col items-center gap-1">
                      <button onClick={() => handleAction('Comments')} className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-90">
                         <MessageCircle size={30} className="text-white hover:text-blue-500 transition-colors drop-shadow-lg" />
                      </button>
                      <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{post.comments}</span>
                   </div>

                   <div className="flex flex-col items-center gap-1">
                      <button onClick={() => handleAction('Share')} className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-90">
                         <Share2 size={30} className="text-white hover:text-green-500 transition-colors drop-shadow-lg" />
                      </button>
                      <span className="text-white text-xs font-bold shadow-black drop-shadow-md">Share</span>
                   </div>
                   
                   <div className="w-8 h-8 rounded-full border-2 border-yellow-500 overflow-hidden animate-spin-slow mt-2">
                      <div className="w-full h-full bg-yellow-600"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
