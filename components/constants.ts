import { QuizLevel, Task } from '../types';

export const ADMIN_EMAIL = 'rohitgurjar522@gmail.com';

export const QUIZ_LEVELS: QuizLevel[] = [
  { level: 1, entryFee: 99, maxPlayers: 150000, totalPool: '₹1.48 Cr', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 2, entryFee: 199, maxPlayers: 100000, totalPool: '₹1.99 Cr', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 3, entryFee: 499, maxPlayers: 50000, totalPool: '₹2.49 Cr', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 4, entryFee: 999, maxPlayers: 25000, totalPool: '₹2.49 Cr', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 5, entryFee: 1500, maxPlayers: 15000, totalPool: '₹2.25 Cr', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 6, entryFee: 3000, maxPlayers: 5000, totalPool: '₹1.50 Cr', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 7, entryFee: 5000, maxPlayers: 2000, totalPool: '₹1.00 Cr', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 8, entryFee: 10000, maxPlayers: 1000, totalPool: '₹1.00 Cr', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 9, entryFee: 15000, maxPlayers: 500, totalPool: '₹75 Lakh', winners: 5, topPrize: '₹10,00,000', status: 'unlocked' },
  { level: 10, entryFee: 99, maxPlayers: 10, totalPool: '₹990', winners: 1, topPrize: '₹500', status: 'unlocked' },
  { level: 11, entryFee: 149, maxPlayers: 20, totalPool: '₹2,980', winners: 1, topPrize: '₹1,500', status: 'unlocked' },
  { level: 12, entryFee: 199, maxPlayers: 50, totalPool: '₹9,950', winners: 1, topPrize: '₹5,000', status: 'unlocked' },
  { level: 13, entryFee: 299, maxPlayers: 30, totalPool: '₹8,970', winners: 1, topPrize: '₹4,000', status: 'unlocked' },
  { level: 14, entryFee: 499, maxPlayers: 40, totalPool: '₹19,960', winners: 1, topPrize: '₹10,000', status: 'unlocked' },
  { level: 15, entryFee: 25000, maxPlayers: 300, totalPool: '₹75 Lakh', winners: 5, topPrize: '₹20,00,000', status: 'unlocked' },
];

export const DAILY_TASKS: Task[] = [
  { id: '1', title: 'Watch Partner Video', reward: 50, type: 'video', completed: false },
  { id: '2', title: 'Share Broo Connect on WhatsApp', reward: 20, type: 'share', completed: false },
  { id: '3', title: 'Install Recommended App', reward: 100, type: 'install', completed: false },
  { id: '4', title: 'Complete Daily Survey', reward: 75, type: 'survey', completed: false },
];