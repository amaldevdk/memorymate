import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { activePatient, role } = useAuth();
  const [socket, setSocket] = useState(null);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const audioAlarmRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected to MemoryMate server:', newSocket.id);
      if (activePatient?._id) {
        newSocket.emit('join_patient_room', activePatient._id);
      }
    });

    newSocket.on('emergency_alert', (alertData) => {
      console.warn('[Socket] EMERGENCY ALERT RECEIVED:', alertData);
      setEmergencyAlert(alertData);
      playEmergencyTone();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [activePatient]);

  const playEmergencyTone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Play 3 pulsating urgent beeps
      [0, 0.25, 0.5].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.18);
      });
    } catch {
      // Audio autoplay policy
    }
  };

  const clearEmergencyAlert = () => {
    setEmergencyAlert(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        emergencyAlert,
        clearEmergencyAlert
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
