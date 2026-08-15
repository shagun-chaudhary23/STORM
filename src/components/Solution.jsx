import React from 'react';
import { Satellite, Cpu, FileCheck2, UserCheck, Send, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Lock } from 'lucide-react';
import { PIPELINE_STAGES } from '../data/stormData';

export default function Solution() {
  const getStageIcon = (iconName) => {
    switch (iconName) {
      case 'Satellite': return Satellite;
      case 'BrainCircuit': return Cpu;
      case 'FileCheck2': return FileCheck2;
      case 'UserCheck': return UserCheck;
      case 'Send': return Send;
      default: return ShieldCheck;
    }
  };

  return (
    <section id="solution" className="py-20 md:py-28 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-xs font-semibold text-[#FF6B1A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The STORM Architecture</span>
          </div>

          {/* Reframed Tagline */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            AI-Speed Detection and Planning.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] to-amber-500">
              Human-Approved Action.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            STORM automates the heavy data synthesis, zone scoring, and alert drafting so human officers can make life-saving decisions in minutes instead of hours.
          </p>
        </div>

        {/* 5-Stage Pipeline Visual */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            {PIPELINE_STAGES.map((stage, idx) => {
              const Icon = getStageIcon(stage.icon);
              const isHumanGate = stage.isHumanGate;

              return (
                <div
                  key={stage.id}
                  className={`rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 ${
                    isHumanGate
                      ? 'bg-gradient-to-b from-[#FF6B1A]/20 to-amber-950/40 border-2 border-[#FF6B1A] shadow-xl shadow-[#FF6B1A]/20 ring-1 ring-[#FF6B1A]/50 scale-[1.03] z-10'
                      : 'glass-panel border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Human Gate Tag */}
                  {isHumanGate && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF6B1A] text-black font-extrabold text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Mandatory Gate
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-extrabold ${isHumanGate ? 'text-[#FF6B1A]' : 'text-slate-400'}`}>
                        {stage.stageNumber}
                      </span>
                      <div className={`p-2 rounded-xl ${isHumanGate ? 'bg-[#FF6B1A] text-slate-950' : 'bg-slate-800/80 text-slate-300'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className={`text-base font-bold mb-1 ${isHumanGate ? 'text-white text-lg' : 'text-slate-200'}`}>
                      {stage.name}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#FF6B1A] mb-3">
                      {stage.tagline}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {stage.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block ${
                      isHumanGate ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/40 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isHumanGate ? '👤 Officer Sign-off' : '⚡ AI Automated'}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Breakdown: What AI Automates vs What Human Confirms */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-slate-800">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
            Clear Division of Responsibilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* What AI Automates */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">What STORM AI Automates</h4>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Real-time ingestion & cross-referencing of satellite radar, river meters, and weather feeds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Algorithmic risk zone scoring (1-100) per Gram Panchayat block.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Drafting localized multilingual emergency alert messages and evacuation recommendations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Computing optimal logistics routes around flooded transport arteries.</span>
                </li>
              </ul>
            </div>

            {/* What Human Confirms */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#FF6B1A]/10 to-slate-900/90 border border-[#FF6B1A]/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FF6B1A] text-slate-950">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white">What Human Officers Confirm</h4>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <span><strong>100% Final Authorization:</strong> Reviewing AI-ranked recommendations on a single tactical dashboard.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <span><strong>Modifying Parameters:</strong> Adjusting NDRF boat counts, supply truck targets, or alert phrasing in seconds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <span><strong>Executing Dispatch:</strong> Authenticating asset movement with 1-click officer credentials.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                  <span><strong>Full Accountability:</strong> Immutable cryptographic logging of officer decisions for governance audit trails.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
