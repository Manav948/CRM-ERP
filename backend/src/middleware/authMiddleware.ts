import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import type { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

interface JwtPayload {
  id: string;
  role: Role;
}

const DEMO_USERS_MAP: Record<string, { id: string; name: string; email: string; role: Role }> = {
  'demo-admin-id-1': { id: 'demo-admin-id-1', name: 'System Admin', email: 'admin@example.com', role: 'Admin' },
  'demo-sales-id-2': { id: 'demo-sales-id-2', name: 'Sarah Sales Manager', email: 'sales@example.com', role: 'Sales' },
  'demo-wh-id-3': { id: 'demo-wh-id-3', name: 'Walter Warehouse Keeper', email: 'warehouse@example.com', role: 'Warehouse' },
  'demo-accounts-id-4': { id: 'demo-accounts-id-4', name: 'Alice Accounts Officer', email: 'accounts@example.com', role: 'Accounts' },
};

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'secret12345';
      const decoded = jwt.verify(token as string, jwtSecret) as unknown as JwtPayload;

      let user: { id: string; name: string; email: string; role: Role } | null = null;

      try {
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });
      } catch (dbErr) {
        console.warn('[Auth Middleware] Database query failed, checking demo token map fallback');
      }

      if (!user && DEMO_USERS_MAP[decoded.id]) {
        user = DEMO_USERS_MAP[decoded.id]!;
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[Auth Middleware Error]', (error as Error).message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (req.user.role === 'Admin' || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `User role '${req.user.role}' is not authorized to access this resource`,
    });
  };
};
