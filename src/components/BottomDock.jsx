import React from 'react';
import { Map, Bell, ShieldAlert, Truck, FileText, LayoutDashboard } from 'lucide-react';

export default function BottomDock({ activeTab, setActiveTab }) {
  const dockItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'zones', label: 'Zones', icon: ShieldAlert },
    { id: 'resources', label: 'Resources', icon: Truck },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-[#141414]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-full shadow-2xl shadow-black/80 flex items-center gap-1 sm:gap-2">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6B1A] to-[#E8391A] text-white shadow-lg shadow-[#FF6B1A]/30 font-bold scale-[1.03]'
                  : 'text-[#9A9A9A] hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] sm:text-xs tracking-wide uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
