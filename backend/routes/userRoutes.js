import express from 'express';
import { check } from 'express-validator';
import {
  authUser,
  getUsers,
  registerUser,
  updateUser,
  deleteUser,
  getUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  userValidationRules,
  validate,
} from '../middleware/userValidatorMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getUsers);
router.post('/login', authUser);
router.route('/').post(userValidationRules(), validate, registerUser);
router
  .route('/:id')
  .delete(protect, deleteUser)
  .get(protect, getUser)
  .put(userValidationRules(), validate, updateUser);

export default router;
