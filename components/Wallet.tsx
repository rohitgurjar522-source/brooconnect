import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Wallet as WalletIcon, CreditCard, Smartphone, CheckCircle, ArrowUpRight, ArrowLeft } from './Icons';
import { User, ViewState } from '../types';

interface WalletProps {
  balance: number;
  user: User;
  refreshUser: () => void;
  onNavigate: (view: ViewState) => void;
}

const WalletPage: React.FC<WalletProps> = ({ balance, user, refreshUser, onNavigate }) => {
  const [selectedGateway, setSelectedGateway] = useState<'upi' | 'card'>('upi');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount < 100) {
          alert("Minimum withdrawal is ₹100");
          return;
      }
      if (amount > balance) {
          alert("Insufficient funds");
          return;
      }

      setLoading(true);
      try {
          const startOfDay = new Date();
          startOfDay.setHours(0,0,0,0);
          
          const { data: withdrawals } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', user.id)
            .eq('type', 'debit')
            .ilike('description', '%withdraw%')
            .gte('created_at', startOfDay.toISOString());
            
          const todayTotal = withdrawals ? withdrawals.reduce((acc, curr) => acc + curr.amount, 0) : 0;
          
          let fee = 0;
          if (todayTotal + amount > 50000) {
              fee = amount * 0.05;
          }

          const { error } = await supabase.from('users').update({ wallet_balance: balance - amount }).eq('id', user.id);
          if (error) throw error;
          
          await supabase.from('transactions').insert({
              user_id: user.id,
              amount: amount,
              type: 'debit',
              description: fee > 0 ? `Withdrawal (Fee: ₹${fee})` : `Withdrawal`,
              created_at: new Date().toISOString()
          });
          
          alert(fee > 0 ? `Withdrawal request sent! ₹${fee} fee applied.` : "Withdrawal successful!");
          setWithdrawAmount('');
          refreshUser();
      } catch (err) {
          console.error(err);
          alert("Withdrawal failed");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in font-chakra">
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => onNavigate('lakhpati')} className="text-gray-500 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl brand-font text-white uppercase tracking-wider italic">Wallet</h2>
      </div>
      
      {/* Balance Card */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-600/10 rounded-full blur-3xl"></div>
        <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">AVAILABLE BALANCE</p>
        <h2 className="text-5xl brand-font text-white mb-8 tracking-tight">₹{balance.toLocaleString()}</h2>
        
        <div className="grid grid-cols-2 gap-4">
           <button className="bg-yellow-600 hover:bg-yellow-500 text-black font-black py-3 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide text-sm">
             <WalletIcon size={18} /> DEPOSIT
           </button>
           <button className="bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-bold py-3 rounded-lg transition-all active:scale-95 uppercase tracking-wide text-sm">
             HISTORY
           </button>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
         <h3 className="text-white font-bold mb-4 uppercase flex items-center gap-2"><ArrowUpRight size={18}/> Withdraw Funds</h3>
         <input 
            type="number" 
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter Amount (Min ₹100)"
            className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-mono text-lg mb-4 focus:border-yellow-500 outline-none"
         />
         <button 
           onClick={handleWithdraw}
           disabled={loading}
           className="w-full btn-gaming py-3 rounded-xl text-black font-black uppercase tracking-wider"
         >
            {loading ? 'PROCESSING...' : 'WITHDRAW NOW'}
         </button>
         <p className="text-[10px] text-gray-500 mt-2 text-center">* 5% Fee applies if daily withdrawal exceeds ₹50,000.</p>
      </div>

      {/* Payment Gateways */}
      <div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Payment Gateways</h3>
        <div className="space-y-3">
           <button 
             onClick={() => setSelectedGateway('upi')}
             className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all active:scale-[0.98] ${
               selectedGateway === 'upi' 
               ? 'bg-black border-yellow-600 text-white shadow-lg shadow-yellow-900/10' 
               : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600'
             }`}
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-black text-xs shadow-sm">UPI</div>
                 <span className="font-bold">PhonePe / GPay / Paytm</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedGateway === 'upi' ? 'border-yellow-500' : 'border-gray-600'}`}>
                 {selectedGateway === 'upi' && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
              </div>
           </button>

           <button 
             onClick={() => setSelectedGateway('card')}
             className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all active:scale-[0.98] ${
               selectedGateway === 'card' 
               ? 'bg-black border-yellow-600 text-white shadow-lg shadow-yellow-900/10' 
               : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600'
             }`}
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white shadow-sm border border-gray-700"><CreditCard size={20}/></div>
                 <span className="font-bold">Credit / Debit Cards</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedGateway === 'card' ? 'border-yellow-500' : 'border-gray-600'}`}>
                 {selectedGateway === 'card' && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
              </div>
           </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;