export const zones = [
  { id: "Z-4B", name: "Zone 4B – South Sikkim", severity: 8.4, status: "critical", population: 12400, coordinates: [27.33, 88.62], activeIncidents: 3 },
  { id: "Z-2A", name: "Zone 2A – Kalimpong", severity: 6.1, status: "warning", population: 8200, coordinates: [27.06, 88.47], activeIncidents: 1 },
  { id: "Z-7C", name: "Zone 7C – Gangtok Rural", severity: 3.2, status: "stable", population: 15600, coordinates: [27.33, 88.61], activeIncidents: 0 },
  { id: "Z-1D", name: "Zone 1D – Mangan", severity: 7.5, status: "critical", population: 5100, coordinates: [27.51, 88.53], activeIncidents: 2 }
];

export const dataSources = [
  { name: "NDMA API", status: "live", lastSync: "12 sec ago", coverage: 96 },
  { name: "IMD Doppler Radar", status: "live", lastSync: "45 sec ago", coverage: 94 },
  { name: "ISRO Satellite Feed", status: "live", lastSync: "3 min ago", coverage: 88 },
  { name: "Social Signal Monitor", status: "delayed", lastSync: "14 min ago", coverage: 61 }
];

export const recommendations = [
  { id: 1, zone: "Z-4B", action: "Dispatch medical team + 200 relief kits", confidence: 91, resourceNeeded: "Medical Team Alpha, 2x Supply Trucks", etaManual: "4-6 hrs", etaAI: "38 min", status: "pending" },
  { id: 2, zone: "Z-1D", action: "Deploy 1 NDRF boat unit for evacuation support", confidence: 87, resourceNeeded: "NDRF Boat Unit 3", etaManual: "5+ hrs", etaAI: "45 min", status: "pending" },
  { id: 3, zone: "Z-2A", action: "Send early-warning WhatsApp alert to residents", confidence: 95, resourceNeeded: "Alert Broadcast System", etaManual: "2 hrs", etaAI: "4 min", status: "approved" }
];

export const resources = [
  { name: "Medical Team Alpha", type: "medical", status: "available", location: "Gangtok Base", assignedZone: null },
  { name: "NDRF Boat Unit 3", type: "rescue", status: "available", location: "Teesta River Post", assignedZone: null },
  { name: "Relief Kit Stock", type: "supplies", quantity: 850, location: "Central Warehouse", status: "available" },
  { name: "Medical Team Beta", type: "medical", status: "deployed", location: "Zone 2A", assignedZone: "Z-2A" }
];

export const activityLog = [
  { time: "2 min ago", event: "AI flagged Zone 4B as critical (8.4/10)", type: "alert" },
  { time: "14 min ago", event: "Coordinator approved Zone 2A alert dispatch", type: "approval" },
  { time: "22 min ago", event: "NDMA feed synced — 4 zones updated", type: "system" },
  { time: "1 hr ago", event: "Field report submitted: Hauz Khas Village Entry, flooding observed", type: "report" }
];

export const fieldReports = [
  { id: 1, location: "Teesta Riverbank, Sector 3", category: "Flooding", severity: "AI-assessed: High", description: "Water level rising rapidly, two homes affected", timestamp: "18 min ago", verified: true },
  { id: 2, location: "Mangan Market Road", category: "Blocked Access", severity: "AI-assessed: Medium", description: "Landslide debris blocking main relief route", timestamp: "1 hr ago", verified: false }
];

export const SIKKIM_CASE_STUDY = {
  title: "South Lhonak Glacial Lake Outburst Flood — Sikkim, October 2023",
  quote: "The 18+ hour gap between the initial glacial lake outburst and coordinated relief dispatch cost lives that a faster decision pipeline could have saved. District teams lacked a unified operational picture.",
  impact: "40+ lives lost, 1,200+ displaced, NH-10 washed out for 3 weeks",
  citation: "NDMA Post-Event Assessment Report, Oct 2023 — South Lhonak GLOF, Sikkim"
};
