import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radio, Cpu, UserCheck, ShieldCheck, Send, 
  ArrowRight, CheckCircle2, XCircle, Clock, Zap, AlertTriangle, Layers 
} from 'lucide-react';

export default function HowItWorks() {
  const navigate = useNavigate();

  const pipelineSteps = [
    {
      step: "01",
      title: "SENSE",
      subtitle: "Multi-Source Continuous Ingestion",
      desc: "Aggregates IMD Doppler radar, NDMA Sachet APIs, ISRO satellite radar (SAR), and river water-level telemetry in sub-minute polling loops.",
      icon: Radio,
      color: "text-[#FF6B1A]"
    },
    {
      step: "02",
      title: "REASON",
      subtitle: "Spatial Constraint AI Scoring",
      desc: "LangChain spatial optimization algorithms analyze road access, flood contours, and nearest resource hubs to draft optimal dispatch packages.",
      icon: Cpu,
      color: "text-amber-400"
    },
    {
      step: "03",
      title: "HUMAN REVIEW",
      subtitle: "Mandatory Officer Authentication",
      desc: "Designated Relief Commissioner or District Collector reviews the pre-drafted order with full override control — 1-click Approve, Modify, or Reject.",
      icon: UserCheck,
      color: "text-emerald-400"
    },
    {
      step: "04",
      title: "ACT",
      subtitle: "Encrypted Dispatch Broadcast",
      desc: "Instant encrypted command dispatch transmitted to NDRF/SDRF commanders and warehouse logistics managers.",
      icon: Zap,
      color: "text-blue-400"
    },
    {
      step: "05",
      title: "COMMUNICATE",
      subtitle: "Localized Multi-Lingual Alerts",
      desc: "Pre-approved vernacular WhatsApp and cell-broadcast warnings transmitted directly to Sarpanches and localized community wards.",
      icon: Send,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      
      {/* Glow Arc */}
      <div className="hero-glow-arc"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Safety Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How STORM Works
          </h1>

          <p className="text-sm sm:text-base text-[#9A9A9A] leading-relaxed">
            AI-speed detection and planning, human-approved physical action. A seamless five-stage pipeline from sensor anomaly to verified relief on the ground.
          </p>
        </div>

        {/* 1. FIVE-STAGE PIPELINE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#FF6B1A]/50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-slate-500 group-hover:text-white transition-colors">
                      {step.step}
                    </span>
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-[#FF6B1A] transition-colors">
                    {step.title}
                  </h3>

                  <span className="text-[11px] font-semibold text-slate-300 block">
                    {step.subtitle}
                  </span>

                  <p className="text-xs text-[#9A9A9A] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                  Stage {idx + 1} of 5
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. DEDICATED PROMINENT CALLOUT: WHY HUMAN APPROVAL IS REQUIRED */}
        <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-2xl bg-[#141414] border-2 border-[#FF6B1A] shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B1A] to-[#E8391A] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[#FF6B1A]/30">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/30 text-xs font-mono font-bold uppercase tracking-wider">
                Non-Negotiable Safety Doctrine
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Why Human Approval Is Required Before Any Resource Moves
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            In high-stakes disaster response, an autonomous system hallucination or faulty telemetry reading could misroute lifeboats away from vulnerable citizens or send heavy supply trucks onto structurally compromised bridges.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <strong className="text-white block font-mono text-[11px] uppercase text-[#FF6B1A]">Legal & Operational Authority</strong>
              <p className="text-[#9A9A9A]">Physical relief deployment must adhere to the Disaster Management Act (2005) under District Magistrate command.</p>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <strong className="text-white block font-mono text-[11px] uppercase text-emerald-400">Contextual Verification</strong>
              <p className="text-[#9A9A9A]">Officers corroborate AI models with un-instrumented ground factors like local election assemblies or roadworks.</p>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <strong className="text-white block font-mono text-[11px] uppercase text-amber-400">Cryptographic Accountability</strong>
              <p className="text-[#9A9A9A]">Every authorization records an immutable officer credential signature in the state audit ledger.</p>
            </div>
          </div>
        </div>

        {/* 3. BEFORE / AFTER COMPARISON */}
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Response Velocity Transformation
            </h2>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              *Comparison figures reflect design targets based on Sikkim & Assam disaster post-mortems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Before Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-red-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-red-400 uppercase">Current Disaster Coordination Pipeline</span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                  4 - 18+ Hours
                </span>
              </div>

              <ul className="space-y-3 text-xs text-[#9A9A9A]">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Manual monitoring of 7+ isolated government department dashboards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Manual telephone escalation to find available boat unit or medical crew.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Handcrafted alert drafting causing delayed citizen evacuation warnings.</span>
                </li>
              </ul>
            </div>

            {/* After Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">STORM Decision Support Pipeline</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  ~30 - 60 Minutes
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Continuous unified ingestion of NDMA, IMD radar, and ISRO satellites.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Instant AI recommendation paired with nearest available warehouse stock.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>1-click Officer Approval instantly fires dispatch orders & multilingual alerts.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-56 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 rounded-full shadow-xl shadow-[#FF6B1A]/25 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Experience Live Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
