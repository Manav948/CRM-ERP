import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  adjustStock,
  getStockLogs,
} from '../controllers/product';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router
  .route('/inventory/adjust')
  .post(authorize('Admin', 'Warehouse'), adjustStock);

router
  .route('/inventory/logs')
  .get(authorize('Admin', 'Warehouse', 'Sales', 'Accounts'), getStockLogs);

router
  .route('/')
  .post(authorize('Admin', 'Warehouse'), createProduct)
  .get(authorize('Admin', 'Warehouse', 'Sales', 'Accounts'), getProducts);

router
  .route('/:id')
  .get(authorize('Admin', 'Warehouse', 'Sales', 'Accounts'), getProductById)
  .put(authorize('Admin', 'Warehouse'), updateProduct);

export default router;
