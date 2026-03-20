import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, PutObjectCommandInput, HeadObjectCommandOutput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Get AWS region, default to us-east-2 based on your error
const AWS_REGION = process.env.AWS_REGION || 'us-east-2';

// S3 client with explicit region
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// FIXED: Correct environment variable names
const PUBLIC_BUCKET = process.env.AWS_PUBLIC_BUCKET_NAME;
const PRIVATE_BUCKET = process.env.AWS_PRIVATE_BUCKET_NAME;

// File type configurations (unchanged)
interface FileTypeConfig {
  maxSize: number;
  extensions: string[];
}

const PUBLIC_FILE_TYPES: Record<string, FileTypeConfig> = {
  'image/jpeg': { maxSize: 50 * 1024 * 1024, extensions: ['.jpg', '.jpeg'] },
  'image/png': { maxSize: 50 * 1024 * 1024, extensions: ['.png'] },
  'image/webp': { maxSize: 50 * 1024 * 1024, extensions: ['.webp'] },
  'video/mp4': { maxSize: 50 * 1024 * 1024, extensions: ['.mp4'] },
  'video/quicktime': { maxSize: 50 * 1024 * 1024, extensions: ['.mov'] }
};

const PRIVATE_FILE_TYPES: Record<string, FileTypeConfig> = {
  'application/pdf': { maxSize: 10 * 1024 * 1024, extensions: ['.pdf'] },
  'application/msword': { maxSize: 10 * 1024 * 1024, extensions: ['.doc'] },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
    maxSize: 10 * 1024 * 1024, 
    extensions: ['.docx'] 
  }
};

export interface FileUploadResult {
  fileKey: string;
  bucket: string;
  bucketName: string; 
  directUrl?: string; 
  size: number;
  mimeType: string;
  originalName: string;
  isPublic: boolean;
}

export interface SignedUrlResult {
  url: string;
  expiresAt: Date;
}

export class S3Service {
  /**
   * Get the actual bucket name for a bucket type
   */
  static getBucketName(bucketType: 'public' | 'private'): string {
    const bucketName = bucketType === 'public' ? PUBLIC_BUCKET : PRIVATE_BUCKET;
    if (!bucketName) {
      throw new Error(`${bucketType} bucket name not configured`);
    }
    return bucketName;
  }

  /**
   * Construct direct S3 URL (works for both public and private, but private needs signed access)
   */
  static constructS3Url(bucketName: string, fileKey: string): string {
    return `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  /**
   * Determine which bucket to use based on file type and purpose
   */
  static determineUploadBucket(fileType: string, purpose: 'media' | 'documents'): 'public' | 'private' {
    const publicTypes = Object.keys(PUBLIC_FILE_TYPES);
    const privateTypes = Object.keys(PRIVATE_FILE_TYPES);
    
    if (purpose === 'media' && publicTypes.includes(fileType)) {
      return 'public';
    } else if (purpose === 'documents' && privateTypes.includes(fileType)) {
      return 'private';
    }
    
    throw new Error(`Invalid file type ${fileType} for purpose ${purpose}`);
  }

  /**
   * Validate file type and size
   */
  static validateFile(file: Express.Multer.File, purpose: 'media' | 'documents'): void {
    const bucket = this.determineUploadBucket(file.mimetype, purpose);
    const fileTypes = bucket === 'public' ? PUBLIC_FILE_TYPES : PRIVATE_FILE_TYPES;
    
    if (!fileTypes[file.mimetype]) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
    
    const maxSize = fileTypes[file.mimetype].maxSize;
    if (file.size > maxSize) {
      throw new Error(`File size ${file.size} exceeds maximum allowed size ${maxSize}`);
    }

    // Validate file content using magic bytes
    if (!this.validateFileContent(file.buffer, file.mimetype)) {
      throw new Error(`File content does not match declared MIME type: ${file.mimetype}`);
    }
  }

  /**
   * Generate unique filename
   */
  static generateUniqueFilename(originalName: string, mimeType: string): string {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    
    return `${sanitizedBaseName}_${timestamp}_${uniqueId}${extension}`;
  }

  /**
   * Upload file to S3 - IMPROVED VERSION
   */
  static async uploadFile(
    file: Express.Multer.File, 
    purpose: 'media' | 'documents',
    userId?: string
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      this.validateFile(file, purpose);
      
      // Determine bucket
      const bucketType = this.determineUploadBucket(file.mimetype, purpose);
      const bucketName = this.getBucketName(bucketType);
      
      // Generate unique filename
      const fileName = this.generateUniqueFilename(file.originalname, file.mimetype);
      const folder = bucketType === 'public' ? 'media' : 'documents';
      const fullKey = `${folder}/${fileName}`;
      
      // Prepare upload parameters
      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: fullKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
        ServerSideEncryption: 'AES256',
        Metadata: {
          originalName: Buffer.from(file.originalname, 'utf8').toString('ascii').replace(/[^\x20-\x7E]/g, '_'),
          uploadedBy: userId || 'anonymous',
          uploadedAt: new Date().toISOString(),
          purpose: purpose
        }
      };
      
      // Upload to S3
      await s3.send(new PutObjectCommand(uploadParams));
      
      // IMPROVED: Always store the file key, only provide direct URL for public files
      const result: FileUploadResult = {
        fileKey: fullKey,
        bucket: bucketType,
        bucketName: bucketName,
        size: file.size,
        mimeType: file.mimetype,
        originalName: file.originalname,
        isPublic: bucketType === 'public'
      };

      // Only provide direct URL for public files
      if (bucketType === 'public') {
        result.directUrl = this.constructS3Url(bucketName, fullKey);
      }
      
      return result;
      
    } catch (error) {
      console.error('S3 upload error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown upload error occurred');
    }
  }

  /**
   * Generate signed URL for any file - IMPROVED
   */
  static async generateSignedUrl(
    fileKey: string, 
    bucketType: 'public' | 'private', 
    expirationSeconds: number = 24 * 60 * 60
  ): Promise<SignedUrlResult> {
    const bucketName = this.getBucketName(bucketType);
    
    // For public files, return the direct URL (no expiration needed)
    if (bucketType === 'public') {
      const directUrl = this.constructS3Url(bucketName, fileKey);
      return {
        url: directUrl,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year (effectively no expiration)
      };
    }
    
    // For private files, generate actual signed URL
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey
    });
    
    try {
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: expirationSeconds });
      const expiresAt = new Date(Date.now() + expirationSeconds * 1000);
      return {
        url: signedUrl,
        expiresAt: expiresAt
      };
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * NEW: Generate access URL - picks the right method automatically
   */
  static async generateAccessUrl(
    fileKey: string,
    bucketType: 'public' | 'private',
    expirationSeconds?: number
  ): Promise<string> {
    if (bucketType === 'public') {
      // For public files, return direct URL immediately
      const bucketName = this.getBucketName(bucketType);
      return this.constructS3Url(bucketName, fileKey);
    } else {
      // For private files, generate signed URL
      const result = await this.generateSignedUrl(fileKey, bucketType, expirationSeconds);
      return result.url;
    }
  }

  /**
   * Delete file from S3
   */
  static async deleteFile(fileKey: string, bucketType: 'public' | 'private'): Promise<void> {
    const bucketName = this.getBucketName(bucketType);
    
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey
    });
    
    try {
      await s3.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Get file metadata from S3
   */
  static async getFileMetadata(fileKey: string, bucketType: 'public' | 'private'): Promise<HeadObjectCommandOutput> {
    const bucketName = this.getBucketName(bucketType);
    
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: fileKey
    });
    
    try {
      return await s3.send(command);
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new Error('Failed to get file metadata');
    }
  }

  /**
   * Validate file content using magic bytes
   */
  static validateFileContent(buffer: Buffer, expectedMimeType: string): boolean {
    const signatures: { [key: string]: number[][] } = {
      'image/jpeg': [[0xFF, 0xD8, 0xFF]],
      'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
      'image/webp': [[0x52, 0x49, 0x46, 0x46], [0x57, 0x45, 0x42, 0x50]],
      'video/mp4': [[0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]],
      'video/quicktime': [[0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74]],
      'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
      'application/msword': [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4B, 0x03, 0x04]]
    };
    
    const expectedSignatures = signatures[expectedMimeType];
    if (!expectedSignatures) {
      return false;
    }
    
    // Special case for WEBP
    if (expectedMimeType === 'image/webp') {
      const hasRiff = buffer.length >= 4 && 
        buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
      const hasWebp = buffer.length >= 12 && 
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
      return hasRiff && hasWebp;
    }
    
    return expectedSignatures.some(signature => {
      if (buffer.length < signature.length) return false;
      return signature.every((byte, index) => buffer[index] === byte);
    });
  }
}

export default S3Service;