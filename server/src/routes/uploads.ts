import { Router } from 'express';
import FileController, { mediaUpload, documentUpload } from '../controllers/fileController';
import { requireSuperAdminAuth } from '../middleware/adminAuth';
import { HTTP_STATUS } from '@parishmart/shared';

const router = Router();

// POST /api/upload/media - Upload images/videos to public bucket (used during registration, no auth)
router.post('/media', mediaUpload.single('file'), FileController.uploadMedia);

// POST /api/upload/documents - Upload documents to private bucket (used during registration, no auth)
router.post('/documents', documentUpload.single('file'), FileController.uploadDocument);

// POST /api/upload/signed-url/:fileKey - Generate signed URL for private files (admin only)
router.post('/signed-url/:fileKey', requireSuperAdminAuth, FileController.generateSignedUrl);

// GET /api/upload/files/:id - Get file information (admin only)
router.get('/files/:id', requireSuperAdminAuth, FileController.getFileInfo);

// DELETE /api/upload/files/:id - Delete file (admin only)
router.delete('/files/:id', requireSuperAdminAuth, FileController.deleteFile);

// GET /api/upload/stats - Get file statistics (admin only)
router.get('/stats', requireSuperAdminAuth, FileController.getFileStats);

// Error handling middleware for multer errors
router.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof Error) {
    if (error.message.includes('File too large')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'File size exceeds the maximum allowed limit'
      });
    }
    
    if (error.message.includes('Only image files are allowed') || 
        error.message.includes('Invalid file type') ||
        error.message.includes('Invalid file content')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error.message
      });
    }
  }
  
  console.error('Upload route error:', error);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'File upload failed'
  });
});

export default router; 