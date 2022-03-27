import express from 'express';
import { authUser, getUsers } from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getUsers);
router.post('/login', authUser);

export default router;
