import { query } from '../db/connection';
import { FileUploadResult } from '../services/s3Service';

export interface FileRecord {
  id: number;
  file_key: string;
  bucket_type: 'public' | 'private';
  original_name: string;
  mime_type: string;
  file_size: number;
  url: string | null;
  is_public: boolean;
  uploaded_by: string | null;
  purpose: 'media' | 'documents';
  metadata: any;
  created_at: Date;
  updated_at: Date;
}

export interface CreateFileData {
  fileKey: string;
  bucketType: 'public' | 'private';
  originalName: string;
  mimeType: string;
  fileSize: number;
  url?: string;
  uploadedBy?: string;
  purpose: 'media' | 'documents';
  metadata?: any;
}

export class FileRepository {
  /**
   * Create a new file record
   */
  static async createFile(data: CreateFileData): Promise<FileRecord> {
    const {
      fileKey,
      bucketType,
      originalName,
      mimeType,
      fileSize,
      url,
      uploadedBy,
      purpose,
      metadata
    } = data;

    const isPublic = bucketType === 'public';

    const result = await query(
      `INSERT INTO files (
        file_key, bucket_type, original_name, mime_type, file_size, 
        url, is_public, uploaded_by, purpose, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        fileKey,
        bucketType,
        originalName,
        mimeType,
        fileSize,
        url || null,
        isPublic,
        uploadedBy || null,
        purpose,
        metadata ? JSON.stringify(metadata) : null
      ]
    );

    return result.rows[0];
  }

  /**
   * Get file by ID
   */
  static async getFileById(id: number): Promise<FileRecord | null> {
    const result = await query(
      'SELECT * FROM files WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Get file by file key
   */
  static async getFileByKey(fileKey: string): Promise<FileRecord | null> {
    const result = await query(
      'SELECT * FROM files WHERE file_key = $1',
      [fileKey]
    );

    return result.rows[0] || null;
  }

  /**
   * Get files by user
   */
  static async getFilesByUser(uploadedBy: string, limit: number = 50, offset: number = 0): Promise<FileRecord[]> {
    const result = await query(
      `SELECT * FROM files 
       WHERE uploaded_by = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [uploadedBy, limit, offset]
    );

    return result.rows;
  }

  /**
   * Get files by purpose
   */
  static async getFilesByPurpose(purpose: 'media' | 'documents', limit: number = 50, offset: number = 0): Promise<FileRecord[]> {
    const result = await query(
      `SELECT * FROM files 
       WHERE purpose = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [purpose, limit, offset]
    );

    return result.rows;
  }

  /**
   * Get public files
   */
  static async getPublicFiles(limit: number = 50, offset: number = 0): Promise<FileRecord[]> {
    const result = await query(
      `SELECT * FROM files 
       WHERE is_public = true 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  }

  /**
   * Update file URL (for private files when generating new signed URLs)
   */
  static async updateFileUrl(id: number, url: string): Promise<FileRecord | null> {
    const result = await query(
      'UPDATE files SET url = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [url, id]
    );

    return result.rows[0] || null;
  }

  /**
   * Update file metadata
   */
  static async updateFileMetadata(id: number, metadata: any): Promise<FileRecord | null> {
    const result = await query(
      'UPDATE files SET metadata = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [JSON.stringify(metadata), id]
    );

    return result.rows[0] || null;
  }

  /**
   * Delete file record
   */
  static async deleteFile(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM files WHERE id = $1',
      [id]
    );

    return (result.rowCount || 0) > 0;
  }

  /**
   * Get file statistics
   */
  static async getFileStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    publicFiles: number;
    privateFiles: number;
    mediaFiles: number;
    documentFiles: number;
  }> {
    const result = await query(`
      SELECT 
        COUNT(*) as total_files,
        COALESCE(SUM(file_size), 0) as total_size,
        COUNT(*) FILTER (WHERE is_public = true) as public_files,
        COUNT(*) FILTER (WHERE is_public = false) as private_files,
        COUNT(*) FILTER (WHERE purpose = 'media') as media_files,
        COUNT(*) FILTER (WHERE purpose = 'documents') as document_files
      FROM files
    `);

    const stats = result.rows[0];
    return {
      totalFiles: parseInt(stats.total_files),
      totalSize: parseInt(stats.total_size),
      publicFiles: parseInt(stats.public_files),
      privateFiles: parseInt(stats.private_files),
      mediaFiles: parseInt(stats.media_files),
      documentFiles: parseInt(stats.document_files)
    };
  }

  /**
   * Search files by original name
   */
  static async searchFiles(searchTerm: string, limit: number = 50, offset: number = 0): Promise<FileRecord[]> {
    const result = await query(
      `SELECT * FROM files 
       WHERE original_name ILIKE $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [`%${searchTerm}%`, limit, offset]
    );

    return result.rows;
  }

  /**
   * Get files by date range
   */
  static async getFilesByDateRange(
    startDate: Date, 
    endDate: Date, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<FileRecord[]> {
    const result = await query(
      `SELECT * FROM files 
       WHERE created_at BETWEEN $1 AND $2 
       ORDER BY created_at DESC 
       LIMIT $3 OFFSET $4`,
      [startDate, endDate, limit, offset]
    );

    return result.rows;
  }

  /**
   * Clean up expired signed URLs (set them to null)
   */
  static async cleanupExpiredUrls(): Promise<number> {
    const result = await query(
      `UPDATE files 
       SET url = NULL, updated_at = NOW() 
       WHERE is_public = false 
       AND url IS NOT NULL 
       AND updated_at < NOW() - INTERVAL '24 hours'`
    );

    return result.rowCount || 0;
  }
}

export default FileRepository; 