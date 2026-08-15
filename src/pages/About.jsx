import React, { useState } from 'react';
import { 
  Building, Users, ShieldCheck, Send, CheckCircle2, 
  MapPin, Flag, Compass, Clock, Lock, Sparkles 
} from 'lucide-react';

export default function About() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    role: 'SDMA Official / Officer',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const roadmapPhases = [
    {
      phase: "Phase 1",
      title: "Prototype & Architecture",
      status: "Completed",
      period: "Q1 - Q2 2024",
      desc: "Simulated multi-zone hydro-meter telemetry, LangChain constraint planner validation, and core governance gate design."
    },
    {
      phase: "Phase 2",
      title: "Live Data Integration",
      status: "In Progress",
      period: "Q3 - Q4 2024",
      desc: "Direct integration of IMD Doppler radar feeds, NDMA Sachet API connectors, and automated WhatsApp alert templating."
    },
    {
      phase: "Phase 3",
      title: "State Pilot Co-Deployment",
      status: "Upcoming",
      period: "Q1 - Q2 2025",
      desc: "Live district control room trials with partner SDMAs across Sikkim, Assam, and Odisha during pre-monsoon operations."
    },
    {
      phase: "Phase 4",
      title: "National Rollout",
      status: "Upcoming",
      period: "2025 - 2026",
      desc: "Multi-state federation, automated inter-agency resource handoffs with NDRF battalions and vetted NGO networks nationwide."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      
      {/* Glow Arc */}
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-20">
        
        {/* 1. MISSION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">
            <Building className="w-3.5 h-3.5" />
            <span>Mission & Target Deployments</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for India's Disaster Command Centers
          </h1>

          <p className="text-sm sm:text-base text-[#9A9A9A] leading-relaxed">
            STORM (Self-Triggered Operations for Real-time Relief Management) bridges the fatal 18+ hour coordination gap in disaster response through AI-assisted decision intelligence paired with strict officer-in-the-loop governance.
          </p>
        </div>

        {/* 2. WHO IT'S BUILT FOR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B1A]">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">State Disaster Management Authorities (SDMAs)</h3>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Provides State Relief Commissioners with unified spatial risk scores across all Gram Panchayats and automated NDRF dispatch drafting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">District Magistrates & Collectors</h3>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Delivers 1-click tactical decision cards to District Emergency Operation Centers (DEOCs) for high-ground evacuation orders.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Accredited NGO Relief Networks</h3>
            <p className="text-xs text-[#9A9A9A] leading-relaxed">
              Enables vetted relief agencies and Aapda Mitra volunteers to receive authenticated mission objectives without duplicate phone chains.
            </p>
          </div>
        </div>

        {/* 3. 4-PHASE ROADMAP CARDS */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF6B1A]">
              <Compass className="w-4 h-4" />
              <span>DEPLOYMENT TIMELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Platform Evolution Roadmap
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {roadmapPhases.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#FF6B1A]/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#FF6B1A]">{item.phase}</span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      item.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                      item.status === 'In Progress' ? 'bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/40 animate-pulse' :
                      'bg-white/5 text-[#9A9A9A] border border-white/10'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <span className="text-[11px] font-mono text-slate-400 block">{item.period}</span>
                  <p className="text-xs text-[#9A9A9A] leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                  Milestone 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CONTACT / PILOT FORM */}
        <div id="contact" className="max-w-3xl mx-auto p-8 rounded-2xl bg-[#141414] border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Inquire About State Co-Pilot Deployment</h2>
            <p className="text-xs text-[#9A9A9A]">
              Connect with the disaster intelligence engineering team to trial STORM in your district command room.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Pilot Inquiry Received</h3>
              <p className="text-xs text-slate-300">
                Thank you, <strong>{formData.name}</strong> ({formData.organization}). We will coordinate with your disaster response cell shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="w-40 py-2.5 bg-white/10 text-xs font-bold text-white rounded-full hover:bg-white/20 transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Officer Ramesh Roy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:border-[#FF6B1A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Organization / Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sikkim SDMA / NDRF 2nd Bn"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:border-[#FF6B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Role / Position</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#FF6B1A] focus:outline-none"
                >
                  <option value="SDMA Official / Officer">SDMA Official / Officer</option>
                  <option value="District Magistrate / Collector">District Magistrate / Collector</option>
                  <option value="NDRF / SDRF Commander">NDRF / SDRF Commander</option>
                  <option value="NGO Relief Director">NGO Relief Director</option>
                  <option value="Disaster Tech Researcher">Disaster Tech Researcher</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Message / Inundation Target Objectives</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail your operational zone requirements, radar feeds, or pilot questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:border-[#FF6B1A] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-48 py-3.5 px-6 bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 text-white font-extrabold uppercase tracking-wider text-xs rounded-full shadow-lg shadow-[#FF6B1A]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
