import { Router } from 'express';
import { purchaseSweet, restockSweet } from '../controllers/inventoryController';
import { authenticateToken,requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/:id/purchase', authenticateToken, purchaseSweet);
router.post('/:id/restock', authenticateToken, requireAdmin, restockSweet);

export default router;