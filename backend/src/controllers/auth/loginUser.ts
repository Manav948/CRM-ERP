import type { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import { loginSchema } from '../../utils/validators.js';

const generateToken = (id: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'secret12345';
  return jwt.sign({ id, role }, secret, { expiresIn: '30d' });
};

export const loginUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const emailLower = validatedData.email.toLowerCase();

    // 1. Query MongoDB Atlas for user
    const dbUser = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 2. Validate hashed password
    const isPasswordValid = await bcrypt.compare(validatedData.password, dbUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Issue JWT Token
    const token = generateToken(dbUser.id, dbUser.role);

    return res.json({
      success: true,
      token,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};
