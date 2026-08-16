const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

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
    const events = response.data.features || [];

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
