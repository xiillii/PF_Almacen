import express from 'express';

import {
  deleteProduct,
  getProduct,
  getProducts,
  patchProduct,
  registerProduct,
  updateProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  productValidate,
  productValidationRules,
  productValidationUpdateRules,
} from '../middleware/productValidatorMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getProducts)
  .post(protect, productValidationRules(), productValidate, registerProduct);

router
  .route('/:id')
  .put(protect, productValidationUpdateRules(), productValidate, updateProduct)
  .patch(protect, patchProduct)
  .delete(protect, deleteProduct)
  .get(protect, getProduct);

export default router;
