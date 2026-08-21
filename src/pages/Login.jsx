import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Fingerprint, Loader2, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DEFAULT_OFFICERS = [
  { id: "OFF-101", name: "Col. Rajesh Sharma", rank: "SDMA Relief Commissioner", defaultPass: "officer101" },
  { id: "OFF-102", name: "Dr. Ananya Sen", rank: "NDMA Operations Chief", defaultPass: "officer102" },
  { id: "OFF-103", name: "Capt. Vikram Malhotra", rank: "NDRF Sector Commander", defaultPass: "officer103" }
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [officerIdInput, setOfficerIdInput] = useState(DEFAULT_OFFICERS[0].id);
  const [passwordInput, setPasswordInput] = useState(DEFAULT_OFFICERS[0].defaultPass);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerId: officerIdInput,
          password: passwordInput
        })
      });
      
      const data = await response.json();
      if (response.ok && data.officer && data.token) {
        localStorage.setItem('storm_officer', JSON.stringify(data.officer));
        localStorage.setItem('storm_officer_token', data.token);
        
        // Custom event to let other components (like Navbar) know auth state changed
        window.dispatchEvent(new Event('storage'));
        
        navigate(from, { replace: true });
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setAuthError('Authentication error: ' + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col justify-center items-center">
      <div className="hero-glow-arc-subtle"></div>
      
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-[#FF6B1A] flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Officer Sign In</h2>
          <p className="text-xs text-[#9A9A9A]">
            Authenticate to access the STORM Tactical Console.
          </p>
        </div>

        {/* Quick Demo Officer Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 block">Select Duty Officer (Demo Presets):</label>
          <div className="grid grid-cols-1 gap-1.5">
            {DEFAULT_OFFICERS.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setOfficerIdInput(o.id);
                  setPasswordInput(o.defaultPass);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  officerIdInput === o.id 
                    ? 'bg-[#FF6B1A]/10 border-[#FF6B1A] text-white' 
                    : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-white">{o.name} <span className="font-mono text-[10px] text-[#FF6B1A]">({o.id})</span></div>
                <div className="text-[10px] text-slate-500">{o.rank}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Officer ID
              </label>
              <input
                type="text"
                required
                value={officerIdInput}
                onChange={(e) => setOfficerIdInput(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#FF6B1A]"
                placeholder="e.g. OFF-101"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Security Passcode
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#FF6B1A]"
                placeholder="Enter passcode"
              />
            </div>
          </div>

          {authError && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
