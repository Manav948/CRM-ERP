import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware';

export const getMe = async (req: AuthRequest,res: Response,next: NextFunction): Promise<void> => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
