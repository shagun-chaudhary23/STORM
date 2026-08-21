import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, UserCheck, CheckCircle2, XCircle, Clock, 
  Layers, Truck, ArrowRight, Radio, Bell, RefreshCw, AlertTriangle, Download, Sparkles, KeyRound
} from 'lucide-react';

export default function Dashboard() {
  const { 
    activeOfficer, 
    openLoginModal,
    zones: activeZones,
    pendingRecommendations: pendingRecs,
    approvedRecommendations: approvedRecs,
    activityLog: liveActivityLog,
    resources: liveResources,
    fieldReports,
    isDisconnected,
    inAppAlert,
    dismissInAppAlert,
    approveRecommendation,
    rejectRecommendation,
    refreshState
  } = useApp();

  const activeZonesCount = activeZones.length;
  const availableResourcesCount = liveResources.filter(r => r.status === 'available').length;

  const handleApprove = (rec) => {
    approveRecommendation(rec);
  };

  const handleReject = (recId) => {
    rejectRecommendation(recId);
  };

  const handleExportCSV = () => {
    if (!liveActivityLog || liveActivityLog.length === 0) {
      alert("No activity log items available to export.");
      return;
    }

    const headers = ["Time", "Type", "Event", "Officer ID", "Officer Name", "Timestamp"];
    const rows = liveActivityLog.map(log => [
      `"${log.time || ''}"`,
      `"${log.type || ''}"`,
      `"${(log.event || '').replace(/"/g, '""')}"`,
      `"${log.officerId || ''}"`,
      `"${log.officerName || ''}"`,
      `"${log.timestamp || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `storm_activity_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 pt-24 pb-12">
      
      {/* Critical In-App Alert Banner */}
      {inAppAlert && inAppAlert.type === 'CRITICAL_ZONE_ALERT' && (
        <div className="bg-red-600 text-white font-mono text-xs px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-red-400 sticky top-16 z-50 shadow-2xl gap-2">
          <div className="flex items-start gap-2 max-w-5xl">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-300 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider bg-red-800 px-1.5 py-0.5 rounded text-[10px]">[CRITICAL SENTRY ALERT]</span>
                <span className="font-bold">{inAppAlert.zoneName} reached Severity {inAppAlert.severity}/10 ({inAppAlert.disasterType})</span>
              </div>
              {inAppAlert.actionPlan && (
                <div className="text-[11px] text-red-100 mt-1.5 whitespace-pre-line font-sans bg-red-700/60 p-2 rounded border border-red-500/40">
                  <span className="font-bold text-yellow-300">🚨 IMMEDIATE ACTION PROTOCOL:</span>
                  <div className="mt-0.5 font-mono">{inAppAlert.actionPlan}</div>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={dismissInAppAlert}
            className="text-white hover:text-red-200 text-xs font-bold underline cursor-pointer self-end md:self-center"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Disconnection Alert Banner */}
      {isDisconnected && (
        <div className="bg-red-500/90 text-white font-mono text-xs px-4 py-2.5 text-center flex items-center justify-center gap-2 border-b border-red-400/30 sticky top-16 z-40 animate-pulse shadow-lg">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span className="font-bold">Disconnected from server — retrying…</span>
        </div>
      )}

      {/* Persistent Demo View Top Banner */}
      <div className="bg-[#141414] border-b border-white/10 px-4 py-2.5 text-center text-xs font-mono flex items-center justify-between text-[#9A9A9A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-white font-bold">STORM TACTICAL CONSOLE</span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="hidden sm:inline-block">District Command Mode</span>
        </div>

        <div className="flex items-center gap-2">
          {activeOfficer ? (
            <span className="text-[10px] text-emerald-400 font-mono">Officer: <strong>{activeOfficer.name}</strong></span>
          ) : (
            <button 
              onClick={openLoginModal}
              className="text-[10px] text-amber-400 underline font-mono cursor-pointer"
            >
              Sign In
            </button>
          )}
          <span className="px-3 py-0.5 rounded-full bg-[#FF6B1A]/15 border border-[#FF6B1A]/30 text-[#FF6B1A] font-bold text-[10px] uppercase tracking-wider">
            Live Telemetry Engine
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Disaster Coordinator Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#9A9A9A] mt-1">
              Active Session: SDMA North-East Command Hub • Human Sign-Off Gate Active
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-semibold text-emerald-400">
            <UserCheck className="w-4 h-4 text-[#FF6B1A]" />
            <span>Human Review Required for Dispatch</span>
          </div>
        </div>

        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Active Zones</span>
            <div className="text-3xl font-black text-white">{activeZonesCount}</div>
            <span className="text-[11px] text-red-400 font-medium">Live Telemetry Feeds</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Pending Approvals</span>
            <div className="text-3xl font-black text-amber-400">{pendingRecs.length}</div>
            <span className="text-[11px] text-amber-400 font-medium">Awaiting Officer Sign-Off</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Resources Available</span>
            <div className="text-3xl font-black text-emerald-400">{availableResourcesCount}</div>
            <span className="text-[11px] text-slate-400 font-medium">Out of {liveResources.length} Total</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Avg Response Time</span>
            <div className="text-3xl font-black text-[#FF6B1A]">~38 min</div>
            <span className="text-[11px] text-slate-500 font-mono">vs 4-6 hrs Manual Baseline</span>
          </div>

        </div>

        {/* Main Content Layout: Recommendations (Left) vs Activity Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column: Pending & Approved Recommendations */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Pending AI Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#FF6B1A]" />
                  <h2 className="text-lg font-bold text-white">Pending AI Recommendations</h2>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30 font-bold">
                  {pendingRecs.length} Awaiting Action
                </span>
              </div>

              {pendingRecs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#141414] border border-white/10 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">All Pending Recommendations Processed</h3>
                  <p className="text-xs text-[#9A9A9A]">No unreviewed AI actions remaining in the queue.</p>
                </div>
              ) : (
                pendingRecs.map((rec) => (
                  <div 
                    key={rec.id}
                    className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#FF6B1A]/40 transition-all space-y-4 shadow-xl"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                          {rec.zone}
                        </span>
                        <span className="text-xs text-[#9A9A9A] font-mono">
                          Confidence: <strong className="text-white">{rec.confidence}%</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-400">AI ETA: <strong className="text-emerald-400">{rec.etaAI}</strong></span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-500">Manual ETA: <strong className="text-red-400">{rec.etaManual}</strong></span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white mb-1.5">{rec.action}</h3>
                      <p className="text-xs text-[#9A9A9A]">
                        Required Resources: <span className="text-slate-200 font-medium">{rec.resourceNeeded}</span>
                      </p>
                    </div>

                    {/* Action Buttons with Auth Guard */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleApprove(rec)}
                        title={!activeOfficer ? "Officer login required" : "Approve & Dispatch"}
                        className="w-48 py-2.5 px-4 bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#FF6B1A]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{activeOfficer ? 'Approve & Dispatch' : 'Login to Approve'}</span>
                      </button>

                      <button
                        onClick={() => handleReject(rec.id)}
                        title={!activeOfficer ? "Officer login required" : "Reject recommendation"}
                        className="w-36 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs rounded-full transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Edit / Reject</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recently Approved Section */}
            {approvedRecs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Recently Approved Dispatches</h2>
                </div>

                <div className="space-y-3">
                  {approvedRecs.map((rec) => (
                    <div 
                      key={rec.id}
                      className="p-5 rounded-2xl bg-[#141414]/60 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                            {rec.zone}
                          </span>
                          <span className="text-xs font-bold text-white">{rec.action}</span>
                        </div>
                        <p className="text-[11px] text-[#9A9A9A]">
                          Resource Assigned: {rec.resourceNeeded} • ETA: {rec.etaAI}
                          {rec.approvedBy && <span className="text-emerald-400 ml-2 font-mono">({rec.approvedBy})</span>}
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        DISPATCHED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar: Recent Activity Feed */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#FF6B1A]" />
                <h2 className="text-base font-bold text-white">Recent Activity Feed</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF6B1A]/40 text-[#9A9A9A] hover:text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
                  title="Download activity log as CSV file"
                >
                  <Download className="w-3 h-3 text-[#FF6B1A]" />
                  <span>CSV</span>
                </button>
                <span className="text-[10px] font-mono text-emerald-400 animate-pulse">LIVE</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4 max-h-[500px] overflow-y-auto">
              {liveActivityLog.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    log.type === 'alert' || log.type === 'critical_alert_sent' ? 'bg-red-500' :
                    log.type === 'approval' ? 'bg-emerald-400' :
                    log.type === 'deployment_response' ? 'bg-cyan-400' :
                    log.type === 'notification_sent' ? 'bg-purple-400' :
                    log.type === 'system' ? 'bg-amber-400' : 'bg-[#FF6B1A]'
                  }`}></div>
                  <div className="space-y-0.5 flex-1">
                    <p className="text-slate-200 leading-relaxed">{log.event}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                      <span>{log.time}</span>
                      {log.officerName && (
                        <span className="text-emerald-400 font-semibold">{log.officerName}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Data Feeds */}
            <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
              <span className="text-xs font-bold text-white block">Active Telemetry Ingestion</span>
              <div className="text-xs text-[#9A9A9A] space-y-2">
                <div className="flex justify-between items-center">
                  <span>USGS Real-Time Earthquake</span>
                  <span className="px-2 py-0.5 bg-emerald-950/50 text-emerald-400 font-mono text-[10px] rounded-md border border-emerald-500/30">Live Sync</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Open-Meteo Weather Streams</span>
                  <span className="px-2 py-0.5 bg-emerald-950/50 text-emerald-400 font-mono text-[10px] rounded-md border border-emerald-500/30">Live Sync</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>NDMA Sachet & ISRO Feeds</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-mono text-[10px] rounded-md border border-slate-700">Illustrative</span>
                </div>
              </div>
            </div>

            {/* Recent Field Reports Panel */}
            {fieldReports.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <h2 className="text-base font-bold text-white">Recent Field Reports</h2>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-amber-950/50 text-amber-400 border border-amber-500/30 rounded-md">
                    {fieldReports.length}
                  </span>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {fieldReports.slice(0, 5).map((report) => (
                    <div key={report.id} className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-white truncate pr-2">{report.location}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase flex-shrink-0 ${report.verified ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                          {report.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">"{report.description}"</p>
                      <div className="flex justify-between text-[9px] font-mono text-slate-500">
                        <span>{report.category}</span>
                        <span>{report.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
