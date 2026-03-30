"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.getClient = exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});
const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
    return res;
};
exports.query = query;
const getClient = async () => {
    return await pool.connect();
};
exports.getClient = getClient;
const testConnection = async (retries = 5, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT NOW()');
            console.log('✅ Database connected successfully at:', result.rows[0].now);
            client.release();
            return;
        }
        catch (error) {
            const isLastAttempt = i === retries - 1;
            if (error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
                console.warn(`⚠️  Database connection attempt ${i + 1}/${retries} failed (DNS/Network issue). ${isLastAttempt ? 'Final attempt failed.' : `Retrying in ${delay / 1000}s...`}`);
                if (!isLastAttempt) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }
};
exports.testConnection = testConnection;
exports.default = pool;
//# sourceMappingURL=connection.js.map