import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, AlertTriangle, 
  Activity, PhoneOff, DatabaseZap, Clock, Radio, ChevronRight, Layers, FileCheck
} from 'lucide-react';
import { zones, recommendations, SIKKIM_CASE_STUDY } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();

  // Highest severity zone from mock data
  const highestZone = [...zones].sort((a, b) => b.severity - a.severity)[0];
  const pendingCount = recommendations.filter(r => r.status === 'pending').length;

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      
      {/* Radial Orange-Red Glow Arc Background */}
      <div className="hero-glow-arc"></div>

      {/* 1. SPLIT HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Subtext, CTAs, Trust Row */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-slate-300 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-white">STORM Platform</span>
              <span className="text-[#9A9A9A]">•</span>
              <span className="text-[#FF6B1A]">AI-Speed Detection, Human-Approved Action</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08] animate-fade-in-up delay-100">
              When coordination fails,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] to-[#E8391A]">
                people die.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#9A9A9A] leading-relaxed max-w-2xl animate-fade-in-up delay-200">
              India faces 400+ disasters a year; the real killer is the coordination gap after the strike — not the disaster itself. STORM synthesizes real-time feeds so human coordinators authorize dispatches in minutes.
            </p>

            {/* Two CTAs - Fixed Width Pills */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 animate-fade-in-up delay-300">
              <button
                onClick={() => navigate('/reason')}
                className="w-56 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-xl shadow-[#FF6B1A]/25 hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Launch Reason AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/resources')}
                className="w-48 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-slate-200 bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 rounded-full transition-all cursor-pointer inline-flex items-center justify-center"
              >
                Match Resources
              </button>
            </div>

            {/* Trust Row with Checkmarks */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#9A9A9A] animate-fade-in-up delay-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">AI-Verified Signals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">Live NDMA Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B1A]" />
                <span className="text-slate-300 font-medium">Human-Reviewed Dispatch</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Detection Status Card */}
          <div className="lg:col-span-5 animate-fade-in-up delay-200">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 relative overflow-hidden shadow-2xl space-y-6 hover:border-[#FF6B1A]/30 transition-colors duration-500">
              
              {/* Header Status Row */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    SENSE ACTIVE
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300">
                  South Sikkim Sector
                </span>
              </div>

              {/* Highest Severity Zone Mini Card */}
              <div className="p-5 rounded-xl bg-[#0A0A0A] border border-red-500/30 space-y-3 cursor-pointer hover:bg-[#1a1111] transition-colors" onClick={() => navigate('/report')}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#9A9A9A] uppercase">Highest Priority Anomaly</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                    {highestZone.severity} / 10 CRITICAL
                  </span>
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {highestZone.name}
                  <ChevronRight className="w-4 h-4 text-red-500" />
                </h3>
                <div className="text-xs text-[#9A9A9A] flex items-center justify-between">
                  <span>Pop: {highestZone.population.toLocaleString()}</span>
                  <span>Active Incidents: {highestZone.activeIncidents}</span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#9A9A9A]">
                    <span>Signal Coverage</span>
                    <strong className="text-white font-mono">96%</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF6B1A] to-emerald-400 w-[96%] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#9A9A9A]">
                    <span>Data Freshness</span>
                    <strong className="text-white font-mono">98% (Synced 12s ago)</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[98%] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Pending Approvals Count */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs cursor-pointer group" onClick={() => navigate('/reason')}>
                <span className="text-[#9A9A9A] group-hover:text-white transition-colors">Pending Officer Orders:</span>
                <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30 font-mono font-bold flex items-center gap-1 group-hover:bg-amber-900 transition-colors">
                  {pendingCount} Pending Approvals
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. THREE BOTTLENECK CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 animate-fade-in-up delay-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>The Crisis of Response Latency</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Three Fatal Bottlenecks
          </h2>
          <p className="text-sm text-[#9A9A9A]">
            Why manual phone trees and siloed paper reporting cost critical lives after disasters strike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl card-dark relative group transition-all duration-300 flex flex-col justify-between animate-fade-in-up delay-100">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B1A]">
                  <PhoneOff className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                  500+ Alerts/Hr
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF6B1A] transition-colors">
                Overwhelmed Coordinators
              </h3>
              <p className="text-xs text-[#9A9A9A] leading-relaxed">
                During a flood or cyclone, officers receive hundreds of unverified WhatsApp messages, phone calls, and paper memos per hour. Critical signals get buried in noise.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
              Bottleneck #01 — Signal Overload
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl card-dark relative group transition-all duration-300 flex flex-col justify-between animate-fade-in-up delay-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B1A]">
                  <DatabaseZap className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                  7+ Isolated Silos
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF6B1A] transition-colors">
                Fragmented Data
              </h3>
              <p className="text-xs text-[#9A9A9A] leading-relaxed">
                IMD Doppler radar, CWC river meters, ISRO satellite feeds, and municipal logs operate in isolated departmental portals with no single operational picture.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
              Bottleneck #02 — Data Siloes
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl card-dark relative group transition-all duration-300 flex flex-col justify-between animate-fade-in-up delay-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B1A]">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                  4 - 18+ Hrs Latency
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF6B1A] transition-colors">
                Delayed Alerts
              </h3>
              <p className="text-xs text-[#9A9A9A] leading-relaxed">
                Drafting evacuation orders and matching NDRF boat inventory manually takes hours. By the time dispatches are signed, communities are already submerged.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
              Bottleneck #03 — Action Delay
            </div>
          </div>

        </div>
      </section>

      {/* 3. SIKKIM 2023 HIGHLIGHTED QUOTE CARD */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#141414] border-l-4 border-l-[#FF6B1A] border border-white/10 relative overflow-hidden shadow-2xl space-y-4 animate-fade-in-up delay-200 hover:border-l-emerald-500 transition-colors duration-500">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              Real Citation Case Study
            </span>
            <span className="text-xs text-[#9A9A9A] font-mono">Oct 4, 2023</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {SIKKIM_CASE_STUDY.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-300 italic leading-relaxed">
            "{SIKKIM_CASE_STUDY.quote}"
          </p>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9A9A9A]">
            <div>
              <span className="block font-mono text-[11px]">Impact Citation:</span>
              <span className="text-slate-300 font-semibold">{SIKKIM_CASE_STUDY.impact}</span>
            </div>

            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] text-slate-500 font-mono block">STORM Target Acceleration</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ~30-60 Min to AI Recommendation
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
