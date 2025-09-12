'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const UploadFileComponent = () => {
  const [isHovered, setIsHovered] = useState(false);

  type UploadState =
    | { status: 'initial' }
    | { status: 'uploading'; file: File; progress: number }
    | { status: 'complete'; file: File };
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'initial',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadState({ status: 'uploading', file: file, progress: 0 });
    }
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
  }, [uploadState.status]);

  // confirmation dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                paddingBottom: '15px',
              }}
            >
              Upload CSV
            </h3>

            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'black',
                marginBottom: '20px',
              }}
            />

            <div
              className="group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                border: isHovered ? '2px dashed #55a8a8' : '2px dashed #cccccc',
                borderRadius: '10px',
                padding: '150px 20px',
                height: '400px',
                textAlign: 'center',
                backgroundColor: '#fff',
                fontWeight: '400',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                src={
                  isHovered
                    ? '/images/add-csv-hover.svg'
                    : '/images/add-csv.svg'
                }
                alt="Upload Icon"
                width={60}
                height={60}
                className="pb-5"
              />
              <p className="font-semibold text-xl text-[#4b4b4b] group-hover:text-[#55a8a8]">
                Select a CSV file to upload{' '}
              </p>
              <p className="opacity-70 text-md text-[#a8a0a3] pb-5">
                or drag and drop it here{' '}
              </p>

              <button
                onClick={() => {
                  const fileInput = document.getElementById('fileInput');
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
                style={{
                  backgroundColor: '#55a8a8',
                  paddingTop: '7px',
                  paddingBottom: '7px',
                  height: '40px',
                  width: '130px',
                  color: '#ffffff',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                + Unggah dokumen
              </button>
            </div>
          </div>
        );

      case 'uploading':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                paddingBottom: '15px',
              }}
            >
              Upload CSV
            </h3>

            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'black',
                marginBottom: '20px',
              }}
            />

            <div
              className="group"
              style={{
                border: '2px dashed #cccccc',
                borderRadius: '10px',
                padding: '150px 20px',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  position: 'relative',
                  marginBottom: '20px',
                }}
              >
                {/* progress circle */}
                <svg
                  viewBox="0 0 36 36"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: 'rotate(-90deg)',
                  }}
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e5e5"
                    strokeWidth="2.5"
                  />

                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#55a8a8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${uploadState.progress}, 100`}
                  />
                </svg>

                {/* percentage text */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#141718',
                  }}
                >
                  {uploadState.progress}%
                </div>
              </div>

              <p
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#141718',
                }}
              >
                Uploading file...
              </p>

              <button
                onClick={() => setUploadState({ status: 'initial' })}
                style={{
                  marginTop: '10px',
                  padding: '4px 20px',
                  backgroundColor: 'transparent',
                  border: '0.8px solid #141718',
                  color: '#141718',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                paddingBottom: '15px',
              }}
            >
              Upload CSV
            </h3>

            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'black',
                marginBottom: '20px',
              }}
            />

            <div
              className="group"
              style={{
                width: '100%',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <div
                className="flex items-center gap-4"
                style={{
                  border: '1px solid #C4CACE',
                  borderRadius: '8px',
                  padding: '20px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <Image
                  src="/images/csv.svg"
                  alt="File icon"
                  width={40}
                  height={40}
                />

                {/* container list file */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div
                    className="pb-1"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '16px',
                        margin: '0',
                      }}
                    >
                      {uploadState.file.name}
                    </p>

                    <Image
                      src="/images/trash.svg"
                      alt="Delete"
                      width={20}
                      height={20}
                      style={{ cursor: 'pointer' }}
                      onClick={handleDeleteClick}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p
                      style={{
                        color: '#666',
                        fontSize: '10px',
                        margin: '0',
                        opacity: 0.7,
                      }}
                    >
                      200 KB
                    </p>

                    <p
                      style={{
                        color: '#141718',
                        fontSize: '10px',
                        fontWeight: '400',
                        margin: '0',
                      }}
                    >
                      Completed
                    </p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#55a8a8',
                      borderRadius: '4px',
                    }}
                  >
                    {' '}
                  </div>
                </div>
              </div>
            </div>

            {/* confirmation message */}
            {isConfirmOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  width: '500px',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: '1001',
                }}
              >
                <p className="text-center">
                  Apakah Anda yakin ingin menghapus file ini?
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '16px',
                    marginTop: '20px',
                  }}
                >
                  <button
                    onClick={handleCancelDelete}
                    style={{
                      backgroundColor: '#F16350',
                      color: '#fff',
                      width: '100px',
                      height: '35px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                      padding: '3px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    BATAL
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    style={{
                      backgroundColor: '#2B6282',
                      color: '#fff',
                      width: '100px',
                      height: '35px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                      padding: '3px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    YAKIN
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="upload-container">
      <input
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {renderContent()}
    </div>
  );
};

export default UploadFileComponent;
