import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection';

export async function requireSuperAdminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const secret = process.env.PARISHMART_ADMIN_JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const payload = jwt.verify(token, secret) as { superAdminId: number; iat: number };

    const result = await query(
      'SELECT is_active, last_logout FROM super_admins WHERE super_admin_id = $1',
      [payload.superAdminId]
    );

    const row = result.rows[0];
    if (!row?.is_active) {
      res.status(401).json({ error: 'Account is inactive' });
      return;
    }

    if (row.last_logout && payload.iat * 1000 < new Date(row.last_logout).getTime()) {
      res.status(401).json({ error: 'Token has been invalidated' });
      return;
    }

    (req as any).superAdminId = payload.superAdminId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
