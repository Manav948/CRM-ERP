import express from 'express';
import { loginUser, getMe, registerUser } from '../controllers/auth';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getMe);

export default router;
