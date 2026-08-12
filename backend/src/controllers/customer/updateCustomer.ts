import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import { customerSchema } from '../../utils/validators';
import type { CustomerStatus, CustomerType, Prisma } from '@prisma/client';

export const updateCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const customerId = req.params.id as string;
    const validatedData = customerSchema.partial().parse(req.body);

    const existingCustomer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const updateData: Prisma.CustomerUpdateInput = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.mobile !== undefined) updateData.mobile = validatedData.mobile;
    if (validatedData.email !== undefined) updateData.email = validatedData.email || null;
    if (validatedData.businessName !== undefined) updateData.businessName = validatedData.businessName;
    if (validatedData.gstNumber !== undefined) updateData.gstNumber = validatedData.gstNumber || null;
    if (validatedData.customerType !== undefined) updateData.customerType = validatedData.customerType as CustomerType;
    if (validatedData.address !== undefined) updateData.address = validatedData.address;
    if (validatedData.status !== undefined) updateData.status = validatedData.status as CustomerStatus;
    if (validatedData.followUpDate !== undefined) {
      updateData.followUpDate = validatedData.followUpDate ? new Date(validatedData.followUpDate) : null;
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: updateData,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({
      success: true,
      data: updatedCustomer,
    });
  } catch (error) {
    next(error);
  }
};
