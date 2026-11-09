require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./src/config/db');

// Initialize Express & HTTP Server
const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach io to app for access in routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/patient', require('./src/routes/patientRoutes'));
app.use('/api/family', require('./src/routes/familyRoutes'));
app.use('/api/memories', require('./src/routes/memoryRoutes'));
app.use('/api/reminders', require('./src/routes/reminderRoutes'));
app.use('/api/routines', require('./src/routes/routineRoutes'));
app.use('/api/emergency', require('./src/routes/emergencyRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/settings', require('./src/routes/settingsRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MemoryMate API',
    timestamp: new Date().toISOString()
  });
});

// Socket.io real-time events
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_patient_room', (patientId) => {
    socket.join(`patient_${patientId}`);
    console.log(`[Socket.io] Client joined room: patient_${patientId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately and initiate DB connection
server.listen(PORT, '127.0.0.1', () => {
  console.log(`====================================================`);
  console.log(`  MemoryMate API Server running on port ${PORT}`);
  console.log(`  Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`====================================================`);
  connectDB().catch(err => console.error('Database connection handling error:', err));
});
