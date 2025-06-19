import { Router } from 'express';
import { uploadFile, uploadFiles, deleteFile, getUserFiles} from '../controllers/upload.controllers';
import { protectRoute } from '../middleWare/auth.middleware';
import { uploadSingle, uploadMultiple } from '../middleWare/upload.middleware';

const router = Router();

// Apply authentication to all upload routes
router.use(protectRoute);

/**
 * POST /api/upload/file
 * Upload single file (Option A: Upload first, get URL)
 * Body: form-data with 'file' field
 */
router.post('/file', uploadSingle, uploadFile);

/**
 * POST /api/upload/files
 * Upload multiple files (for future use)
 * Body: form-data with 'files' field (array)
 */
router.post('/files/multiple', uploadMultiple, uploadFiles);

/**
 * DELETE /api/upload/:fileKey
 * Delete uploaded file (cleanup)
 */
router.get('/files', getUserFiles);

router.delete('/files/:fileId', deleteFile);

export default router;