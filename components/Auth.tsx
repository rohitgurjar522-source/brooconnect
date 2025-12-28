import React, { useState, useEffect } from "react";
import { Trophy, Phone, CheckCircle, Smartphone, ShieldCheck, Key, Lock, Mail, User as UserIcon, MapPin } from './Icons';
import { triggerOtp, verifyAndCreateAccount, verifyAndResetPin } from '../lib/authFlow';

type AuthView = "login" | "register" | "otp_verify_reg" | "forgot_pin" | "otp_verify_forgot";

export default function Auth() {
  const [view, setView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  // Auth Inputs
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");

  const [regData, setRegData] = useState({
    name: "",
    age: "",
    city: "",
    pincode: "",
    email: ""
  });

  useEffect(() => {
    let interval: any;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const displayErr = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  };

  const onLogin = async () => {
    if (mobile.length !== 10 || pin.length < 4) return displayErr("Enter 10-digit mobile and 4-6 digit PIN");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, pin })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('broo_user', JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      displayErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startSignup = async () => {
    if (!regData.name || mobile.length !== 10 || pin.length < 4) return displayErr("Name, Mobile and PIN are required");
    setLoading(true);
    try {
      const data = await triggerOtp(mobile, 'signup');
      if (data.success) {
        setTimer(30);
        setView("otp_verify_reg");
      } else throw new Error(data.message);
    } catch (err: any) {
      displayErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finalizeSignup = async () => {
    if (otp.length !== 6) return displayErr("Enter 6-digit code");
    setLoading(true);
    try {
      await verifyAndCreateAccount({ ...regData, mobile, pin }, otp);
    } catch (err: any) {
      displayErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startForgot = async () => {
    if (mobile.length !== 10) return displayErr("Enter 10-digit registered mobile");
    setLoading(true);
    try {
      const data = await triggerOtp(mobile, 'forgot');
      if (data.success) {
        setTimer(30);
        setView("otp_verify_forgot");
      } else throw new Error(data.message);
    } catch (err: any) {
      displayErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finalizeForgot = async () => {
    if (otp.length !== 6 || newPin.length < 4) return displayErr("Enter code and new PIN");
    setLoading(true);
    try {
      await verifyAndResetPin(mobile, otp, newPin);
    } catch (err: any) {
      displayErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 font-chakra">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10 animate-fade-in">
          <Trophy size={60} className="text-yellow-500 mx-auto mb-2" />
          <h1 className="text-4xl font-black text-yellow-500 brand-font tracking-tighter uppercase italic">BROO CONNECT</h1>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">SECURE EARNING NETWORK</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/5 rounded-full blur-3xl"></div>
          
          <h2 className="text-white text-xl font-black mb-8 text-center uppercase tracking-tight flex items-center justify-center gap-2">
            {view === "login" && <><ShieldCheck size={20} className="text-yellow-500"/> LOGIN</>}
            {view === "register" && <><UserIcon size={20} className="text-yellow-500"/> SIGNUP</>}
            {view.includes("otp") && <><Smartphone size={20} className="text-yellow-500"/> VERIFY</>}
            {view === "forgot_pin" && <><Key size={20} className="text-yellow-500"/> RECOVERY</>}
          </h2>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase animate-shake">
                {error}
              </div>
            )}

            {view === "login" && (
              <div className="space-y-4 animate-fade-in">
                <InputGroup icon={<Phone size={18}/>} prefix="+91">
                  <input type="tel" maxLength={10} placeholder="Mobile Number" className="auth-input" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}/>
                </InputGroup>
                <InputGroup icon={<Lock size={18}/>}>
                  <input type="password" placeholder="PIN Code" className="auth-input" value={pin} onChange={e => setPin(e.target.value)}/>
                </InputGroup>
                <button onClick={onLogin} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider text-sm shadow-xl shadow-yellow-500/10">
                  {loading ? <Spinner/> : "LOG IN"}
                </button>
                <div className="flex justify-between px-1">
                   <button onClick={() => setView("forgot_pin")} className="text-[10px] text-gray-500 font-bold uppercase hover:text-yellow-600">Forgot PIN?</button>
                   <button onClick={() => setView("register")} className="text-[10px] text-yellow-600 font-bold uppercase hover:text-white">Join Now</button>
                </div>
              </div>
            )}

            {view === "register" && (
              <div className="space-y-3 animate-fade-in max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
                <InputGroup icon={<UserIcon size={18}/>}>
                  <input placeholder="Full Name *" className="auth-input" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})}/>
                </InputGroup>
                <InputGroup icon={<Phone size={18}/>} prefix="+91">
                  <input type="tel" maxLength={10} placeholder="Mobile Number *" className="auth-input" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}/>
                </InputGroup>
                <div className="grid grid-cols-2 gap-3">
                   <InputGroup><input type="number" placeholder="Age" className="auth-input" value={regData.age} onChange={e => setRegData({...regData, age: e.target.value})}/></InputGroup>
                   <InputGroup><input placeholder="City" className="auth-input" value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})}/></InputGroup>
                </div>
                <InputGroup icon={<MapPin size={18}/>}>
                   <input placeholder="Pincode" className="auth-input" value={regData.pincode} onChange={e => setRegData({...regData, pincode: e.target.value})}/>
                </InputGroup>
                <InputGroup icon={<Lock size={18}/>}>
                  <input type="password" placeholder="Create 4-6 Digit PIN *" className="auth-input" value={pin} onChange={e => setPin(e.target.value)}/>
                </InputGroup>
                <button onClick={startSignup} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase text-sm">
                  {loading ? <Spinner/> : "CREATE ACCOUNT"}
                </button>
                <button onClick={() => setView("login")} className="w-full text-center text-[10px] text-gray-500 font-bold uppercase py-2">Back to Login</button>
              </div>
            )}

            {view === "otp_verify_reg" && (
              <div className="space-y-6 animate-fade-in text-center">
                <p className="text-xs text-gray-400">Verifying <span className="text-white font-bold">+91 {mobile}</span></p>
                <InputGroup icon={<CheckCircle size={18}/>}>
                  <input type="text" maxLength={6} placeholder="6-Digit OTP" className="auth-input text-center tracking-[0.5em] font-bold text-xl" value={otp} onChange={e => setOtp(e.target.value)}/>
                </InputGroup>
                <div className="flex justify-between items-center px-1">
                   <button onClick={() => setView("register")} className="text-[10px] text-gray-500 uppercase font-bold">Edit Info</button>
                   <button onClick={() => triggerOtp(mobile, 'signup')} disabled={timer > 0} className={`text-[10px] font-bold uppercase ${timer > 0 ? 'text-gray-700' : 'text-yellow-600'}`}>
                      {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                   </button>
                </div>
                <button onClick={finalizeSignup} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase text-sm">
                  {loading ? <Spinner/> : "VERIFY & FINISH"}
                </button>
              </div>
            )}

            {view === "forgot_pin" && (
              <div className="space-y-6 animate-fade-in">
                <p className="text-[10px] text-gray-500 uppercase text-center tracking-wider leading-relaxed">Enter registered mobile to recover account.</p>
                <InputGroup icon={<Phone size={18}/>} prefix="+91">
                  <input type="tel" maxLength={10} placeholder="Mobile" className="auth-input" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}/>
                </InputGroup>
                <button onClick={startForgot} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase text-sm">
                  {loading ? <Spinner/> : "SEND OTP"}
                </button>
                <button onClick={() => setView("login")} className="w-full text-center text-[10px] text-gray-500 font-bold uppercase">Cancel</button>
              </div>
            )}

            {view === "otp_verify_forgot" && (
              <div className="space-y-4 animate-fade-in">
                <InputGroup icon={<CheckCircle size={18}/>}>
                  <input type="text" maxLength={6} placeholder="Enter OTP" className="auth-input text-center tracking-[0.5em] font-bold" value={otp} onChange={e => setOtp(e.target.value)}/>
                </InputGroup>
                <InputGroup icon={<Lock size={18}/>}>
                  <input type="password" placeholder="New PIN Code" className="auth-input" value={newPin} onChange={e => setNewPin(e.target.value)}/>
                </InputGroup>
                <button onClick={finalizeForgot} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase text-sm">
                  {loading ? <Spinner/> : "RESET & LOGIN"}
                </button>
              </div>
            )}

            <div className="pt-6 text-center border-t border-gray-800/50 flex flex-col items-center">
               <div className="flex items-center justify-center gap-2 mb-1">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Gateway Verified</span>
               </div>
               <p className="text-[8px] text-gray-700 uppercase">BROO-SECURE™ v5.3</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-input { width: 100%; background: transparent; color: white; outline: none; font-weight: bold; font-size: 14px; }
        .auth-input::placeholder { color: #4b5563; font-weight: normal; font-size: 12px; }
      `}</style>
    </div>
  );
}

function InputGroup({ children, icon, prefix }: { children?: React.ReactNode, icon?: React.ReactNode, prefix?: string }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
        {icon}
      </div>
      <div className={`flex items-center bg-black/50 border border-gray-800 rounded-2xl py-4 pr-4 transition-all focus-within:border-yellow-600 ${icon ? 'pl-11' : 'pl-4'}`}>
        {prefix && <span className="text-gray-400 font-bold border-r border-gray-800 pr-2 mr-2 text-sm">{prefix}</span>}
        {children}
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>;
}