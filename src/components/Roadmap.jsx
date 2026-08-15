import React from 'react';
import { ROADMAP_PHASES } from '../data/stormData';
import { Compass, CheckCircle2, Clock, Target, Flag, ShieldCheck } from 'lucide-react';

export default function Roadmap() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">Completed</span>;
      case 'In Progress':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/40 text-xs font-semibold animate-pulse">In Progress</span>;
      case 'Targeted':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold">Targeted Pilot</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">Planned</span>;
    }
  };

  return (
    <section id="roadmap" className="py-20 md:py-28 bg-[#0B101D] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-xs font-semibold text-[#FF6B1A]">
            <Compass className="w-3.5 h-3.5" />
            <span>Development Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Deployment Roadmap
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            From simulated prototype validation to live state-level SDMA pilots across India's disaster hot-zones.
          </p>
        </div>

        {/* 4-Phase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {ROADMAP_PHASES.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-[#FF6B1A]/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-extrabold text-[#FF6B1A]">{item.phase}</span>
                  {getStatusBadge(item.status)}
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FF6B1A] transition-colors">
                  {item.name}
                </h3>
                <div className="text-xs text-slate-400 font-mono mb-4">{item.timeframe}</div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.details}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Target className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>Milestone Goal</span>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Highlight Quote (Strict positioning requirement) */}
        <div className="glass-panel-orange p-8 rounded-2xl border border-[#FF6B1A]/40 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex justify-center">
              <ShieldCheck className="w-8 h-8 text-[#FF6B1A]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              "When the storm hits, STORM is already moving — with people still in the loop."
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Transforming disaster coordination across SDMAs, NDMA, and vetted NGO networks.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
