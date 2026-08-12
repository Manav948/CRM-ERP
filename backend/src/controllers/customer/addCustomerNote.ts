import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';
import { customerNoteSchema } from '../../utils/validators';

export const addCustomerNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const customerId = req.params.id as string;
    const { text } = customerNoteSchema.parse(req.body);

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    await prisma.customerNote.create({
      data: {
        text,
        customerId,
        createdById: req.user!.id,
      },
    });

    const updatedCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        notes: {
          include: {
            createdBy: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
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
