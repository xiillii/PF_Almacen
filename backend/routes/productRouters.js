import express from 'express';

import { getProducts } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  productValidate,
  productValidationRules,
} from '../middleware/productValidatorMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getProducts);

export default router;
