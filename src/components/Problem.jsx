import React from 'react';
import { PhoneOff, DatabaseZap, Clock, AlertOctagon, ArrowRight, ExternalLink } from 'lucide-react';
import { SIKKIM_CASE_STUDY } from '../data/stormData';

export default function Problem() {
  const problemCards = [
    {
      icon: PhoneOff,
      title: "Overwhelmed Coordinators",
      description: "During a flash flood or cyclone, officers receive 500+ unverified WhatsApp messages, phone calls, and manual memos per hour. Critical signals get buried in noise."
    },
    {
      icon: DatabaseZap,
      title: "Fragmented Data",
      description: "IMD Doppler feeds, CWC river gauge meters, ISRO satellite radar, and municipal reports exist in departmental silos. No single operational view exists."
    },
    {
      icon: Clock,
      title: "Delayed Alerts",
      description: "Drafting evacuation orders and matching NDRF boat inventory manually takes 4 to 6 hours. By the time dispatches are signed, floodwaters have already crested."
    }
  ];

  return (
    <section id="problem" className="py-20 md:py-28 bg-[#0B101D] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>The Crisis of Delayed Response</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            The Coordination Gap Kills First
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Disasters unfold in minutes, but conventional disaster administration operates across multi-tier bureaucracy, manual phone chains, and fragmented paper logs.
          </p>
        </div>

        {/* 3-Column Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {problemCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-[#FF6B1A]/40 transition-all duration-300 group hover:-translate-y-1 relative"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 flex items-center justify-center text-[#FF6B1A] mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF6B1A] transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Sikkim 2023 Case Study Callout Box */}
        <div className="glass-panel-orange p-6 sm:p-8 rounded-2xl border border-[#FF6B1A]/40 relative overflow-hidden mb-16 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wide">
                  Real Citation
                </span>
                <span className="text-xs text-slate-400 font-medium">South Lhonak Lake GLOF (Oct 2023)</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white">
                Case in Point: {SIKKIM_CASE_STUDY.title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {SIKKIM_CASE_STUDY.impact} <strong className="text-amber-400">{SIKKIM_CASE_STUDY.delayDetails}</strong>
              </p>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                <ExternalLink className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span className="italic">{SIKKIM_CASE_STUDY.citation}</span>
              </div>
            </div>

            <div className="w-full lg:w-auto flex-shrink-0 bg-slate-900/90 p-5 rounded-xl border border-slate-800 text-center lg:text-left">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Coordination Latency</div>
              <div className="text-3xl font-extrabold text-red-400 font-mono">{SIKKIM_CASE_STUDY.delayHours}</div>
              <div className="text-[11px] text-slate-400 mt-1">Manual signal-to-action timeline</div>
            </div>
          </div>
        </div>

        {/* Before Flow Diagram */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
          <h4 className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">
            Traditional Post-Disaster Manual Workflow (High Latency)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-[#FF6B1A] mb-3">01</div>
              <div className="text-sm font-bold text-white mb-1">Disaster Signal</div>
              <div className="text-xs text-slate-400">Satellite / Weather radar anomaly detected</div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-amber-400 mb-3">02</div>
              <div className="text-sm font-bold text-white mb-1">Manual Phone Chains</div>
              <div className="text-xs text-slate-400">Calls between CWC, SDMA & District Collector</div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-red-400 mb-3">03</div>
              <div className="text-sm font-bold text-white mb-1">Siloed Analysis</div>
              <div className="text-xs text-slate-400">Departmental spreadsheets & physical paper drafting</div>
            </div>

            <div className="p-5 rounded-xl bg-red-950/30 border border-red-500/30 flex flex-col items-center text-center relative">
              <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold mb-3">04</div>
              <div className="text-sm font-bold text-red-300 mb-1">Hours of Delay</div>
              <div className="text-xs text-red-400/80 font-mono">4 to 18+ Hours before physical movement</div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
