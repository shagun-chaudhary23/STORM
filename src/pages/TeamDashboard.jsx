import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Truck, ShieldAlert, CheckCircle2, XCircle, Clock, MapPin, 
  Send, Loader2, LogOut, RefreshCw, AlertTriangle, UserCheck, ShieldCheck, Sparkles, Filter 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function TeamDashboard() {
  const navigate = useNavigate();
  const { activeTeamLeader, logoutTeamLeader, completeTeamDeployment, resources } = useApp();

  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingToken, setSubmittingToken] = useState(null);
  const [formStates, setFormStates] = useState({});
  const [filterTab, setFilterTab] = useState('active'); // 'active' | 'completed' | 'all'
  const [actionSuccess, setActionSuccess] = useState(null);

  // Fetch logged-in team leader's deployments
  const fetchMyDeployments = useCallback(async () => {
    const token = localStorage.getItem('storm_team_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/team-deployments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.deployments) {
        setDeployments(data.deployments);
      }
    } catch (err) {
      console.error('Error fetching team deployments:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyDeployments();
  }, [fetchMyDeployments, resources]);

  const handleStatusChange = (token, status) => {
    setFormStates(prev => ({
      ...prev,
      [token]: {
        ...prev[token],
        status
      }
    }));
  };

  const handleNotesChange = (token, notes) => {
    setFormStates(prev => ({
      ...prev,
      [token]: {
        ...prev[token],
        notes
      }
    }));
  };

  const handleSubmitResponse = async (deployment) => {
    const token = deployment.token;
    const currentState = formStates[token] || {};
    const status = currentState.status || 'completed';
    const notes = currentState.notes || '';

    setSubmittingToken(token);
    setActionSuccess(null);

    try {
      const res = await completeTeamDeployment({
        token,
        status,
        notes
      });

      if (res.success) {
        setActionSuccess(`Mission at ${deployment.zone_name} marked as ${status.toUpperCase()}! HQ notified.`);
        // Refresh local list
        await fetchMyDeployments();
        setTimeout(() => setActionSuccess(null), 8000);
      } else {
        alert("Failed to submit status: " + res.error);
      }
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setSubmittingToken(null);
    }
  };

  const handleLogout = () => {
    logoutTeamLeader();
    navigate('/team-login');
  };

  const activeDeployments = deployments.filter(d => d.status === 'pending');
  const completedDeployments = deployments.filter(d => d.status !== 'pending');

  const displayedDeployments = filterTab === 'active' 
    ? activeDeployments 
    : filterTab === 'completed' 
      ? completedDeployments 
      : deployments;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 pt-28 pb-16 px-4 sm:px-8">
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Top Header Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center">
                <Truck className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {activeTeamLeader?.id || 'TEAM LEAD'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activeTeamLeader?.phone}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {activeTeamLeader?.name || 'Unit Commander'}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Assigned Unit: <strong className="text-slate-200">{activeTeamLeader?.team_name || 'Emergency Unit'}</strong>
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
            <button
              onClick={fetchMyDeployments}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title="Refresh Deployments"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Feed</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-500/30 text-xs font-bold text-red-300 hover:text-red-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Action Success Banner */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2.5 animate-fade-in shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTab('active')}
              className={`px-4 py-2 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                filterTab === 'active'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Active Missions ({activeDeployments.length})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-4 py-2 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                filterTab === 'completed'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Completed ({completedDeployments.length})
            </button>
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              All ({deployments.length})
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Live Socket.IO Stream Active
          </span>
        </div>

        {/* Deployments List */}
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading tactical mission logs...</p>
          </div>
        ) : displayedDeployments.length === 0 ? (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center space-y-4">
            <ShieldCheck className="w-12 h-12 text-emerald-500/40 mx-auto" />
            <h3 className="text-lg font-bold text-white">No {filterTab} missions found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {filterTab === 'active' 
                ? 'All field missions assigned to your unit are currently closed out or standing by. Stand by for HQ dispatches.'
                : 'No deployment records found in this category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {displayedDeployments.map((dep) => {
              const isPending = dep.status === 'pending';
              const currentForm = formStates[dep.token] || { status: 'completed', notes: '' };
              const isSubmitting = submittingToken === dep.token;

              return (
                <div 
                  key={dep.id || dep.token}
                  className={`bg-[#141414] border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl transition-all ${
                    isPending 
                      ? 'border-emerald-500/40 bg-gradient-to-br from-[#141414] to-emerald-950/10' 
                      : 'border-white/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Top info bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                          {dep.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isPending 
                            ? 'bg-amber-950/70 border border-amber-500/40 text-amber-300 animate-pulse' 
                            : dep.status === 'completed'
                              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                              : 'bg-red-950/70 border border-red-500/40 text-red-300'
                        }`}>
                          {dep.status}
                        </span>
                      </div>
                      <div className="text-lg font-black text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#FF6B1A]" />
                        <span>{dep.zone_name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">SEVERITY</span>
                        <span className="text-red-400 font-bold">{dep.severity || 7}/10</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px]">AUTHORIZED BY</span>
                        <span className="text-slate-300 font-bold">{dep.officer_name || 'HQ Officer'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Task details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Mission Directive</span>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        "{dep.task_summary}"
                      </p>
                    </div>

                    <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Assigned Unit:</span>
                        <span className="text-emerald-400 font-bold">{dep.resource_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Officer Contact:</span>
                        <span className="text-slate-300">{dep.officer_phone || 'SDMA Command'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dispatched At:</span>
                        <span className="text-slate-400">{dep.created_at ? new Date(dep.created_at).toLocaleTimeString() : 'Recent'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Form for Active Mission */}
                  {isPending ? (
                    <div className="pt-2 space-y-4 bg-black/30 p-5 rounded-xl border border-emerald-500/20">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-200 font-mono">
                          Update Mission Status:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(dep.token, 'completed')}
                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                              (currentForm.status || 'completed') === 'completed'
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                                : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Mark Completed</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(dep.token, 'incomplete')}
                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                              currentForm.status === 'incomplete'
                                ? 'bg-amber-950/70 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                                : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            <XCircle className="w-4 h-4 text-amber-400" />
                            <span>Incomplete / Blocked</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-mono text-slate-400">
                          Field Observation / Resolution Notes:
                        </label>
                        <textarea
                          rows={2}
                          value={currentForm.notes || ''}
                          onChange={(e) => handleNotesChange(dep.token, e.target.value)}
                          placeholder="e.g. Sector cleared. Medical triage established for 60 individuals."
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSubmitResponse(dep)}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit Mission Resolution</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-500 text-[10px] uppercase">Recorded Status</span>
                        <span className="font-bold text-emerald-400 uppercase font-mono">{dep.status}</span>
                      </div>
                      {dep.notes && (
                        <p className="text-slate-300 italic text-[11px]">
                          Field Notes: "{dep.notes}"
                        </p>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Closed At: {dep.updated_at ? new Date(dep.updated_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
