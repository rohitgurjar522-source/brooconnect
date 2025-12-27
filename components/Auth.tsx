import React, { useState, useEffect } from "react";
import { Trophy, ArrowLeft, Phone, CheckCircle, Smartphone, ShieldCheck, Clock, User as UserIcon, MapPin, Key, Lock, Mail, Zap } from './Icons';

type AuthView = "login" | "admin_login" | "register" | "otp_verify" | "forgot_pin" | "reset_pin_entry";

export default function Auth() {
  const [view, setView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  // Form States
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // Registration States
  const [regData, setRegData] = useState({
    name: "",
    age: "",
    city: "",
    pincode: "",
    email: ""
  });

  // Forgot PIN State
  const [newPin, setNewPin] = useState("");

  useEffect(() => {
    let interval: any;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };

  const handleSendOtp = async (targetMobile: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "91" + targetMobile })
      });
      const data = await res.json();
      if (data.type === "success" || data.success) {
        setTimer(30);
        return true;
      }
      throw new Error(data.message || data.error || "Failed to send OTP");
    } catch (err: any) {
      handleError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async () => {
    if (mobile.length !== 10 || pin.length < 4) return handleError("Enter valid Mobile and PIN");
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
        window.location.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      handleError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onAdminLogin = async () => {
    if (!email || !password) return handleError("Enter Email and Password");
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('broo_user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      handleError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startRegistration = async () => {
    if (!regData.name || mobile.length !== 10 || !pin) return handleError("Name, Mobile and PIN are required");
    const sent = await handleSendOtp(mobile);
    if (sent) setView("otp_verify");
  };

  const finalizeRegistration = async () => {
    if (!otp) return handleError("Enter OTP");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...regData, mobile, pin, otp })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('broo_user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      handleError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startForgotPin = async () => {
    if (mobile.length !== 10) return handleError("Enter Mobile first");
    const sent = await handleSendOtp(mobile);
    if (sent) setView("reset_pin_entry");
  };

  const onResetPin = async () => {
    if (!otp || newPin.length < 4) return handleError("Enter OTP and New PIN");
    setLoading(true);
    try {
      const res = await fetch("/api/reset-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp, newPin })
      });
      const data = await res.json();
      if (data.success) {
        alert("PIN Reset Successful! Please login.");
        setView("login");
        setOtp("");
        setPin("");
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      handleError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 font-chakra overflow-hidden">
      <div className="w-full max-sm:w-full max-w-sm">
        {/* Branding */}
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
            {view === "login" && <><ShieldCheck size={20} className="text-yellow-500"/> USER LOGIN</>}
            {view === "admin_login" && <><CrownIcon size={20} className="text-yellow-500"/> ADMIN SECURE</>}
            {view === "register" && <><UserIcon size={20} className="text-yellow-500"/> CREATE ACCOUNT</>}
            {(view === "otp_verify" || view === "reset_pin_entry") && <><Smartphone size={20} className="text-yellow-500"/> VERIFY IDENTITY</>}
            {view === "forgot_pin" && <><Key size={20} className="text-yellow-500"/> RESET PIN</>}
          </h2>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase tracking-wider animate-shake">
                {error}
              </div>
            )}

            {view === "login" && (
              <div className="space-y-4 animate-fade-in">
                <InputGroup icon={<Phone size={18}/>} prefix="+91">
                  <input type="tel" maxLength={10} placeholder="Mobile Number" className="auth-input" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}/>
                </InputGroup>
                <InputGroup icon={<Lock size={18}/>}>
                  <input type="password" placeholder="Enter PIN" className="auth-input" value={pin} onChange={e => setPin(e.target.value)}/>
                </InputGroup>
                <button onClick={onLogin} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider active:scale-95 transition-all text-sm shadow-[0_10px_20px_rgba(234,179,8,0.2)]">
                  {loading ? <Spinner/> : "ACCESS DASHBOARD"}
                </button>
                <div className="flex justify-between px-1">
                   <button onClick={() => setView("forgot_pin")} className="text-[10px] text-gray-500 font-bold uppercase hover:text-yellow-600">Forgot PIN?</button>
                   <button onClick={() => setView("register")} className="text-[10px] text-yellow-600 font-bold uppercase hover:text-white">Sign Up</button>
                </div>
                <div className="pt-4 border-t border-gray-800/50 text-center">
                   <button onClick={() => setView("admin_login")} className="text-[9px] text-gray-600 font-bold uppercase tracking-widest hover:text-gray-400">Switch to Admin Login</button>
                </div>
              </div>
            )}

            {view === "admin_login" && (
              <div className="space-y-4 animate-fade-in">
                <InputGroup icon={<Mail size={18}/>}>
                  <input type="email" placeholder="Admin Email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)}/>
                </InputGroup>
                <InputGroup icon={<Lock size={18}/>}>
                  <input type="password" placeholder="Password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)}/>
                </InputGroup>
                <button onClick={onAdminLogin} disabled={loading} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-wider active:scale-95 transition-all text-sm shadow-xl">
                  {loading ? <Spinner/> : "ADMIN ACCESS"}
                </button>
                <button onClick={() => setView("login")} className="w-full text-center text-[10px] text-gray-500 font-bold uppercase">Back to User Login</button>
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
                <InputGroup icon={<Mail size={18}/>}>
                   <input type="email" placeholder="Email (Optional)" className="auth-input" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})}/>
                </InputGroup>
                <InputGroup icon={<Lock size={18}/>}>
                  <input type="password" placeholder="Create PIN (4-6 digits) *" className="auth-input" value={pin} onChange={e => setPin(e.target.value)}/>
                </InputGroup>
                <button onClick={startRegistration} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider active:scale-95 transition-all text-sm">
                  {loading ? <Spinner/> : "GET VERIFIED"}
                </button>
                <button onClick={() => setView("login")} className="w-full text-center text-[10px] text-gray-500 font-bold uppercase py-2">Cancel</button>
              </div>
            )}

            {view === "otp_verify" && (
              <div className="space-y-6 animate-fade-in text-center">
                <p className="text-xs text-gray-400">Verifying <span className="text-white font-bold">+91 {mobile}</span></p>
                <InputGroup icon={<CheckCircle size={18}/>}>
                  <input type="text" maxLength={6} placeholder="Enter 6-Digit OTP" className="auth-input text-center tracking-[0.5em] font-bold text-xl" value={otp} onChange={e => setOtp(e.target.value)}/>
                </InputGroup>
                <div className="flex justify-between items-center px-1">
                   <button onClick={() => setView("register")} className="text-[10px] text-gray-500 uppercase font-bold">Edit Info</button>
                   <button onClick={() => handleSendOtp(mobile)} disabled={timer > 0} className={`text-[10px] font-bold uppercase ${timer > 0 ? 'text-gray-700' : 'text-yellow-600'}`}>
                      {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                   </button>
                </div>
                <button onClick={finalizeRegistration} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider text-sm">
                  {loading ? <Spinner/> : "FINISH SETUP"}
                </button>
              </div>
            )}

            {view === "forgot_pin" && (
              <div className="space-y-6 animate-fade-in">
                <p className="text-[10px] text-gray-500 uppercase text-center tracking-wider leading-relaxed">Identity verification required to reset your PIN.</p>
                <InputGroup icon={<Phone size={18}/>} prefix="+91">
                  <input type="tel" maxLength={10} placeholder="Mobile Number" className="auth-input" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}/>
                </InputGroup>
                <button onClick={startForgotPin} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider text-sm">
                  {loading ? <Spinner/> : "SEND OTP"}
                </button>
                <button onClick={() => setView("login")} className="w-full text-center text-[10px] text-gray-500 font-bold uppercase">Cancel</button>
              </div>
            )}

            {view === "reset_pin_entry" && (
              <div className="space-y-4 animate-fade-in">
                <InputGroup icon={<CheckCircle size={18}/>}>
                  <input type="text" maxLength={6} placeholder="OTP Code" className="auth-input text-center tracking-[0.5em] font-bold" value={otp} onChange={e => setOtp(e.target.value)}/>
                </InputGroup>
                <InputGroup icon={<Lock size={18}/>}>
                  <input type="password" placeholder="Create New PIN" className="auth-input" value={newPin} onChange={e => setNewPin(e.target.value)}/>
                </InputGroup>
                <button onClick={onResetPin} disabled={loading} className="w-full btn-gaming py-4 rounded-2xl text-black font-black uppercase tracking-wider text-sm">
                  {loading ? <Spinner/> : "UPDATE PIN"}
                </button>
              </div>
            )}

            <div className="pt-6 text-center border-t border-gray-800/50">
               <div className="flex items-center justify-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Gateway: BROO-SECURE-V5</span>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[9px] text-gray-800 font-bold tracking-[0.3em] uppercase opacity-40">
          Broo Connect • Security Layer v4.1.0
        </div>
      </div>

      <style>{`
        .auth-input { width: 100%; background: transparent; color: white; outline: none; font-weight: bold; font-size: 14px; }
        .auth-input::placeholder { color: #4b5563; font-weight: normal; font-size: 12px; }
      `}</style>
    </div>
  );
}

// Added optional children to the props definition to resolve TypeScript errors where JSX children are not correctly mapped to the required children prop.
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

function CrownIcon({ size, className }: { size: number, className: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
}