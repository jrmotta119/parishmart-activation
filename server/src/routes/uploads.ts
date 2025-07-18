import { Router } from 'express';
import FileController, { mediaUpload, documentUpload } from '../controllers/fileController';
import { HTTP_STATUS } from '@parishmart/shared';

const router = Router();

// POST /api/upload/media - Upload images/videos to public bucket
router.post('/media', mediaUpload.single('file'), FileController.uploadMedia);

// POST /api/upload/documents - Upload documents to private bucket
router.post('/documents', documentUpload.single('file'), FileController.uploadDocument);

// POST /api/upload/signed-url/:fileKey - Generate signed URL for private files
router.post('/signed-url/:fileKey', FileController.generateSignedUrl);

// GET /api/upload/files/:id - Get file information
router.get('/files/:id', FileController.getFileInfo);

// DELETE /api/upload/files/:id - Delete file
router.delete('/files/:id', FileController.deleteFile);

// GET /api/upload/stats - Get file statistics
router.get('/stats', FileController.getFileStats);

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