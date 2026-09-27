// Point this at your Django server.
export const API_BASE = process.env.REACT_APP_API_BASE || 'https://freshie.techfest.org';
export const WS_BASE = process.env.REACT_APP_WS_BASE || 'wss://freshie.techfest.org';

async function req(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.detail || data.username?.[0] || data.password?.[0] || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export function authHeaders() {
  const token = localStorage.getItem('access');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(username, password) {
  return req('/player/auth/register/', { method: 'POST', body: JSON.stringify({ username, password }) });
}

export async function login(username, password) {
  // Enforces "nobody can log in with someone else's username": Django checks
  // the password hash for that exact username, so a wrong password simply
  // fails - there's no way to authenticate as a username you don't own.
  const data = await req('/player/auth/token/', { method: 'POST', body: JSON.stringify({ username, password }) });
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  localStorage.setItem('username', username);
  return data;
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('username');
}

export async function createLobby() {
  return req('/player/lobby/create/', { method: 'POST', headers: authHeaders() });
}

export async function joinLobby(code) {
  return req('/player/lobby/join/', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ code }) });
}

export async function getLobby(code) {
  return req(`/player/lobby/${code}/`, { headers: authHeaders() });
}