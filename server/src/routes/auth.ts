import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { timingSafeEqual } from 'crypto';
import rateLimit from 'express-rate-limit';
import { query } from '../db/connection';
import { HTTP_STATUS } from '@parishmart/shared';
import { requireSuperAdminAuth } from '../middleware/adminAuth';

const router = Router();

const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later' },
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // TODO: Implement login logic
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Login endpoint - to be implemented',
  });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  // TODO: Implement registration logic
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Register endpoint - to be implemented',
  });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  // TODO: Implement logout logic
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logout endpoint - to be implemented',
  });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  // TODO: Implement token refresh logic
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Refresh token endpoint - to be implemented',
  });
});

/**
 * POST /api/auth/admin/login
 * Authenticate a super admin and return a JWT
 */
router.post('/admin/login', adminAuthLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Email and password are required' });
  }

  try {
    const secret = process.env.PARISHMART_ADMIN_JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const result = await query(
      `SELECT super_admin_id, email, password_hash, first_name, last_name, role, is_active
       FROM super_admins
       WHERE email = $1 AND is_active = true`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const passwordValid = await bcrypt.compare(password, admin.password_hash);

    if (!passwordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    }

    // Update last_login
    await query(
      'UPDATE super_admins SET last_login = NOW() WHERE super_admin_id = $1',
      [admin.super_admin_id]
    );

    const token = jwt.sign(
      { superAdminId: admin.super_admin_id },
      secret,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      firstName: admin.first_name,
      lastName: admin.last_name,
      role: admin.role,
    });

  } catch (error) {
    console.error('❌ Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/admin/setup
 * One-time bootstrap: create first super admin account.
 * Fails if any active super_admin already exists.
 * Requires PARISHMART_ADMIN_SETUP_SECRET in request body.
 */
router.post('/admin/setup', adminAuthLimiter, async (req, res) => {
  const { setupSecret, email, password, firstName, lastName } = req.body;

  const configuredSecret = process.env.PARISHMART_ADMIN_SETUP_SECRET;
  const secretsMatch =
    configuredSecret &&
    typeof setupSecret === 'string' &&
    setupSecret.length === configuredSecret.length &&
    timingSafeEqual(Buffer.from(setupSecret), Buffer.from(configuredSecret));
  if (!secretsMatch) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Invalid setup secret' });
  }

  if (!email || !password || !firstName || !lastName) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'email, password, firstName, and lastName are required' });
  }

  try {
    // Check if any active super_admin already exists
    const existing = await query(
      'SELECT COUNT(*) as count FROM super_admins WHERE is_active = true'
    );
    if (parseInt(existing.rows[0].count) > 0) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Setup already complete — active admin account exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO super_admins (email, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, 'super_admin', true)
       RETURNING super_admin_id, email, first_name, last_name, role`,
      [email.toLowerCase().trim(), passwordHash, firstName, lastName]
    );

    console.log(`✅ Super admin created: ${result.rows[0].email}`);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Super admin account created',
      admin: result.rows[0],
    });

  } catch (error) {
    console.error('❌ Admin setup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/admin/logout
 * Invalidates the current token by recording last_logout timestamp.
 */
router.post('/admin/logout', requireSuperAdminAuth, async (req, res) => {
  const superAdminId = (req as any).superAdminId as number;
  try {
    await query(
      'UPDATE super_admins SET last_logout = NOW(), last_dashboard_view = NOW() WHERE super_admin_id = $1',
      [superAdminId]
    );
    return res.json({ success: true });
  } catch (error) {
    console.error('❌ Admin logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
