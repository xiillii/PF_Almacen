import express from 'express';

import {
  getCategories,
  registerCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  categoryValidationRules,
  categoryValidate,
} from '../middleware/categoryValidatorMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getCategories)
  .post(protect, categoryValidationRules(), categoryValidate, registerCategory);

router
  .route('/:id')
  .put(protect, categoryValidationRules(), categoryValidate, updateCategory)
  .delete(protect, deleteCategory);

export default router;
