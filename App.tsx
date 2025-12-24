import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { UserRole, ViewState, User } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Quiz from './components/Quiz';
import Referral from './components/Referral';
import Tasks from './components/Tasks';
import WalletPage from './components/Wallet';
import AdminPanel from './components/AdminPanel';
import Feed from './components/Feed';
import Profile from './components/Profile';
import HomeFeed from './components/HomeFeed';
import Lakhpati from './components/Lakhpati';
import Learning from './components/Learning';
import { Crown } from './components/Icons';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const savedUserStr = localStorage.getItem('broo_user');
      
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (!parsed || !parsed.id) {
          localStorage.removeItem('broo_user');
          setUser(null);
          return;
        }

        // Try to fetch fresh data from Supabase to ensure sync with real-time balance
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', parsed.id)
          .maybeSingle();

        if (error) {
          console.warn("Using offline session:", error.message);
          setUser(mapProfileToUser(parsed));
        } else if (profile) {
          setUser(mapProfileToUser(profile));
          localStorage.setItem('broo_user', JSON.stringify(profile));
        } else {
          localStorage.removeItem('broo_user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error("Session verification failed:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const mapProfileToUser = (profile: any): User => ({
    id: profile.id,
    email: profile.email || '',
    name: profile.full_name || profile.name || 'User',
    role: (profile.role as UserRole) || UserRole.USER,
    walletBalance: profile.wallet_balance || 0,
    referralCode: profile.referral_code || '',
    referredBy: profile.referred_by,
    joinedAt: profile.created_at || new Date().toISOString(),
    isPaidMember: !!profile.is_paid_member,
    totalEarnings: profile.total_earnings || 0,
    referralsCount: 0, 
    profilePic: profile.avatar_url,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('broo_user');
    setUser(null);
    setCurrentView('home');
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-yellow-500 font-bold brand-font uppercase tracking-widest">
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      System Booting...
    </div>
  );

  if (!user) return <Auth />;

  // Paid membership wall
  if (!user.isPaidMember && user.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 font-chakra bg-[#050505]">
        <div className="w-full max-w-sm bg-[#111] border border-gray-800 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.1)]">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
             <Crown size={48} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase mb-2 brand-font">Unlock Premium</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">Gain full access to Lakhpati Quiz, Direct Withdrawals, and Referral Rewards with a one-time activation fee.</p>
          <button className="w-full btn-gaming text-black font-black py-4 rounded-2xl mb-4 transition-transform active:scale-95 shadow-xl" onClick={() => alert("Payment gateway integration pending.")}>PAY ₹999 NOW</button>
          <button onClick={handleLogout} className="text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors py-2">Logout Account</button>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={currentView} role={user.role} onNavigate={setCurrentView} onLogout={handleLogout}>
       {currentView === 'home' && <HomeFeed />}
       {currentView === 'lakhpati' && <Lakhpati user={user} onNavigate={setCurrentView} onJoinQuiz={() => setCurrentView('quiz')} />}
       {currentView === 'refer' && <Referral referralCode={user.referralCode} earnings={user.totalEarnings} onNavigate={setCurrentView} />}
       {currentView === 'quiz' && <Quiz userBalance={user.walletBalance} onJoinQuiz={() => {}} onNavigate={setCurrentView} />}
       {currentView === 'tasks' && <Tasks onCompleteTask={() => {}} onNavigate={setCurrentView} />}
       {currentView === 'learning' && <Learning onNavigate={setCurrentView} />}
       {currentView === 'wallet' && <WalletPage balance={user.walletBalance} user={user} refreshUser={fetchUserData} onNavigate={setCurrentView}/>}
       {currentView === 'feed' && <Feed />}
       {currentView === 'profile' && <Profile user={user} onLogout={handleLogout} />}
       {currentView === 'admin' && user.role === UserRole.ADMIN && <AdminPanel user={user} platformProfit={0} totalUsers={0} onNavigate={setCurrentView} />}
    </Layout>
  );
};

export default App;