import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';

export const getCustomerById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const customerId = req.params.id as string;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        notes: {
          include: {
            createdBy: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        challans: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};
