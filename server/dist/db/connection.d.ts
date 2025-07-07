import { Pool, PoolClient } from 'pg';
declare const pool: Pool;
export declare const testConnection: () => Promise<boolean>;
export declare const getClient: () => Promise<PoolClient>;
export declare const query: (text: string, params?: any[]) => Promise<import("pg").QueryResult<any>>;
export declare const closePool: () => Promise<void>;
export declare const healthCheck: () => Promise<{
    status: "healthy" | "unhealthy";
    details: any;
}>;
export default pool;
//# sourceMappingURL=connection.d.ts.map