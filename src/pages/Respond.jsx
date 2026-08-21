import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Truck, MapPin, 
  UserCheck, Send, Loader2, ArrowLeft, Clock, ShieldAlert, Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Respond() {
  const { token } = useParams();
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedStatus, setSelectedStatus] = useState('completed');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/deployments/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Deployment token invalid or expired.');
        }
        return res.json();
      })
      .then((data) => {
        setDeployment(data);
        if (data.status && data.status !== 'pending') {
          setSubmitted(true);
          setSelectedStatus(data.status);
          setNotes(data.notes || '');
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/deployments/${token}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          notes: notes.trim()
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit status update.');
      }

      const data = await response.json();
      setDeployment(data.deployment);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B1A] mb-3" />
        <span className="font-mono text-xs text-slate-400">Validating tactical deployment token...</span>
      </div>
    );
  }

  if (error && !deployment) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-[#141414] border border-red-500/30 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Invalid Deployment Link</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error}
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to STORM Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 pb-20 min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-xl w-full bg-[#141414] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B1A] to-[#E8391A] p-0.5 flex items-center justify-center mx-auto shadow-lg shadow-[#FF6B1A]/20">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#FF6B1A]" />
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6B1A] font-bold block">
            STORM Field Deployment Loop
          </span>
          <h1 className="text-2xl font-black text-white">
            Team Lead Mission Briefing
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Authorized by <strong className="text-slate-200">{deployment?.officer_name || 'Command Officer'}</strong> ({deployment?.officer_id || 'HQ'})
          </p>
        </div>

        {/* Mission Briefing Card */}
        <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[11px]">TARGET INCIDENT ZONE:</span>
            <span className="font-bold text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
              {deployment?.zone_name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[11px]">ASSIGNED UNIT / TEAM:</span>
            <span className="font-bold text-emerald-400">
              {deployment?.resource_name} ({deployment?.team_lead_name || 'Lead Officer'})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[11px]">ZONE SEVERITY:</span>
            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-400 font-mono font-bold">
              {deployment?.severity || 7} / 10
            </span>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-1">
            <span className="text-slate-400 font-mono text-[10px] uppercase block">Mission Action Summary:</span>
            <p className="text-slate-200 font-semibold text-xs leading-relaxed">
              "{deployment?.task_summary}"
            </p>
          </div>
        </div>

        {/* Status Form or Success View */}
        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Status Transmitted to Command Hub</h3>
            <p className="text-xs text-slate-300">
              Mission marked as <strong className="uppercase font-mono text-emerald-400">{deployment?.status || selectedStatus}</strong>.
            </p>
            {notes && (
              <p className="text-[11px] text-slate-400 italic bg-black/40 p-2.5 rounded-lg border border-white/5">
                Notes: "{notes}"
              </p>
            )}
            <p className="text-[10px] text-slate-400 font-mono">
              Confirmation SMS routed to deploying officer ({deployment?.officer_phone || 'HQ'}). Dashboard updated live.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Update Mission Status *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedStatus('completed')}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === 'completed'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Completed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus('incomplete')}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === 'incomplete'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-amber-400" />
                  <span>Incomplete / Blocked</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Ground Observations / Field Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Relief kits distributed to 140 families. Secondary bridge impassable, requested boat support."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B1A]"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Status Response</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
