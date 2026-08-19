require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { zone, resource } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not set on the server.' });
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
  "resourceNeeded": "${resource.name}",
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
    resultJson.zone = zone.id;
    
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

const PORT = 3001;

// Internal state to keep track of processed recommendations
let pendingRecommendations = [];
let approvedRecommendations = [];
let activeZones = [];
let activityLog = [];

function addLog(event, type) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  activityLog.unshift({ event, time, type });
  if (activityLog.length > 50) activityLog.pop();
}

addLog('STORM Backend Server Initialized', 'system');

// Fetch Data and generate recommendations
async function fetchDisasterFeeds() {
  try {
    const response = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
    let events = response.data.features || [];
    
    // Filter strictly for India
    events = events.filter(e => e.properties.place && e.properties.place.toLowerCase().includes('india'));

    // Filter and map events
    const newZones = [];
    const newRecs = [];

    // Only take top 10 most recent
    events.slice(0, 10).forEach((event, index) => {
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
        population: Math.floor(Math.random() * 500000), // Estimated affected
        activeIncidents: 1,
        status: severity > 7 ? 'critical' : 'warning'
      });

      // Generate a recommendation if it's severe and we haven't processed it yet
      const recId = `REC-${event.id}`;
      const isAlreadyPending = pendingRecommendations.some(r => r.id === recId);
      const isAlreadyApproved = approvedRecommendations.some(r => r.id === recId);

      if (severity >= 7 && !isAlreadyPending && !isAlreadyApproved) {
        newRecs.push({
          id: recId,
          zone: zoneName,
          action: `Magnitude ${magnitude} EQ Response & Evacuation`,
          confidence: Math.floor(85 + Math.random() * 15), // 85-99%
          etaAI: '10 mins',
          etaManual: '3 hrs',
          resourceNeeded: 'NDRF Battalion, Search & Rescue',
          status: 'pending'
        });
        addLog(`AI detected critical anomaly in ${zoneName}. Recommendation generated.`, 'alert');
      }
    });

    activeZones = newZones;
    
    if (newRecs.length > 0) {
       pendingRecommendations = [...newRecs, ...pendingRecommendations];
    }

    // Broadcast state to all clients
    broadcastState();

  } catch (error) {
    console.error('Error fetching GDACS feed:', error.message);
  }
}

function broadcastState() {
  io.emit('storm_state_update', {
    zones: activeZones,
    pendingRecommendations: pendingRecommendations,
    approvedRecommendations: approvedRecommendations,
    activityLog: activityLog
  });
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send initial state upon connection
  socket.emit('storm_state_update', {
    zones: activeZones,
    pendingRecommendations,
    approvedRecommendations,
    activityLog
  });

  socket.on('approve_recommendation', (rec) => {
    // Move from pending to approved
    pendingRecommendations = pendingRecommendations.filter(r => r.id !== rec.id);
    const approvedRec = { ...rec, status: 'approved', approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    approvedRecommendations = [approvedRec, ...approvedRecommendations];
    
    addLog(`Officer approved dispatch for ${rec.zone}.`, 'approval');
    
    // Broadcast updated state
    broadcastState();
  });

  socket.on('reject_recommendation', (recId) => {
    pendingRecommendations = pendingRecommendations.filter(r => r.id !== recId);
    addLog(`Officer rejected AI recommendation (ID: ${recId}).`, 'system');
    broadcastState();
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start fetching every 30 seconds
setInterval(fetchDisasterFeeds, 30000);
fetchDisasterFeeds(); // Initial fetch

server.listen(PORT, () => {
  console.log(`STORM Real-time Backend running on port ${PORT}`);
});
