import React, { useState } from 'react';
import { MOCK_DISASTER_EVENTS } from '../data/stormData';
import { AlertTriangle, CheckCircle, Edit3, Send, ShieldCheck, RefreshCw, Smartphone, Radio, UserCheck } from 'lucide-react';

export default function CoordinatorSimulator() {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [status, setStatus] = useState('review'); // 'review' | 'modifying' | 'approved' | 'rejected'
  const [customAction, setCustomAction] = useState('');
  const [dispatchedLogs, setDispatchedLogs] = useState([]);

  const currentEvent = MOCK_DISASTER_EVENTS[selectedEventIndex];

  const handleApprove = () => {
    setStatus('approved');
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      event: currentEvent.name,
      action: customAction || currentEvent.aiRecommendation.action,
      officer: "Officer S. Roy (SDMA Deputy Relief Commissioner)",
      status: "DISPATCHED via WhatsApp & Emergency Cell Broadcast"
    };
    setDispatchedLogs([newLog, ...dispatchedLogs]);
  };

  const handleReset = () => {
    setStatus('review');
    setCustomAction('');
  };

  return (
    <section id="simulator" className="py-20 md:py-28 bg-[#0B101D] border-t border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Coordinator Approval Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Test the Human-in-the-Loop Workflow
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Experience how a District Magistrate or SDMA Relief Commissioner reviews AI disaster recommendations and authorizes emergency dispatches.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Disaster Event Selection & AI Signal */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
              1. Simulated Live Signals
            </h3>

            {MOCK_DISASTER_EVENTS.map((event, idx) => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedEventIndex(idx);
                  handleReset();
                }}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  selectedEventIndex === idx
                    ? 'bg-slate-900 border-[#FF6B1A] ring-1 ring-[#FF6B1A]/40 shadow-lg'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    {event.severity}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Risk Index: <strong className="text-white">{event.riskScore}/100</strong></span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">{event.name}</h4>
                <div className="text-xs text-slate-400">{event.state} • {event.affectedWards}</div>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF6B1A]" />
                Guardrail Rule:
              </div>
              <p className="leading-relaxed">
                The AI system cannot trigger WhatsApp broadcasts or deploy trucks without the coordinator clicking <strong className="text-white">"Approve & Execute Dispatch"</strong> below.
              </p>
            </div>
          </div>

          {/* Right Panel: Coordinator Tactical Review Dashboard */}
          <div className="lg:col-span-8">
            <div className="glass-panel-orange rounded-2xl p-6 sm:p-8 border border-[#FF6B1A]/40 relative overflow-hidden shadow-2xl">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B1A] animate-ping"></span>
                    <span className="text-xs font-mono text-[#FF6B1A] font-bold uppercase tracking-wider">
                      SDMA Coordinator Dashboard
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{currentEvent.name}</h3>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#FF6B1A]" />
                  <span>Authenticated: <strong>Officer S. Roy</strong></span>
                </div>
              </div>

              {/* Event AI Recommendation Card */}
              <div className="py-6 space-y-5">
                
                {/* AI Draft Recommendation */}
                <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      AI Pre-Drafted Action Plan (Confidence: 94%)
                    </span>
                    <button
                      onClick={() => setStatus(status === 'modifying' ? 'review' : 'modifying')}
                      className="text-xs text-[#FF6B1A] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {status === 'modifying' ? 'Cancel Edit' : 'Modify Plan'}
                    </button>
                  </div>

                  {status === 'modifying' ? (
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Edit Proposed Dispatch Action:</label>
                      <textarea
                        value={customAction || currentEvent.aiRecommendation.action}
                        onChange={(e) => setCustomAction(e.target.value)}
                        className="w-full bg-slate-950 border border-[#FF6B1A] rounded-lg p-3 text-xs text-white focus:outline-none"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div className="text-base font-bold text-white bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      {customAction || currentEvent.aiRecommendation.action}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded bg-slate-950/40 border border-slate-800/60">
                      <span className="text-slate-400 block text-[11px]">Target Zones:</span>
                      <strong className="text-slate-200">{currentEvent.aiRecommendation.targetZone}</strong>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950/40 border border-slate-800/60">
                      <span className="text-slate-400 block text-[11px]">Automated Multilingual Draft:</span>
                      <span className="text-slate-300 italic text-[11px]">"{currentEvent.aiRecommendation.alertDraft}"</span>
                    </div>
                  </div>
                </div>

                {/* Status Decision Controls */}
                {status === 'approved' ? (
                  <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                      <CheckCircle className="w-5 h-5" />
                      Dispatch Order Approved & Transmitted!
                    </div>
                    <p className="text-xs text-slate-300">
                      Encrypted order sent to NDRF Battalion Commander and WhatsApp broadcast launched to 14 Gram Panchayat Sarpanches.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Test Another Event
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={handleApprove}
                      className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-[#FF6B1A] to-amber-600 hover:from-amber-600 hover:to-[#FF6B1A] text-white font-bold rounded-xl shadow-lg shadow-[#FF6B1A]/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <UserCheck className="w-5 h-5" />
                      Approve & Execute Dispatch
                    </button>

                    <button
                      onClick={() => setStatus('rejected')}
                      className="w-full sm:w-auto py-3.5 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                    >
                      Reject Plan
                    </button>
                  </div>
                )}

              </div>

              {/* Dispatch Audit Log */}
              {dispatchedLogs.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
                  <div className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Live Audit Trail ({dispatchedLogs.length} Executed)
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {dispatchedLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                        <div>
                          <span className="font-bold text-white">{log.event}</span> — <span className="text-slate-300">{log.action}</span>
                          <div className="text-[10px] text-slate-500 mt-0.5">Signed by {log.officer}</div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                          {log.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
