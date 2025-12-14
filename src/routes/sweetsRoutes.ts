import { Router } from 'express';
import { 
  createSweet, 
  getAllSweets, 
  updateSweet, 
  deleteSweet,
  searchSweets
} from '../controllers/sweetsController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Standard Protected Routes
router.post('/', authenticateToken, createSweet);
router.get('/', authenticateToken, getAllSweets);
router.put('/:id', authenticateToken, updateSweet);

// Admin Only Route
router.delete('/:id', authenticateToken, requireAdmin, deleteSweet);

router.get('/search', authenticateToken, searchSweets); 

router.put('/:id', authenticateToken, updateSweet);
router.delete('/:id', authenticateToken, requireAdmin, deleteSweet);

export default router;