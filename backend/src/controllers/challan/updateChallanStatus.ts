import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';

export const updateChallanStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const challanId = req.params.id as string;
    const { status } = req.body;

    if (!['Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values are 'Confirmed' or 'Cancelled'",
      });
    }

    const challan = await prisma.challan.findUnique({
      where: { id: challanId },
      include: { items: true },
    });

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: 'Challan not found',
      });
    }

    if (challan.status === status) {
      return res.status(400).json({
        success: false,
        message: `Challan is already in '${status}' status`,
      });
    }

    if (status === 'Confirmed') {
      if (challan.status !== 'Draft') {
        return res.status(400).json({
          success: false,
          message: `Cannot confirm a challan with status '${challan.status}'`,
        });
      }

      for (const item of challan.items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product '${item.name}' (SKU: ${item.sku}) no longer exists`,
          });
        }
        if (product.currentStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product '${product.name}' (SKU: ${product.sku}). Available: ${product.currentStock}, Requested: ${item.quantity}`,
          });
        }
      }

      const updated = await prisma.$transaction(async (tx) => {
        for (const item of challan.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { currentStock: { decrement: item.quantity } },
          });

          await tx.stockLog.create({
            data: {
              productId: item.productId,
              quantityChanged: item.quantity,
              movementType: 'OUT',
              reason: `Sales Challan ${challan.challanNumber}`,
              createdById: req.user!.id,
            },
          });
        }

        return await tx.challan.update({
          where: { id: challanId },
          data: { status: 'Confirmed' },
          include: { items: true },
        });
      });

      return res.json({
        success: true,
        message: "Challan status updated to 'Confirmed'",
        data: updated,
      });
    }

    if (status === 'Cancelled') {
      const updated = await prisma.$transaction(async (tx) => {
        if (challan.status === 'Confirmed') {
          for (const item of challan.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { currentStock: { increment: item.quantity } },
            });

            await tx.stockLog.create({
              data: {
                productId: item.productId,
                quantityChanged: item.quantity,
                movementType: 'IN',
                reason: `Cancelled Sales Challan ${challan.challanNumber}`,
                createdById: req.user!.id,
              },
            });
          }
        }

        return await tx.challan.update({
          where: { id: challanId },
          data: { status: 'Cancelled' },
          include: { items: true },
        });
      });

      return res.json({
        success: true,
        message: "Challan status updated to 'Cancelled'",
        data: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};
