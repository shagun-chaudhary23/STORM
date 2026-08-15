import React, { useState } from 'react';
import { zones, recommendations, resources } from '../data/mockData';
import { 
  Cpu, ArrowRight, UserCheck, ShieldCheck, Clock, 
  Sparkles, AlertCircle, CheckCircle2, Sliders, ChevronRight 
} from 'lucide-react';

export default function Reason() {
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0].id);
  const [selectedResourceName, setSelectedResourceName] = useState(resources[0].name);
  const [analyzed, setAnalyzed] = useState(true);

  // Match recommendation for selected zone or fallback to first
  const currentRec = recommendations.find(r => r.zone === selectedZoneId) || recommendations[0];
  const currentZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  const handleAnalyze = (e) => {
    e.preventDefault();
    setAnalyzed(true);
  };

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      
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
                className="w-56 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-lg shadow-[#FF6B1A]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Recommend</span>
              </button>
            </div>
          </form>
        </div>

        {/* Side-by-Side Comparison: AI Recommendation vs Manual Baseline */}
        {analyzed && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* AI Recommended Action Card (Green Accent) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-emerald-500/50 space-y-5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-400">
                      AI RECOMMENDED ACTION
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    {currentRec.confidence}% Confidence
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">{currentRec.action}</h4>
                  <p className="text-xs text-[#9A9A9A]">
                    Recommended Assets: <strong className="text-slate-200">{currentRec.resourceNeeded}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#9A9A9A]">Target Response ETA:</span>
                  <span className="text-emerald-400 font-extrabold text-base">{currentRec.etaAI}</span>
                </div>

                <div className="text-[11px] text-[#9A9A9A] leading-relaxed">
                  ✓ Route elevation profile checked • Bridge load capacity confirmed safe • Automated WhatsApp alert pre-drafted.
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

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  ✗ Requires multi-tier telephone approvals, unverified roadblock risks, manual WhatsApp broadcast drafting.
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
                  <span className="text-white font-semibold">100% Verified in Warehouse</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">Standby Ready</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[#9A9A9A] font-mono text-[10px] block">OPTIMAL TRANSIT DISTANCE</span>
                  <span className="text-white font-semibold">18.4 km via State Highway 10</span>
                  <span className="text-[10px] text-slate-400 block font-mono">All-weather bypass clear</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[#9A9A9A] font-mono text-[10px] block">TIME REDUCTION FACTOR</span>
                  <span className="text-[#FF6B1A] font-bold text-sm">~85% Faster Dispatch Cycle</span>
                  <span className="text-[10px] text-slate-500 block font-mono">Simulated target</span>
                </div>
              </div>
            </div>

            {/* Mandatory Human Review Governance Callout Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#141414] to-[#141414] border border-[#FF6B1A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-[#FF6B1A] flex-shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">
                    Recommendations are generated by AI. Every dispatch requires human review.
                  </h4>
                  <p className="text-xs text-[#9A9A9A]">
                    STORM provides situational decision support. Official dispatch orders only execute upon authentication by a designated State or District Coordinator.
                  </p>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
                Officer Sign-Off Required
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
