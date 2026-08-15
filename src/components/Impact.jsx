import React from 'react';
import { BEFORE_AFTER_DATA } from '../data/stormData';
import { Clock, Zap, AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export default function Impact() {
  const { currentSystem, stormAssisted } = BEFORE_AFTER_DATA;

  return (
    <section id="impact" className="py-20 md:py-28 bg-[#0B101D] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-xs font-semibold text-[#FF6B1A]">
            <Clock className="w-3.5 h-3.5" />
            <span>Response Velocity Transformation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Impact & Before-After Comparison
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Compressing the critical time-to-recommendation from 6 hours to under 60 minutes — while maintaining 100% human sign-off.
          </p>
        </div>

        {/* Side by Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          
          {/* Current Manual System Card */}
          <div className="glass-panel p-8 rounded-2xl border border-red-500/20 relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">Baseline Status Quo</span>
                <h3 className="text-xl font-bold text-white mt-1">{currentSystem.name}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">Hazard Detection Latency:</span>
                <div className="text-2xl font-bold text-slate-300 font-mono">{currentSystem.detectionTime}</div>
              </div>

              <div>
                <span className="text-xs text-slate-400">Actionable Plan Generation:</span>
                <div className="text-3xl font-extrabold text-red-400 font-mono">{currentSystem.recommendationTime}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Manual PDF generation & phone calls</div>
              </div>

              <div className="pt-2 space-y-2 text-xs text-slate-300 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Integration:</span>
                  <strong className="text-slate-300">{currentSystem.dataIntegration}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alert Dispatch:</span>
                  <strong className="text-slate-300">{currentSystem.alertMethod}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resource Risk:</span>
                  <strong className="text-red-400">{currentSystem.errorRate}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* STORM-Assisted System Card */}
          <div className="glass-panel-orange p-8 rounded-2xl border-2 border-[#FF6B1A] relative overflow-hidden space-y-6 shadow-2xl shadow-[#FF6B1A]/10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-[#FF6B1A] uppercase tracking-wider">STORM Decision Support</span>
                <h3 className="text-xl font-bold text-white mt-1">{stormAssisted.name}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FF6B1A] text-slate-950 shadow-md">
                <Zap className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">Hazard Detection Latency:</span>
                <div className="text-2xl font-bold text-amber-400 font-mono">{stormAssisted.detectionTime}</div>
              </div>

              <div>
                <span className="text-xs text-slate-400">Actionable AI Recommendation:</span>
                <div className="text-3xl font-extrabold text-[#FF6B1A] font-mono">{stormAssisted.recommendationTime}</div>
                <div className="text-[11px] text-amber-400 font-semibold mt-0.5">{stormAssisted.recommendationNote}</div>
              </div>

              <div className="pt-2 space-y-2 text-xs text-slate-200 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Integration:</span>
                  <strong className="text-white">{stormAssisted.dataIntegration}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alert Dispatch:</span>
                  <strong className="text-white">{stormAssisted.alertMethod}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Governance & Safety:</span>
                  <strong className="text-emerald-400">{stormAssisted.errorRate}</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer Banner (Strict positioning requirement) */}
        <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-center max-w-2xl mx-auto">
          <Info className="w-4 h-4 text-[#FF6B1A] flex-shrink-0" />
          <span>
            <strong>Performance Disclaimer:</strong> Figures are design targets pending state pilot validation. Physical dispatch speeds depend on local road infrastructure and officer response time.
          </span>
        </div>

      </div>
    </section>
  );
}
