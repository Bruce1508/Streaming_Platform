import { Router } from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { optionalSessionValidation } from '../middleware/session.middleware';
import { 
    getActiveSessions, 
    logoutSession, 
    logoutAllDevices 
} from '../controllers/session.controllers';

const router = Router();

// All session routes require authentication
router.use([
    optionalSessionValidation,  // Get session info
    protectRoute               // Require valid JWT
]);

// Session management endpoints
router.get('/sessions', getActiveSessions);
router.delete('/sessions', logoutAllDevices);
router.delete('/sessions/:sessionId', logoutSession);

export default router;