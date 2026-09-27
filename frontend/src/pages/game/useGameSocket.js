import { useCallback, useEffect, useRef, useState } from 'react';
import { WS_BASE } from './api';

// The socket is the ONLY source of truth about the game. This hook never
// simulates anything itself - it just stores whatever snapshot the server
// last sent and exposes tiny helpers to send input. That's the whole fix for
// the "not synced between devices" bug: there is nothing left to go out of
// sync, because nothing runs the game logic except the server.
export function useGameSocket(code) {
  const [connected, setConnected] = useState(false);
  const [mySeat, setMySeat] = useState(null);
  const [hostSeat, setHostSeat] = useState(null);
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  const [phase, setPhase] = useState('lobby'); // 'lobby' | 'playing' | 'over'
  const [state, setState] = useState(null); // latest snapshot from engine.snapshot()
  const wsRef = useRef(null);

  useEffect(() => {
    if (!code) return undefined;
    const token = localStorage.getItem('access');
    const ws = new WebSocket(`${WS_BASE}/ws/lobby/${code}/?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      switch (msg.type) {
        case 'welcome':
          setMySeat(msg.seat);
          setHostSeat(msg.hostSeat);
          break;
        case 'lobby':
          setLobbyPlayers(msg.players);
          break;
        case 'started':
          setPhase('playing');
          break;
        case 'state':
          setState(msg.state);
          break;
        case 'over':
          setState(msg.state);
          setPhase('over');
          break;
        default:
          break;
      }
    };

    return () => ws.close();
  }, [code]);

  const send = useCallback((payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const startGame = useCallback(() => send({ type: 'start_game' }), [send]);
  const spawn = useCallback((unit) => send({ type: 'action', action: 'spawn', unit }), [send]);
  const cycleTarget = useCallback(() => send({ type: 'action', action: 'target' }), [send]);

  return { connected, mySeat, hostSeat, lobbyPlayers, phase, state, startGame, spawn, cycleTarget };
}