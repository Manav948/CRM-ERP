import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';

export const getProductById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const productId = req.params.id as string;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        stockLogs: {
          include: { createdBy: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
