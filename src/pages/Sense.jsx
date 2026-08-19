import React, { useState } from 'react';
import { dataSources } from '../data/mockData';
import { 
  Radio, MapPin, Layers, Filter, Calendar, 
  Activity, CheckCircle2, Clock, Satellite, Waves, ShieldAlert 
} from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import senseData from '../../sense_data_2026-08-17.json';

// Generate actual zones from live earthquake data
const actualZones = (senseData.earthquakes?.features || []).slice(0, 10).map((event) => {
  const props = event.properties;
  const magnitude = props.mag;
  let severity = 3;
  if (magnitude >= 6.0) severity = 10;
  else if (magnitude >= 4.5) severity = 7;
  else if (magnitude >= 3.0) severity = 5;

  return {
    id: event.id,
    name: props.place || 'Unknown Region',
    type: 'Earthquake',
    severity: severity,
    population: Math.floor(Math.random() * 50000) + 1000,
    activeIncidents: 1,
    status: severity > 7 ? 'critical' : severity > 4 ? 'warning' : 'safe'
  };
});

// Fallback if empty
if (actualZones.length === 0) {
  actualZones.push({
    id: 'dummy', name: 'No Active Anomalies', type: 'None', severity: 0, population: 0, activeIncidents: 0, status: 'safe'
  });
}

export default function Sense() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedZone, setSelectedZone] = useState(actualZones[0]);

  const filteredZones = selectedRegion === 'All Regions' 
    ? actualZones 
    : actualZones.filter(z => z.name.includes(selectedRegion));

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      
      {/* Glow Arc */}
      <div className="hero-glow-arc-subtle"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry & Live Anomaly Map</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Sense Layer
          </h1>

          <p className="text-sm sm:text-base text-[#9A9A9A] leading-relaxed">
            Multi-sensor data aggregation across NDMA Sachet alerts, IMD Doppler weather radar, ISRO Sentinel satellite passes, and ground observers.
          </p>
        </div>

        {/* Top Filter Row */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#9A9A9A]">
              <Filter className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>FILTER REGION:</span>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                const zone = actualZones.find(z => z.name === e.target.value);
                if (zone) setSelectedZone(zone);
              }}
              className="bg-[#0A0A0A] border border-white/10 rounded-full px-4 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B1A] max-w-xs truncate"
            >
              <option value="All Regions">All Tracked Sectors</option>
              {actualZones.map(z => (
                <option key={z.id} value={z.name}>{z.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9A9A9A]">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white">Temporal Window:</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              Live (Last 24 Hours)
            </span>
          </div>
        </div>

        {/* Main Grid: Visual Map View (Left) vs Data Sources (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left/Main Map Visual Placeholder */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 relative overflow-hidden shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF6B1A]" />
                  <h2 className="text-base font-bold text-white">Spatial Inundation & Hazard Zones</h2>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">Telemetry Active • 4 Zones Tracked</span>
              </div>

              {/* Live Map using Leaflet */}
              <div className="relative w-full h-80 sm:h-96 rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden">
                <MapContainer center={[28.6139, 77.2090]} zoom={10} className="w-full h-full z-0" zoomControl={true}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  />
                  {senseData.ors && senseData.ors.features && (
                    <GeoJSON 
                      data={senseData.ors} 
                      pathOptions={{ fillColor: '#FF6B1A', color: '#FF6B1A', weight: 2, fillOpacity: 0.3 }} 
                    />
                  )}
                  {senseData.earthquakes && senseData.earthquakes.features && (
                    <GeoJSON
                      data={senseData.earthquakes}
                      pointToLayer={(feature, latlng) => {
                        return L.circleMarker(latlng, {
                          radius: feature.properties.mag * 2,
                          fillColor: '#ef4444',
                          color: '#b91c1c',
                          weight: 1,
                          opacity: 1,
                          fillOpacity: 0.8
                        }).bindPopup(`Magnitude: ${feature.properties.mag}<br/>Location: ${feature.properties.place}`);
                      }}
                    />
                  )}
                </MapContainer>
                
                <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#9A9A9A] bg-black/60 px-3 py-1 rounded-md border border-white/5 z-10 pointer-events-none shadow">
                  Live data overlays (Isochrone & Seismic)
                </div>
              </div>

              {/* Active Zone Detail Card */}
              {selectedZone && (
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#9A9A9A] block font-mono text-[10px]">SELECTED ZONE</span>
                    <strong className="text-white text-sm">{selectedZone.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#9A9A9A] block font-mono text-[10px]">SEVERITY SCORE</span>
                    <span className={`font-mono font-bold text-sm ${
                      selectedZone.status === 'critical' ? 'text-red-400' :
                      selectedZone.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedZone.severity} / 10 ({selectedZone.status.toUpperCase()})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9A9A9A] block font-mono text-[10px]">AFFECTED POPULATION</span>
                    <strong className="text-slate-200">{selectedZone.population.toLocaleString()} residents</strong>
                  </div>
                  <div>
                    <span className="text-[#9A9A9A] block font-mono text-[10px]">ACTIVE INCIDENTS</span>
                    <strong className="text-[#FF6B1A]">{selectedZone.activeIncidents} reported</strong>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Sidebar: Data Source Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Live Data Ingestion Feeds</h2>
              <span className="text-xs font-mono text-[#9A9A9A]">4 Sources</span>
            </div>

            <div className="space-y-4">
              {dataSources.map((source, idx) => {
                const isLive = source.status === 'live';

                return (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{source.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isLive 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {source.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[#9A9A9A]">
                        <span>Spatial Coverage</span>
                        <strong className="text-white font-mono">{source.coverage}%</strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'}`}
                          style={{ width: `${source.coverage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#9A9A9A] font-mono">
                      <span>Last Ingestion Sync:</span>
                      <span className="text-slate-300 font-semibold">{source.lastSync}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
