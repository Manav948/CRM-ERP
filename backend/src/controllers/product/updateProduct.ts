import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import { productSchema } from '../../utils/validators';
import type { Prisma } from '@prisma/client';

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const productId = req.params.id as string;
    const validatedData = productSchema.partial().parse(req.body);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (validatedData.sku && validatedData.sku.toUpperCase() !== product.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku: validatedData.sku.toUpperCase() },
      });
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: `Product with SKU '${validatedData.sku}' already exists`,
        });
      }
    }

    const updateData: Prisma.ProductUpdateInput = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.sku !== undefined) updateData.sku = validatedData.sku.toUpperCase();
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.unitPrice !== undefined) updateData.unitPrice = validatedData.unitPrice;
    if (validatedData.currentStock !== undefined) updateData.currentStock = validatedData.currentStock;
    if (validatedData.minStockAlert !== undefined) updateData.minStockAlert = validatedData.minStockAlert;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};
