import React from 'react';
import { ShieldCheck, ArrowRight, UserCheck, Activity, AlertTriangle, ChevronDown } from 'lucide-react';

export default function Hero({ onRequestPilot }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF6B1A]/10 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Positioning Banner Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel-orange border border-[#FF6B1A]/40 text-xs sm:text-sm font-semibold text-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/10 animate-float">
            <UserCheck className="w-4 h-4 text-[#FF6B1A]" />
            <span>AI-Speed Detection & Planning • Human-Approved Action</span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            When coordination fails,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] via-amber-500 to-orange-400">
              people die.
            </span>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            India faces <strong className="text-white font-semibold">400+ natural disasters every year</strong>. 
            The real killer is not the disaster itself — it is the <span className="text-amber-400 underline underline-offset-4 decoration-[#FF6B1A]/40">18+ hour coordination gap</span> after the strike before physical relief teams are authorized to move.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#architecture"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 text-base font-bold text-white bg-gradient-to-r from-[#FF6B1A] to-amber-600 rounded-xl shadow-xl shadow-[#FF6B1A]/30 hover:shadow-[#FF6B1A]/50 hover:scale-[1.02] transition-all cursor-pointer"
            >
              See how it works
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>

            <button
              onClick={onRequestPilot}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer"
            >
              Request a Pilot
            </button>
          </div>
        </div>

        {/* Hero Visual Card - Positioning Guardrail Callout */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B1A]/10 rounded-bl-full pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Stat 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">400+</div>
                  <div className="text-xs text-slate-400 font-medium">Disasters / Year in India</div>
                  <div className="text-[11px] text-slate-500 mt-1">Floods, cyclones, landslides</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-3 rounded-lg bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/20">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">~30-60 Min</div>
                  <div className="text-xs text-slate-400 font-medium">Target Recommendation Time</div>
                  <div className="text-[11px] text-slate-500 mt-1">Design goal pending validation</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Human Officer Sign-off</div>
                  <div className="text-[11px] text-slate-500 mt-1">Zero unapproved dispatches</div>
                </div>
              </div>

            </div>

            {/* Guardrail Disclaimer Banner */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B1A]"></span>
                <strong>STORM Decision Support Framework:</strong> AI detects anomalies & drafts plans. SDMA/NDMA officers retain 100% final authorization.
              </span>
              <span className="text-slate-500 font-mono text-[11px]">V1.0 Decision Architecture</span>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 text-center flex justify-center">
          <a href="#problem" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-[#FF6B1A] transition-colors">
            <span>Explore the Coordination Gap</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#FF6B1A]" />
          </a>
        </div>

      </div>
    </section>
  );
}
