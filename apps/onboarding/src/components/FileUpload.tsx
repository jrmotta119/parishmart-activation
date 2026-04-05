import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Upload, File, Image, FileText, X, Download } from 'lucide-react';

interface UploadedFile {
  id: number;
  fileKey: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  isPublic: boolean;
  createdAt: string;
}

interface FileUploadProps {
  onFileUploaded?: (file: UploadedFile) => void;
  purpose: 'media' | 'documents';
  maxSize?: number;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  purpose,
  maxSize = purpose === 'media' ? 50 * 1024 * 1024 : 10 * 1024 * 1024,
  className = ''
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const getAcceptedFileTypes = () => {
    if (purpose === 'media') {
      return '.jpg,.jpeg,.png,.webp,.mp4,.mov';
    } else {
      return '.pdf,.doc,.docx';
    }
  };

  const getMaxSizeMB = () => {
    return Math.round(maxSize / (1024 * 1024));
  };

  const validateFile = (selectedFile: File): string | null => {
    // Check file size
    if (selectedFile.size > maxSize) {
      return `File size must be less than ${getMaxSizeMB()}MB`;
    }

    // Check file type based on purpose
    const mediaTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    const documentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (purpose === 'media' && !mediaTypes.includes(selectedFile.type)) {
      return 'Please select a valid image or video file';
    }

    if (purpose === 'documents' && !documentTypes.includes(selectedFile.type)) {
      return 'Please select a valid document file (PDF, DOC, DOCX)';
    }

    return null;
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setUploadedFile(null);

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
  }, [purpose, maxSize]);

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = purpose === 'media' ? '/api/upload/media' : '/api/upload/documents';

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (result.success) {
        setUploadedFile(result.data);
        onFileUploaded?.(result.data);
        setFile(null);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setUploadedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <File className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload {purpose === 'media' ? 'Media' : 'Document'}
          </CardTitle>
          <CardDescription>
            {purpose === 'media' 
              ? 'Upload images (JPG, PNG, WebP) or videos (MP4, MOV) up to 50MB'
              : 'Upload documents (PDF, DOC, DOCX) up to 10MB'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!uploadedFile ? (
            <>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept={getAcceptedFileTypes()}
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="flex-1"
                />
                {file && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFile}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {file.type}
                  </Badge>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button
                onClick={uploadFile}
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  File uploaded successfully!
                </AlertDescription>
              </Alert>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                {getFileIcon(uploadedFile.mimeType)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.size)} • {uploadedFile.isPublic ? 'Public' : 'Private'}
                  </p>
                </div>
                <Badge variant={uploadedFile.isPublic ? 'default' : 'secondary'}>
                  {uploadedFile.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>

              {uploadedFile.url && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(uploadedFile.url, '_blank')}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {uploadedFile.isPublic ? 'View File' : 'Download'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFile}
                  >
                    Upload Another
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload; 