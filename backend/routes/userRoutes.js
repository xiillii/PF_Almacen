import express from 'express';
import {
  authUser,
  getUsers,
  registerUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getUsers);
router.post('/login', authUser);
router.route('/').post(registerUser);

export default router;
