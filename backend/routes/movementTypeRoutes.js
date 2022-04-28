import express from 'express';

import {
  getMovementTypes,
  registerMovementType,
  updateMovementType,
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

router
  .route('/:id')
  .put(
    protect,
    movementTypeValidationRules(),
    movementTypeValidate,
    updateMovementType
  );

export default router;
