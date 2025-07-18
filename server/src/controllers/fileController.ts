import { Request, Response } from 'express';
import multer from 'multer';
import S3Service, { FileUploadResult } from '../services/s3Service';
import FileRepository, { FileRecord } from '../repositories/fileRepository';
import { HTTP_STATUS } from '@parishmart/shared';

// Configure multer for memory storage (no disk writes)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const purpose = req.path.includes('/media') ? 'media' : 'documents';
  
  try {
    // Validate file type based on purpose
    S3Service.validateFile(file, purpose as 'media' | 'documents');
    cb(null, true);
  } catch (error) {
    cb(error as Error);
  }
};

// Configure multer with appropriate limits
const createUploadMiddleware = (maxFileSize: number) => {
  return multer({
    storage: storage,
    limits: {
      fileSize: maxFileSize,
      files: 1 // Only allow one file at a time
    },
    fileFilter: fileFilter
  });
};

// Media upload middleware (50MB limit)
export const mediaUpload = createUploadMiddleware(50 * 1024 * 1024);

// Document upload middleware (10MB limit)
export const documentUpload = createUploadMiddleware(10 * 1024 * 1024);

export class FileController {
  /**
   * Upload media files (images/videos) to public bucket
   */
  static async uploadMedia(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Additional validation for media files
      if (!S3Service.validateFileContent(req.file.buffer, req.file.mimetype)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Invalid file content detected'
        });
      }

      // Get user ID from request (assuming authentication middleware sets this)
      const userId = (req as any).user?.id;

      // Upload to S3
      const uploadResult: FileUploadResult = await S3Service.uploadFile(
        req.file,
        'media',
        userId
      );

      // Store file metadata in database
      const fileRecord: FileRecord = await FileRepository.createFile({
        fileKey: uploadResult.fileKey,
        bucketType: uploadResult.bucket as 'public' | 'private',
        originalName: uploadResult.originalName,
        mimeType: uploadResult.mimeType,
        fileSize: uploadResult.size,
        url: uploadResult.directUrl,
        uploadedBy: userId,
        purpose: 'media',
        metadata: {
          uploadedVia: 'media-upload',
          contentType: req.file.mimetype
        }
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Media file uploaded successfully',
        data: {
          id: fileRecord.id,
          fileKey: fileRecord.file_key,
          originalName: fileRecord.original_name,
          url: fileRecord.url,
          size: fileRecord.file_size,
          mimeType: fileRecord.mime_type,
          isPublic: fileRecord.is_public,
          createdAt: fileRecord.created_at
        }
      });

    } catch (error) {
      console.error('Media upload error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid file type') || error.message.includes('exceeds maximum')) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: error.message
          });
        }
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to upload media file'
      });
    }
  }

  /**
   * Upload document files to private bucket
   */
  static async uploadDocument(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Additional validation for document files
      if (!S3Service.validateFileContent(req.file.buffer, req.file.mimetype)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Invalid file content detected'
        });
      }

      // Get user ID from request (assuming authentication middleware sets this)
      const userId = (req as any).user?.id;

      // Upload to S3
      const uploadResult: FileUploadResult = await S3Service.uploadFile(
        req.file,
        'documents',
        userId
      );

      // Store file metadata in database
      const fileRecord: FileRecord = await FileRepository.createFile({
        fileKey: uploadResult.fileKey,
        bucketType: uploadResult.bucket as 'public' | 'private',
        originalName: uploadResult.originalName,
        mimeType: uploadResult.mimeType,
        fileSize: uploadResult.size,
        url: uploadResult.directUrl,
        uploadedBy: userId,
        purpose: 'documents',
        metadata: {
          uploadedVia: 'document-upload',
          contentType: req.file.mimetype
        }
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          id: fileRecord.id,
          fileKey: fileRecord.file_key,
          originalName: fileRecord.original_name,
          url: fileRecord.url,
          size: fileRecord.file_size,
          mimeType: fileRecord.mime_type,
          isPublic: fileRecord.is_public,
          createdAt: fileRecord.created_at
        }
      });

    } catch (error) {
      console.error('Document upload error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid file type') || error.message.includes('exceeds maximum')) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: error.message
          });
        }
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to upload document'
      });
    }
  }

  /**
   * Generate signed URL for private files
   */
  static async generateSignedUrl(req: Request, res: Response) {
    try {
      const { fileKey } = req.params;
      const { expirationHours = 24 } = req.body;

      // Validate expiration time
      if (expirationHours < 1 || expirationHours > 168) { // Max 7 days
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Expiration time must be between 1 and 168 hours'
        });
      }

      // Get file record from database
      const fileRecord = await FileRepository.getFileByKey(fileKey);
      if (!fileRecord) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'File not found'
        });
      }

      // Check if file is private
      if (fileRecord.is_public) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Cannot generate signed URL for public files'
        });
      }

      // Generate signed URL
      const signedUrl = await S3Service.generateSignedUrl(
        fileRecord.file_key,
        fileRecord.bucket_type as 'public' | 'private',
        expirationHours * 60 * 60 // Convert hours to seconds
      );

      // Update file record with new signed URL
      await FileRepository.updateFileUrl(fileRecord.id, signedUrl.url);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Signed URL generated successfully',
        data: {
          fileId: fileRecord.id,
          fileKey: fileRecord.file_key,
          originalName: fileRecord.original_name,
          signedUrl: signedUrl.url,
          expiresAt: signedUrl.expiresAt,
          expirationHours: expirationHours
        }
      });

    } catch (error) {
      console.error('Signed URL generation error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to generate signed URL'
      });
    }
  }

  /**
   * Get file information
   */
  static async getFileInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fileId = parseInt(id);

      if (isNaN(fileId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Invalid file ID'
        });
      }

      const fileRecord = await FileRepository.getFileById(fileId);
      if (!fileRecord) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'File not found'
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          id: fileRecord.id,
          fileKey: fileRecord.file_key,
          originalName: fileRecord.original_name,
          mimeType: fileRecord.mime_type,
          size: fileRecord.file_size,
          isPublic: fileRecord.is_public,
          purpose: fileRecord.purpose,
          uploadedBy: fileRecord.uploaded_by,
          createdAt: fileRecord.created_at,
          updatedAt: fileRecord.updated_at,
          // Only include URL for public files or if user has permission
          url: fileRecord.is_public ? fileRecord.url : null
        }
      });

    } catch (error) {
      console.error('Get file info error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to get file information'
      });
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fileId = parseInt(id);

      if (isNaN(fileId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Invalid file ID'
        });
      }

      // Get file record
      const fileRecord = await FileRepository.getFileById(fileId);
      if (!fileRecord) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'File not found'
        });
      }

      // TODO: Add authorization check here
      // const userId = (req as any).user?.id;
      // if (fileRecord.uploaded_by !== userId && !isAdmin(userId)) {
      //   return res.status(HTTP_STATUS.FORBIDDEN).json({
      //     success: false,
      //     error: 'Not authorized to delete this file'
      //   });
      // }

      // Delete from S3
      await S3Service.deleteFile(
        fileRecord.file_key,
        fileRecord.bucket_type as 'public' | 'private'
      );

      // Delete from database
      await FileRepository.deleteFile(fileId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'File deleted successfully'
      });

    } catch (error) {
      console.error('Delete file error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to delete file'
      });
    }
  }

  /**
   * Get file statistics
   */
  static async getFileStats(req: Request, res: Response) {
    try {
      const stats = await FileRepository.getFileStats();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get file stats error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to get file statistics'
      });
    }
  }
}

export default FileController; 