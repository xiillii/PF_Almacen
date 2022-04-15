import express from 'express';

import {
  getWarehouses,
  registerWarehouse,
} from '../controllers/warehouseController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  warehouseValidate,
  warehouseValidationRules,
} from '../middleware/warehouseValidatorMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getWarehouses)
  .post(
    protect,
    warehouseValidationRules(),
    warehouseValidate,
    registerWarehouse
  );

export default router;
