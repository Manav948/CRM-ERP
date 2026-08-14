import type { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import { registerUserSchema } from '../../utils/validators.js';

const generateToken = (id: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'secret12345';
  return jwt.sign({ id, role }, secret, { expiresIn: '30d' });
};

export const registerUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    const emailLower = validatedData.email.toLowerCase();

    // 1. Check if user already exists in MongoDB Atlas
    const userExists = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // 2. Hash password & create user in MongoDB Atlas
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: emailLower,
        password: hashedPassword,
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 3. Issue JWT Token
    const token = generateToken(newUser.id, newUser.role);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};
