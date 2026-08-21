import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useApp } from '../context/AppContext';
import { 
  Truck, ShieldAlert, HeartPulse, LifeBuoy, Package, 
  MapPin, CheckCircle2, AlertCircle, RefreshCw, Filter, Navigation, KeyRound
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const socket = io(API_URL, {
  auth: { token: localStorage.getItem('storm_officer_token') },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 5000
});

export default function Resources() {
  const { activeOfficer, openLoginModal } = useApp();

  const [resources, setResources] = useState([]);
  const [liveZones, setLiveZones] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');

  useEffect(() => {
    socket.auth = { token: localStorage.getItem('storm_officer_token') };

    const handleStateUpdate = (data) => {
      if (data) {
        if (data.resources) {
          setResources(data.resources);
        }
        if (data.zones) {
          setLiveZones(data.zones);
        }
      }
    };

    socket.on('storm_state_update', handleStateUpdate);
    socket.on('auth_error', (data) => {
      alert(`Authorization Error: ${data.message || 'Action denied'}`);
      openLoginModal();
    });

    return () => {
      socket.off('storm_state_update', handleStateUpdate);
      socket.off('auth_error');
    };
  }, [openLoginModal]);

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

  const filteredResources = resources.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  const handleAssignClick = (resource) => {
    if (!activeOfficer) {
      openLoginModal();
      return;
    }
    setSelectedResource(resource);
    setSelectedZone(liveZones[0]?.id || '');
    setAssignmentModalOpen(true);
  };

  const confirmAssignment = (e) => {
    e.preventDefault();
    if (!selectedResource || !selectedZone) return;

    if (!activeOfficer) {
      setAssignmentModalOpen(false);
      openLoginModal();
      return;
    }

    const zoneObj = liveZones.find(z => z.id === selectedZone);
    const zoneName = zoneObj?.name || selectedZone;
    const token = localStorage.getItem('storm_officer_token');

    const payload = {
      resourceId: selectedResource.id,
      targetZoneId: selectedZone,
      targetZoneName: zoneName,
      taskSummary: `Deploy ${selectedResource.name} to ${zoneName}`,
      severity: zoneObj?.severity || 7,
      token: token
    };

    socket.emit('bind_resource', payload);

    setResources(resources.map(r => 
      (r.id === selectedResource.id || r.name === selectedResource.name)
        ? { ...r, status: 'deployed', assignedZone: zoneName }
        : r
    ));

    setAssignmentModalOpen(false);
    setSelectedResource(null);
  };

  return (
    <div className="relative pt-28 pb-20 overflow-hidden min-h-screen">
      
      {/* Radial Arc Glow */}
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">
            <Truck className="w-3.5 h-3.5" />
            <span>State Inventory & Command Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Resource Match & Deploy
          </h1>
          <p className="text-sm text-[#9A9A9A]">
            Select available assets and bind them directly to active incident zones with automated team lead briefing.
          </p>
        </div>

        {/* Top Summary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Total Registered Assets</span>
            <div className="text-3xl font-black text-white">{totalResources}</div>
            <span className="text-[11px] text-slate-400">Tracked Across Incident Bases</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-emerald-500/20 space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Available for Dispatch</span>
            <div className="text-3xl font-black text-emerald-400">{availableCount}</div>
            <span className="text-[11px] text-emerald-400 font-medium">Ready at Base Stations</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-[#FF6B1A]/20 space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Navigation className="w-16 h-16 text-[#FF6B1A]" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Active Deployments</span>
            <div className="text-3xl font-black text-[#FF6B1A]">{deployedCount}</div>
            <span className="text-[11px] text-[#FF6B1A] font-medium">Currently in Field Operations</span>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Left Column: Resources List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#141414] border border-white/10">
              <div className="flex items-center gap-2 text-[#9A9A9A]">
                <Filter className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Filter Assets</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
                >
                  <option value="all">All Types</option>
                  <option value="rescue">Rescue</option>
                  <option value="medical">Medical</option>
                  <option value="supplies">Supplies</option>
                </select>

                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B1A]"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="deployed">Deployed</option>
                </select>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((item) => {
                const Icon = getResourceIcon(item.type);
                const isAvailable = item.status === 'available';

                return (
                  <div 
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full ${
                      isAvailable ? 'bg-[#141414] border-white/10 hover:border-emerald-500/40' : 'bg-[#0A0A0A] border-white/5 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                            isAvailable ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{item.name}</h3>
                            <span className="text-[10px] font-mono uppercase text-[#9A9A9A]">{item.type} unit</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isAvailable
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-white/5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[#9A9A9A] font-mono flex items-center gap-1"><MapPin className="w-3 h-3"/> Base Station:</span>
                          <span className="text-slate-200">{item.location}</span>
                        </div>
                        {item.team_lead_name && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#9A9A9A] font-mono">Team Lead:</span>
                            <span className="text-slate-200 font-semibold">{item.team_lead_name}</span>
                          </div>
                        )}
                        {item.quantity && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#9A9A9A] font-mono">Volume:</span>
                            <span className="text-slate-200">{item.quantity.toLocaleString()} kits</span>
                          </div>
                        )}
                        {!isAvailable && item.assignedZone && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#9A9A9A] font-mono">Assigned Sector:</span>
                            <span className="text-[#FF6B1A] font-bold">{item.assignedZone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isAvailable && (
                      <button 
                        onClick={() => handleAssignClick(item)}
                        className="mt-5 w-full py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-xs font-bold text-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Navigation className="w-4 h-4" />
                        BIND & Deploy Asset
                      </button>
                    )}
                  </div>
                );
              })}
              
              {filteredResources.length === 0 && (
                <div className="col-span-1 md:col-span-2 p-10 text-center rounded-2xl border border-dashed border-white/10">
                  <span className="text-[#9A9A9A]">No resources found matching the criteria.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Incidents Overview */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-white/10 sticky top-28 space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h2 className="text-base font-bold text-white">Active Incident Zones</h2>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {liveZones.map(zone => (
                  <div key={zone.id} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-white truncate pr-2">{zone.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 text-[10px] font-mono font-bold flex-shrink-0">
                        Sev {zone.severity}/10
                      </span>
                    </div>
                    <div className="text-[10px] text-[#9A9A9A] font-mono flex justify-between">
                      <span>Est. Pop: {Number(zone.population || 0).toLocaleString()}</span>
                      <span className="text-emerald-400">{zone.type || 'Incident'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Assignment Modal */}
      {assignmentModalOpen && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <Navigation className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Deploy & Brief Field Unit</h2>
              <p className="text-xs text-[#9A9A9A]">
                You are deploying <strong className="text-emerald-400">{selectedResource.name}</strong>. Team Lead: <strong className="text-white">{selectedResource.team_lead_name || 'Unit Commander'}</strong>.
              </p>
            </div>

            <form onSubmit={confirmAssignment} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Target Incident Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {liveZones.map(z => (
                    <option key={z.id} value={z.id}>{z.name} (Severity: {z.severity}/10)</option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#9A9A9A] space-y-1">
                <div>Base Location: <span className="text-slate-200">{selectedResource.location}</span></div>
                <div>Team Lead Contact: <span className="text-emerald-400">{selectedResource.team_lead_phone || 'Radio Channel 4'}</span></div>
                <div className="text-[10px] text-amber-400 pt-1">
                  Automated SMS dispatch order with response link will be transmitted to team lead upon confirmation.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignmentModalOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-4 h-4" />
                  Authorize & BIND
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
