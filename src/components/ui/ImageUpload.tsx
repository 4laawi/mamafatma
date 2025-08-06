"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onCancel: () => void;
  folder?: string;
}

export default function ImageUpload({ onUpload, onCancel, folder = "products" }: ImageUploadProps) {
  const { lang } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log('Attempting to upload to:', filePath);

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Provide specific error messages
        console.log('Full upload error:', uploadError);
        
        if (uploadError.message.includes('bucket')) {
          throw new Error('Storage bucket "images" not found. Please create it in your Supabase dashboard.');
        } else if (uploadError.message.includes('policy') || uploadError.message.includes('permission')) {
          throw new Error('Storage policies not configured. Please set up storage policies in Supabase.');
        } else if (uploadError.message.includes('not found')) {
          throw new Error('Storage bucket "images" not found. Please create it in your Supabase dashboard.');
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      onUpload(publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className={clsx("text-lg font-medium text-gray-900 mb-4", lang === 'ar' ? 'text-right' : 'text-left')}>
            {lang === 'ar' ? 'رفع صورة' : 'Upload Image'}
          </h3>
          
          <div className="space-y-4">
            {/* File Input */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-2", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'اختر صورة' : 'Select Image'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className={clsx("text-sm font-medium text-red-800", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div>
                <label className={clsx("block text-sm font-medium text-gray-700 mb-2", lang === 'ar' ? 'text-right' : 'text-left')}>
                  {lang === 'ar' ? 'معاينة' : 'Preview'}
                </label>
                <div className="border rounded-lg p-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {uploading 
                  ? (lang === 'ar' ? 'جاري الرفع...' : 'Uploading...') 
                  : (lang === 'ar' ? 'رفع' : 'Upload')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 