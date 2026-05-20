import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leadController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/export', exportLeads);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead);

export default router;