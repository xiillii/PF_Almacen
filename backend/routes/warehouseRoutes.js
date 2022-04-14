import express from 'express';

import { getWarehouses } from '../controllers/warehouseController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  warehouseValidate,
  warehouseValidationRules,
} from '../middleware/warehouseValidatorMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getWarehouses);

export default router;
