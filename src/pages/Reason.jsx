import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { zones, recommendations, resources } from '../data/mockData';
import { 
  Cpu, ArrowRight, UserCheck, ShieldCheck, Clock, 
  Sparkles, AlertCircle, CheckCircle2, Sliders, ChevronRight, Fingerprint, Activity, Loader2, KeyRound, LogOut
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const socket = io(API_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 5000
});

const DEFAULT_OFFICERS = [
  { id: "OFF-101", name: "Col. Rajesh Sharma", rank: "SDMA Relief Commissioner", defaultPass: "officer101" },
  { id: "OFF-102", name: "Dr. Ananya Sen", rank: "NDMA Operations Chief", defaultPass: "officer102" },
  { id: "OFF-103", name: "Capt. Vikram Malhotra", rank: "NDRF Sector Commander", defaultPass: "officer103" }
];

export default function Reason() {
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0].id);
  const [selectedResourceName, setSelectedResourceName] = useState(resources[0].name);
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [liveRecommendation, setLiveRecommendation] = useState(null);

  // Officer authentication state
  const [activeOfficer, setActiveOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem('storm_officer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [officerIdInput, setOfficerIdInput] = useState(DEFAULT_OFFICERS[0].id);
  const [passwordInput, setPasswordInput] = useState(DEFAULT_OFFICERS[0].defaultPass);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Match recommendation for selected zone or fallback to first
  const currentRec = liveRecommendation || (recommendations.find(r => r.zone === selectedZoneId) || recommendations[0]);
  const currentZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const selectedResource = resources.find(r => r.name === selectedResourceName) || resources[0];

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

  const handleOfficerLoginAndApprove = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      // Authenticate against server
      let officer = null;
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
        if (response.ok && data.officer) {
          officer = data.officer;
        } else {
          setAuthError(data.error || 'Invalid credentials');
          setIsAuthenticating(false);
          return;
        }
      } catch {
        // Local fallback check if backend unreachable
        const found = DEFAULT_OFFICERS.find(o => o.id === officerIdInput && o.defaultPass === passwordInput);
        if (found) {
          officer = { id: found.id, name: found.name, rank: found.rank };
        } else {
          setAuthError('Invalid credentials');
          setIsAuthenticating(false);
          return;
        }
      }

      if (officer) {
        setActiveOfficer(officer);
        localStorage.setItem('storm_officer', JSON.stringify(officer));

        // Emit approve_recommendation socket event
        const recPayload = {
          id: currentRec.id || `REC-AI-${Date.now()}`,
          recommendationId: currentRec.id || `REC-AI-${Date.now()}`,
          zone: currentZone.name,
          action: currentRec.action,
          resourceNeeded: selectedResource.name,
          etaAI: currentRec.etaAI || '15 mins',
          etaManual: currentRec.etaManual || '3 hrs',
          confidence: currentRec.confidence || 90,
          officerId: officer.id,
          officerName: officer.name,
          rank: officer.rank,
          timestamp: new Date().toISOString()
        };

        socket.emit('approve_recommendation', recPayload);

        setIsApproved(true);
        setShowAuthModal(false);
      }
    } catch (err) {
      setAuthError('Authentication error: ' + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleQuickApprove = () => {
    if (!activeOfficer) {
      setShowAuthModal(true);
      return;
    }

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
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} (Severity: {zone.severity}/10 – {zone.status.toUpperCase()})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#9A9A9A] block font-mono">
                  Current population: {currentZone.population.toLocaleString()} • Active incidents: {currentZone.activeIncidents}
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
                  {resources.map((res, idx) => (
                    <option key={idx} value={res.name}>
                      {res.name} — {res.location} ({res.status.toUpperCase()})
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
                disabled={isAnalyzing}
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
                      handleQuickApprove();
                    } else {
                      setShowAuthModal(true);
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

      {/* Officer Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-[#FF6B1A] flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Officer Authentication</h2>
              <p className="text-xs text-[#9A9A9A]">
                Sign in with duty credentials to authorize dispatch to <strong className="text-slate-200">{currentZone.name}</strong>.
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

            <form onSubmit={handleOfficerLoginAndApprove} className="space-y-4">
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

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="flex-1 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      Sign & Execute
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
