import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const socket = io(API_URL, {
  auth: { token: localStorage.getItem('storm_officer_token') },
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 5000
});

export function updateSocketAuthToken(token) {
  socket.auth = { token };
  if (socket.connected) {
    socket.disconnect().connect();
  }
}

export default socket;
