import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';

export const updateDraftChallan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const challanId = req.params.id as string;

    const challan = await prisma.challan.findUnique({ where: { id: challanId } });
    if (!challan) {
      return res.status(404).json({ success: false, message: 'Challan not found' });
    }

    if (challan.status !== 'Draft') {
      return res.status(400).json({ success: false, message: 'Only Draft challans can be edited' });
    }

    const { items, customerId } = req.body;

    let customerData = {};
    if (customerId) {
      const customer = await prisma.customer.findUnique({ where: { id: customerId } });
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
      customerData = {
        customerId: customer.id,
        customerName: customer.name,
        customerMobile: customer.mobile,
        customerBusiness: customer.businessName,
        customerAddress: customer.address,
      };
    }

    if (items && Array.isArray(items)) {
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

      for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product '${item.productId}' not found`,
          });
        }

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

      await prisma.challanItem.deleteMany({ where: { challanId } });

      const updatedChallan = await prisma.challan.update({
        where: { id: challanId },
        data: {
          ...customerData,
          totalQuantity,
          grandTotal,
          items: {
            create: itemSnapshots,
          },
        },
        include: { items: true },
      });

      return res.json({
        success: true,
        data: updatedChallan,
      });
    }

    const updatedChallan = await prisma.challan.update({
      where: { id: challanId },
      data: customerData,
      include: { items: true },
    });

    res.json({
      success: true,
      data: updatedChallan,
    });
  } catch (error) {
    next(error);
  }
};
