'use client';

import Image from 'next/image';
import TrashCan from 'public/icons/trash.svg';
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
// import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

type UploadState =
  | { status: 'initial' }
  | { status: 'uploading'; file: File; progress: number }
  | { status: 'complete'; file: File }
  | { status: 'success'; message: string; data?: any }
  | { status: 'error'; error: string };

interface CsvFormContentProps {
  importType:
    | 'kegiatan-anggota'
    | 'kegiatan-nilai'
    | 'lembaga-anggota'
    | 'lembaga-nilai';
  entityId: string;
  onImportSuccess?: (data: any) => void;
  triggerElement?: React.ReactNode;
}

const CsvFormContent = ({
  importType,
  entityId,
  onImportSuccess,
}: CsvFormContentProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'initial',
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!/\.(xlsx|xls)$/.exec(file.name)) {
        setUploadState({
          status: 'error',
          error: `Invalid file format. Please upload Excel file (.xlsx or .xls)`,
        });
        return;
      }

      setUploadState({ status: 'uploading', file: file, progress: 0 });

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(getUploadEndpoint(), {
          method: 'POST',
          body: formData,
        });

        const result = (await response.json()) as {
          message?: string;
          data?: any;
          error?: string;
          details?: string;
        };

        if (response.ok) {
          setUploadState({
            status: 'success',
            message: result.message ?? 'File imported successfully',
            data: result.data,
          });
          onImportSuccess?.(result.data);
        } else {
          const errorMsg = result.error ?? result.details ?? 'Upload failed';
          setUploadState({
            status: 'error',
            error: errorMsg,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        setUploadState({
          status: 'error',
          error: errorMessage,
        });
      }
    }
  };

  const getImportTypeInfo = () => {
    switch (importType) {
      case 'kegiatan-anggota':
        return {
          title: 'Upload Daftar Anggota Kegiatan',
          worksheetName: 'Anggota Kegiatan',
        };
      case 'kegiatan-nilai':
        return {
          title: 'Upload Nilai Profil Kegiatan',
          worksheetName: 'Nilai Profil Kegiatan',
        };
      case 'lembaga-anggota':
        return {
          title: 'Upload Daftar Anggota Lembaga',
          worksheetName: 'Anggota Lembaga',
        };
      case 'lembaga-nilai':
        return {
          title: 'Upload Nilai Profil Lembaga',
          worksheetName: 'Nilai Profil Lembaga',
        };
    }
  };

  const getUploadEndpoint = () => {
    switch (importType) {
      case 'kegiatan-anggota':
        return `/api/lembaga/kegiatan/${entityId}/anggota`;
      case 'kegiatan-nilai':
        return `/api/lembaga/kegiatan/${entityId}/nilai`;
      case 'lembaga-anggota':
        return `/api/lembaga/${entityId}/anggota`;
      case 'lembaga-nilai':
        return `/api/lembaga/${entityId}/nilai`;
    }
  };

  const typeInfo = getImportTypeInfo();

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsConfirmOpen(false);
    setUploadState({ status: 'initial' });
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };


  const renderContent = () => {
    switch (uploadState.status) {
      case 'initial':
        return (
          <div className="flex flex-col h-full">
            <h3 className="m-0 text-[20px] font-semibold text-[#141718] pb-[15px]">
              {typeInfo.title}
            </h3>

            <div className="h-px w-full bg-black mb-5" />

            <div
              className={`group flex flex-col justify-center items-center h-full max-h-[400px] p-[150px_20px] bg-white font-normal text-center rounded-[10px] border-2 border-dashed ${isHovered ? 'border-[#00B7B7]' : 'border-[#C4CACE]'}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src={
                  isHovered
                    ? '/images/miscellaneous/add-csv-hover.svg'
                    : '/images/miscellaneous/add-csv.svg'
                }
                alt="Upload Icon"
                width={60}
                height={60}
                className="pb-5"
              />

              <p className="font-semibold text-xl text-[#636A6D] group-hover:text-[#00A5A5]">
                Select an Excel file to upload{' '}
              </p>
              <p className="font-bold text-md text-[#C7CCCF] pb-5">
                or drag and drop it here{' '}
              </p>

              <div className="upload-container">
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <Button
                  onClick={() => {
                    const fileInput = document.getElementById('fileInput');
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                  variant="light_blue"
                  className="pt-[7px] pb-[7px] text-[12px] font-semibold"
                >
                  + Unggah dokumen
                </Button>
              </div>
            </div>
          </div>
        );

      case 'uploading':
        return (
          <div className="flex flex-col h-full">
            <h3 className="m-0 text-[20px] font-semibold text-[#141718] pb-[15px]">
              {typeInfo.title}
            </h3>

            <div className="h-px w-full bg-black mb-5" />

            <div className="group flex flex-col justify-center items-center h-[400px] p-[150px_20px] bg-white rounded-[10px] border-2 border-dashed border-[#C4CACE]">
              <div className="w-[100px] h-[100px] relative mb-5">
                {/* progress circle */}
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e5e5"
                    strokeWidth="2.5"
                  />

                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#00A5A5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${uploadState.progress}, 100`}
                  />
                </svg>

                {/* percentage text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] font-bold text-[#141718]">
                  {uploadState.progress}%
                </div>
              </div>

              <p className="text-[20px] font-semibold text-[#141718]">
                Uploading file...
              </p>

              <Button
                onClick={() => setUploadState({ status: 'initial' })}
                variant="warning_outline"
                className="mt-2.5 text-[14px] font-semibold"
              >
                Cancel
              </Button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="flex flex-col h-full">
            <h3 className="m-0 text-[20px] font-semibold text-[#141718] pb-[15px]">
              {typeInfo.title}
            </h3>

            <div className="h-px w-full bg-black mb-5" />

            <div className="group flex flex-col justify-start w-full h-[400px]">
              <div className="flex items-center gap-4 border border-[#C4CACE] rounded-[8px] p-[20px_16px]">
                <Image
                  src="/images/miscellaneous/excel.svg"
                  alt="File icon"
                  width={40}
                  height={40}
                />

                {/* container list file */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="pb-1 flex items-center justify-between">
                    <p className="font-medium text-[#141718] text-[16px] m-0">
                      {uploadState.file.name}
                    </p>

                    <Image
                      src={TrashCan}
                      alt="Delete"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                      onClick={handleDeleteClick}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[#666] text-[10px] m-0 opacity-70">
                      200 KB
                    </p>

                    <p className="text-[#141718] text-[10px] font-normal m-0">
                      Completed
                    </p>
                  </div>

                  <div className="w-full h-2 bg-[#00A5A5] rounded"> </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col h-full">
            <h3 className="m-0 text-[20px] font-semibold text-[#141718] pb-[15px]">
              {typeInfo.title}
            </h3>

            <div className="h-px w-full bg-black mb-5" />

            <div className="group flex flex-col justify-center items-center h-[400px] p-[50px_20px] bg-white rounded-[10px] border-2 border-[#00A5A5]">
              <div className="w-[80px] h-[80px] bg-[#00A5A5] rounded-full flex items-center justify-center mb-5">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
              </div>

              <p className="text-[20px] font-semibold text-[#00A5A5] text-center">
                {uploadState.message}
              </p>

              <Button
                onClick={() => setUploadState({ status: 'initial' })}
                variant="light_blue"
                className="mt-5 text-[14px] font-semibold"
              >
                Upload Another File
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col h-full">
            <h3 className="m-0 text-[20px] font-semibold text-[#141718] pb-[15px]">
              {typeInfo.title}
            </h3>

            <div className="h-px w-full bg-black mb-5" />

            <div className="group flex flex-col justify-center items-center h-[400px] p-[50px_20px] bg-white rounded-[10px] border-2 border-[#FF4444]">
              <div className="w-[80px] h-[80px] bg-[#FF4444] rounded-full flex items-center justify-center mb-5">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </div>

              <p className="text-[20px] font-semibold text-[#FF4444] text-center mb-2">
                Upload Failed
              </p>

              <p className="text-[14px] text-[#666] text-center mb-5">
                {uploadState.error}
              </p>

              <Button
                onClick={() => setUploadState({ status: 'initial' })}
                variant="warning_outline"
                className="text-[14px] font-semibold"
              >
                Try Again
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {renderContent()}

      {/* confirmation message */}
      {isConfirmOpen && (
        <>
          {/* bg hitam */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-black/50 z-[1000]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#ccc] w-[500px] rounded-[20px] p-5 shadow-[0_4px_8px_rgba(0,0,0,0.1)] z-[1001]">
            <p className="text-center">
              Apakah Anda yakin ingin menghapus file ini?
            </p>

            <div className="flex flex-row justify-center gap-4 mt-3">
              <Button
                onClick={handleCancelDelete}
                variant="warning"
                className="text-[12px] font-semibold"
              >
                BATAL
              </Button>

              <Button
                onClick={handleConfirmDelete}
                variant="dark_blue"
                className="text-[12px] font-semibold"
              >
                YAKIN
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CsvFormContent;
