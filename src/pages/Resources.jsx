import React from 'react';
import { resources } from '../data/mockData';
import { 
  Truck, ShieldAlert, HeartPulse, LifeBuoy, Package, 
  MapPin, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';

export default function Resources() {
  const totalResources = resources.length;
  const availableCount = resources.filter(r => r.status === 'available').length;
  const deployedCount = resources.filter(r => r.status === 'deployed').length;

  const getResourceIcon = (type) => {
    switch (type) {
      case 'medical': return HeartPulse;
      case 'rescue': return LifeBuoy;
      case 'supplies': return Package;
      default: return Truck;
    }
  };

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      
      {/* Radial Arc Glow */}
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">
            <Truck className="w-3.5 h-3.5" />
            <span>State Inventory & Asset Tracker</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Relief Resource Logistics
          </h1>

          <p className="text-sm sm:text-base text-[#9A9A9A] leading-relaxed">
            Real-time readiness and deployment registry across medical personnel, NDRF water rescue battalions, and emergency ration stockpiles.
          </p>
        </div>

        {/* Top Summary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Total Registered Assets</span>
            <div className="text-3xl font-black text-white">{totalResources}</div>
            <span className="text-[11px] text-slate-400">Tracked Across Sikkim & Bengal Sector</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Available for Dispatch</span>
            <div className="text-3xl font-black text-emerald-400">{availableCount}</div>
            <span className="text-[11px] text-emerald-400 font-medium">Ready at Base Stations</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Active Deployments</span>
            <div className="text-3xl font-black text-[#FF6B1A]">{deployedCount}</div>
            <span className="text-[11px] text-[#FF6B1A] font-medium">Currently in Field Operations</span>
          </div>

        </div>

        {/* Grid of Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {resources.map((item, idx) => {
            const Icon = getResourceIcon(item.type);
            const isAvailable = item.status === 'available';

            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#FF6B1A]/40 transition-all space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B1A]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <span className="text-xs font-mono uppercase text-[#9A9A9A]">{item.type} unit</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    isAvailable
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[#9A9A9A] flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      Station Location
                    </span>
                    <strong className="text-slate-200 block">{item.location}</strong>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#9A9A9A] block font-mono">
                      {item.quantity ? 'Stock Volume' : 'Assigned Target'}
                    </span>
                    <strong className="text-slate-200 block">
                      {item.quantity ? `${item.quantity.toLocaleString()} kits` : (item.assignedZone || 'None (Standby)')}
                    </strong>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
