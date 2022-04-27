import express from 'express';

import {
  getMovementTypes,
  registerMovementType,
} from '../controllers/movementTypeController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  movementTypeValidate,
  movementTypeValidationRules,
} from '../middleware/movementTypeValidatorMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getMovementTypes)
  .post(
    protect,
    movementTypeValidationRules(),
    movementTypeValidate,
    registerMovementType
  );

export default router;
