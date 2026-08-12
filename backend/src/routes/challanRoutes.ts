import express from 'express';
import {
  createChallan,
  getChallans,
  getChallanById,
  updateChallanStatus,
  updateDraftChallan,
} from '../controllers/challan';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('Admin', 'Sales'), createChallan)
  .get(authorize('Admin', 'Sales', 'Accounts'), getChallans);

router
  .route('/:id')
  .get(authorize('Admin', 'Sales', 'Accounts'), getChallanById)
  .put(authorize('Admin', 'Sales'), updateDraftChallan);

router
  .route('/:id/status')
  .patch(authorize('Admin', 'Sales'), updateChallanStatus);

export default router;
