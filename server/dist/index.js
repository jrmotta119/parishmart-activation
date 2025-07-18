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
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const vendors_1 = __importDefault(require("./routes/vendors"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const registration_1 = __importDefault(require("./routes/registration"));
// Import middleware
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Disable for development, configure properly for production
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CORS_ORIGINS?.split(',') || ['*']
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
// Logging middleware
if (process.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('combined'));
}
// Compression middleware
app.use((0, compression_1.default)());
// Body parsing middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Static file serving
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Parishmart API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// Database health check endpoint
app.get('/api/health/db', async (req, res) => {
    try {
        await (0, connection_1.testConnection)();
        res.status(200).json({
            success: true,
            database: { status: 'healthy' },
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Database health check failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });
    }
});
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/products', products_1.default);
app.use('/api/vendors', vendors_1.default);
app.use('/api/uploads', uploads_1.default);
app.use('/api/registration', registration_1.default);
// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app build directory
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/dist')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../client/dist/index.html'));
    });
}
else {
    // Development route
    app.get('/', (req, res) => {
        res.json({ message: 'API is running in development mode' });
    });
}
// 404 handler for API routes
app.use('/api/*', notFound_1.notFound);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database health: http://localhost:${PORT}/api/health/db`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
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