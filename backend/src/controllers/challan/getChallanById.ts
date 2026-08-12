import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import type { AuthRequest } from '../../middleware/authMiddleware';

export const getChallanById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const challanId = req.params.id as string;

    const challan = await prisma.challan.findUnique({
      where: { id: challanId },
      include: {
        items: true,
        customer: true,
        createdBy: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: 'Challan not found',
      });
    }

    res.json({
      success: true,
      data: challan,
    });
  } catch (error) {
    next(error);
  }
};
