import { Router } from 'express';
import { protectRoute } from '../middleWare/auth.middleware';
import { optionalSessionValidation } from '../middleWare/session.middleware';
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
router.delete('/sessions/:sessionId', logoutSession);  
router.delete('/sessions', logoutAllDevices);

export default router;