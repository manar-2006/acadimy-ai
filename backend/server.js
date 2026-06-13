require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const pdfRoutes = require('./src/routes/pdf');
const chatRoutes = require('./src/routes/chat');
const plannerRoutes = require('./src/routes/planner');
const communityRoutes = require('./src/routes/community');
const notificationsRoutes = require('./src/routes/notifications');
const userRoutes = require('./src/routes/user');
const universitiesRoutes = require('./src/routes/universities');
const coursesRoutes = require('./src/routes/courses');
const analyticsRoutes = require('./src/routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client-side frontend communication
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets or uploads if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/universities', universitiesRoutes);
app.use('/universities', universitiesRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'EduSphere Backend', timestamp: new Date() });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});

// Start listening
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`EduSphere AI Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
