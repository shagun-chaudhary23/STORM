const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'storm.db');
const db = new Database(dbPath);

// Enable WAL mode for performance & reliability
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'Earthquake',
    severity REAL DEFAULT 5,
    status TEXT DEFAULT 'warning',
    population INTEGER DEFAULT 0,
    activeIncidents INTEGER DEFAULT 1,
    coordinates TEXT
  );

  CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    zone TEXT NOT NULL,
    action TEXT NOT NULL,
    confidence INTEGER DEFAULT 90,
    resourceNeeded TEXT,
    etaManual TEXT DEFAULT '3 hrs',
    etaAI TEXT DEFAULT '15 mins',
    status TEXT DEFAULT 'pending',
    approvedAt TEXT,
    approvedBy TEXT
  );

  CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'available',
    location TEXT,
    assignedZone TEXT,
    quantity INTEGER
  );

  CREATE TABLE IF NOT EXISTS field_reports (
    id TEXT PRIMARY KEY,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT,
    description TEXT,
    timestamp TEXT,
    verified INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT NOT NULL,
    event TEXT NOT NULL,
    type TEXT NOT NULL,
    officerId TEXT,
    officerName TEXT,
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS officers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rank TEXT NOT NULL,
    passwordHash TEXT NOT NULL
  );
`);

// Initial seed data
const initialZones = [
  { id: "Z-4B", name: "Zone 4B – South Sikkim", type: "Earthquake", severity: 8.4, status: "critical", population: 12400, coordinates: JSON.stringify([27.33, 88.62]), activeIncidents: 3 },
  { id: "Z-2A", name: "Zone 2A – Kalimpong", type: "Earthquake", severity: 6.1, status: "warning", population: 8200, coordinates: JSON.stringify([27.06, 88.47]), activeIncidents: 1 },
  { id: "Z-7C", name: "Zone 7C – Gangtok Rural", type: "Earthquake", severity: 3.2, status: "stable", population: 15600, coordinates: JSON.stringify([27.33, 88.61]), activeIncidents: 0 },
  { id: "Z-1D", name: "Zone 1D – Mangan", type: "Earthquake", severity: 7.5, status: "critical", population: 5100, coordinates: JSON.stringify([27.51, 88.53]), activeIncidents: 2 }
];

const initialRecommendations = [
  { id: "REC-001", zone: "Zone 4B – South Sikkim", action: "Dispatch medical team + 200 relief kits", confidence: 91, resourceNeeded: "Medical Team Alpha, 2x Supply Trucks", etaManual: "4-6 hrs", etaAI: "38 min", status: "pending", approvedAt: null, approvedBy: null },
  { id: "REC-002", zone: "Zone 1D – Mangan", action: "Deploy 1 NDRF boat unit for evacuation support", confidence: 87, resourceNeeded: "NDRF Boat Unit 3", etaManual: "5+ hrs", etaAI: "45 min", status: "pending", approvedAt: null, approvedBy: null },
  { id: "REC-003", zone: "Zone 2A – Kalimpong", action: "Send early-warning WhatsApp alert to residents", confidence: 95, resourceNeeded: "Alert Broadcast System", etaManual: "2 hrs", etaAI: "4 min", status: "approved", approvedAt: "14 min ago", approvedBy: "Col. Rajesh Sharma (OFF-101)" }
];

const initialResources = [
  { id: "RES-1", name: "Medical Team Alpha", type: "medical", status: "available", location: "Gangtok Base", assignedZone: null, quantity: null },
  { id: "RES-2", name: "NDRF Boat Unit 3", type: "rescue", status: "available", location: "Teesta River Post", assignedZone: null, quantity: null },
  { id: "RES-3", name: "Relief Kit Stock", type: "supplies", status: "available", location: "Central Warehouse", assignedZone: null, quantity: 850 },
  { id: "RES-4", name: "Medical Team Beta", type: "medical", status: "deployed", location: "Zone 2A", assignedZone: "Zone 2A – Kalimpong", quantity: null }
];

const initialFieldReports = [
  { id: "REP-1", location: "Teesta Riverbank, Sector 3", category: "Flooding", severity: "AI-assessed: High", description: "Water level rising rapidly, two homes affected", timestamp: "18 min ago", verified: 1 },
  { id: "REP-2", location: "Mangan Market Road", category: "Blocked Access", severity: "AI-assessed: Medium", description: "Landslide debris blocking main relief route", timestamp: "1 hr ago", verified: 0 }
];

const initialOfficers = [
  { id: "OFF-101", name: "Col. Rajesh Sharma", rank: "SDMA Relief Commissioner", passwordHash: "officer101" },
  { id: "OFF-102", name: "Dr. Ananya Sen", rank: "NDMA Operations Chief", passwordHash: "officer102" },
  { id: "OFF-103", name: "Capt. Vikram Malhotra", rank: "NDRF Sector Commander", passwordHash: "officer103" }
];

const initialLogs = [
  { time: "2 min ago", event: "AI flagged Zone 4B as critical (8.4/10)", type: "alert", officerId: "SYSTEM", officerName: "STORM AI", timestamp: new Date(Date.now() - 120000).toISOString() },
  { time: "14 min ago", event: "Coordinator approved Zone 2A alert dispatch", type: "approval", officerId: "OFF-101", officerName: "Col. Rajesh Sharma", timestamp: new Date(Date.now() - 840000).toISOString() },
  { time: "22 min ago", event: "NDMA feed synced — 4 zones updated", type: "system", officerId: "SYSTEM", officerName: "Feed Sync", timestamp: new Date(Date.now() - 1320000).toISOString() },
  { time: "1 hr ago", event: "Field report submitted: Hauz Khas Village Entry, flooding observed", type: "report", officerId: "FIELD-01", officerName: "Ground Observer", timestamp: new Date(Date.now() - 3600000).toISOString() }
];

// Seed if empty
function seedDatabaseIfEmpty() {
  const zoneCount = db.prepare('SELECT COUNT(*) as count FROM zones').get().count;
  if (zoneCount === 0) {
    const insertZone = db.prepare(`
      INSERT INTO zones (id, name, type, severity, status, population, activeIncidents, coordinates)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertManyZones = db.transaction((zones) => {
      for (const z of zones) {
        insertZone.run(z.id, z.name, z.type || 'Earthquake', z.severity || 5, z.status || 'warning', z.population || 0, z.activeIncidents || 0, z.coordinates || null);
      }
    });
    insertManyZones(initialZones);
  }

  const recCount = db.prepare('SELECT COUNT(*) as count FROM recommendations').get().count;
  if (recCount === 0) {
    const insertRec = db.prepare(`
      INSERT INTO recommendations (id, zone, action, confidence, resourceNeeded, etaManual, etaAI, status, approvedAt, approvedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertManyRecs = db.transaction((recs) => {
      for (const r of recs) {
        insertRec.run(r.id, r.zone, r.action, r.confidence || 90, r.resourceNeeded || '', r.etaManual || '3 hrs', r.etaAI || '15 mins', r.status || 'pending', r.approvedAt || null, r.approvedBy || null);
      }
    });
    insertManyRecs(initialRecommendations);
  }

  const resCount = db.prepare('SELECT COUNT(*) as count FROM resources').get().count;
  if (resCount === 0) {
    const insertRes = db.prepare(`
      INSERT INTO resources (id, name, type, status, location, assignedZone, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertManyRes = db.transaction((resources) => {
      for (const r of resources) {
        insertRes.run(r.id, r.name, r.type, r.status || 'available', r.location || '', r.assignedZone || null, r.quantity || null);
      }
    });
    insertManyRes(initialResources);
  }

  const repCount = db.prepare('SELECT COUNT(*) as count FROM field_reports').get().count;
  if (repCount === 0) {
    const insertRep = db.prepare(`
      INSERT INTO field_reports (id, location, category, severity, description, timestamp, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertManyReps = db.transaction((reports) => {
      for (const rep of reports) {
        insertRep.run(rep.id, rep.location, rep.category, rep.severity || '', rep.description || '', rep.timestamp || '', rep.verified ? 1 : 0);
      }
    });
    insertManyReps(initialFieldReports);
  }

  const offCount = db.prepare('SELECT COUNT(*) as count FROM officers').get().count;
  if (offCount === 0) {
    const insertOfficer = db.prepare(`
      INSERT INTO officers (id, name, rank, passwordHash)
      VALUES (?, ?, ?, ?)
    `);
    const insertManyOfficers = db.transaction((officers) => {
      for (const o of officers) {
        insertOfficer.run(o.id, o.name, o.rank, o.passwordHash);
      }
    });
    insertManyOfficers(initialOfficers);
  }

  const logCount = db.prepare('SELECT COUNT(*) as count FROM activity_log').get().count;
  if (logCount === 0) {
    const insertLog = db.prepare(`
      INSERT INTO activity_log (time, event, type, officerId, officerName, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertManyLogs = db.transaction((logs) => {
      for (const l of logs) {
        insertLog.run(l.time, l.event, l.type, l.officerId || null, l.officerName || null, l.timestamp || new Date().toISOString());
      }
    });
    insertManyLogs(initialLogs);
  }
}

seedDatabaseIfEmpty();

// Database access functions
function getZones() {
  const rows = db.prepare('SELECT * FROM zones ORDER BY severity DESC').all();
  return rows.map(r => ({
    ...r,
    coordinates: r.coordinates ? JSON.parse(r.coordinates) : null
  }));
}

function saveZones(zones) {
  const upsert = db.prepare(`
    INSERT INTO zones (id, name, type, severity, status, population, activeIncidents, coordinates)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      type=excluded.type,
      severity=excluded.severity,
      status=excluded.status,
      population=excluded.population,
      activeIncidents=excluded.activeIncidents,
      coordinates=excluded.coordinates
  `);
  const runTransaction = db.transaction((zonesList) => {
    for (const z of zonesList) {
      upsert.run(
        z.id,
        z.name,
        z.type || 'Earthquake',
        z.severity || 5,
        z.status || 'warning',
        z.population || 0,
        z.activeIncidents || 0,
        Array.isArray(z.coordinates) ? JSON.stringify(z.coordinates) : (typeof z.coordinates === 'string' ? z.coordinates : null)
      );
    }
  });
  runTransaction(zones);
}

function getRecommendations() {
  return db.prepare('SELECT * FROM recommendations ORDER BY id DESC').all();
}

function getPendingRecommendations() {
  return db.prepare("SELECT * FROM recommendations WHERE status = 'pending' ORDER BY id DESC").all();
}

function getApprovedRecommendations() {
  return db.prepare("SELECT * FROM recommendations WHERE status = 'approved' ORDER BY id DESC").all();
}

function addRecommendations(newRecs) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO recommendations (id, zone, action, confidence, resourceNeeded, etaManual, etaAI, status, approvedAt, approvedBy)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NULL, NULL)
  `);
  const runTransaction = db.transaction((recs) => {
    for (const r of recs) {
      insert.run(
        r.id,
        r.zone,
        r.action,
        r.confidence || 90,
        r.resourceNeeded || '',
        r.etaManual || '3 hrs',
        r.etaAI || '15 mins'
      );
    }
  });
  runTransaction(newRecs);
}

function approveRecommendation(rec, officerInfo = null) {
  const recId = rec.id || rec.recommendationId;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const approvedBy = officerInfo 
    ? `${officerInfo.name || 'Officer'} (${officerInfo.id || officerInfo.rank || 'Command'})`
    : (rec.officerName ? `${rec.officerName} (${rec.officerId || 'Command'})` : 'Duty Officer');

  const existing = db.prepare('SELECT * FROM recommendations WHERE id = ?').get(recId);
  if (existing) {
    db.prepare(`
      UPDATE recommendations
      SET status = 'approved', approvedAt = ?, approvedBy = ?
      WHERE id = ?
    `).run(time, approvedBy, recId);
  } else {
    db.prepare(`
      INSERT INTO recommendations (id, zone, action, confidence, resourceNeeded, etaManual, etaAI, status, approvedAt, approvedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?)
    `).run(
      recId,
      rec.zone || 'Target Sector',
      rec.action || 'Deploy units',
      rec.confidence || 90,
      rec.resourceNeeded || 'Standard Relief Unit',
      rec.etaManual || '3 hrs',
      rec.etaAI || '15 mins',
      time,
      approvedBy
    );
  }

  return db.prepare('SELECT * FROM recommendations WHERE id = ?').get(recId);
}

function rejectRecommendation(recId) {
  db.prepare("UPDATE recommendations SET status = 'rejected' WHERE id = ?").run(recId);
}

function getResources() {
  return db.prepare('SELECT * FROM resources ORDER BY id ASC').all();
}

function bindResource(resourceId, targetZoneId, targetZoneName = null) {
  const res = db.prepare('SELECT * FROM resources WHERE id = ? OR name = ?').get(resourceId, resourceId);
  if (res) {
    const zoneName = targetZoneName || targetZoneId;
    db.prepare(`
      UPDATE resources
      SET status = 'deployed', assignedZone = ?
      WHERE id = ?
    `).run(zoneName, res.id);
    return db.prepare('SELECT * FROM resources WHERE id = ?').get(res.id);
  }
  return null;
}

function getActivityLog(limit = 50) {
  return db.prepare('SELECT * FROM activity_log ORDER BY id DESC LIMIT ?').all(limit);
}

function getFieldReports() {
  return db.prepare('SELECT * FROM field_reports ORDER BY id DESC').all();
}

function addFieldReport(report) {
  const time = report.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const verified = report.verified ? 1 : 0;
  
  db.prepare(`
    INSERT INTO field_reports (id, location, category, severity, description, timestamp, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    report.id, 
    report.location, 
    report.category, 
    report.severity, 
    report.description, 
    time, 
    verified
  );

  return db.prepare('SELECT * FROM field_reports WHERE id = ?').get(report.id);
}

function addLog(event, type, officerId = null, officerName = null) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timestamp = new Date().toISOString();
  db.prepare(`
    INSERT INTO activity_log (time, event, type, officerId, officerName, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(time, event, type, officerId, officerName, timestamp);
}

function getOfficers() {
  return db.prepare('SELECT id, name, rank FROM officers').all();
}

function authenticateOfficer(officerId, password) {
  const officer = db.prepare('SELECT * FROM officers WHERE id = ?').get(officerId);
  if (!officer) return null;
  if (officer.passwordHash === password) {
    return {
      id: officer.id,
      name: officer.name,
      rank: officer.rank
    };
  }
  return null;
}

module.exports = {
  db,
  getZones,
  saveZones,
  getRecommendations,
  getPendingRecommendations,
  getApprovedRecommendations,
  addRecommendations,
  approveRecommendation,
  rejectRecommendation,
  getResources,
  bindResource,
  getActivityLog,
  addLog,
  getOfficers,
  authenticateOfficer,
  getFieldReports,
  addFieldReport
};
