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

const router = express.Router();

router.route('/').get(protect, getUsers);
router.post('/login', authUser);
router
  .route('/')
  .post(
    [
      check('email')
        .trim()
        .escape()
        .normalizeEmail()
        .isEmail({ checkFalsy: true })
        .withMessage('Must be a valid email'),
      check('name')
        .trim()
        .escape()
        .exists({ checkFalsy: true })
        .withMessage('Name is mandatory'),
      check('password')
        .trim()
        .escape()
        .exists({ checkFalsy: true })
        .withMessage('Password is mandatory'),
    ],
    registerUser
  );
router
  .route('/:id')
  .put(protect, updateUser)
  .delete(protect, deleteUser)
  .get(protect, getUser);

export default router;
