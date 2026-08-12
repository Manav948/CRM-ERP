import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import type { ChallanStatus, Prisma } from '@prisma/client';

export const getChallans = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status, page = '1', limit = '10' } = req.query;

    const where: Prisma.ChallanWhereInput = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { challanNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerBusiness: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && typeof status === 'string') {
      where.status = status as ChallanStatus;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [total, challans] = await Promise.all([
      prisma.challan.count({ where }),
      prisma.challan.findMany({
        where,
        include: {
          items: true,
          createdBy: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
    ]);

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: challans,
    });
  } catch (error) {
    next(error);
  }
};
