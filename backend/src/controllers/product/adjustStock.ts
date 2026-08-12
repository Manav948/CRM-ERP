import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import { stockAdjustmentSchema } from '../../utils/validators';
import type { MovementType } from '@prisma/client';

export const adjustStock = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { productId, quantityChanged, movementType, reason } = stockAdjustmentSchema.parse(req.body);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (movementType === 'OUT' && product.currentStock < quantityChanged) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for product '${product.name}' (SKU: ${product.sku}). Available: ${product.currentStock}, Requested reduction: ${quantityChanged}`,
      });
    }

    const newStock =
      movementType === 'OUT'
        ? product.currentStock - quantityChanged
        : product.currentStock + quantityChanged;

    const result = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { currentStock: newStock },
      });

      const stockLog = await tx.stockLog.create({
        data: {
          productId: product.id,
          quantityChanged,
          movementType: movementType as MovementType,
          reason,
          createdById: req.user!.id,
        },
      });

      return { updatedProduct, stockLog };
    });

    res.json({
      success: true,
      message: `Stock successfully adjusted (${movementType} ${quantityChanged})`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
