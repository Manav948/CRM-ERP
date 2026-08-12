import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import { createChallanSchema } from '../../utils/validators';
import type { ChallanStatus } from '@prisma/client';

const generateChallanNumber = async (): Promise<string> => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await prisma.challan.count();
  const sequence = String(count + 1).padStart(4, '0');
  return `CH-${dateStr}-${sequence}`;
};

export const createChallan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { customerId, items, status } = createChallanSchema.parse(req.body);

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const itemSnapshots: {
      productId: string;
      sku: string;
      name: string;
      unitPrice: number;
      quantity: number;
      totalAmount: number;
    }[] = [];

    let totalQuantity = 0;
    let grandTotal = 0;

    const productDocs: { product: any; requestedQuantity: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${item.productId}' not found`,
        });
      }

      productDocs.push({ product, requestedQuantity: item.quantity });

      const itemTotal = product.unitPrice * item.quantity;
      totalQuantity += item.quantity;
      grandTotal += itemTotal;

      itemSnapshots.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        unitPrice: product.unitPrice,
        quantity: item.quantity,
        totalAmount: itemTotal,
      });
    }

    const challanNumber = await generateChallanNumber();

    if (status === 'Confirmed') {
      for (const entry of productDocs) {
        if (entry.product.currentStock < entry.requestedQuantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product '${entry.product.name}' (SKU: ${entry.product.sku}). Available: ${entry.product.currentStock}, Requested: ${entry.requestedQuantity}`,
          });
        }
      }
    }

    const challan = await prisma.$transaction(async (tx) => {
      if (status === 'Confirmed') {
        for (const entry of productDocs) {
          await tx.product.update({
            where: { id: entry.product.id },
            data: { currentStock: { decrement: entry.requestedQuantity } },
          });

          await tx.stockLog.create({
            data: {
              productId: entry.product.id,
              quantityChanged: entry.requestedQuantity,
              movementType: 'OUT',
              reason: `Sales Challan ${challanNumber}`,
              createdById: req.user!.id,
            },
          });
        }
      }

      const newChallan = await tx.challan.create({
        data: {
          challanNumber,
          customerId: customer.id,
          customerName: customer.name,
          customerMobile: customer.mobile,
          customerBusiness: customer.businessName,
          customerAddress: customer.address,
          status: (status as ChallanStatus) || 'Draft',
          totalQuantity,
          grandTotal,
          createdById: req.user!.id,
          items: {
            create: itemSnapshots,
          },
        },
        include: {
          items: true,
          createdBy: { select: { id: true, name: true, email: true, role: true } },
        },
      });

      return newChallan;
    });

    res.status(201).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    next(error);
  }
};
