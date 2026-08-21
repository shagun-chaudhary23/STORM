import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Truck, KeyRound, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function TeamLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/team-dashboard";
  const { demoTeamLeaders, loginTeamLeader } = useApp();

  const [leaderIdInput, setLeaderIdInput] = useState(demoTeamLeaders[0]?.id || "TL-201");
  const [passwordInput, setPasswordInput] = useState(demoTeamLeaders[0]?.pass || "leader201");
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await loginTeamLeader(leaderIdInput, passwordInput);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setAuthError(res.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Authentication error: ' + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col justify-center items-center px-4">
      <div className="hero-glow-arc-subtle"></div>
      
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
            STORM Ground Unit Portal
          </span>
          <h2 className="text-2xl font-bold text-white">Team Leader Sign In</h2>
          <p className="text-xs text-[#9A9A9A]">
            Access assigned missions, submit tactical field reports, and report task completions.
          </p>
        </div>

        {/* Quick Demo Team Leader Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 block">Select Deployment Unit (Demo Presets):</label>
          <div className="grid grid-cols-1 gap-1.5">
            {demoTeamLeaders.map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setLeaderIdInput(l.id);
                  setPasswordInput(l.pass);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  leaderIdInput === l.id 
                    ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                    : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{l.name}</span>
                  <span className="font-mono text-[10px] text-emerald-400">({l.id})</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">{l.team}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Leader ID
              </label>
              <input
                type="text"
                required
                value={leaderIdInput}
                onChange={(e) => setLeaderIdInput(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. TL-201"
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
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
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
              className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In to Unit Console
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-white/5 text-center">
          <Link
            to="/login"
            className="text-[11px] text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
          >
            <span>Are you a HQ Duty Officer?</span>
            <span className="text-[#FF6B1A] font-bold">Officer Sign In &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
