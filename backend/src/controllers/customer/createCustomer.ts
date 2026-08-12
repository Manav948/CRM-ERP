import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import { customerSchema } from '../../utils/validators';
import type { CustomerStatus, CustomerType } from '@prisma/client';

export const createCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = customerSchema.parse(req.body);

    const customer = await prisma.customer.create({
      data: {
        name: validatedData.name,
        mobile: validatedData.mobile,
        email: validatedData.email || null,
        businessName: validatedData.businessName,
        gstNumber: validatedData.gstNumber || null,
        customerType: validatedData.customerType as CustomerType,
        address: validatedData.address,
        status: validatedData.status as CustomerStatus,
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
        createdById: req.user?.id || null,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};
