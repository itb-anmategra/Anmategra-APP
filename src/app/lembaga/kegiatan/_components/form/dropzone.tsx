'use client';

import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dropzone } from '~/components/ui/shadcn-io/dropzone/index';

interface CustomDropzoneProps {
  onFileChange: (url: string) => void;
  label: string;
}

const CustomDropzone = ({ onFileChange, label }: CustomDropzoneProps) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [filePreview, setFilePreview] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrop = async (droppedFiles: File[]) => {
    if (droppedFiles.length === 0) return;

    setFiles(droppedFiles);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setFilePreview(e.target?.result);
        onFileChange(e.target?.result);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          clearInterval(interval);
        }, 500);
      }
    };
    reader.readAsDataURL(droppedFiles[0]!);
  };

  const handleCancel = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setFiles(undefined);
  };

  const handleChange = () => {
    setFilePreview(undefined);
    setFiles(undefined);
    setUploadProgress(0);
  };

  return (
    <Dropzone
      accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
      onDrop={handleDrop}
      onError={console.error}
      className="group"
    >
      <div
        className={`relative w-full h-44 border-2 p-4 rounded-xl transition-all ${filePreview && !isUploading ? 'border-solid border-[#00B7B7]' : 'border-dashed border-gray-300 group-hover:border-[#00B7B7]'}`}
      >
        {!files && !isUploading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 group-hover:text-[#00B7B7] transition-colors">
            <div className="relative w-12 h-12">
              <Image
                src="/icons/upload.svg"
                alt="Upload icon"
                width={50}
                height={53}
                className="absolute inset-0 group-hover:opacity-0 transition-opacity"
              />
              <Image
                src="/icons/upload-blue.svg"
                alt="Upload icon hover"
                width={50}
                height={53}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex flex-col text-center -mt-2">
              <p className="text-base font-medium text-gray-700 group-hover:text-[#00B7B7] transition-colors">
                Select image to upload
              </p>
              <p className="text-sm text-gray-500">or drag to drop it here</p>
            </div>
            <Button
              type="button"
              variant="light_blue"
              className=" border-gray-300 hover:border-[#00B7B7]"
            >
              + Unggah dokumen
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - uploadProgress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Uploading file...</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}

        {filePreview && !isUploading && (
          <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
            <img
              alt="Preview"
              className="w-full h-full object-cover"
              src={filePreview}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant={'outline'}
                onClick={handleChange}
                className="bg-white text-gray-900 hover:bg-gray-100 border border-neutral-700"
              >
                Ubah File
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dropzone>
  );
};

export default CustomDropzone;
