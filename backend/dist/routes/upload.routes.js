"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controllers_1 = require("../controllers/upload.controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// Apply authentication to all upload routes
router.use(auth_middleware_1.protectRoute);
/**
 * POST /api/upload/file
 * Upload single file (Option A: Upload first, get URL)
 * Body: form-data with 'file' field
 */
router.post('/file', upload_middleware_1.uploadSingle, upload_controllers_1.uploadFile);
/**
 * POST /api/upload/filesMultiple
 * Upload multiple files (for future use)
 * Body: form-data with 'files' field (array)
 */
router.post('/filesMultiple', upload_middleware_1.uploadMultiple, upload_controllers_1.uploadFiles);
/**
 * GET /api/upload/files
 * Get user's uploaded files
 */
router.get('/files', upload_controllers_1.getUserFiles);
/**
 * DELETE /api/upload/files/:fileId
 * Delete uploaded file (cleanup)
 */
router.delete('/files/:fileId', upload_controllers_1.deleteFile);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map