import { useState, FormEvent } from 'react';
import { Shield, Brain, Lock, Mail, UserCheck, ArrowRight, UserPlus, HelpCircle, Activity } from 'lucide-react';

interface AuthenticationProps {
  onLoginSuccess: (token: string, user: { id: string; email: string; role: 'patient' | 'doctor' | 'admin'; name: string; profileId?: string }) => void;
  onBackToHome?: () => void;
}

export default function Authentication({ onLoginSuccess, onBackToHome }: AuthenticationProps) {
  const [activeMode, setActiveMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  
  // Registration extras
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Apply default demo billing credentials
  const handleApplyPreset = (emailPreset: string, passPreset: string) => {
    setEmail(emailPreset);
    setPassword(passPreset);
    setError(null);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Store token
      localStorage.setItem('medicore_token', data.token);
      localStorage.setItem('medicore_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || "Invalid network request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role, dob, phone, specialty })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed compiling credentials.");
      }

      localStorage.setItem('medicore_token', data.token);
      localStorage.setItem('medicore_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || "Registration failure.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Reset transmission failed.");
      }

      setSuccessMsg(data.message || "Password recovery instructions successfully issued.");
      setTimeout(() => setActiveMode('login'), 3500);
    } catch (err: any) {
      setError(err.message || "Verification request unsuccessful.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative z-10 space-y-6">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-indigo-550 rounded-2xl shadow-xl text-white">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-1.5 leading-none">
              <span>MediCore AI</span>
              <span className="bg-indigo-600 text-[8px] font-black tracking-widest text-white px-1.5 py-0.5 rounded uppercase font-mono">Enterprise</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">Healthcare Intelligence &amp; Triage Suite</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 p-2.5 rounded-xl text-[11px] leading-snug animate-fade-in text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-305 p-3 rounded-xl text-xs leading-none text-center">
            {successMsg}
          </div>
        )}

        {/* Dynamic Mode Forms */}
        {activeMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Enterprise Domain Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input 
                  type="email" 
                  required
                  placeholder="name@medicore.ai" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] tracking-wider uppercase font-bold text-slate-400 font-mono">
                <label>Secure Key Password</label>
                <button 
                  type="button"
                  onClick={() => setActiveMode('forgot')}
                  className="text-indigo-400 hover:text-indigo-305 hover:underline cursor-pointer transition lowercase font-sans normal-case"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shadow-md hover:shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1.5 transition active:scale-98 disabled:opacity-50"
            >
              <span>Verify credentials</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Quick Presets matching demo requirements */}
            <div className="pt-3 border-t border-slate-850">
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2 text-center">Standard Demo Credentials</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('admin@medicore.ai', 'admin123')}
                  className="p-1 px-1.5 bg-slate-850 hover:bg-slate-800 text-[10px] font-semibold text-slate-350 border border-slate-800 hover:border-slate-700 rounded-lg text-center cursor-pointer transition"
                >
                  Admin Pres
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('doctor@medicore.ai', 'doctor123')}
                  className="p-1 px-1.5 bg-slate-850 hover:bg-slate-800 text-[10px] font-semibold text-slate-350 border border-slate-800 hover:border-slate-700 rounded-lg text-center cursor-pointer transition"
                >
                  Doctor Pres
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('patient@medicore.ai', 'patient123')}
                  className="p-1 px-1.5 bg-slate-850 hover:bg-slate-800 text-[10px] font-semibold text-slate-350 border border-slate-800 hover:border-slate-700 rounded-lg text-center cursor-pointer transition"
                >
                  Patient Pres
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveMode('register')}
                className="text-xs text-slate-400 hover:text-white transition font-semibold"
              >
                No account? <span className="text-indigo-455">Create Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* Registration Profile Form */}
        {activeMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="Sarah Jenkins" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Role Tier Selector</label>
              <div className="grid grid-cols-3 gap-2">
                {(['patient', 'doctor', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setSpecialty(''); }}
                    className={`py-2 border text-xs font-bold uppercase font-mono tracking-wider rounded-xl transition cursor-pointer ${
                      role === r 
                        ? 'bg-indigo-650/10 border-indigo-505 text-indigo-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Enterprise Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@medicore.ai" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Secure Word Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
                />
              </div>
            </div>

            {role === 'patient' && (
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Date of Birth</label>
                  <input 
                    type="date" 
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-440 block font-mono">Contact Phone</label>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 019-2834" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
                  />
                </div>
              </div>
            )}

            {role === 'doctor' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Clinical Specialty</label>
                <input 
                  type="text" 
                  required
                  placeholder="Cardiology, General Medicine, Neurology" 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shadow-md hover:shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1.5 transition active:scale-98 disabled:opacity-50"
            >
              <span>Build Secure Identity Profile</span>
              <UserPlus className="h-4 w-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveMode('login')}
                className="text-xs text-slate-400 hover:text-white transition font-semibold"
              >
                Already have an identity? <span className="text-indigo-400">Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Recovery */}
        {activeMode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="p-3 bg-indigo-950/40 border border-indigo-850/30 rounded-xl flex items-start gap-2 text-[10.5px] text-slate-400 leading-snug">
              <HelpCircle className="h-5 w-5 text-indigo-455 shrink-0" />
              <p>Type in your registered enterprise domain. We'll instantly dispatch clinical bypass keys.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Identity Email</label>
              <input 
                type="email" 
                required
                placeholder="name@medicore.ai" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider shadow-md cursor-pointer transition active:scale-98 disabled:opacity-50"
            >
              <span>Issue Reset Request</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveMode('login')}
                className="text-xs text-indigo-400 hover:text-white transition font-semibold"
              >
                Return to Access Panel
              </button>
            </div>
          </form>
        )}

        {/* Home navigation control */}
        {onBackToHome && (
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-400 hover:text-white transition font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>← Back to Home Screen</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
