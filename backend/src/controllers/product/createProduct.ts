import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import { productSchema } from '../../utils/validators';

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const validatedData = productSchema.parse(req.body);

    const existingSku = await prisma.product.findUnique({
      where: { sku: validatedData.sku.toUpperCase() },
    });

    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: `Product with SKU '${validatedData.sku}' already exists`,
      });
    }

    const product = await prisma.$transaction(async (tx) => {
      const newProd = await tx.product.create({
        data: {
          name: validatedData.name,
          sku: validatedData.sku.toUpperCase(),
          category: validatedData.category,
          unitPrice: validatedData.unitPrice,
          currentStock: validatedData.currentStock,
          minStockAlert: validatedData.minStockAlert,
          location: validatedData.location || 'Main Warehouse',
          createdById: req.user?.id || null,
        },
      });

      if (newProd.currentStock > 0) {
        await tx.stockLog.create({
          data: {
            productId: newProd.id,
            quantityChanged: newProd.currentStock,
            movementType: 'IN',
            reason: 'Initial stock setup',
            createdById: req.user!.id,
          },
        });
      }

      return newProd;
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
