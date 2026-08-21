const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

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
    quantity INTEGER,
    team_lead_name TEXT,
    team_lead_phone TEXT
  );

  CREATE TABLE IF NOT EXISTS field_reports (
    id TEXT PRIMARY KEY,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT,
    description TEXT,
    timestamp TEXT,
    verified INTEGER DEFAULT 0,
    reporter_name TEXT,
    reporter_phone TEXT
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
    passwordHash TEXT NOT NULL,
    phone TEXT
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT,
    role TEXT,
    message TEXT,
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS team_leaders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    team_name TEXT NOT NULL,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS deployments (
    id TEXT PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    resource_id TEXT,
    resource_name TEXT,
    zone_id TEXT,
    zone_name TEXT,
    officer_id TEXT,
    officer_name TEXT,
    officer_phone TEXT,
    team_leader_id TEXT,
    team_lead_name TEXT,
    team_lead_phone TEXT,
    task_summary TEXT,
    severity REAL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TEXT,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS critical_alerts (
    zone_id TEXT PRIMARY KEY,
    severity REAL,
    timestamp TEXT
  );
`);

// Safe column migrations for existing databases
function safeAddColumn(table, columnDef) {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
  } catch {
    // Column already exists
  }
}

safeAddColumn('resources', 'team_lead_name TEXT');
safeAddColumn('resources', 'team_lead_phone TEXT');
safeAddColumn('officers', 'phone TEXT');
safeAddColumn('field_reports', 'reporter_name TEXT');
safeAddColumn('field_reports', 'reporter_phone TEXT');
safeAddColumn('deployments', 'team_leader_id TEXT');

// Initial seed data with configured real notification routing
const initialResources = [
  { id: "RES-1", name: "Medical Team Alpha", type: "medical", status: "available", location: "Gangtok Base", assignedZone: null, quantity: null, team_lead_name: "Major Dr. R. Nair", team_lead_phone: "+916387095624" },
  { id: "RES-2", name: "NDRF Boat Unit 3", type: "rescue", status: "available", location: "Teesta River Post", assignedZone: null, quantity: null, team_lead_name: "Subedar S. Roy", team_lead_phone: "+916387095624" },
  { id: "RES-3", name: "Relief Kit Stock", type: "supplies", status: "available", location: "Central Warehouse", assignedZone: null, quantity: 850, team_lead_name: "Inspector K. Das", team_lead_phone: "+916387095624" },
  { id: "RES-4", name: "Medical Team Beta", type: "medical", status: "deployed", location: "Zone 2A", assignedZone: "Zone 2A – Kalimpong", quantity: null, team_lead_name: "Dr. V. Rao", team_lead_phone: "+916387095624" }
];

const initialTeamLeaders = [
  { id: "TL-201", name: "Major Dr. R. Nair", phone: "+916387095624", team_name: "Medical Team Alpha", passwordHash: bcrypt.hashSync("leader201", 10), created_at: new Date().toISOString() },
  { id: "TL-202", name: "Subedar S. Roy", phone: "+916387095624", team_name: "NDRF Boat Unit 3", passwordHash: bcrypt.hashSync("leader202", 10), created_at: new Date().toISOString() },
  { id: "TL-203", name: "Inspector K. Das", phone: "+916387095624", team_name: "Relief Kit Stock", passwordHash: bcrypt.hashSync("leader203", 10), created_at: new Date().toISOString() },
  { id: "TL-204", name: "Dr. V. Rao", phone: "+916387095624", team_name: "Medical Team Beta", passwordHash: bcrypt.hashSync("leader204", 10), created_at: new Date().toISOString() }
];

const initialOfficers = [
  { id: "OFF-101", name: "Col. Rajesh Sharma", rank: "SDMA Relief Commissioner", passwordHash: bcrypt.hashSync("officer101", 10), phone: "+919870551588" },
  { id: "OFF-102", name: "Dr. Ananya Sen", rank: "NDMA Operations Chief", passwordHash: bcrypt.hashSync("officer102", 10), phone: "+919870551588" },
  { id: "OFF-103", name: "Capt. Vikram Malhotra", rank: "NDRF Sector Commander", passwordHash: bcrypt.hashSync("officer103", 10), phone: "+919870551588" }
];

const initialLogs = [
  { time: "Just now", event: "STORM system initialized with real-time feeds", type: "system", officerId: "SYSTEM", officerName: "STORM AI", timestamp: new Date().toISOString() }
];

// Seed if empty or synchronize updated routing
function seedDatabaseIfEmpty() {
  const resCount = db.prepare('SELECT COUNT(*) as count FROM resources').get().count;
  if (resCount === 0) {
    const insertRes = db.prepare(`
      INSERT INTO resources (id, name, type, status, location, assignedZone, quantity, team_lead_name, team_lead_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertManyRes = db.transaction((resources) => {
      for (const r of resources) {
        insertRes.run(r.id, r.name, r.type, r.status || 'available', r.location || '', r.assignedZone || null, r.quantity || null, r.team_lead_name || null, r.team_lead_phone || null);
      }
    });
    insertManyRes(initialResources);
  } else {
    // Update existing resources with configured team lead phone numbers
    for (const r of initialResources) {
      db.prepare(`
        UPDATE resources 
        SET team_lead_name = COALESCE(team_lead_name, ?), team_lead_phone = ?
        WHERE id = ?
      `).run(r.team_lead_name, r.team_lead_phone, r.id);
    }
  }

  const leadCount = db.prepare('SELECT COUNT(*) as count FROM team_leaders').get().count;
  if (leadCount === 0) {
    const insertLeader = db.prepare(`
      INSERT INTO team_leaders (id, name, phone, passwordHash, team_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertManyLeaders = db.transaction((leaders) => {
      for (const l of leaders) {
        insertLeader.run(l.id, l.name, l.phone, l.passwordHash, l.team_name, l.created_at || new Date().toISOString());
      }
    });
    insertManyLeaders(initialTeamLeaders);
  } else {
    for (const l of initialTeamLeaders) {
      const existing = db.prepare('SELECT * FROM team_leaders WHERE id = ?').get(l.id);
      if (existing) {
        let hash = existing.passwordHash;
        if (!hash.startsWith('$2b$') && !hash.startsWith('$2a$')) {
          hash = bcrypt.hashSync(hash, 10);
        }
        db.prepare(`
          UPDATE team_leaders 
          SET passwordHash = ?, phone = ?, team_name = ?, name = ?
          WHERE id = ?
        `).run(hash, l.phone, l.team_name, l.name, l.id);
      }
    }
  }

  // Backfill deployments table with team_leader_id if null
  try {
    db.exec(`
      UPDATE deployments
      SET team_leader_id = (
        SELECT id FROM team_leaders 
        WHERE team_leaders.phone = deployments.team_lead_phone 
           OR team_leaders.name = deployments.team_lead_name 
           OR team_leaders.team_name = deployments.resource_name
        LIMIT 1
      )
      WHERE (team_leader_id IS NULL OR team_leader_id = '') 
        AND (team_lead_phone IS NOT NULL OR team_lead_name IS NOT NULL OR resource_name IS NOT NULL);
    `);
  } catch (err) {
    console.warn('Deployments team_leader_id backfill warning:', err.message);
  }

  const offCount = db.prepare('SELECT COUNT(*) as count FROM officers').get().count;
  if (offCount === 0) {
    const insertOfficer = db.prepare(`
      INSERT INTO officers (id, name, rank, passwordHash, phone)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertManyOfficers = db.transaction((officers) => {
      for (const o of officers) {
        insertOfficer.run(o.id, o.name, o.rank, o.passwordHash, o.phone);
      }
    });
    insertManyOfficers(initialOfficers);
  } else {
    // Hash existing plaintext passwords and update phone numbers
    for (const o of initialOfficers) {
      const existing = db.prepare('SELECT * FROM officers WHERE id = ?').get(o.id);
      if (existing) {
        let hash = existing.passwordHash;
        if (!hash.startsWith('$2b$') && !hash.startsWith('$2a$')) {
          hash = bcrypt.hashSync(hash, 10);
        }
        db.prepare(`
          UPDATE officers 
          SET passwordHash = ?, phone = ?
          WHERE id = ?
        `).run(hash, o.phone, o.id);
      }
    }
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
    INSERT INTO field_reports (id, location, category, severity, description, timestamp, verified, reporter_name, reporter_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    report.id, 
    report.location, 
    report.category, 
    report.severity, 
    report.description, 
    time, 
    verified,
    report.reporter_name || report.reporterName || null,
    report.reporter_phone || report.reporterPhone || null
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
  return db.prepare('SELECT id, name, rank, phone FROM officers').all();
}

function getOfficerById(id) {
  return db.prepare('SELECT id, name, rank, phone FROM officers WHERE id = ?').get(id);
}

function authenticateOfficer(officerId, password) {
  const officer = db.prepare('SELECT * FROM officers WHERE id = ?').get(officerId);
  if (!officer) return null;

  let valid = false;
  if (officer.passwordHash && (officer.passwordHash.startsWith('$2a$') || officer.passwordHash.startsWith('$2b$'))) {
    valid = bcrypt.compareSync(password, officer.passwordHash);
  } else if (officer.passwordHash === password) {
    valid = true;
    const newHash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE officers SET passwordHash = ? WHERE id = ?').run(newHash, officer.id);
  }

  if (valid) {
    return {
      id: officer.id,
      name: officer.name,
      rank: officer.rank,
      phone: officer.phone
    };
  }
  return null;
}

function getTeamLeaders() {
  return db.prepare('SELECT id, name, phone, team_name, created_at FROM team_leaders ORDER BY id ASC').all();
}

function getTeamLeaderById(id) {
  return db.prepare('SELECT id, name, phone, team_name, created_at FROM team_leaders WHERE id = ?').get(id);
}

function authenticateTeamLeader(leaderId, password) {
  if (!leaderId || !password) return null;
  const leader = db.prepare('SELECT * FROM team_leaders WHERE id = ? OR LOWER(name) = LOWER(?)').get(leaderId.trim(), leaderId.trim());
  if (!leader) return null;

  let valid = false;
  if (leader.passwordHash && (leader.passwordHash.startsWith('$2a$') || leader.passwordHash.startsWith('$2b$'))) {
    valid = bcrypt.compareSync(password, leader.passwordHash);
  } else if (leader.passwordHash === password) {
    valid = true;
    const newHash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE team_leaders SET passwordHash = ? WHERE id = ?').run(newHash, leader.id);
  }

  if (valid) {
    return {
      id: leader.id,
      name: leader.name,
      phone: leader.phone,
      team_name: leader.team_name,
      role: 'team_leader'
    };
  }
  return null;
}

// Inquiries / Pilot Requests
function saveInquiry(inquiry) {
  const id = inquiry.id || `INQ-${Date.now()}`;
  const timestamp = new Date().toISOString();
  db.prepare(`
    INSERT INTO inquiries (id, name, organization, role, message, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, inquiry.name, inquiry.organization || '', inquiry.role || '', inquiry.message || '', timestamp);
  return db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
}

function getInquiries() {
  return db.prepare('SELECT * FROM inquiries ORDER BY timestamp DESC').all();
}

// Deployments / Two-Way SMS Tracking
function createDeployment(dep) {
  const id = dep.id || `DEP-${Date.now()}`;
  const token = dep.token || require('crypto').randomBytes(16).toString('hex');
  const now = new Date().toISOString();
  
  // Resolve team_leader_id if not provided
  let teamLeaderId = dep.team_leader_id || null;
  if (!teamLeaderId) {
    const leader = db.prepare(`
      SELECT id FROM team_leaders 
      WHERE phone = ? OR name = ? OR team_name = ?
      LIMIT 1
    `).get(dep.team_lead_phone || '', dep.team_lead_name || '', dep.resource_name || '');
    if (leader) {
      teamLeaderId = leader.id;
    }
  }

  db.prepare(`
    INSERT INTO deployments (
      id, token, resource_id, resource_name, zone_id, zone_name,
      officer_id, officer_name, officer_phone,
      team_leader_id, team_lead_name, team_lead_phone, task_summary, severity,
      status, notes, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, token, dep.resource_id, dep.resource_name, dep.zone_id, dep.zone_name,
    dep.officer_id, dep.officer_name, dep.officer_phone,
    teamLeaderId, dep.team_lead_name, dep.team_lead_phone, dep.task_summary, dep.severity || 5,
    'pending', null, now, now
  );

  return db.prepare('SELECT * FROM deployments WHERE id = ?').get(id);
}

function getDeploymentByToken(token) {
  return db.prepare('SELECT * FROM deployments WHERE token = ?').get(token);
}

function getDeploymentsByTeamLeader(teamLeaderId) {
  return db.prepare(`
    SELECT * FROM deployments 
    WHERE team_leader_id = ? 
       OR team_lead_phone IN (SELECT phone FROM team_leaders WHERE id = ?)
       OR team_lead_name IN (SELECT name FROM team_leaders WHERE id = ?)
    ORDER BY created_at DESC, id DESC
  `).all(teamLeaderId, teamLeaderId, teamLeaderId);
}

function releaseResource(resourceId) {
  if (!resourceId) return null;
  db.prepare(`
    UPDATE resources
    SET status = 'available', assignedZone = NULL
    WHERE id = ? OR name = ?
  `).run(resourceId, resourceId);
  return db.prepare('SELECT * FROM resources WHERE id = ? OR name = ?').get(resourceId, resourceId);
}

function updateZoneOnDeploymentCompletion(zoneId, zoneName) {
  const zoneIdentifier = zoneId || zoneName;
  if (!zoneIdentifier) return;
  const zone = db.prepare('SELECT * FROM zones WHERE id = ? OR name = ?').get(zoneIdentifier, zoneIdentifier);
  if (!zone) return;

  // Check if any open deployments remain for this zone
  const pendingDeps = db.prepare(`
    SELECT COUNT(*) as count FROM deployments 
    WHERE (zone_id = ? OR zone_name = ?) AND status = 'pending'
  `).get(zone.id, zone.name).count;

  if (pendingDeps === 0) {
    const newIncidents = Math.max(0, (zone.activeIncidents || 1) - 1);
    const newStatus = newIncidents === 0 ? (zone.severity > 7 ? 'warning' : 'stable') : zone.status;
    db.prepare(`
      UPDATE zones 
      SET activeIncidents = ?, status = ?
      WHERE id = ?
    `).run(newIncidents, newStatus, zone.id);
  }
}

function updateDeploymentStatus(token, status, notes = '') {
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE deployments
    SET status = ?, notes = ?, updated_at = ?
    WHERE token = ?
  `).run(status, notes, now, token);

  return db.prepare('SELECT * FROM deployments WHERE token = ?').get(token);
}

// Critical Alerts tracking
function isZoneAlerted(zoneId) {
  const record = db.prepare('SELECT * FROM critical_alerts WHERE zone_id = ?').get(zoneId);
  return !!record;
}

function recordCriticalAlert(zoneId, severity) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT OR REPLACE INTO critical_alerts (zone_id, severity, timestamp)
    VALUES (?, ?, ?)
  `).run(zoneId, severity, now);
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
  releaseResource,
  getActivityLog,
  addLog,
  getOfficers,
  getOfficerById,
  authenticateOfficer,
  getTeamLeaders,
  getTeamLeaderById,
  authenticateTeamLeader,
  getDeploymentsByTeamLeader,
  updateZoneOnDeploymentCompletion,
  getFieldReports,
  addFieldReport,
  saveInquiry,
  getInquiries,
  createDeployment,
  getDeploymentByToken,
  updateDeploymentStatus,
  isZoneAlerted,
  recordCriticalAlert
};
