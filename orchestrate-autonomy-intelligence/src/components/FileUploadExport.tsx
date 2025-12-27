import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileAudio, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  File
} from 'lucide-react';

interface FileUploadExportProps {
  onFileUploaded?: (fileId: string, filename: string) => void;
  taskId?: string;
}

export function FileUploadExport({ onFileUploaded, taskId }: FileUploadExportProps) {
  const [uploadedFile, setUploadedFile] = useState<{
    id: string;
    name: string;
    size: number;
    type: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setUploadedFile({
        id: data.fileId,
        name: data.filename,
        size: data.size,
        type: data.type
      });

      if (onFileUploaded) {
        onFileUploaded(data.fileId, data.filename);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleExport = async (format: 'excel' | 'word' | 'project' | 'audio' | 'jpeg') => {
    if (!taskId) {
      setExportError('No task selected for export');
      return;
    }

    setExporting(true);
    setExportError(null);

    try {
      const response = await fetch('http://localhost:8080/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId,
          format: format
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Export failed');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const extensions: Record<string, string> = {
        excel: 'xlsx',
        word: 'docx',
        project: 'json',
        audio: 'mp3',
        jpeg: 'jpg'
      };
      
      a.download = `task_${taskId}.${extensions[format]}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Export error:', error);
      setExportError(error.message || 'Failed to export. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="h-6 w-6 text-purple-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Pipeline File Upload</h3>
            <p className="text-sm text-gray-400">Upload files for AI pipeline processing</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            
            {!uploadedFile ? (
              <div className="space-y-3">
                <File className="h-12 w-12 mx-auto text-purple-400/50" />
                <div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Supports documents, images, audio, and video files
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <CheckCircle className="h-12 w-12 mx-auto text-green-400" />
                <div className="space-y-1">
                  <p className="text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(uploadedFile.size)} • {uploadedFile.type}
                  </p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Uploaded Successfully
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="mt-2"
                >
                  Upload Another File
                </Button>
              </div>
            )}
          </div>

          {uploadError && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                {uploadError}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Export Section */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="h-6 w-6 text-cyan-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Export Results</h3>
            <p className="text-sm text-gray-400">Download task results in various formats</p>
          </div>
        </div>

        {!taskId && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10 mb-4">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              Complete a task first to enable export functionality
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            onClick={() => handleExport('excel')}
            disabled={!taskId || exporting}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10"
          >
            <FileSpreadsheet className="h-8 w-8 text-green-400" />
            <span className="text-sm">Excel</span>
          </Button>

          <Button
            onClick={() => handleExport('word')}
            disabled={!taskId || exporting}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10"
          >
            <FileText className="h-8 w-8 text-blue-400" />
            <span className="text-sm">Word</span>
          </Button>

          <Button
            onClick={() => handleExport('project')}
            disabled={!taskId || exporting}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10"
          >
            <FileText className="h-8 w-8 text-purple-400" />
            <span className="text-sm">Project</span>
          </Button>

          <Button
            onClick={() => handleExport('audio')}
            disabled={!taskId || exporting}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-pink-500/30 hover:border-pink-500/50 hover:bg-pink-500/10"
          >
            <FileAudio className="h-8 w-8 text-pink-400" />
            <span className="text-sm">Audio</span>
          </Button>

          <Button
            onClick={() => handleExport('jpeg')}
            disabled={!taskId || exporting}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10"
          >
            <ImageIcon className="h-8 w-8 text-orange-400" />
            <span className="text-sm">JPEG</span>
          </Button>
        </div>

        {exporting && (
          <Alert className="border-cyan-500/50 bg-cyan-500/10 mt-4">
            <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
            <AlertDescription className="text-cyan-200">
              Generating export file...
            </AlertDescription>
          </Alert>
        )}

        {exportError && (
          <Alert className="border-red-500/50 bg-red-500/10 mt-4">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {exportError}
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
}
