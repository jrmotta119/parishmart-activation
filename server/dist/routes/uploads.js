"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileController_1 = __importStar(require("../controllers/fileController"));
const adminAuth_1 = require("../middleware/adminAuth");
const shared_1 = require("@parishmart/shared");
const router = (0, express_1.Router)();
// POST /api/upload/media - Upload images/videos to public bucket (used during registration, no auth)
router.post('/media', fileController_1.mediaUpload.single('file'), fileController_1.default.uploadMedia);
// POST /api/upload/documents - Upload documents to private bucket (used during registration, no auth)
router.post('/documents', fileController_1.documentUpload.single('file'), fileController_1.default.uploadDocument);
// POST /api/upload/signed-url/:fileKey - Generate signed URL for private files (admin only)
router.post('/signed-url/:fileKey', adminAuth_1.requireSuperAdminAuth, fileController_1.default.generateSignedUrl);
// GET /api/upload/files/:id - Get file information (admin only)
router.get('/files/:id', adminAuth_1.requireSuperAdminAuth, fileController_1.default.getFileInfo);
// DELETE /api/upload/files/:id - Delete file (admin only)
router.delete('/files/:id', adminAuth_1.requireSuperAdminAuth, fileController_1.default.deleteFile);
// GET /api/upload/stats - Get file statistics (admin only)
router.get('/stats', adminAuth_1.requireSuperAdminAuth, fileController_1.default.getFileStats);
// Error handling middleware for multer errors
router.use((error, req, res, next) => {
    if (error instanceof Error) {
        if (error.message.includes('File too large')) {
            return res.status(shared_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: 'File size exceeds the maximum allowed limit'
            });
        }
        if (error.message.includes('Only image files are allowed') ||
            error.message.includes('Invalid file type') ||
            error.message.includes('Invalid file content')) {
            return res.status(shared_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: error.message
            });
        }
    }
    console.error('Upload route error:', error);
    res.status(shared_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'File upload failed'
    });
});
exports.default = router;
//# sourceMappingURL=uploads.js.map