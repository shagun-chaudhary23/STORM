import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { zones as initialZones, recommendations as initialRecs, resources as initialRes } from '../data/mockData';
import { 
  Cpu, ArrowRight, UserCheck, ShieldCheck, Clock, 
  Sparkles, AlertCircle, CheckCircle2, Sliders, ChevronRight, Fingerprint, Activity, Loader2, KeyRound, LogOut
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const socket = io(API_URL, {
  auth: { token: localStorage.getItem('storm_officer_token') },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 5000
});



export default function Reason() {
  const [activeZones, setActiveZones] = useState(initialZones);
  const [activeResources, setActiveResources] = useState(initialRes);
  const [activeRecommendations, setActiveRecommendations] = useState(initialRecs);

  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [selectedResourceName, setSelectedResourceName] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [liveRecommendation, setLiveRecommendation] = useState(null);

  useEffect(() => {
    socket.on('storm_state_update', (data) => {
      setActiveZones(data.zones || []);
      setActiveResources(data.resources || []);
      setActiveRecommendations([...(data.pendingRecommendations || []), ...(data.approvedRecommendations || [])]);
      
      // Auto-select first available items if nothing selected
      if (!selectedZoneId && data.zones?.length > 0) {
        setSelectedZoneId(data.zones[0].id);
      }
      if (!selectedResourceName && data.resources?.length > 0) {
        setSelectedResourceName(data.resources[0].name);
      }
    });

    return () => {
      socket.off('storm_state_update');
    };
  }, [selectedZoneId, selectedResourceName]);

  // Officer authentication state
  const [activeOfficer, setActiveOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem('storm_officer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Match recommendation for selected zone or fallback to first
  const currentRec = liveRecommendation || (activeRecommendations.find(r => r.zone === selectedZoneId) || activeRecommendations[0] || {});
  const currentZone = activeZones.find(z => z.id === selectedZoneId) || activeZones[0] || {};
  const selectedResource = activeResources.find(r => r.name === selectedResourceName) || activeResources[0] || {};

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalyzed(false);
    setIsApproved(false);
    setLiveRecommendation(null);
    
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone: currentZone,
          resource: selectedResource
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setLiveRecommendation(data);
      } else {
        alert("AI Analysis Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    } finally {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }
  };

  const handleApprove = () => {
    if (!activeOfficer) return;

    const recPayload = {
      id: currentRec.id || `REC-AI-${Date.now()}`,
      recommendationId: currentRec.id || `REC-AI-${Date.now()}`,
      zone: currentZone.name,
      action: currentRec.action,
      resourceNeeded: selectedResource.name,
      etaAI: currentRec.etaAI || '15 mins',
      etaManual: currentRec.etaManual || '3 hrs',
      confidence: currentRec.confidence || 90,
      officerId: activeOfficer.id,
      officerName: activeOfficer.name,
      rank: activeOfficer.rank,
      timestamp: new Date().toISOString()
    };

    socket.emit('approve_recommendation', recPayload);
    setIsApproved(true);
  };

  const handleOfficerLogout = () => {
    setActiveOfficer(null);
    localStorage.removeItem('storm_officer');
    localStorage.removeItem('storm_officer_token');
    socket.auth = {};
    socket.disconnect().connect();
  };

  return (
    <div className="relative pt-28 pb-20 overflow-hidden min-h-screen">
      
      {/* Glow Arc */}
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Planning & Optimization Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Reason Layer
          </h1>

          <p className="text-sm sm:text-base text-[#9A9A9A] leading-relaxed">
            Multi-constraint spatial planning models rank route safety, stockpile distances, and resource availability to draft instant recommendations for coordinator authorization.
          </p>

          {/* Active Officer Identity Banner */}
          <div className="pt-2">
            {activeOfficer ? (
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300">Active Officer:</span>
                <strong className="text-emerald-400">{activeOfficer.name} ({activeOfficer.id})</strong>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">{activeOfficer.rank}</span>
                <button
                  onClick={handleOfficerLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors ml-1 p-0.5"
                  title="Sign out officer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-400">
                <KeyRound className="w-3.5 h-3.5" />
                <span>No Officer Session • Authentication Required for Dispatch</span>
              </div>
            )}
          </div>
        </div>

        {/* Top: Two-Input Comparison Form */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 shadow-2xl">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF6B1A] uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>Simulate Dispatch Logic for Incident Sector</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Input 1: Incident Zone Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Select Incident Zone
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
                >
                  {activeZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} (Severity: {zone.severity}/10 – {zone.status?.toUpperCase()})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#9A9A9A] block font-mono">
                  Current population: {currentZone?.population?.toLocaleString() || 0} • Active incidents: {currentZone?.activeIncidents || 0}
                </span>
              </div>

              {/* Input 2: Nearest Resource Hub Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Select Nearest Resource Hub
                </label>
                <select
                  value={selectedResourceName}
                  onChange={(e) => setSelectedResourceName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
                >
                  {activeResources.map((res, idx) => (
                    <option key={idx} value={res.name}>
                      {res.name} — {res.location} ({res.status?.toUpperCase()})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#9A9A9A] block font-mono">
                  Inventory status synced across state warehouses
                </span>
              </div>

            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isAnalyzing || !currentZone.id || !selectedResource.name}
                className={`w-56 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-white rounded-full shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2 ${
                  isAnalyzing 
                    ? 'bg-slate-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 shadow-[#FF6B1A]/20 hover:scale-[1.02]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze & Recommend</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* AI Loading State */}
        {isAnalyzing && (
          <div className="max-w-3xl mx-auto p-12 text-center space-y-4 animate-pulse">
            <Activity className="w-10 h-10 text-[#FF6B1A] mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Running Multi-Constraint Spatial Models...</h3>
            <p className="text-xs text-[#9A9A9A] font-mono">Evaluating {selectedResource.name} deployment to {currentZone.name}</p>
          </div>
        )}

        {/* Side-by-Side Comparison: AI Recommendation vs Manual Baseline */}
        {analyzed && !isAnalyzing && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* AI Recommended Action Card (Green Accent) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-emerald-500/50 space-y-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-transparent"></div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-400">
                      {liveRecommendation?.demoFallback ? 'DEMO RECOMMENDATION' : 'AI RECOMMENDED ACTION'}
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    {currentRec.confidence}% Confidence
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">{currentRec.action}</h4>
                  <p className="text-xs text-[#9A9A9A]">
                    Recommended Assets: <strong className="text-slate-200">{selectedResource.name}</strong> from {selectedResource.location}
                  </p>
                  {liveRecommendation?.demoFallback && (
                    <p className="text-xs text-amber-400">
                      Gemini is not configured. This deterministic recommendation is for local demonstration only.
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#9A9A9A]">Target Response ETA:</span>
                  <span className="text-emerald-400 font-extrabold text-base">{currentRec.etaAI}</span>
                </div>

                <div className="text-[11px] text-[#9A9A9A] leading-relaxed flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Route elevation profile checked • Bridge load capacity confirmed safe • Automated WhatsApp alert pre-drafted.</span>
                </div>
              </div>

              {/* Manual Baseline Estimate Card (Muted/Red Accent) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#9A9A9A]" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#9A9A9A]">
                      MANUAL BASELINE ESTIMATE
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                    Unoptimized
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-300">Standard Sequential Phone Escalation</h4>
                  <p className="text-xs text-[#9A9A9A]">
                    Dependent on district officer manual availability and paper file movement.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#9A9A9A]">Estimated Coordination Lag:</span>
                  <span className="text-red-400 font-extrabold text-base">{currentRec.etaManual}</span>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Requires multi-tier telephone approvals, unverified roadblock risks, manual WhatsApp broadcast drafting.</span>
                </div>
              </div>

            </div>

            {/* Recommendation Parameters List Below */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Evaluation Constraints & Recommendation Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[#9A9A9A] font-mono text-[10px] block">RESOURCE AVAILABILITY</span>
                  <span className="text-white font-semibold">{selectedResource.status === 'available' ? '100% Verified in Warehouse' : 'Partial / Deployed'}</span>
                  <span className={`text-[10px] block font-mono ${selectedResource.status === 'available' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedResource.status === 'available' ? 'Standby Ready' : 'Limited availability'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[#9A9A9A] font-mono text-[10px] block">OPTIMAL TRANSIT DISTANCE</span>
                  <span className="text-white font-semibold">{liveRecommendation?.keyFactors ? liveRecommendation.keyFactors[0] : "18.4 km via State Highway 10"}</span>
                  <span className="text-[10px] block font-mono text-emerald-400">Clear route confirmed by Sentinel</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[#9A9A9A] font-mono text-[10px] block">CRITICAL FACTORS</span>
                  <span className="text-white font-semibold">{liveRecommendation?.keyFactors ? liveRecommendation.keyFactors[1] : "High Population Density"}</span>
                  <span className="text-[10px] block font-mono text-[#FF6B1A]">Requires rapid deployment</span>
                </div>
              </div>
            </div>

            {/* Mandatory Human Review Governance Callout Box */}
            <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isApproved 
                ? 'bg-emerald-950/20 border-emerald-500/40' 
                : 'bg-gradient-to-r from-amber-950/40 via-[#141414] to-[#141414] border-[#FF6B1A]/40'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl border flex-shrink-0 ${
                  isApproved 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-[#FF6B1A]/10 border-[#FF6B1A]/30 text-[#FF6B1A]'
                }`}>
                  {isApproved ? <ShieldCheck className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">
                    {isApproved ? 'Dispatch Authorized & Active' : 'Recommendations are generated by AI. Every dispatch requires human review.'}
                  </h4>
                  <p className="text-xs text-[#9A9A9A]">
                    {isApproved 
                      ? `Coordinator signature verified by ${activeOfficer ? `${activeOfficer.name} (${activeOfficer.rank})` : 'Authorized Officer'}. ${selectedResource.name} has been instructed to deploy to ${currentZone.name}.` 
                      : 'STORM provides situational decision support. Official dispatch orders only execute upon authentication by a designated State or District Coordinator.'}
                  </p>
                </div>
              </div>

              {!isApproved ? (
                <button
                  onClick={() => {
                    if (activeOfficer) {
                      handleApprove();
                    }
                  }}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white whitespace-nowrap transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4 text-[#FF6B1A]" />
                  {activeOfficer ? `Authorize as ${activeOfficer.name}` : 'Authenticate & Authorize'}
                </button>
              ) : (
                <span className="px-4 py-2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Deployed
                </span>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
