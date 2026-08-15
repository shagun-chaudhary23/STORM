import React from 'react';
import { Compass, CheckCircle2, Clock, Target, Flag, ShieldCheck, ArrowDown } from 'lucide-react';
import { ROADMAP_TIMELINE } from '../data/stormData';

export default function Roadmap() {
  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      
      {/* Glow Arc */}
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">
            <Compass className="w-3.5 h-3.5" />
            <span>Development & Deployment Milestones</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            STORM Deployment Roadmap
          </h1>

          <p className="text-sm sm:text-base text-[#9A9A9A] leading-relaxed">
            From synthetic stress-testing to co-pilot deployments with State Disaster Management Authorities across India.
          </p>
        </div>

        {/* Connected Horizontal / Vertical Timeline Visual */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical Connecting Line */}
          <div className="absolute top-0 bottom-0 left-6 sm:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#FF6B1A] via-amber-500 to-slate-800 pointer-events-none"></div>

          <div className="space-y-12 relative">
            {ROADMAP_TIMELINE.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div key={idx} className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                  
                  {/* Left Side (Odd items or empty spacer) */}
                  <div className={`w-full sm:w-[45%] pl-14 sm:pl-0 ${isEven ? 'sm:text-right' : 'sm:order-2'}`}>
                    <div className="p-6 rounded-2xl card-dark relative border-white/10 hover:border-[#FF6B1A]/50 transition-all shadow-xl group">
                      
                      <div className={`flex items-center gap-2 mb-3 ${isEven ? 'sm:justify-end' : 'sm:justify-start'}`}>
                        <span className="text-xs font-mono font-extrabold text-[#FF6B1A]">{item.phase}</span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                          item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          item.status === 'In Progress' ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/40 animate-pulse' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FF6B1A] transition-colors">
                        {item.title}
                      </h3>
                      <div className="text-xs font-mono text-slate-400 mb-3">{item.period}</div>

                      <p className="text-xs text-[#9A9A9A] leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Indicator */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#141414] border-2 border-[#FF6B1A] flex items-center justify-center text-[#FF6B1A] shadow-xl shadow-[#FF6B1A]/20 z-10">
                    <span className="text-xs font-mono font-bold text-white">{idx + 1}</span>
                  </div>

                  {/* Right Side Spacer for layout symmetry */}
                  <div className="hidden sm:block w-[45%]"></div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Closing Quote Banner */}
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-[#141414] border border-[#FF6B1A]/40 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#FF6B1A] mx-auto" />
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              "When the storm hits, STORM is already moving — with people still in the loop."
            </h3>
            <p className="text-xs text-[#9A9A9A]">
              Architected for SDMA, NDMA, and vetted relief NGO deployment across India.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
