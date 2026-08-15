export const SIKKIM_CASE_STUDY = {
  title: "South Sikkim Glacial Lake Outburst Flood (Oct 2023)",
  citation: "South Lhonak Lake GLOF Event, Sikkim, India — October 4, 2023",
  impact: "Teesta Dam breached; 100+ lives lost/missing; 14+ bridges destroyed across river basin.",
  delayHours: "18+ Hours",
  quote: "Satellite detection occurred hours prior, but multi-tier manual calls, departmental siloes, and paper memos delayed down-river evacuation authorization until floodwaters had already crested.",
  stormDifference: "With STORM, multi-source anomaly detection flags lake expansion within minutes, pre-drafts downstream flood zone alerts, and routes one-click decision cards to the District Magistrate in ~30-60 minutes."
};

export const PROBLEM_CARDS = [
  {
    id: "coordinators",
    title: "Overwhelmed Coordinators",
    stat: "500+ Alerts / Hr",
    description: "During a flood or cyclone, officers receive hundreds of unverified WhatsApp messages, phone calls, and paper memos per hour. Critical signals get lost in noise."
  },
  {
    id: "fragmented",
    title: "Fragmented Data",
    stat: "7+ Isolated Silos",
    description: "IMD Doppler radar, CWC river meters, ISRO satellite feeds, and municipal logs operate in isolated departmental portals with no single operational picture."
  },
  {
    id: "delayed",
    title: "Delayed Alerts",
    stat: "4 - 18+ Hrs Latency",
    description: "Drafting evacuation orders and matching NDRF boat inventory manually takes hours. By the time dispatches are signed, communities are already submerged."
  }
];

export const SENSE_DATA_SOURCES = [
  {
    id: "ndma-api",
    title: "NDMA Sachet Emergency API",
    category: "Government Feed",
    icon: "ShieldAlert",
    description: "Real-time connection to National Disaster Management Authority emergency alert feeds and disaster severity categorizations."
  },
  {
    id: "imd-weather",
    title: "IMD Doppler Weather Radar",
    category: "Meteorological",
    icon: "CloudRain",
    description: "Live precipitation intensity, cyclone track prediction, and cloud-burst monitoring from Indian Meteorological Department stations."
  },
  {
    id: "satellite",
    title: "ISRO Bhuvan & Sentinel Radar",
    category: "Remote Sensing",
    icon: "Satellite",
    description: "Sentinel-1/2 synthetic aperture radar imagery for instant surface water inundation mapping and landslide scar detection."
  },
  {
    id: "cwc-gauges",
    title: "CWC River Hydro-meters",
    category: "Hydrological",
    icon: "Waves",
    description: "Central Water Commission telemetry tracking river level rise rates, reservoir discharge volumes, and embankment overflow risks."
  },
  {
    id: "social-signals",
    title: "Verified Ground Observer Feeds",
    category: "Crowdsourced NLP",
    icon: "MessageSquare",
    description: "NLP filter pipeline parsing geotagged distress reports from Gram Sevaks, Aapda Mitra volunteers, and local field officers."
  }
];

export const MOCK_ZONE_SCORES = [
  {
    gpName: "Silchar Ward 4 & Sonai Block",
    district: "Cachar, Assam",
    riverBasin: "Barak River",
    riskScore: 89,
    status: "CRITICAL",
    popDensity: "4,200 / sq km",
    keyVulnerability: "Tehsildar embankment leak reported",
    aiRecommendation: "Pre-position 3 NDRF Teams & 5,000 Ration Kits at Silchar Hub"
  },
  {
    gpName: "Rajnagar Coastal Wards",
    district: "Kendrapara, Odisha",
    riverBasin: "Brahmani Estuary",
    riskScore: 76,
    status: "HIGH",
    popDensity: "1,850 / sq km",
    keyVulnerability: "1.5m storm surge prediction",
    aiRecommendation: "Dispatch 2 SDRF Inflatable Boats & Open 12 Shelters"
  },
  {
    gpName: "Chungthang Basin Wards",
    district: "Mangan, Sikkim",
    riverBasin: "Teesta River",
    riskScore: 68,
    status: "ELEVATED",
    popDensity: "620 / sq km",
    keyVulnerability: "Glacial lake water level rise +4.2m",
    aiRecommendation: "Issue Pre-Evacuation Warning to Wards 1 through 5"
  },
  {
    gpName: "Munsiari Landslide Belt",
    district: "Pithoragarh, Uttarakhand",
    riverBasin: "Gori Ganga",
    riskScore: 54,
    status: "MODERATE",
    popDensity: "310 / sq km",
    keyVulnerability: "Continuous 120mm/hr rainfall",
    aiRecommendation: "Standby 1 SDRF Hill Rescue Unit at Dharchula"
  }
];

export const ROADMAP_TIMELINE = [
  {
    phase: "Phase 01",
    title: "Prototype & Simulation",
    status: "Completed",
    period: "Q1 2026",
    details: "LangChain zone-scoring model trained on historical Sikkim & Assam flood telemetry. Synthetic disaster stress-testing completed."
  },
  {
    phase: "Phase 02",
    title: "Live Data Integration",
    status: "In Progress",
    period: "Q2 2026",
    details: "Connecting live NDMA Sachet APIs, IMD radar streams, and ISRO Bhuvan satellite image connectors into unified ingestion pipeline."
  },
  {
    phase: "Phase 03",
    title: "State SDMA Pilot",
    status: "Targeted",
    period: "Q3 - Q4 2026",
    details: "Co-pilot deployment with Assam SDMA / Odisha SDMA across 3 flood-vulnerable riverine and coastal districts."
  },
  {
    phase: "Phase 04",
    title: "National Rollout",
    status: "Planned",
    period: "2027+",
    details: "Scaling multi-state operational dashboard to NDMA core emergency control rooms and vetted NGO response networks."
  }
];

export const DASHBOARD_STATS = [
  { label: "Active Anomaly Feeds", value: "14 Live", note: "NDMA, IMD, ISRO", color: "text-amber-400" },
  { label: "High Risk Wards", value: "6 Wards", note: "Score > 75/100", color: "text-[#FF6B1A]" },
  { label: "Pending Approvals", value: "2 Orders", note: "Requires Officer Sign-off", color: "text-red-400" },
  { label: "Avg Recommendation Time", value: "~34 Min", note: "Target simulated metric", color: "text-emerald-400" }
];

export const MOCK_DISASTER_EVENTS = [
  {
    id: "evt-1",
    name: "Cachar District Flash Flood Warning",
    state: "Assam",
    severity: "CRITICAL",
    riskScore: 89,
    affectedWards: "14 Gram Panchayats along Barak River",
    aiRecommendation: {
      action: "Pre-position 3 NDRF Teams & 5,000 Food Rations at Silchar Hub",
      targetZone: "Silchar Ward 4, 8 & Sonai Block",
      alertDraft: "[EMERGENCY ALERT] Severe river rise predicted in Barak basin within 4 hrs. Move to designated high ground camps."
    }
  },
  {
    id: "evt-2",
    name: "Coastal Cyclone Surge Alert",
    state: "Odisha (Kendrapara)",
    severity: "HIGH",
    riskScore: 76,
    affectedWards: "Rajnagar & Mahakalapada blocks",
    aiRecommendation: {
      action: "Dispatch 2 SDRF Inflatable Craft & Activate 12 Evacuation Shelters",
      targetZone: "Kendrapara Coastal Belt",
      alertDraft: "[SDMA ADVISORY] Storm surge 1.5m expected near Rajnagar. Evacuation shelters OPEN."
    }
  }
];

