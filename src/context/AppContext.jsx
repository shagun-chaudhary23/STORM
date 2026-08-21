import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socket, { updateSocketAuthToken } from '../services/socket';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AppContext = createContext();

const DEMO_OFFICERS = [
  { id: "OFF-101", name: "Col. Rajesh Sharma", rank: "SDMA Relief Commissioner", pass: "officer101" },
  { id: "OFF-102", name: "Dr. Ananya Sen", rank: "NDMA Operations Chief", pass: "officer102" },
  { id: "OFF-103", name: "Capt. Vikram Malhotra", rank: "NDRF Sector Commander", pass: "officer103" }
];

const DEMO_TEAM_LEADERS = [
  { id: "TL-201", name: "Major Dr. R. Nair", team: "Medical Team Alpha", pass: "leader201", phone: "+916387095624" },
  { id: "TL-202", name: "Subedar S. Roy", team: "NDRF Boat Unit 3", pass: "leader202", phone: "+916387095624" },
  { id: "TL-203", name: "Inspector K. Das", team: "Relief Kit Stock", pass: "leader203", phone: "+916387095624" },
  { id: "TL-204", name: "Dr. V. Rao", team: "Medical Team Beta", pass: "leader204", phone: "+916387095624" }
];

export function AppProvider({ children }) {
  // Theme state: 'dark' | 'light' (defaults to 'dark')
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('storm_theme');
      return savedTheme === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Official officer auth state
  const [activeOfficer, setActiveOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem('storm_officer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Deployment team leader auth state
  const [activeTeamLeader, setActiveTeamLeader] = useState(() => {
    try {
      const saved = localStorage.getItem('storm_team_leader');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login modal open/close state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Centralized Live STORM Real-Time State (Instant 0ms access across all pages)
  const [zones, setZones] = useState([]);
  const [pendingRecommendations, setPendingRecommendations] = useState([]);
  const [approvedRecommendations, setApprovedRecommendations] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [resources, setResources] = useState([]);
  const [fieldReports, setFieldReports] = useState([]);
  const [isDisconnected, setIsDisconnected] = useState(!socket.connected);
  const [inAppAlert, setInAppAlert] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Instant State Fetch via REST API
  const fetchLiveState = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/state`);
      if (res.ok) {
        const data = await res.json();
        if (data.zones) setZones(data.zones);
        if (data.pendingRecommendations) setPendingRecommendations(data.pendingRecommendations);
        if (data.approvedRecommendations) setApprovedRecommendations(data.approvedRecommendations);
        if (data.activityLog) setActivityLog(data.activityLog);
        if (data.resources) setResources(data.resources);
        if (data.fieldReports) setFieldReports(data.fieldReports);
      }
    } catch (err) {
      console.warn('Initial state fetch error:', err.message);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Initial load & Socket Event Binding (Runs ONCE for the entire application)
  useEffect(() => {
    // 1. Instant REST fetch so pages have data in 0-10ms
    fetchLiveState();

    // 2. Set up socket listeners
    const handleConnect = () => {
      setIsDisconnected(false);
      socket.emit('request_state');
    };

    const handleDisconnect = () => {
      setIsDisconnected(true);
    };

    const handleStateUpdate = (data) => {
      if (!data) return;
      if (data.zones !== undefined) setZones(data.zones);
      if (data.pendingRecommendations !== undefined) setPendingRecommendations(data.pendingRecommendations);
      if (data.approvedRecommendations !== undefined) setApprovedRecommendations(data.approvedRecommendations);
      if (data.activityLog !== undefined) setActivityLog(data.activityLog);
      if (data.resources !== undefined) setResources(data.resources);
      if (data.fieldReports !== undefined) setFieldReports(data.fieldReports);
      setInitialLoading(false);
    };

    const handleNotificationBroadcast = (alertData) => {
      if (alertData) {
        setInAppAlert(alertData);
        setTimeout(() => setInAppAlert(null), 12000);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('storm_state_update', handleStateUpdate);
    socket.on('notification_broadcast', handleNotificationBroadcast);

    if (socket.connected) {
      setIsDisconnected(false);
      socket.emit('request_state');
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('storm_state_update', handleStateUpdate);
      socket.off('notification_broadcast', handleNotificationBroadcast);
    };
  }, [fetchLiveState]);

  // Apply theme class and data-theme attribute directly to <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
    
    localStorage.setItem('storm_theme', theme);
  }, [theme]);

  // Sync auth state from storage changes
  useEffect(() => {
    const syncAuth = () => {
      try {
        const savedOfficer = localStorage.getItem('storm_officer');
        setActiveOfficer(savedOfficer ? JSON.parse(savedOfficer) : null);
        const savedLeader = localStorage.getItem('storm_team_leader');
        setActiveTeamLeader(savedLeader ? JSON.parse(savedLeader) : null);
      } catch {
        setActiveOfficer(null);
        setActiveTeamLeader(null);
      }
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loginOfficer = async (officerId, password) => {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId, password })
      });
      const data = await response.json();
      if (response.ok && data.officer) {
        setActiveOfficer(data.officer);
        localStorage.setItem('storm_officer', JSON.stringify(data.officer));
        if (data.token) {
          localStorage.setItem('storm_officer_token', data.token);
          updateSocketAuthToken(data.token);
        }
        window.dispatchEvent(new Event('storage'));
        return { success: true, officer: data.officer };
      }
      return { success: false, error: data.error || 'Invalid Officer ID or Password' };
    } catch (err) {
      return { success: false, error: 'Authentication server unreachable: ' + err.message };
    }
  };

  const logoutOfficer = () => {
    setActiveOfficer(null);
    localStorage.removeItem('storm_officer');
    localStorage.removeItem('storm_officer_token');
    updateSocketAuthToken(null);
    window.dispatchEvent(new Event('storage'));
  };

  const loginTeamLeader = async (leaderId, password) => {
    try {
      const response = await fetch(`${API_URL}/api/team-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderId, password })
      });
      const data = await response.json();
      if (response.ok && data.leader) {
        setActiveTeamLeader(data.leader);
        localStorage.setItem('storm_team_leader', JSON.stringify(data.leader));
        if (data.token) {
          localStorage.setItem('storm_team_token', data.token);
        }
        window.dispatchEvent(new Event('storage'));
        return { success: true, leader: data.leader };
      }
      return { success: false, error: data.error || 'Invalid Team Leader ID or Password' };
    } catch (err) {
      return { success: false, error: 'Authentication server unreachable: ' + err.message };
    }
  };

  const logoutTeamLeader = () => {
    setActiveTeamLeader(null);
    localStorage.removeItem('storm_team_leader');
    localStorage.removeItem('storm_team_token');
    window.dispatchEvent(new Event('storage'));
  };

  const openLoginModal = () => setIsLoginModalOpen(false || true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const dismissInAppAlert = () => setInAppAlert(null);

  // Common Action Methods
  const approveRecommendation = (rec) => {
    if (!activeOfficer) {
      openLoginModal();
      return false;
    }
    const token = localStorage.getItem('storm_officer_token');
    socket.emit('approve_recommendation', {
      recommendationId: rec.id || rec.recommendationId,
      zone: rec.zone,
      action: rec.action,
      resourceNeeded: rec.resourceNeeded,
      officerId: activeOfficer.id,
      officerName: activeOfficer.name,
      token
    });
    return true;
  };

  const rejectRecommendation = (id) => {
    if (!activeOfficer) {
      openLoginModal();
      return false;
    }
    const token = localStorage.getItem('storm_officer_token');
    socket.emit('reject_recommendation', { id, token });
    return true;
  };

  const bindResource = ({ resourceId, targetZoneId, targetZoneName, taskSummary, severity }) => {
    if (!activeOfficer) {
      openLoginModal();
      return false;
    }
    const token = localStorage.getItem('storm_officer_token');
    socket.emit('bind_resource', {
      resourceId,
      targetZoneId,
      targetZoneName,
      taskSummary,
      severity,
      token
    });
    return true;
  };

  const completeTeamDeployment = async ({ token, status, notes }) => {
    const teamToken = localStorage.getItem('storm_team_token');
    try {
      const response = await fetch(`${API_URL}/api/deployments/${token}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(teamToken ? { 'Authorization': `Bearer ${teamToken}` } : {})
        },
        body: JSON.stringify({
          status,
          notes: notes || '',
          token: teamToken
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit deployment status.');
      }
      return { success: true, deployment: data.deployment };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeOfficer,
        loginOfficer,
        logoutOfficer,
        activeTeamLeader,
        loginTeamLeader,
        logoutTeamLeader,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        demoOfficers: DEMO_OFFICERS,
        demoTeamLeaders: DEMO_TEAM_LEADERS,
        
        // Live state available synchronously to every page on mount
        zones,
        pendingRecommendations,
        approvedRecommendations,
        activityLog,
        resources,
        fieldReports,
        isDisconnected,
        inAppAlert,
        dismissInAppAlert,
        initialLoading,
        socket,
        refreshState: fetchLiveState,
        approveRecommendation,
        rejectRecommendation,
        bindResource,
        completeTeamDeployment
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
