import { Router } from 'express';
import { signup, login, deleteUser, updateUser, resetPassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.delete('/:email', authenticateToken, deleteUser);
router.put('/:email', authenticateToken, updateUser);
router.post('/reset-password', authenticateToken, resetPassword);

// Example protected test route
router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'You are authorized!' });
});

export default router;