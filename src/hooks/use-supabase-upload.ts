
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface UseSupabaseUploadOptions {
  bucket: string;
  folder?: string;
  fileTypes?: string[];
  maxSizeMB?: number;
}

interface UploadResult {
  path: string;
  url: string;
}

export const useSupabaseUpload = ({
  bucket,
  folder = '',
  fileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeMB = 2
}: UseSupabaseUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!fileTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${fileTypes.join(', ')}`);
      return false;
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File too large. Maximum size: ${maxSizeMB}MB`);
      return false;
    }
    
    return true;
  };
  
  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);
      
      if (!validateFile(file)) {
        setUploading(false);
        return null;
      }
      
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const folderPrefix = folder ? `${folder}/` : '';
      const filePath = `${folderPrefix}${fileName}`;
      
      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
          }
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return {
        path: filePath,
        url: publicUrl
      };
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  return {
    uploadFile,
    uploading,
    progress,
    error,
    setError
  };
};
