import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, Truck, CheckCircle2, XCircle, 
  X, ArrowRight, ShieldAlert, Sparkles, MapPin, Bell
} from 'lucide-react';

export default function GlobalNotificationToast() {
  const { inAppAlert, dismissInAppAlert, activeOfficer, activeTeamLeader } = useApp();
  const navigate = useNavigate();

  if (!inAppAlert) return null;

  const isCritical = inAppAlert.type === 'CRITICAL_ZONE_ALERT';
  const isDispatch = inAppAlert.type === 'DISPATCH_ORDER';
  const isCompleted = inAppAlert.type === 'MISSION_COMPLETED';

  const getBorderColor = () => {
    if (isCritical) return 'border-red-500/60 bg-red-950/90 text-red-100 shadow-red-500/20';
    if (isDispatch) return 'border-[#FF6B1A]/60 bg-[#18120e]/95 text-orange-100 shadow-[#FF6B1A]/20';
    if (isCompleted) return 'border-emerald-500/60 bg-emerald-950/95 text-emerald-100 shadow-emerald-500/20';
    return 'border-blue-500/60 bg-slate-900/95 text-white shadow-blue-500/20';
  };

  const getIcon = () => {
    if (isCritical) return <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce flex-shrink-0" />;
    if (isDispatch) return <Truck className="w-5 h-5 text-[#FF6B1A] animate-pulse flex-shrink-0" />;
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
    return <Bell className="w-5 h-5 text-blue-400 flex-shrink-0" />;
  };

  const handleActionClick = () => {
    dismissInAppAlert();
    if (isDispatch && activeTeamLeader) {
      navigate('/team-dashboard');
    } else if (isCompleted || isCritical) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-50 max-w-md w-[calc(100vw-24px)] animate-slide-down">
      <div className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all ${getBorderColor()}`}>
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-black/40 border border-white/10 mt-0.5">
            {getIcon()}
          </div>

          <div className="flex-grow space-y-1 pr-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/40 border border-white/10">
                {inAppAlert.title || (isCritical ? 'CRITICAL DISASTER PROTOCOL' : isDispatch ? 'DISPATCH ORDER' : 'MISSION UPDATE')}
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <p className="text-xs font-semibold leading-snug break-words">
              {inAppAlert.message || (
                isCritical 
                  ? `${inAppAlert.zoneName} reached Severity ${inAppAlert.severity}/10 (${inAppAlert.disasterType}). Immediate action: ${inAppAlert.actionPlan}`
                  : inAppAlert.taskSummary || 'Mission state updated.'
              )}
            </p>

            {inAppAlert.notes && (
              <p className="text-[11px] italic opacity-85 font-mono">
                Notes: "{inAppAlert.notes}"
              </p>
            )}

            <div className="pt-1.5 flex items-center gap-2">
              <button
                onClick={handleActionClick}
                className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={dismissInAppAlert}
                className="px-2.5 py-1 rounded-lg hover:bg-black/30 text-[10px] font-mono text-slate-300 transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={dismissInAppAlert}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-black/20 transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
