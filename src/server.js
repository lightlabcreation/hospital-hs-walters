const express = require('express');
const cors = require('cors');
const { PORT, NODE_ENV, FRONTEND_URL } = require('./common/config/env');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const patientRoutes = require('./routes/patient.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const prescriptionRoutes = require('./routes/prescription.routes');
const labRoutes = require('./routes/lab.routes');
const medicalNotesRoutes = require('./routes/medicalNotes.routes');
const billingRoutes = require('./routes/billing.routes');
const reportRoutes = require('./routes/report.routes');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration - allow multiple frontend ports for development
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost on any port for development
      if (NODE_ENV === 'development' && origin.includes('localhost')) {
        return callback(null, true);
      }

      // Check against configured FRONTEND_URL
      if (origin === FRONTEND_URL) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Digital Clinic EMR API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab-results', labRoutes);
app.use('/api/medical-notes', medicalNotesRoutes);
app.use('/api/invoices', billingRoutes);
app.use('/api/reports', reportRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      message: 'A record with this value already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'Record not found.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token has expired.',
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         DIGITAL CLINIC EMR SYSTEM - BACKEND API            ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                  ║
║  Environment: ${NODE_ENV.padEnd(42)}║
║  API Base URL: http://localhost:${PORT}/api                   ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
