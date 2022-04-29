import express from 'express';

import { registerMovement } from '../controllers/kardexController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  kardexValidate,
  kardexValidationRules,
} from '../middleware/kardexValidatorMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, kardexValidationRules(), kardexValidate, registerMovement);

export default router;
