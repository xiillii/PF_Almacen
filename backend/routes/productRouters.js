import express from 'express';

import {
  deleteProduct,
  getProducts,
  patchProduct,
  registerProduct,
  updateProduct,
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

router
  .route('/:id')
  .put(protect, productValidationRules(), productValidate, updateProduct)
  .patch(protect, patchProduct)
  .delete(protect, deleteProduct);

export default router;
