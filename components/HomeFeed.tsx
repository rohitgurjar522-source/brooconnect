
import React, { useState } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark } from './Icons';

const STORIES = [
  { id: 1, user: 'Your Story', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', isUser: true },
  { id: 2, user: 'rohit_g', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
  { id: 3, user: 'earning_pro', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 4, user: 'crypto_buzz', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: 5, user: 'quiz_master', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop' },
];

const POSTS = [
  {
    id: 1,
    user: 'broo_official',
    userImg: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
    postImg: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600&h=600&fit=crop',
    likes: 1245,
    caption: 'Turn your free time into earnings! 🚀 Start the Lakhpati Quiz today.',
    comments: 45
  },
  {
    id: 2,
    user: 'rohit_gurjar',
    userImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    postImg: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&h=600&fit=crop',
    likes: 892,
    caption: 'Just withdrew ₹50,000 from Broo Connect! 💰 #PassiveIncome #BrooConnect',
    comments: 12
  }
];

const HomeFeed: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(prev => prev.filter(p => p !== id));
    } else {
      setLikedPosts(prev => [...prev, id]);
    }
  };

  const toggleBookmark = (id: number) => {
    if (bookmarkedPosts.includes(id)) {
      setBookmarkedPosts(prev => prev.filter(p => p !== id));
    } else {
      setBookmarkedPosts(prev => [...prev, id]);
    }
  };

  const handleAction = (action: string) => {
    alert(`${action} feature coming soon!`);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-24 font-chakra">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h1 className="text-2xl brand-font text-white italic">BrooConnect</h1>
        <div className="relative cursor-pointer" onClick={() => handleAction('Messages')}>
          <Send size={24} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">2</div>
        </div>
      </div>

      {/* Stories */}
      <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar border-b border-gray-800">
        {STORIES.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1 min-w-[70px] cursor-pointer" onClick={() => handleAction(`Story by ${story.user}`)}>
            <div className={`w-[70px] h-[70px] rounded-full p-[2px] ${story.isUser ? 'border-2 border-gray-700' : 'bg-gradient-to-tr from-yellow-500 to-red-600'}`}>
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                <img src={story.img} alt={story.user} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs text-gray-400 truncate w-full text-center">{story.user}</span>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="pb-4">
        {POSTS.map((post) => (
          <div key={post.id} className="border-b border-gray-800 pb-4">
            {/* Post Header */}
            <div className="flex justify-between items-center p-3">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleAction(`Profile of ${post.user}`)}>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
                  <img src={post.userImg} alt={post.user} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-sm">{post.user}</span>
              </div>
              <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" onClick={() => handleAction('Post Options')} />
            </div>

            {/* Post Image */}
            <div className="w-full aspect-square bg-[#111]" onDoubleClick={() => toggleLike(post.id)}>
              <img src={post.postImg} alt="Post" className="w-full h-full object-cover" />
            </div>

            {/* Actions */}
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-4">
                  <Heart 
                    size={24} 
                    className={`cursor-pointer transition-colors active:scale-90 ${likedPosts.includes(post.id) ? 'text-red-500 fill-current' : 'hover:text-red-500'}`} 
                    onClick={() => toggleLike(post.id)}
                  />
                  <MessageCircle size={24} className="cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleAction('Comments')} />
                  <Send size={24} className="cursor-pointer hover:text-green-500 transition-colors" onClick={() => handleAction('Share Post')} />
                </div>
                <Bookmark 
                  size={24} 
                  className={`cursor-pointer transition-colors active:scale-90 ${bookmarkedPosts.includes(post.id) ? 'text-yellow-500 fill-current' : 'hover:text-yellow-500'}`} 
                  onClick={() => toggleBookmark(post.id)}
                />
              </div>
              
              <p className="font-bold text-sm mb-1">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)} likes</p>
              <p className="text-sm">
                <span className="font-bold mr-2">{post.user}</span>
                {post.caption}
              </p>
              <p className="text-gray-500 text-xs mt-1 cursor-pointer" onClick={() => handleAction('Comments')}>View all {post.comments} comments</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeFeed;
