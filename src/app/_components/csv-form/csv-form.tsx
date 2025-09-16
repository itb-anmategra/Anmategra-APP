'use client';

import Image from 'next/image';
import TrashCan from 'public/icons/trash.svg';
import React, { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

const CsvForm = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'initial',
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  type UploadState =
    | { status: 'initial' }
    | { status: 'uploading'; file: File; progress: number }
    | { status: 'complete'; file: File };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadState({ status: 'uploading', file: file, progress: 0 });
    }
  };

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

  // simulasi proses upload
  useEffect(() => {
    if (uploadState.status === 'uploading') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadState({
          status: 'uploading',
          file: uploadState.file,
          progress,
        });
        if (progress >= 100) {
          clearInterval(interval);
          setUploadState({ status: 'complete', file: uploadState.file });
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [uploadState]);

  const renderContent = () => {
    switch (uploadState.status) {
      case 'initial':
        return (
          <div className="flex flex-col h-full">
            <h3 className="m-0 text-[20px] font-semibold text-[#141718] pb-[15px]">
              Upload CSV
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
                Select a CSV file to upload{' '}
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
              Upload CSV
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
              Upload CSV
            </h3>

            <div className="h-px w-full bg-black mb-5" />

            <div className="group flex flex-col justify-start w-full h-[400px]">
              <div className="flex items-center gap-4 border border-[#C4CACE] rounded-[8px] p-[20px_16px]">
                <Image
                  src="/images/miscellaneous/csv.svg"
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

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setUploadState({ status: 'initial' });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="light_blue" className="text-[12px] font-semibold">
          Upload CSV
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white p-[24px_28px] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] max-w-[800px] w-[90%] min-h-[400px]">
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
      </DialogContent>
    </Dialog>
  );
};

export default CsvForm;
