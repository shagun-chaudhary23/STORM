export const zones = [];

export const dataSources = [
  { name: "USGS Earthquake Feed", status: "live", lastSync: "Syncing...", coverage: 100 },
  { name: "Open-Meteo Extreme Weather", status: "live", lastSync: "Syncing...", coverage: 100 },
  { name: "GDACS Global Disaster Alert", status: "delayed", lastSync: "Syncing...", coverage: 85 }
];

export const recommendations = [];

export const resources = [
  { name: "Medical Team Alpha", type: "medical", status: "available", location: "Gangtok Base", assignedZone: null },
  { name: "NDRF Boat Unit 3", type: "rescue", status: "available", location: "Teesta River Post", assignedZone: null },
  { name: "Relief Kit Stock", type: "supplies", quantity: 850, location: "Central Warehouse", status: "available" },
  { name: "Medical Team Beta", type: "medical", status: "deployed", location: "Zone 2A", assignedZone: "Z-2A" }
];

export const activityLog = [];

export const fieldReports = [];

export const SIKKIM_CASE_STUDY = {
  title: "South Lhonak Glacial Lake Outburst Flood — Sikkim, October 2023",
  quote: "The 18+ hour gap between the initial glacial lake outburst and coordinated relief dispatch cost lives that a faster decision pipeline could have saved. District teams lacked a unified operational picture.",
  impact: "40+ lives lost, 1,200+ displaced, NH-10 washed out for 3 weeks",
  citation: "NDMA Post-Event Assessment Report, Oct 2023 — South Lhonak GLOF, Sikkim"
};
