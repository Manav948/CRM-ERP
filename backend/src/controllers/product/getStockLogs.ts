import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import type { Prisma } from '@prisma/client';

export const getStockLogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, page = '1', limit = '20' } = req.query;

    const where: Prisma.StockLogWhereInput = {};
    if (productId && typeof productId === 'string') {
      where.productId = productId;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [total, logs] = await Promise.all([
      prisma.stockLog.count({ where }),
      prisma.stockLog.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, sku: true, category: true, currentStock: true } },
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
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
