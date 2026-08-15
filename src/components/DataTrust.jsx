import React from 'react';
import { ShieldCheck, Database, FileCheck, Lock, AlertTriangle, Users, Server } from 'lucide-react';

export default function DataTrust() {
  const trustPillars = [
    {
      icon: Database,
      title: "Data Reliability & Degradation Handling",
      description: "When satellite radar or NDMA API feeds are delayed or incomplete, STORM automatically degrades confidence scores and triggers ground observer verification prompts via WhatsApp to local Gram Sevaks."
    },
    {
      icon: Lock,
      title: "100% Human Sign-off Accountability",
      description: "No physical asset (ambulance, NDRF boat, or supply truck) can be dispatched automatically. Dual-key or single authenticated officer sign-off is cryptographically required for every operational order."
    },
    {
      icon: Users,
      title: "Vetted Institutional Governance",
      description: "Designed specifically for deployment within state disaster management authorities (SDMAs), NDMA core control rooms, and vetted NGO relief networks (NDRF / SDRF compatible)."
    }
  ];

  return (
    <section id="trust" className="py-20 md:py-28 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Governance & Reliability Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Built on Data Integrity & Trust
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            AI is only as good as its governance. STORM is engineered with fail-safes, confidence scoring, and strict human authorization gates.
          </p>
        </div>

        {/* 3 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4 hover:border-[#FF6B1A]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 flex items-center justify-center text-[#FF6B1A]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Fallback Protocol Details */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#FF6B1A] font-semibold text-sm">
                <Server className="w-4 h-4" />
                Graceful Degradation Protocol
              </div>
              <h4 className="text-lg font-bold text-white">What happens during telecom or API outages?</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                If live IMD Doppler or satellite links drop, STORM seamlessly switches to cached terrain elevation maps and SMS-based mesh reporting from district officers. AI confidence ratings dynamically drop to reflect partial data, forcing explicit officer verification before dispatches.
              </p>
            </div>

            <div className="flex-shrink-0 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">System Availability Target</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">99.9% Fail-Safe</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
