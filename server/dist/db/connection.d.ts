import { Pool, PoolClient, QueryResult } from 'pg';
declare const pool: Pool;
export declare const query: (text: string, params?: any[]) => Promise<QueryResult>;
export declare const getClient: () => Promise<PoolClient>;
export declare const testConnection: (retries?: number, delay?: number) => Promise<void>;
export default pool;
//# sourceMappingURL=connection.d.ts.map