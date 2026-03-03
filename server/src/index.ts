import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

// Import database connection
import { testConnection } from './db/connection';

// Import email service
import { EmailService } from './services/emailService';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import vendorRoutes from './routes/vendors';
// import uploadRoutes from './routes/uploads'; // Temporarily disabled due to compilation issues
import registrationRoutes from './routes/registration';
import adminRoutes from './routes/admin';
import emailTestRoutes from './routes/emailTest';
import webhookRoutes from './routes/webhooks';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Heroku/production deployments
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "blob:", "https://api.tempolabs.ai"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
      connectSrc: ["'self'"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan('combined'));

// Compression
app.use(compression());

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/health/db', async (req, res) => {
  try {
    await testConnection();
    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

// Email health check
app.get('/api/health/email', async (req, res) => {
  try {
    const health = await EmailService.getHealthStatus();
    res.json({
      status: 'OK',
      email: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      email: 'Service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
// app.use('/api/uploads', uploadRoutes); // Temporarily disabled
app.use('/api/registration', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/email-test', emailTestRoutes);
app.use('/api/webhook', webhookRoutes);

// Serve client build files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database health: http://localhost:${PORT}/api/health/db`);
  console.log(`📧 Email health: http://localhost:${PORT}/api/health/email`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize email service
  try {
    await EmailService.initialize();
  } catch (error) {
    console.warn('⚠️  Email service initialization failed, continuing without email functionality');
  }
  
  // Test database connection only if DATABASE_URL is provided
  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'your_actual_heroku_postgres_url_here') {
    console.log('🔌 Testing database connection...');
    await testConnection();
  } else {
    console.log('⚠️  No valid DATABASE_URL provided, skipping database connection test');
    console.log('💡 To test database connection, set DATABASE_URL in server/.env file');
  }
});

export default app; 