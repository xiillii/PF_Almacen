import express from 'express';

import {
  getProducts,
  registerProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  productValidate,
  productValidationRules,
} from '../middleware/productValidatorMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getProducts)
  .post(protect, productValidationRules(), productValidate, registerProduct);

export default router;
