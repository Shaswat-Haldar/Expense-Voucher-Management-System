import { Router } from 'express';
import { 
  createVoucher, listVouchers, getVoucher, updateVoucher, deleteVoucher,
  uploadEmployeeSignature, uploadDirectorSignature,
  submitVoucher, approveVoucher, rejectVoucher
} from './voucher.controller.js';
import { auth } from '../../middleware/auth.js';
import { roleGuard } from '../../middleware/roleGuard.js';
import { upload } from '../../middleware/upload.js';

const router = Router();

router.use(auth);

router.post('/', roleGuard('employee'), createVoucher);
router.get('/', listVouchers);
router.get('/:id', getVoucher);
router.patch('/:id', roleGuard('employee'), updateVoucher);
router.delete('/:id', roleGuard('employee'), deleteVoucher);

router.post('/:id/signature/employee', roleGuard('employee'), upload.single('signature'), uploadEmployeeSignature);
router.post('/:id/signature/director', roleGuard('director'), upload.single('signature'), uploadDirectorSignature);

router.post('/:id/submit', roleGuard('employee'), submitVoucher);
router.post('/:id/approve', roleGuard('director'), approveVoucher);
router.post('/:id/reject', roleGuard('director'), rejectVoucher);

export default router;
