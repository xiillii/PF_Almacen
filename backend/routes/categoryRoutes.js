import express from 'express';
import { check } from 'express-validator';

import {
  getCategories,
  registerCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getCategories)
  .post(
    [
      check('code')
        .trim()
        .escape()
        .exists({ checkFalsy: true })
        .withMessage('Code must have more than 1 characters'),
      check('description').trim().escape(),
    ],
    protect,
    registerCategory
  );

export default router;
