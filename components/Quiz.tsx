import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { QuizLevel, ViewState } from '../types';
import { QUIZ_LEVELS } from './constants';
import { Trophy, ArrowLeft, Lock, Clock } from './Icons';

interface QuizProps {
  userBalance: number;
  onJoinQuiz: (fee: number) => void;
  onNavigate: (view: ViewState) => void;
}

// Sound URLs
const SOUNDS = {
  CORRECT: 'https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3',
  INCORRECT: 'https://assets.mixkit.co/active_storage/sfx/1111/1111-preview.mp3',
  WIN: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  LOSS: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
};

// Simulated Questions Database
const QUESTION_BANK = [
  { q: "What is the capital of India?", options: ["Delhi", "Mumbai", "Kolkata", "Chennai"], ans: "Delhi" },
  { q: "Who is known as the Iron Man of India?", options: ["Gandhi", "Patel", "Nehru", "Bose"], ans: "Patel" },
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], ans: "Mars" },
  { q: "What is the largest ocean in the world?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: "Pacific" },
  { q: "Current Prime Minister of India?", options: ["Manmohan Singh", "Modi", "Rahul Gandhi", "Amit Shah"], ans: "Modi" },
  { q: "H2O is chemical formula for?", options: ["Salt", "Air", "Water", "Fire"], ans: "Water" },
  { q: "Which year did India get independence?", options: ["1942", "1945", "1947", "1950"], ans: "1947" },
  { q: "Currency of USA?", options: ["Euro", "Yen", "Dollar", "Pound"], ans: "Dollar" },
  { q: "Fastest land animal?", options: ["Lion", "Tiger", "Cheetah", "Horse"], ans: "Cheetah" },
  { q: "Smallest state in India?", options: ["Goa", "Sikkim", "Tripura", "Kerala"], ans: "Goa" },
  { q: "Who wrote the National Anthem?", options: ["Bankim Chandra", "Tagore", "Premchand", "Dinkar"], ans: "Tagore" },
  { q: "Capital of Maharashtra?", options: ["Pune", "Nagpur", "Mumbai", "Nashik"], ans: "Mumbai" },
  { q: "National Bird of India?", options: ["Peacock", "Parrot", "Eagle", "Sparrow"], ans: "Peacock" },
  { q: "Sun rises in the?", options: ["West", "North", "East", "South"], ans: "East" },
  { q: "Hardest substance?", options: ["Gold", "Iron", "Diamond", "Silver"], ans: "Diamond" },
  { q: "Brain of computer?", options: ["RAM", "CPU", "Mouse", "Monitor"], ans: "CPU" },
  { q: "Largest desert?", options: ["Sahara", "Gobi", "Thar", "Kalahari"], ans: "Sahara" },
  { q: "Colors in rainbow?", options: ["5", "6", "7", "8"], ans: "7" },
  { q: "Festival of Lights?", options: ["Holi", "Eid", "Diwali", "Christmas"], ans: "Diwali" },
  { q: "Cricket World Cup 2011 winner?", options: ["Australia", "India", "Sri Lanka", "Pakistan"], ans: "India" },
  { q: "National Animal?", options: ["Lion", "Tiger", "Elephant", "Deer"], ans: "Tiger" },
];

const Quiz: React.FC<QuizProps> = ({ userBalance, onJoinQuiz, onNavigate }) => {
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [questions, setQuestions] = useState<any[]>([]);
  const [gameOver, setGameOver] = useState<'won' | 'lost' | null>(null);

  const playEffect = (url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const startQuiz = () => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 20));
    setIsPlaying(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimer(15 + Math.floor(Math.random() * 5));
    setGameOver(null);
  };

  const handleJoin = (level: QuizLevel) => {
    if (userBalance >= level.entryFee) {
      onJoinQuiz(level.entryFee);
      setSelectedLevel(level);
      startQuiz();
    } else {
      alert("Insufficient Balance! Please add funds to your wallet.");
    }
  };

  const handleAnswer = (option: string) => {
    const isCorrect = option === questions[currentQuestionIndex].ans;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      playEffect(SOUNDS.CORRECT);
    } else {
      playEffect(SOUNDS.INCORRECT);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimer(15 + Math.floor(Math.random() * 5));
    } else {
      finishQuiz(score + (isCorrect ? 1 : 0));
    }
  };

  const finishQuiz = (finalScore: number) => {
    const percentage = (finalScore / questions.length) * 100;
    const passed = percentage >= 60;
    
    setGameOver(passed ? 'won' : 'lost');
    setIsPlaying(false);
    
    if (passed) {
      playEffect(SOUNDS.WIN);
    } else {
      playEffect(SOUNDS.LOSS);
    }
  };

  useEffect(() => {
    if (isPlaying && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (isPlaying && timer === 0) {
       if (currentQuestionIndex + 1 < questions.length) {
          playEffect(SOUNDS.INCORRECT);
          setCurrentQuestionIndex(prev => prev + 1);
          setTimer(15 + Math.floor(Math.random() * 5));
       } else {
          finishQuiz(score);
       }
    }
  }, [isPlaying, timer, currentQuestionIndex]);


  if (gameOver) {
      return (
          <div className="h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-black">
             <div className="mb-6">
                 {gameOver === 'won' ? <Trophy size={64} className="text-yellow-500 mx-auto animate-bounce"/> : <Lock size={64} className="text-red-500 mx-auto"/>}
             </div>
             <h2 className="text-3xl font-black text-white brand-font mb-2">{gameOver === 'won' ? 'LEVEL PASSED!' : 'LEVEL FAILED'}</h2>
             <p className="text-gray-400 mb-6">You scored {score} / {questions.length} (Need 60% to pass)</p>
             
             <button onClick={() => { setGameOver(null); setSelectedLevel(null); }} className="btn-gaming px-8 py-3 rounded-xl font-black text-black uppercase">
                {gameOver === 'won' ? 'CLAIM REWARD & EXIT' : 'TRY AGAIN'}
             </button>
          </div>
      )
  }

  if (isPlaying && questions.length > 0) {
      const q = questions[currentQuestionIndex];
      return (
          <div className="min-h-screen p-6 font-chakra relative animate-fade-in bg-black">
             <div className="flex justify-between items-center mb-8">
                <button onClick={() => { if(confirm("Quit Quiz? Progress will be lost.")) setIsPlaying(false); setSelectedLevel(null); }} className="text-gray-500 hover:text-white flex items-center gap-2">
                   <ArrowLeft size={20}/> <span className="text-xs uppercase font-bold">QUIT</span>
                </button>
                <span className={`flex items-center gap-2 font-mono font-bold text-xl ${timer < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    <Clock size={20}/> {timer}s
                </span>
             </div>

             <h2 className="text-xl text-white font-bold mb-8 min-h-[80px]">{q.q}</h2>

             <div className="space-y-3">
                 {q.options.map((opt: string) => (
                     <button 
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl text-left text-gray-300 hover:bg-yellow-600 hover:text-black hover:border-yellow-500 transition-all font-bold"
                     >
                        {opt}
                     </button>
                 ))}
             </div>
          </div>
      )
  }

  return (
    <div className="pb-24 animate-fade-in font-chakra">
      <div className="flex justify-between items-center mb-6 mt-4">
        <button onClick={() => onNavigate('lakhpati')} className="text-gray-500 hover:text-white flex items-center gap-2">
           <ArrowLeft size={20}/> <span className="text-xs uppercase font-bold">BACK</span>
        </button>
        <div className="bg-red-900/20 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold border border-red-900 flex items-center gap-2 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]">
           <span className="w-2 h-2 bg-red-500 rounded-full"></span> LIVE
        </div>
      </div>

      <div className="space-y-4">
        {QUIZ_LEVELS.map((level) => (
          <div 
            key={level.level} 
            className={`bg-[#111] border border-gray-800 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-gray-600 ${level.status === 'locked' ? 'opacity-60 grayscale' : 'shadow-lg'}`}
          >
            <div className="flex justify-between items-end relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-yellow-600 font-black text-[10px] uppercase tracking-wider bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-800">LEVEL {level.level}</p>
                </div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Total Pool</p>
                <h3 className="text-4xl font-black text-white brand-font tracking-tight mb-4 drop-shadow-md">{level.totalPool}</h3>
                
                <div className="flex items-center gap-2">
                   <div>
                     <p className="text-gray-500 text-[10px] uppercase font-bold">TOP PRIZE</p>
                     <p className="text-yellow-500 font-bold brand-font">{level.topPrize}</p>
                   </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                 <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] pointer-events-none transform rotate-12">
                    <Trophy size={140} />
                 </div>

                 {level.status === 'locked' ? (
                   <button disabled className="w-24 h-16 rounded-xl bg-gray-800 flex flex-col items-center justify-center text-gray-500 border border-gray-700 cursor-not-allowed">
                     <Lock size={20} className="mb-1" />
                   </button>
                 ) : (
                   <button 
                     onClick={() => handleJoin(level)}
                     className="w-28 h-20 rounded-xl btn-gaming flex flex-col items-center justify-center text-black shadow-[0_4px_15px_rgba(234,179,8,0.3)] hover:brightness-110 transition-all active:scale-95"
                   >
                     <span className="text-xl font-black italic tracking-wider brand-font">PLAY</span>
                     <span className="text-xs font-bold opacity-80">₹{level.entryFee}</span>
                   </button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;