require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

process.on('uncaughtException', (err) => {
  console.error('Server Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Server Unhandled Rejection:', reason);
});

// Officer Authentication endpoint
app.post('/api/login', (req, res) => {
  const { officerId, password } = req.body;
  if (!officerId || !password) {
    return res.status(400).json({ error: 'Officer ID and password are required.' });
  }

  const officer = db.authenticateOfficer(officerId, password);
  if (officer) {
    db.addLog(`Officer ${officer.name} (${officer.id}) signed in to tactical session.`, 'system', officer.id, officer.name);
    broadcastState();
    return res.json({ success: true, officer });
  }
  return res.status(401).json({ error: 'Invalid Officer ID or Password.' });
});

// List officers for demo selection
app.get('/api/officers', (req, res) => {
  res.json(db.getOfficers());
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { zone, resource } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      const severity = Number(zone?.severity || 0);
      const population = Number(zone?.population || 0);
      const isCritical = severity >= 7;

      return res.json({
        id: 'DEMO-' + Date.now(),
        zone: zone?.name || zone?.id || 'Target Zone',
        action: isCritical
          ? `Deploy ${resource?.name || 'a relief unit'} for immediate response and evacuation support`
          : `Stage ${resource?.name || 'a relief unit'} near the zone for rapid response`,
        etaAI: isCritical ? '38 mins' : '52 mins',
        etaManual: isCritical ? '4-6 hrs' : '3 hrs',
        confidence: isCritical ? 88 : 82,
        resourceNeeded: resource?.name || 'Standard Relief Unit',
        keyFactors: [
          `${population.toLocaleString()} people in the affected zone`,
          `${severity}/10 severity assessment`
        ],
        demoFallback: true
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are a Disaster Coordination AI.
Input Zone: ${JSON.stringify(zone)}
Available Resource: ${JSON.stringify(resource)}

Generate a dispatch recommendation based on the severity, population, and resource status.
Return ONLY a valid JSON object matching exactly this structure:
{
  "action": "Brief description of dispatch action (e.g., Deploy 2 units to Sector X)",
  "etaAI": "Estimated time string (e.g., '15 mins')",
  "etaManual": "Estimated manual time string (e.g., '2 hrs')",
  "confidence": <integer between 80 and 99>,
  "resourceNeeded": "${resource?.name || 'Standard Relief Unit'}",
  "keyFactors": ["factor 1", "factor 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultJson = JSON.parse(response.text);
    resultJson.id = 'AI-' + Date.now();
    resultJson.zone = zone?.name || zone?.id || 'Target Zone';
    
    res.json(resultJson);
  } catch (err) {
    console.error('AI Analysis Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for demo
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

function broadcastState() {
  io.emit('storm_state_update', {
    zones: db.getZones(),
    pendingRecommendations: db.getPendingRecommendations(),
    approvedRecommendations: db.getApprovedRecommendations(),
    activityLog: db.getActivityLog(),
    resources: db.getResources()
  });
}

// Fetch Disaster Feeds and generate recommendations
async function fetchDisasterFeeds() {
  try {
    const response = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', {
      timeout: 5000
    });
    let events = response.data.features || [];
    
    // Filter strictly for India
    events = events.filter(e => e.properties.place && e.properties.place.toLowerCase().includes('india'));

    if (events.length > 0) {
      const currentPending = db.getPendingRecommendations();
      const currentApproved = db.getApprovedRecommendations();
      const newZones = [];
      const newRecs = [];

      events.slice(0, 10).forEach((event) => {
        const props = event.properties;
        const zoneName = `${props.place}`;
        const magnitude = props.mag;
        
        let severity = 3;
        if (magnitude >= 6.0) severity = 10;
        else if (magnitude >= 4.5) severity = 7;
        else if (magnitude >= 3.0) severity = 5;

        newZones.push({
          id: event.id,
          name: zoneName,
          type: 'Earthquake',
          severity: severity,
          population: Math.floor(Math.random() * 500000) + 10000,
          activeIncidents: 1,
          status: severity > 7 ? 'critical' : 'warning',
          coordinates: event.geometry?.coordinates ? [event.geometry.coordinates[1], event.geometry.coordinates[0]] : null
        });

        const recId = `REC-${event.id}`;
        const isAlreadyPending = currentPending.some(r => r.id === recId);
        const isAlreadyApproved = currentApproved.some(r => r.id === recId);

        if (severity >= 7 && !isAlreadyPending && !isAlreadyApproved) {
          newRecs.push({
            id: recId,
            zone: zoneName,
            action: `Magnitude ${magnitude} EQ Response & Evacuation`,
            confidence: Math.floor(85 + Math.random() * 15),
            etaAI: '10 mins',
            etaManual: '3 hrs',
            resourceNeeded: 'NDRF Battalion, Search & Rescue',
            status: 'pending'
          });
          db.addLog(`AI detected critical anomaly in ${zoneName}. Recommendation generated.`, 'alert', 'SYSTEM', 'STORM AI');
        }
      });

      if (newZones.length > 0) {
        db.saveZones(newZones);
      }

      if (newRecs.length > 0) {
        db.addRecommendations(newRecs);
      }

      broadcastState();
    }
  } catch (error) {
    console.error('Error fetching disaster feeds:', error.message);
  }
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send initial state upon connection
  socket.emit('storm_state_update', {
    zones: db.getZones(),
    pendingRecommendations: db.getPendingRecommendations(),
    approvedRecommendations: db.getApprovedRecommendations(),
    activityLog: db.getActivityLog(),
    resources: db.getResources()
  });

  socket.on('approve_recommendation', (rec) => {
    const officerInfo = (rec.officerId || rec.officerName)
      ? { id: rec.officerId, name: rec.officerName, rank: rec.rank }
      : null;

    db.approveRecommendation(rec, officerInfo);
    
    const officerLabel = officerInfo?.name 
      ? `Officer ${officerInfo.name} (${officerInfo.id || 'Command'})` 
      : 'Officer';
    
    db.addLog(`${officerLabel} approved dispatch for ${rec.zone || 'designated sector'}.`, 'approval', officerInfo?.id, officerInfo?.name);
    
    broadcastState();
  });

  socket.on('reject_recommendation', (recId) => {
    const id = typeof recId === 'object' ? (recId.id || recId.recommendationId) : recId;
    db.rejectRecommendation(id);
    db.addLog(`Officer rejected AI recommendation (ID: ${id}).`, 'system');
    broadcastState();
  });

  socket.on('bind_resource', (payload) => {
    const { resourceId, targetZoneId, targetZoneName, officerId, officerName } = payload;
    const updated = db.bindResource(resourceId, targetZoneId, targetZoneName);
    if (updated) {
      const officerLabel = officerName ? ` by ${officerName}` : '';
      db.addLog(`Resource ${updated.name} deployed to ${updated.assignedZone}${officerLabel}.`, 'system', officerId, officerName);
      broadcastState();
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Refresh feed periodically
setInterval(fetchDisasterFeeds, 30000);
fetchDisasterFeeds(); // Initial fetch

server.listen(PORT, () => {
  console.log(`STORM Real-time Backend running on port ${PORT}`);
});
