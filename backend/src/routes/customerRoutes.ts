import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  addCustomerNote,
} from '../controllers/customer';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('Admin', 'Sales'), createCustomer)
  .get(authorize('Admin', 'Sales', 'Accounts'), getCustomers);

router
  .route('/:id')
  .get(authorize('Admin', 'Sales', 'Accounts'), getCustomerById)
  .put(authorize('Admin', 'Sales'), updateCustomer);

router
  .route('/:id/notes')
  .post(authorize('Admin', 'Sales'), addCustomerNote);

export default router;
