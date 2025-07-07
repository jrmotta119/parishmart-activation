"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.closePool = exports.query = exports.getClient = exports.testConnection = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Enhanced pool configuration for Heroku PostgreSQL
const createPool = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    // Parse the connection string to debug issues
    try {
        const url = new URL(connectionString);
        // Only show detailed parsing in development
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔍 Parsed DATABASE_URL:');
            console.log(`   Protocol: ${url.protocol}`);
            console.log(`   Host: ${url.hostname}`);
            console.log(`   Port: ${url.port}`);
            console.log(`   Database: ${url.pathname.slice(1)}`);
            console.log(`   Username: ${url.username}`);
            console.log(`   Password: ${url.password ? '***' : 'NOT SET'}`);
            console.log(`   Password length: ${url.password ? url.password.length : 0}`);
        }
        // Check for common issues
        if (!url.password) {
            console.error('❌ Password is missing from DATABASE_URL');
        }
        if (url.password && url.password.includes(' ')) {
            console.warn('⚠️  Password contains spaces - this might cause issues');
        }
        if (url.password && url.password.includes('%')) {
            console.warn('⚠️  Password contains % characters - check if URL encoding is needed');
        }
    }
    catch (parseError) {
        console.error('❌ Failed to parse DATABASE_URL:', parseError);
    }
    return new pg_1.Pool({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        },
        // Optimized connection pool settings for production
        max: process.env.NODE_ENV === 'production' ? 10 : 20, // Fewer connections in production
        idleTimeoutMillis: process.env.NODE_ENV === 'production' ? 30000 : 30000,
        connectionTimeoutMillis: process.env.NODE_ENV === 'production' ? 5000 : 2000, // Longer timeout in production
        // Additional production optimizations
        allowExitOnIdle: process.env.NODE_ENV === 'production',
    });
};
const pool = createPool();
// Enhanced test connection with more detailed logging
const testConnection = async () => {
    let client = null;
    try {
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔌 Attempting to connect to database...');
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
        }
        if (!process.env.DATABASE_URL) {
            console.error('❌ DATABASE_URL environment variable is not set');
            return false;
        }
        client = await pool.connect();
        if (process.env.NODE_ENV !== 'production') {
            console.log('✅ Successfully connected to database pool');
        }
        // Test basic query
        const result = await client.query('SELECT NOW() as current_time, version() as db_version');
        if (process.env.NODE_ENV !== 'production') {
            console.log('✅ Database query successful');
            console.log(`⏰ Current time: ${result.rows[0].current_time}`);
            console.log(`📊 Database version: ${result.rows[0].db_version.split(' ')[0]}`);
        }
        // Test if we can create a simple table (optional, for more thorough testing)
        try {
            await client.query(`
        CREATE TABLE IF NOT EXISTS connection_test (
          id SERIAL PRIMARY KEY,
          test_time TIMESTAMP DEFAULT NOW()
        )
      `);
            if (process.env.NODE_ENV !== 'production') {
                console.log('✅ Database write permissions verified');
            }
            // Clean up test table
            await client.query('DROP TABLE IF EXISTS connection_test');
            if (process.env.NODE_ENV !== 'production') {
                console.log('✅ Database cleanup successful');
            }
        }
        catch (writeError) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('⚠️  Database write test failed (this might be expected in some environments):', writeError);
            }
        }
        return true;
    }
    catch (err) {
        console.error('❌ Database connection failed:');
        console.error('Error details:', err);
        // Provide helpful error messages for common issues
        if (err instanceof Error) {
            if (err.message.includes('ECONNREFUSED')) {
                console.error('💡 Tip: Database server is not running or not accessible');
            }
            else if (err.message.includes('authentication failed')) {
                console.error('💡 Tip: Check your DATABASE_URL credentials');
            }
            else if (err.message.includes('does not exist')) {
                console.error('💡 Tip: Database does not exist, check your DATABASE_URL');
            }
            else if (err.message.includes('SSL')) {
                console.error('💡 Tip: SSL configuration issue, check your connection string');
            }
            else if (err.message.includes('client password must be a string')) {
                console.error('💡 Tip: Password format issue in DATABASE_URL');
                console.error('💡 Common fixes:');
                console.error('   - URL encode special characters in password');
                console.error('   - Remove any quotes around the DATABASE_URL');
                console.error('   - Check for extra spaces or newlines');
                console.error('   - Ensure password is properly formatted');
            }
        }
        return false;
    }
    finally {
        if (client) {
            client.release();
            if (process.env.NODE_ENV !== 'production') {
                console.log('🔌 Database client released');
            }
        }
    }
};
exports.testConnection = testConnection;
// Get a client from the pool
const getClient = () => {
    return pool.connect();
};
exports.getClient = getClient;
// Execute a query with error handling
const query = async (text, params) => {
    try {
        const result = await pool.query(text, params);
        return result;
    }
    catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};
exports.query = query;
// Close the pool gracefully
const closePool = async () => {
    try {
        await pool.end();
        console.log('🔌 Database pool closed successfully');
    }
    catch (error) {
        console.error('Error closing database pool:', error);
    }
};
exports.closePool = closePool;
// Health check function for monitoring
const healthCheck = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT 1 as health_check');
        client.release();
        return {
            status: 'healthy',
            details: {
                timestamp: new Date().toISOString(),
                poolSize: pool.totalCount,
                idleCount: pool.idleCount,
                waitingCount: pool.waitingCount
            }
        };
    }
    catch (error) {
        return {
            status: 'unhealthy',
            details: {
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        };
    }
};
exports.healthCheck = healthCheck;
exports.default = pool;
//# sourceMappingURL=connection.js.map