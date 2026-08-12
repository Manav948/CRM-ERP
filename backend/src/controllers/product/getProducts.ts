import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import type { Prisma } from '@prisma/client';

export const getProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, category, lowStock, page = '1', limit = '10' } = req.query;

    const where: Prisma.ProductWhereInput = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && typeof category === 'string') {
      where.category = category;
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    let products = await prisma.product.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (lowStock === 'true') {
      products = products.filter((p) => p.currentStock <= p.minStockAlert);
    }

    const total = products.length;
    const paginatedProducts = products.slice(skip, skip + limitNum);

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: paginatedProducts,
    });
  } catch (error) {
    next(error);
  }
};
