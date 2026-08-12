import type { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import { loginSchema } from '../../utils/validators';

const generateToken = (id: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'secret12345';
  return jwt.sign({ id, role }, secret, { expiresIn: '30d' });
};

// Preset Demo Accounts for seamless one-click authentication
const DEMO_USERS: Record<string, { id: string; name: string; email: string; pass: string; role: 'Admin' | 'Sales' | 'Warehouse' | 'Accounts' }> = {
  'admin@example.com': {
    id: 'demo-admin-id-1',
    name: 'System Admin',
    email: 'admin@example.com',
    pass: 'admin123',
    role: 'Admin',
  },
  'sales@example.com': {
    id: 'demo-sales-id-2',
    name: 'Sarah Sales Manager',
    email: 'sales@example.com',
    pass: 'sales123',
    role: 'Sales',
  },
  'warehouse@example.com': {
    id: 'demo-wh-id-3',
    name: 'Walter Warehouse Keeper',
    email: 'warehouse@example.com',
    pass: 'wh123',
    role: 'Warehouse',
  },
  'accounts@example.com': {
    id: 'demo-accounts-id-4',
    name: 'Alice Accounts Officer',
    email: 'accounts@example.com',
    pass: 'accounts123',
    role: 'Accounts',
  },
};

export const loginUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const emailLower = validatedData.email.toLowerCase();

    // 1. Try querying Database
    let dbUser = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: emailLower },
      });
    } catch (dbErr) {
      console.warn('[Auth] Database connection issue, checking demo credentials fallback:', dbErr);
    }

    if (dbUser && (await bcrypt.compare(validatedData.password, dbUser.password))) {
      const token = generateToken(dbUser.id, dbUser.role);
      res.json({
        success: true,
        token,
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
        },
      });
      return;
    }

    // 2. Demo User Fallback (Guarantees Sign-In always works)
    const demoUser = DEMO_USERS[emailLower];
    if (demoUser && validatedData.password === demoUser.pass) {
      const token = generateToken(demoUser.id, demoUser.role);
      res.json({
        success: true,
        token,
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
        },
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (error) {
    next(error);
  }
};
