"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import database connection
const connection_1 = require("./db/connection");
// Import email service
const emailService_1 = require("./services/emailService");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const vendors_1 = __importDefault(require("./routes/vendors"));
// import uploadRoutes from './routes/uploads'; // Temporarily disabled due to compilation issues
const registration_1 = __importDefault(require("./routes/registration"));
const admin_1 = __importDefault(require("./routes/admin"));
const emailTest_1 = __importDefault(require("./routes/emailTest"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
// Import middleware
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Trust proxy for Heroku/production deployments
app.set('trust proxy', 1);
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "blob:", "https:"],
            frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
            connectSrc: ["'self'"],
        },
    },
}));
// CORS
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGINS || 'http://localhost:3000',
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
// Logging
app.use((0, morgan_1.default)('combined'));
// Compression
app.use((0, compression_1.default)());
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
        await (0, connection_1.testConnection)();
        res.json({
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
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
        const health = await emailService_1.EmailService.getHealthStatus();
        res.json({
            status: 'OK',
            email: health,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'ERROR',
            email: 'Service unavailable',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });
    }
});
// Static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/products', products_1.default);
app.use('/api/vendors', vendors_1.default);
// app.use('/api/uploads', uploadRoutes); // Temporarily disabled
app.use('/api/registration', registration_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/email-test', emailTest_1.default);
app.use('/api/webhook', webhooks_1.default);
// Serve client build files in production
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path_1.default.join(__dirname, '../../client/dist');
    app.use(express_1.default.static(clientBuildPath));
    // Handle client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
    });
}
// Error handling middleware (must be last)
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database health: http://localhost:${PORT}/api/health/db`);
    console.log(`📧 Email health: http://localhost:${PORT}/api/health/email`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    // Initialize email service
    try {
        await emailService_1.EmailService.initialize();
    }
    catch (error) {
        console.warn('⚠️  Email service initialization failed, continuing without email functionality');
    }
    // Test database connection only if DATABASE_URL is provided
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'your_actual_heroku_postgres_url_here') {
        console.log('🔌 Testing database connection...');
        await (0, connection_1.testConnection)();
    }
    else {
        console.log('⚠️  No valid DATABASE_URL provided, skipping database connection test');
        console.log('💡 To test database connection, set DATABASE_URL in server/.env file');
    }
});
exports.default = app;
//# sourceMappingURL=index.js.map