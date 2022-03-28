import express from 'express';
import {
  authUser,
  getUsers,
  registerUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getUsers);
router.post('/login', authUser);
router.route('/').post(registerUser);
router.route('/:id').put(protect, updateUser).delete(protect, deleteUser);

export default router;
