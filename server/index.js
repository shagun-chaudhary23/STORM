require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');
const db = require('./db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && !process.env.TWILIO_ACCOUNT_SID.includes('your_')) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.warn('Twilio initialization failed:', err.message);
  }
}

async function sendSMS(to, body) {
  if (!to) return;
  const from = process.env.TWILIO_FROM_NUMBER || '+15005550006';
  
  if (twilioClient) {
    try {
      const msg = await twilioClient.messages.create({ body, from, to });
      console.log(`[Twilio SMS Sent] ID: ${msg.sid} to ${to}: ${body}`);
      return msg;
    } catch (err) {
      console.warn(`[Twilio SMS Error] to ${to}: ${err.message}. Falling back to simulated dispatch.`);
    }
  }
  
  // Simulated dispatch output for local dev / testing
  console.log(`[Simulated SMS Dispatch] TO: ${to} | FROM: ${from}\nMSG: ${body}\n----------------------------------`);
}

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
    
    const token = jwt.sign(
      { id: officer.id, name: officer.name, rank: officer.rank, phone: officer.phone },
      process.env.JWT_SECRET || 'storm_fallback_secret_key',
      { expiresIn: '8h' }
    );

    return res.json({ success: true, officer, token });
  }
  return res.status(401).json({ error: 'Invalid Officer ID or Password.' });
});

// List officers for demo selection
app.get('/api/officers', (req, res) => {
  res.json(db.getOfficers());
});

// GET all field reports
app.get('/api/reports', (req, res) => {
  res.json(db.getFieldReports());
});

// POST a new field report
app.post('/api/reports', (req, res) => {
  const { location, category, severity, description, reporterName, reporterPhone } = req.body;
  
  if (!location || !category || !description) {
    return res.status(400).json({ error: 'Location, category, and description are required.' });
  }

  const report = {
    id: 'REP-' + Date.now(),
    location,
    category,
    severity: severity || 'Medium',
    description,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    verified: false,
    reporter_name: reporterName || 'Ground Observer',
    reporter_phone: reporterPhone || null
  };

  const savedReport = db.addFieldReport(report);
  const byLabel = reporterName ? `${reporterName} (${reporterPhone || 'Field'})` : 'Ground Observer';
  db.addLog(`Field report submitted for ${location} (${category}) by ${byLabel}.`, 'report', 'FIELD-01', reporterName || 'Ground Observer');
  broadcastState();

  res.status(201).json(savedReport);
});

// Inquiries API (About Page Contact / Pilot Inquiries)
app.post('/api/inquiries', (req, res) => {
  const { name, organization, role, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }

  const inquiry = db.saveInquiry({ name, organization, role, message });
  db.addLog(`Pilot inquiry submitted from ${name} (${organization || 'Independent'}).`, 'system', null, name);
  broadcastState();

  res.status(201).json({ success: true, inquiry });
});

app.get('/api/inquiries', (req, res) => {
  res.json(db.getInquiries());
});

// Deployment Token Response Endpoints (Two-Way Notification Loop)
app.get('/api/deployments/:token', (req, res) => {
  const { token } = req.params;
  const deployment = db.getDeploymentByToken(token);
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment token not found or expired.' });
  }
  res.json(deployment);
});

app.post('/api/deployments/:token/respond', async (req, res) => {
  const { token } = req.params;
  const { status, notes } = req.body;

  if (!status || !['completed', 'incomplete'].includes(status.toLowerCase())) {
    return res.status(400).json({ error: 'Valid status (completed or incomplete) is required.' });
  }

  const deployment = db.getDeploymentByToken(token);
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment token not found or expired.' });
  }

  const updatedStatus = status.toLowerCase() === 'completed' ? 'completed' : 'incomplete';
  const updated = db.updateDeploymentStatus(token, updatedStatus, notes || '');

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const statusLabel = updatedStatus === 'completed' ? 'Completed' : 'Incomplete';

  // Log in activity log
  db.addLog(
    `Team ${deployment.team_lead_name || deployment.resource_name} marked mission as [${statusLabel}] at ${deployment.zone_name} (Notes: ${notes || 'None'}).`,
    'deployment_response',
    deployment.officer_id || null,
    deployment.officer_name || null
  );

  // Send SMS back to deploying officer
  if (deployment.officer_phone) {
    const officerSmsBody = `STORM UPDATE: Team Lead ${deployment.team_lead_name || 'Unit'} marked [${deployment.task_summary || deployment.resource_name}] as ${statusLabel} at ${deployment.zone_name} at ${timeStr}. Note: ${notes || 'No extra notes'}.`;
    await sendSMS(deployment.officer_phone, officerSmsBody);
  }

  broadcastState();
  res.json({ success: true, deployment: updated });
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
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : "*",
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    // Allow connection but mark as unauthenticated for read-only access (dashboard viewers)
    return next();
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'storm_fallback_secret_key', (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.user = decoded;
    next();
  });
});

const PORT = process.env.PORT || 3001;

function broadcastState() {
  io.emit('storm_state_update', {
    zones: db.getZones(),
    pendingRecommendations: db.getPendingRecommendations(),
    approvedRecommendations: db.getApprovedRecommendations(),
    activityLog: db.getActivityLog(),
    resources: db.getResources(),
    fieldReports: db.getFieldReports()
  });
}

// Fetch Disaster Feeds (USGS and Open-Meteo) and generate recommendations
async function fetchDisasterFeeds() {
  try {
    const currentPending = db.getPendingRecommendations();
    const currentApproved = db.getApprovedRecommendations();
    const newZones = [];
    const newRecs = [];

    // 1. USGS Earthquake Feed
    try {
      const usgsResponse = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', {
        timeout: 5000
      });
      let events = usgsResponse.data.features || [];
      
      // Filter strictly for India
      events = events.filter(e => e.properties.place && e.properties.place.toLowerCase().includes('india'));

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
    } catch (err) {
      console.warn('USGS feed fetch warning:', err.message);
    }

    // 2. Open-Meteo Weather Feed (Major Indian Cities)
    const cities = [
      { name: "Mumbai (Coastal)", lat: 19.0760, lon: 72.8777 },
      { name: "Delhi (NCR)", lat: 28.7041, lon: 77.1025 },
      { name: "Chennai (Coastal)", lat: 13.0827, lon: 80.2707 },
      { name: "Guwahati (River Basin)", lat: 26.1445, lon: 91.7362 }
    ];

    for (const city of cities) {
      try {
        const meteoResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,precipitation,wind_speed_10m&timezone=Asia/Kolkata`, {
          timeout: 5000
        });
        
        const current = meteoResponse.data.current;
        if (!current) continue;

        let severity = 2;
        let type = 'Weather';
        let action = '';
        let resource = '';

        if (current.precipitation >= 0.1) {
          severity = current.precipitation > 10 ? 9 : 7;
          type = 'Severe Flooding';
          action = `Heavy Rainfall (${current.precipitation}mm) Response`;
          resource = 'NDRF Boat Unit 3';
        } else if (current.temperature_2m >= 28) {
          severity = 8;
          type = 'Extreme Heatwave';
          action = `Heatwave Relief (${current.temperature_2m}°C)`;
          resource = 'Medical Team Alpha';
        } else if (current.wind_speed_10m > 20) {
          severity = 8;
          type = 'Cyclone/High Wind';
          action = `Cyclone Prep (${current.wind_speed_10m} km/h winds)`;
          resource = 'Disaster Relief Unit';
        }

        if (severity >= 7) {
          const zoneId = `METEO-${city.name.replace(/\s+/g, '')}`;
          newZones.push({
            id: zoneId,
            name: `Alert: ${city.name}`,
            type: type,
            severity: severity,
            population: 1500000,
            activeIncidents: Math.floor(Math.random() * 5) + 1,
            status: 'critical',
            coordinates: [city.lat, city.lon]
          });

          const recId = `REC-${zoneId}`;
          const isAlreadyPending = currentPending.some(r => r.id === recId);
          const isAlreadyApproved = currentApproved.some(r => r.id === recId);

          if (!isAlreadyPending && !isAlreadyApproved) {
            newRecs.push({
              id: recId,
              zone: `Alert: ${city.name}`,
              action: action,
              confidence: Math.floor(85 + Math.random() * 10),
              etaAI: '20 mins',
              etaManual: '4 hrs',
              resourceNeeded: resource,
              status: 'pending'
            });
            db.addLog(`AI detected critical weather anomaly in ${city.name} via Open-Meteo.`, 'alert', 'SYSTEM', 'STORM AI');
          }
        }
      } catch (e) {
        console.warn(`Open-Meteo fetch failed for ${city.name}:`, e.message);
      }
    }

    if (newZones.length > 0) {
      db.saveZones(newZones);

      // Check for Critical Severity Zones (Severity >= 8) and Auto-Alert Officers
      for (const zone of newZones) {
        if (zone.severity >= 8 && !db.isZoneAlerted(zone.id)) {
          db.recordCriticalAlert(zone.id, zone.severity);
          
          const alertEvent = `CRITICAL ALERT: Zone [${zone.name}] reached severity ${zone.severity}/10 (${zone.type}). Auto-notifying all duty officers.`;
          db.addLog(alertEvent, 'critical_alert_sent', 'SYSTEM', 'STORM SENTRY');

          // Send SMS to all officers
          const officers = db.getOfficers();
          const smsBody = `[STORM CRITICAL ALERT] Critical disaster condition detected in ${zone.name} (Severity: ${zone.severity}/10 - ${zone.type}). Log in to STORM Console immediately for tactical review.`;
          
          for (const off of officers) {
            if (off.phone) {
              sendSMS(off.phone, smsBody);
            }
          }

          // Socket in-app alert broadcast
          io.emit('notification_broadcast', {
            type: 'CRITICAL_ZONE_ALERT',
            zoneId: zone.id,
            zoneName: zone.name,
            severity: zone.severity,
            disasterType: zone.type,
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    if (newRecs.length > 0) {
      db.addRecommendations(newRecs);
    }
    
    broadcastState();

  } catch (error) {
    console.error('Error in fetchDisasterFeeds:', error.message);
  }
}

// Helper to authenticate socket user from token or message payload
function getSocketUser(socket, payload) {
  if (socket.user) return socket.user;
  const token = payload?.token || socket.handshake.auth?.token;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'storm_fallback_secret_key');
  } catch {
    return null;
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
    resources: db.getResources(),
    fieldReports: db.getFieldReports()
  });

  socket.on('approve_recommendation', (rec) => {
    const user = getSocketUser(socket, rec);
    if (!user) {
      return socket.emit('auth_error', { message: 'Authentication required to approve dispatch.' });
    }
    const officerInfo = { id: user.id, name: user.name, rank: user.rank, phone: user.phone };

    db.approveRecommendation(rec, officerInfo);
    
    const officerLabel = `Officer ${officerInfo.name} (${officerInfo.id || 'Command'})`;
    db.addLog(`${officerLabel} approved dispatch for ${rec.zone || 'designated sector'}.`, 'approval', officerInfo.id, officerInfo.name);
    
    broadcastState();
  });

  socket.on('reject_recommendation', (payload) => {
    const user = getSocketUser(socket, payload);
    if (!user) {
      return socket.emit('auth_error', { message: 'Authentication required to reject recommendation.' });
    }
    const id = typeof payload === 'object' ? (payload.id || payload.recommendationId) : payload;
    db.rejectRecommendation(id);
    db.addLog(`Officer ${user.name} rejected AI recommendation (ID: ${id}).`, 'system', user.id, user.name);
    broadcastState();
  });

  socket.on('bind_resource', async (payload) => {
    const user = getSocketUser(socket, payload);
    if (!user) {
      return socket.emit('auth_error', { message: 'Authentication required to bind resource.' });
    }
    const { resourceId, targetZoneId, targetZoneName, taskSummary, severity } = payload;
    const updated = db.bindResource(resourceId, targetZoneId, targetZoneName);
    
    if (updated) {
      // Create deployment tracking record
      const token = crypto.randomBytes(16).toString('hex');
      const deployment = db.createDeployment({
        token,
        resource_id: updated.id,
        resource_name: updated.name,
        zone_id: targetZoneId,
        zone_name: updated.assignedZone || targetZoneName || targetZoneId,
        officer_id: user.id,
        officer_name: user.name,
        officer_phone: user.phone,
        team_lead_name: updated.team_lead_name,
        team_lead_phone: updated.team_lead_phone,
        task_summary: taskSummary || `Deploy ${updated.name} to ${updated.assignedZone}`,
        severity: severity || 7
      });

      db.addLog(`Resource ${updated.name} deployed to ${updated.assignedZone} by ${user.name}.`, 'system', user.id, user.name);
      
      // Outbound SMS to Team Lead
      if (updated.team_lead_phone) {
        const appUrl = process.env.APP_URL || 'http://localhost:5173';
        const respondLink = `${appUrl}/respond/${token}`;
        const smsBody = `STORM DISPATCH ORDER: Zone [${deployment.zone_name}] (Sev: ${deployment.severity}/10). Action: ${deployment.task_summary}. Authorized by ${user.name} (${user.rank}). Please report status here: ${respondLink}`;
        
        await sendSMS(updated.team_lead_phone, smsBody);
        db.addLog(`Deployment briefing SMS dispatched to Team Lead ${updated.team_lead_name || 'Lead'} (${updated.team_lead_phone}).`, 'notification_sent', user.id, user.name);
      }

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
