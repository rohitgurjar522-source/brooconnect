import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Trophy, ArrowLeft, Phone, CheckCircle, Smartphone, ShieldCheck, Clock } from './Icons';

export default function Auth() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const finalizeAuth = async () => {
    try {
      const dbMobile = "91" + mobile;

      // Check for existing user in our Supabase DB
      let { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('mobile', dbMobile)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!user) {
        // Create new user profile if first-time login
        const referralCode = "BR" + Math.floor(1000 + Math.random() * 9000);
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            mobile: dbMobile,
            full_name: 'User_' + dbMobile.slice(-4),
            name: 'User_' + dbMobile.slice(-4),
            role: 'USER',
            wallet_balance: 0,
            referral_code: referralCode,
            is_paid_member: false,
            total_earnings: 0,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        user = newUser;
      }

      if (user) {
        localStorage.setItem('broo_user', JSON.stringify(user));
        // Using reload for SPA consistency as there is no separate /dashboard route
        window.location.reload();
      } else {
        throw new Error("User session creation failed");
      }
    } catch (err: any) {
      console.error("Auth Sync Error:", err);
      setError("Login successful but profile sync failed.");
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "91" + mobile })
      });

      const data = await res.json();
      
      if (res.ok && (data.type === "success" || data.success)) {
        setStep("otp");
        setTimer(30);
      } else {
        throw new Error(data.message || data.error || "Failed to deliver OTP");
      }
    } catch (err: any) {
      setError(err.message || "OTP delivery failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: "91" + mobile, 
          otp: otp 
        })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        // Successful verification - finalize auth and redirect
        await finalizeAuth();
      } else {
        throw new Error(data.message || "Incorrect verification code");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 font-chakra overflow-hidden">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10 animate-fade-in">
          <div className="relative inline-block mb-3">
             <Trophy size={60} className="text-yellow-500 mx-auto" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_15px_#fbbf24]"></div>
          </div>
          <h1 className="text-4xl font-black text-yellow-500 brand-font tracking-tighter uppercase italic">BROO CONNECT</h1>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.5em] mt-1">Premium Earning Portal</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/5 rounded-full blur-3xl"></div>
          
          <h2 className="text-white text-xl font-black mb-8 text-center uppercase tracking-tight flex items-center justify-center gap-2">
            {step === "mobile" ? <><ShieldCheck size={20} className="text-yellow-500"/> SECURE LOGIN</> : <><Smartphone size={20} className="text-yellow-500"/> VERIFY IDENTITY</>}
          </h2>

          <div className="space-y-6">
            {step === "mobile" ? (
              <>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                    <Phone size={20} />
                  </div>
                  <div className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r border-gray-800 pr-2">+91</div>
                  <input 
                    type="tel" 
                    placeholder="Mobile Number" 
                    maxLength={10}
                    autoFocus
                    className="w-full bg-black/50 border border-gray-800 rounded-2xl py-4 pl-24 pr-4 text-white outline-none focus:border-yellow-600 transition-all font-bold tracking-widest text-lg" 
                    value={mobile} 
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                  />
                </div>
                
                <p className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-wider leading-relaxed">
                  Fast, secure login via OTP.
                </p>

                <button 
                  onClick={handleSendOtp} 
                  disabled={loading} 
                  className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>SEND OTP NOW <Smartphone size={18}/></>
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                    <CheckCircle size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter Code" 
                    maxLength={6}
                    autoFocus
                    className="w-full bg-black/50 border border-gray-800 rounded-2xl py-4 pl-14 pr-4 text-white outline-none focus:border-yellow-600 transition-all font-bold tracking-[0.5em] text-xl text-center" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                  />
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Sent to <span className="text-white font-bold">+91 {mobile}</span></p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => { setStep("mobile"); setOtp(""); setError(""); }} className="text-[10px] text-gray-500 font-bold uppercase hover:text-white flex items-center gap-1">
                      <ArrowLeft size={10} /> Change
                    </button>
                    <button 
                      onClick={handleSendOtp} 
                      disabled={timer > 0 || loading}
                      className={`text-[10px] font-bold uppercase flex items-center gap-1 ${timer > 0 ? 'text-gray-700 cursor-not-allowed' : 'text-yellow-600 hover:text-yellow-400'}`}
                    >
                      <Clock size={10} /> {timer > 0 ? `Retry in ${timer}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleVerifyOtp} 
                  disabled={loading} 
                  className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>CONFIRM & ENTER</>
                  )}
                </button>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase tracking-wider animate-shake">
                {error}
              </div>
            )}

            <div className="pt-6 text-center border-t border-gray-800/50">
               <div className="flex items-center justify-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Gateway Secure</span>
               </div>
               <p className="text-[8px] text-gray-600 leading-relaxed max-w-[240px] mx-auto uppercase">
                 Verified by Enterprise-Grade SSL Encryption.
               </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[9px] text-gray-800 font-bold tracking-[0.3em] uppercase opacity-40">
          Broo Connect • Secure Auth v3.6.0
        </div>
      </div>
    </div>
  );
}