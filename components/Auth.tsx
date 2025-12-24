import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Trophy, ArrowLeft, Phone, CheckCircle, Smartphone, ShieldCheck, Clock } from './Icons';

declare global {
  interface Window {
    sendOtp: (identifier: string) => void;
    verifyOtp: (otp: string) => void;
  }
}

export default function Auth() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Handle successful verification event from global window script
  useEffect(() => {
    const handleVerified = async (e: any) => {
      console.log("React caught verified event:", e.detail);
      await finalizeAuth();
    };

    const handleError = (e: any) => {
      setLoading(false);
      alert("OTP Error: " + e.detail);
    };

    window.addEventListener("otp-verified", handleVerified);
    window.addEventListener("otp-error", handleError);
    return () => {
      window.removeEventListener("otp-verified", handleVerified);
      window.removeEventListener("otp-error", handleError);
    };
  }, [mobile]);

  // Resend timer
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const finalizeAuth = async () => {
    try {
      setLoading(true);
      // Ensure we have the mobile without the prefix for the DB check if needed, 
      // but usually the full identifier is better for uniqueness.
      const formattedMobile = mobile.length === 10 ? "91" + mobile : mobile;

      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('mobile', formattedMobile)
        .maybeSingle();

      if (error) throw error;

      if (!user) {
        // Registration Flow
        const referralCode = "BR" + Math.floor(1000 + Math.random() * 9000);
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            mobile: formattedMobile,
            full_name: 'User_' + formattedMobile.slice(-4),
            name: 'User_' + formattedMobile.slice(-4),
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

      localStorage.setItem('broo_user', JSON.stringify(user));
      window.location.reload();
    } catch (err: any) {
      alert("Finalizing login failed: " + err.message);
      setLoading(false);
    }
  };

  const handleSendOTP = () => {
    if (!mobile || mobile.length < 10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    const identifier = mobile.length === 10 ? "91" + mobile : mobile;

    if (window.sendOtp) {
      try {
        window.sendOtp(identifier);
        // We assume it triggers the 'success' in config or we wait for UI change.
        // Actually the SDK handles the UI transition if not using exposeMethods, 
        // but since we are using methods, we manually transition on success.
        // However, the SDK usually emits its own success. 
        // For reliability, we set a timeout or rely on the SDK's internal state.
        setOtpSent(true);
        setTimer(30);
        setLoading(false);
      } catch (err: any) {
        alert("SDK Call Failed: " + JSON.stringify(err));
        setLoading(false);
      }
    } else {
      alert("OTP System not ready. Please refresh.");
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length < 4) {
      alert("Please enter the OTP sent to your phone");
      return;
    }

    setLoading(true);
    if (window.verifyOtp) {
      window.verifyOtp(otp);
    } else {
      alert("Verification system missing. Refreshing...");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 font-chakra">
      <div className="w-full max-w-sm">
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="relative inline-block mb-3">
             <Trophy size={60} className="text-yellow-500 mx-auto" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#fbbf24]"></div>
          </div>
          <h1 className="text-4xl font-black text-yellow-500 brand-font tracking-tighter uppercase">BROO CONNECT</h1>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.5em] mt-1">Smarter Earning • Faster Living</p>
        </div>

        {/* Auth Panel */}
        <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/5 rounded-full blur-3xl"></div>
          
          <h2 className="text-white text-xl font-black mb-8 text-center uppercase tracking-tight flex items-center justify-center gap-2">
            {!otpSent ? <><ShieldCheck size={20} className="text-yellow-500"/> ACCESS PORTAL</> : <><Smartphone size={20} className="text-yellow-500"/> VERIFY IDENTITY</>}
          </h2>

          <div className="space-y-6">
            {!otpSent ? (
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
                    className="w-full bg-black/50 border border-gray-800 rounded-2xl py-4 pl-24 pr-4 text-white outline-none focus:border-yellow-600 transition-all font-bold tracking-widest text-lg" 
                    value={mobile} 
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  />
                </div>
                
                <p className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-wider leading-relaxed">
                  We'll send a one-time password to verify your account securely via MSG91.
                </p>

                <button 
                  onClick={handleSendOTP} 
                  disabled={loading} 
                  className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider active:scale-95 transition-all text-sm flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(234,179,8,0.1)]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>GET SECURE OTP <Smartphone size={18}/></>
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
                    placeholder="Enter 6-Digit OTP" 
                    maxLength={6}
                    autoFocus
                    className="w-full bg-black/50 border border-gray-800 rounded-2xl py-4 pl-14 pr-4 text-white outline-none focus:border-yellow-600 transition-all font-bold tracking-[0.5em] text-xl text-center" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                  />
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Sent to <span className="text-white font-bold">+91 {mobile}</span></p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => setOtpSent(false)} className="text-[10px] text-gray-500 font-bold uppercase hover:text-white flex items-center gap-1">
                      <ArrowLeft size={10} /> Change
                    </button>
                    <button 
                      onClick={handleSendOTP} 
                      disabled={timer > 0 || loading}
                      className={`text-[10px] font-bold uppercase flex items-center gap-1 ${timer > 0 ? 'text-gray-700 cursor-not-allowed' : 'text-yellow-600 hover:text-yellow-400'}`}
                    >
                      <Clock size={10} /> {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleVerifyOTP} 
                  disabled={loading} 
                  className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>VERIFY & ENTER</>
                  )}
                </button>
              </>
            )}

            <div className="pt-6 text-center border-t border-gray-800/50">
               <div className="flex items-center justify-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Production Gateway: BROOCT</span>
               </div>
               <p className="text-[8px] text-gray-600 leading-relaxed max-w-[240px] mx-auto uppercase">
                 Encryption standard AES-256. Your data is protected by enterprise-grade security.
               </p>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center text-[9px] text-gray-800 font-bold tracking-[0.3em] uppercase">
          Powered by Broo Ecosystem • v2.6.1 stable
        </div>
      </div>
    </div>
  );
}