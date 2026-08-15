import React from 'react';
import { X, ShieldCheck, Lock, FileText } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 sm:p-8 border border-slate-700 relative max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FF6B1A]/10 text-[#FF6B1A] border border-[#FF6B1A]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Privacy & Governance Policy</h3>
              <p className="text-xs text-slate-400">STORM Platform Data Handling Guidelines</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#FF6B1A]" />
              1. Institutional Scope & Data Authorization
            </h4>
            <p>
              STORM is designed strictly for decision-support deployment by State Disaster Management Authorities (SDMAs), National Disaster Management Authority (NDMA), and verified emergency response partners. STORM does not harvest or retain unverified citizen PII.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#FF6B1A]" />
              2. Data Ingestion & Satellite Streams
            </h4>
            <p>
              All environmental telemetry, weather radar feeds, river gauge heights, and satellite radar imagery ingested by STORM originate from authorized government APIs (IMD, CWC, ISRO Bhuvan, NDMA Sachet) or verified public distress signals.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              3. Cryptographic Decision Audit Logs
            </h4>
            <p>
              Every human officer action (Approve, Modify, or Reject) is logged with immutable cryptographic timestamps, officer ID credentials, and modification rationale for governance oversight.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#FF6B1A] hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Close Policy Window
          </button>
        </div>

      </div>
    </div>
  );
}
