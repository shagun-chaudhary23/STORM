import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, KeyRound, AlertCircle, Loader2, X, UserCheck } from 'lucide-react';

export default function OfficialLoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginOfficer, demoOfficers } = useApp();
  
  const [officerId, setOfficerId] = useState('OFF-101');
  const [password, setPassword] = useState('officer101');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginOfficer(officerId, password);
    setLoading(false);

    if (result.success) {
      closeLoginModal();
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleSelectPreset = (officer) => {
    setOfficerId(officer.id);
    setPassword(officer.pass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative text-white">
        
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B1A]/20 to-[#E8391A]/10 border border-[#FF6B1A]/30 text-[#FF6B1A] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FF6B1A]/10">
            <ShieldCheck className="w-7 h-7 text-[#FF6B1A]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Official Command Portal
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter designated officer credentials to access emergency dispatch controls.
          </p>
        </div>

        {/* Quick Demo Officer Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-semibold text-[#FF6B1A] uppercase tracking-wider block">
            Quick Demo Presets:
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {demoOfficers.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => handleSelectPreset(o)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  officerId === o.id
                    ? 'bg-[#FF6B1A]/15 border-[#FF6B1A] text-white'
                    : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="font-bold text-white">
                    {o.name} <span className="font-mono text-[10px] text-[#FF6B1A]">({o.id})</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{o.rank}</div>
                </div>
                {officerId === o.id && (
                  <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Official ID
              </label>
              <input
                type="text"
                required
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#FF6B1A]"
                placeholder="e.g. OFF-101"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#FF6B1A]"
                placeholder="Enter security password"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeLoginModal}
              className="flex-1 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-xl shadow-lg shadow-[#FF6B1A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate & Sign In</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
