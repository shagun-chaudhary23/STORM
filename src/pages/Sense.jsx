import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { 
  Radio, MapPin, Layers, Filter, Calendar, 
  Activity, CheckCircle2, Clock, Satellite, Waves, ShieldAlert, AlertTriangle, Eye, Flame, CloudRain
} from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import senseData from '../../sense_data_2026-08-17.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const socket = io(API_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 5000
});

// Map Controller for interactive zoom-to-zone
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || 11, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

const LIVE_DATA_FEEDS = [
  {
    name: "USGS Real-Time Seismic Feed",
    type: "Real Integration",
    status: "live",
    coverage: 100,
    lastSync: "Every 30s",
    detail: "USGS geojson telemetry actively polled for Indian subcontinent anomalies."
  },
  {
    name: "Open-Meteo Weather Streams",
    type: "Real Integration",
    status: "live",
    coverage: 96,
    lastSync: "Every 30s",
    detail: "Live precipitation, extreme temperature, and wind speed monitoring across Indian metros."
  },
  {
    name: "NDMA Sachet Emergency Stream",
    type: "Illustrative — integration pending",
    status: "pending",
    coverage: 88,
    lastSync: "Mock sync (Pending gov clearance)",
    detail: "State disaster alerts and early warnings protocol bridge."
  },
  {
    name: "ISRO Bhuvan Inundation Radar",
    type: "Illustrative — integration pending",
    status: "pending",
    coverage: 82,
    lastSync: "Mock sync (Pending gov clearance)",
    detail: "Synthetic Aperture Radar water coverage rasterization."
  }
];

export default function Sense() {
  const [zones, setZones] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [mapZoom, setMapZoom] = useState(6);
  const [earthquakeGeoJSON, setEarthquakeGeoJSON] = useState(null);

  useEffect(() => {
    socket.on('storm_state_update', (data) => {
      if (data && data.zones && data.zones.length > 0) {
        setZones(data.zones);
        
        // Convert zones into GeoJSON features for the map
        const features = data.zones.map((z, idx) => {
          const lat = z.coordinates ? z.coordinates[0] : (20 + (idx * 2));
          const lng = z.coordinates ? z.coordinates[1] : (78 + (idx * 1.5));
          return {
            type: 'Feature',
            id: z.id || `zone-${idx}`,
            properties: {
              mag: z.severity ? (z.severity > 5 ? z.severity / 1.5 : z.severity) : 4.0,
              place: z.name,
              severity: z.severity,
              type: z.type
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            }
          };
        });
        setEarthquakeGeoJSON({ type: 'FeatureCollection', features });
      }
    });

    return () => {
      socket.off('storm_state_update');
    };
  }, []);

  useEffect(() => {
    if (zones.length > 0 && !selectedZone) {
      setSelectedZone(zones[0]);
      if (zones[0].coordinates) {
        setMapCenter(zones[0].coordinates);
      }
    }
  }, [zones, selectedZone]);

  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
    if (zone.coordinates && Array.isArray(zone.coordinates)) {
      setMapCenter(zone.coordinates);
      setMapZoom(10);
    }
  };

  const filteredZones = selectedRegion === 'All Regions' 
    ? zones 
    : zones.filter(z => z.name.includes(selectedRegion));

  return (
    <div className="relative pt-28 pb-20 overflow-hidden min-h-screen">
      
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
            Multi-sensor data aggregation integrating live USGS seismic telemetry, Open-Meteo multi-city weather streams, and field observer intake.
          </p>
        </div>

        {/* Top Filter Row */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#9A9A9A]">
              <Filter className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>FILTER SECTOR:</span>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                const zone = zones.find(z => z.name === e.target.value);
                if (zone) handleSelectZone(zone);
              }}
              className="bg-[#0A0A0A] border border-white/10 rounded-full px-4 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B1A] max-w-xs truncate"
            >
              <option value="All Regions">All Tracked Disaster Sectors ({zones.length})</option>
              {zones.map(z => (
                <option key={z.id} value={z.name}>{z.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9A9A9A]">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white">Temporal Window:</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-bold">
              Live Polling (30s Cycle)
            </span>
          </div>
        </div>

        {/* Main Grid: Visual Map View (Left) vs Detected Regions & Data Sources (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive Map View */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 relative overflow-hidden shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF6B1A]" />
                  <h2 className="text-base font-bold text-white">Spatial Inundation & Hazard Zones</h2>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">Telemetry Active • {zones.length} Live Anomalies</span>
              </div>

              {/* Live Map using Leaflet */}
              <div className="relative w-full h-80 sm:h-[440px] rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden">
                <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full z-0" zoomControl={true}>
                  <MapController center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  />
                  {senseData.ors && senseData.ors.features && (
                    <GeoJSON 
                      data={senseData.ors} 
                      pathOptions={{ fillColor: '#FF6B1A', color: '#FF6B1A', weight: 2, fillOpacity: 0.25 }} 
                    />
                  )}
                  {earthquakeGeoJSON && earthquakeGeoJSON.features && (
                    <GeoJSON
                      key={`eq-${earthquakeGeoJSON.features.length}-${mapCenter.join('-')}`}
                      data={earthquakeGeoJSON}
                      pointToLayer={(feature, latlng) => {
                        const sev = feature.properties?.severity || 5;
                        const isCritical = sev >= 8;
                        return L.circleMarker(latlng, {
                          radius: Math.max(sev * 2, 6),
                          fillColor: isCritical ? '#ef4444' : '#f59e0b',
                          color: isCritical ? '#991b1b' : '#b45309',
                          weight: 2,
                          opacity: 1,
                          fillOpacity: 0.85
                        }).bindPopup(`<b>${feature.properties?.place || 'Incident Zone'}</b><br/>Severity: ${sev}/10<br/>Type: ${feature.properties?.type || 'Disaster'}`);
                      }}
                    />
                  )}
                </MapContainer>
                
                <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#9A9A9A] bg-black/75 px-3 py-1 rounded-md border border-white/10 z-10 pointer-events-none shadow backdrop-blur">
                  Click any detected region on right to zoom & inspect
                </div>
              </div>

              {/* Active Zone Detail Card */}
              {selectedZone ? (
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#9A9A9A] block font-mono text-[10px]">INSPECTED ZONE</span>
                    <strong className="text-white text-sm truncate block">{selectedZone.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#9A9A9A] block font-mono text-[10px]">SEVERITY SCORE</span>
                    <span className={`font-mono font-bold text-sm ${
                      Number(selectedZone.severity) >= 8 ? 'text-red-400' :
                      Number(selectedZone.severity) >= 5 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedZone.severity} / 10 ({selectedZone.status?.toUpperCase() || 'ACTIVE'})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9A9A9A] block font-mono text-[10px]">EST. POPULATION</span>
                    <strong className="text-slate-200">{Number(selectedZone.population || 0).toLocaleString()} (est.)</strong>
                  </div>
                  <div>
                    <span className="text-[#9A9A9A] block font-mono text-[10px]">INCIDENT TYPE</span>
                    <strong className="text-[#FF6B1A] flex items-center gap-1">
                      {selectedZone.type || 'Earthquake'}
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-slate-400 font-mono">
                  Awaiting detected disaster telemetry...
                </div>
              )}

            </div>

          </div>

          {/* Right Column: 1. Detected Disaster Regions Panel (Task 5) & 2. Data Feeds */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PANEL 1: Detected Disaster Regions (Clickable) */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#FF6B1A]" />
                  <h2 className="text-base font-bold text-white">Detected Disaster Regions</h2>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#FF6B1A]/20 text-[#FF6B1A] border border-[#FF6B1A]/30 font-bold">
                  {filteredZones.length} Active
                </span>
              </div>

              <p className="text-[11px] text-[#9A9A9A]">
                Live detected emergency sectors requiring tactical oversight. Click any card to highlight and center on the map.
              </p>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {filteredZones.length > 0 ? (
                  filteredZones.map((zone) => {
                    const isSelected = selectedZone?.id === zone.id;
                    const isCritical = Number(zone.severity) >= 8;

                    return (
                      <div
                        key={zone.id}
                        onClick={() => handleSelectZone(zone)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF6B1A]/10 border-[#FF6B1A] shadow-md shadow-[#FF6B1A]/10'
                            : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#FF6B1A]' : 'text-slate-400'}`} />
                            <span className="text-xs font-bold text-white truncate">{zone.name}</span>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex-shrink-0 ${
                            isCritical ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          }`}>
                            Sev: {zone.severity}/10
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Type: <strong className="text-slate-200">{zone.type}</strong></span>
                          <span>Est. Pop: <strong className="text-slate-300">{Number(zone.population || 0).toLocaleString()}</strong></span>
                          <span className="text-emerald-400 font-semibold">{zone.activeIncidents || 1} Incidents</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 font-mono">
                    No disaster anomalies currently detected.
                  </div>
                )}
              </div>
            </div>

            {/* PANEL 2: Live Ingestion Feed Status */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">Ingestion Feed Architecture</h2>
                </div>
                <span className="text-xs font-mono text-[#9A9A9A]">2 Live • 2 Illustrative</span>
              </div>

              <div className="space-y-3">
                {LIVE_DATA_FEEDS.map((feed, idx) => (
                  <div key={idx} className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{feed.name}</strong>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                        feed.status === 'live' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {feed.status === 'live' ? 'Live Telemetry' : 'Illustrative (Pending)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{feed.detail}</p>
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
                      <span>Rate: {feed.lastSync}</span>
                      <span>Coverage: {feed.coverage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
