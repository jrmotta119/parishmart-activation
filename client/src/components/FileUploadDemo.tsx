import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Image, FileText, Upload, Download, Calendar, User } from 'lucide-react';

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

const FileUploadDemo: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFiles(prev => [file, ...prev]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const mediaFiles = uploadedFiles.filter(file => file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/'));
  const documentFiles = uploadedFiles.filter(file => file.mimeType.startsWith('application/'));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Secure File Upload System</h1>
        <p className="text-muted-foreground">
          Upload and manage files with separate public and private storage buckets
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="media">Media Files</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              purpose="media"
              onFileUploaded={handleFileUploaded}
              className="h-fit"
            />
            <FileUpload
              purpose="documents"
              onFileUploaded={handleFileUploaded}
              className="h-fit"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Summary
              </CardTitle>
              <CardDescription>
                Overview of your uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{uploadedFiles.length}</div>
                  <div className="text-sm text-muted-foreground">Total Files</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mediaFiles.length}</div>
                  <div className="text-sm text-muted-foreground">Media Files</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{documentFiles.length}</div>
                  <div className="text-sm text-muted-foreground">Documents</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {formatFileSize(uploadedFiles.reduce((sum, file) => sum + file.size, 0))}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Size</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Media Files ({mediaFiles.length})
              </CardTitle>
              <CardDescription>
                Images and videos stored in the public bucket
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mediaFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No media files uploaded yet
                </div>
              ) : (
                <div className="space-y-4">
                  {mediaFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {getFileIcon(file.mimeType)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.originalName}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.mimeType}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(file.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Public</Badge>
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents ({documentFiles.length})
              </CardTitle>
              <CardDescription>
                PDFs and documents stored in the private bucket with signed URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No documents uploaded yet
                </div>
              ) : (
                <div className="space-y-4">
                  {documentFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {getFileIcon(file.mimeType)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.originalName}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.mimeType}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(file.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Private</Badge>
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Download file (signed URL)"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
          <CardDescription>
            Key features of the secure file upload system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🔒 Secure Storage</h3>
              <p className="text-sm text-muted-foreground">
                Separate public and private buckets with appropriate access controls
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📁 File Validation</h3>
              <p className="text-sm text-muted-foreground">
                MIME type and magic bytes validation for enhanced security
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🔗 Signed URLs</h3>
              <p className="text-sm text-muted-foreground">
                Temporary access to private files with configurable expiration
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📊 Metadata Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Complete audit trail with file information and upload history
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">⚡ Performance</h3>
              <p className="text-sm text-muted-foreground">
                Direct S3 uploads with progress tracking and error handling
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🛡️ Access Control</h3>
              <p className="text-sm text-muted-foreground">
                User-based permissions and file ownership tracking
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploadDemo; 