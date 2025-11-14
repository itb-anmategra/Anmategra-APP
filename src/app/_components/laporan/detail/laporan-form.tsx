'use client';

import {
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Paperclip,
  Plus,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { api } from '~/trpc/react';
import { useUploadThing } from '~/utils/uploadthing';

const fileSchema = z
  .string()
  .url({ message: 'URL file tidak valid' })
  .optional();

const laporanSchema = z.object({
  judul: z
    .string()
    .min(1, { message: 'Judul laporan wajib diisi' })
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(50, { message: 'Judul maksimal 50 karakter' }),
  deskripsi: z
    .string()
    .min(1, { message: 'Deskripsi laporan wajib diisi' })
    .min(10, { message: 'Deskripsi minimal 10 karakter' })
    .max(400, { message: 'Deskripsi maksimal 400 karakter' }),
  file: fileSchema.optional(), 
  prioritas: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Prioritas urgensi wajib dipilih',
  }),
});

type LaporanSchema = z.infer<typeof laporanSchema>;

interface CustomFormFieldProps {
  error?: string;
  children: React.ReactNode;
}

const CustomFormField: React.FC<CustomFormFieldProps> = ({
  error,
  children,
}) => (
  <div className="space-y-2">
    {children}
    {error && <p className="ml-3 text-[16px] text-red-600">{error}</p>}
  </div>
);

interface CustomUploadButtonProps {
  onUploadSuccess: (url: string) => void;
  onError: (message: string) => void;
  isAdmin: boolean;
  isFormSubmitting: boolean;
}

const CustomUploadButton: React.FC<CustomUploadButtonProps> = ({
  onUploadSuccess,
  onError,
  isAdmin,
  isFormSubmitting,
}) => {
  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      const uploadedUrl = res[0]?.url;
      if (uploadedUrl) {
        onUploadSuccess(uploadedUrl);
      } else {
        onError('URL file tidak ditemukan setelah upload selesai.');
      }
    },
    onUploadError: (error) => {
      onError(`Gagal mengunggah file: ${error.message}`);
    },
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileToUpload = files[0];
      const validationResult = laporanSchema.shape.file.safeParse(fileToUpload);
      void startUpload(Array.from(files));
      e.target.value = '';
    }
  };

  const isDisabled = isAdmin || isUploading || isFormSubmitting || isUploading;

  return (
    <>
      {/* Input file tersembunyi yang akan dipicu oleh tombol */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf" 
        disabled={isDisabled}
      />

      {/* Tombol Paperclip Custom */}
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-auto"
        onClick={handleClick}
        disabled={isDisabled}
      >
        {isUploading ? (
          <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Paperclip className="!w-6 !h-6 text-gray-600 rotate-45" />
        )}
      </Button>
    </>
  );
};

interface LaporanFormDialogProps {
  isAdmin?: boolean;
}

const LaporanFormDialog: React.FC<LaporanFormDialogProps> = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [formData, setFormData] = useState<LaporanSchema>({
    judul: '',
    deskripsi: '',
    file: undefined, 
    prioritas: undefined as unknown as LaporanSchema['prioritas'],
  });

  const [showPrioritas, setShowPrioritas] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC mutation
  const createDraftMutation = api.users.createDraft.useMutation();
  const isSubmitting = createDraftMutation.isPending;

  const getFieldError = (field: string): string | undefined => errors[field];

  const handleInputChange = (
    field: keyof LaporanSchema,
    value: string | undefined, // value can be string or undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleFileUploadSuccess = (url: string) => {
    handleInputChange('file', url);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.file;
      return newErrors;
    });
  };

  const handleFileUploadError = (message: string) => {
    setErrors((prev) => ({
      ...prev,
      file: message,
    }));
  };

  const handleSubmit = async () => {
    const result = laporanSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (isAdmin) {
      return;
    }

    setErrors({});

    try {
      await createDraftMutation.mutateAsync({
        subject: formData.judul,
        urgent: formData.prioritas,
        description: formData.deskripsi,
        attachment: formData.file, 
      });

      // Reset form
      setFormData({
        judul: '',
        deskripsi: '',
        file: undefined,
        prioritas: undefined as any,
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        general: 'Gagal membuat draf laporan, coba lagi nanti.',
      });
    }
  };

  const handleClose = () => {
    setFormData({
      judul: '',
      deskripsi: '',
      file: undefined,
      prioritas: undefined as any,
    });
    setErrors({});
    setIsOpen(false);
    setIsMaximized(false);
  };

  const getFileNameFromUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    try {
      const urlObject = new URL(url);
      const pathname = urlObject.pathname;
      const parts = pathname.split('/');
      const fileName = parts[parts.length - 1];
      return fileName;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="p-8">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="dark_blue"
            className="w-[169px] h-[42px] rounded-[12px] px-3 py-2 inline-flex items-center gap-2 font-[600] text-[18px] leading-[26px]"
          >
            <Plus className="w-4 h-4" />
            Buat laporan
          </Button>
        </DialogTrigger>

        <DialogContent
          className={`
            p-0 rounded-[20px] border bg-white [&>button]:hidden
            ${
              isMaximized
                ? 'w-[95vw] h-[95vh] max-w-none left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'
                : 'w-[1000px] h-[384px] max-w-none left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'
            }
          `}
          aria-describedby={undefined}
        >
          <div
            className={`flex flex-col pt-8 pr-6 pb-4 pl-6 gap-[${
              isMaximized ? '400px' : '120px'
            }]`}
          >
            {/* Header */}
            <div className={`flex flex-col gap-${isMaximized ? '4' : '3'} w-full`}>
              <div className="flex items-center justify-between w-full h-[36px]">
                <div className="flex items-center gap-3">
                  <ChevronRight className="w-5 h-5 text-[#000000]" />
                  <span className="text-[#636A6D] font-bold text-[16px] leading-[24px]">
                    Laporan baru
                  </span>
                </div>

                {/* Header Right Controls */}
                <div className="flex items-center gap-4">
                  
                  {getFieldError('file') && (
                    <p className="text-sm text-red-600 max-w-[250px] leading-4">
                        {getFieldError('file')}
                    </p>
                  )}

                  {!formData.file ? (
                    <CustomUploadButton
                      onUploadSuccess={handleFileUploadSuccess}
                      onError={handleFileUploadError}
                      isAdmin={!!isAdmin}
                      isFormSubmitting={isSubmitting}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600 max-w-[200px]">
                      <Paperclip className="!w-4 !h-4 text-gray-600 rotate-45" />
                      <span className="truncate">
                        {getFileNameFromUrl(formData.file) || 'File Terunggah'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={() => handleInputChange('file', undefined)}
                        disabled={isAdmin}
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  )}

                  {/* Prioritas */}
                  <div className="relative inline-block">
                    <Button
                      variant="outline"
                      onClick={() => setShowPrioritas(!showPrioritas)}
                      className="items-center box-border px-3 py-2 w-[172px] h-auto text-[14px] font-bold border border-neutral-700 rounded-[12px] text-neutral-700 gap-[3px]"
                      disabled={isAdmin}
                    >
                      {formData.prioritas
                        ? `Prioritas: ${
                            formData.prioritas.charAt(0).toUpperCase() +
                            formData.prioritas.slice(1)
                          }`
                        : 'Prioritas Urgensi'}
                      <ChevronDown className="!w-5 !h-6" />
                    </Button>

                    {showPrioritas && !isAdmin && (
                      <div className="absolute left-0 top-full mt-1 w-[172px] bg-white border border-neutral-700 rounded-[12px] shadow-lg z-10">
                        {[
                          { label: 'Low', value: 'Low', color: 'bg-green-500' },
                          { label: 'Medium', value: 'Medium', color: 'bg-yellow-400' },
                          { label: 'High', value: 'High', color: 'bg-red-500' },
                        ].map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                prioritas: option.value as LaporanSchema['prioritas'],
                              }));
                              setShowPrioritas(false);
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.prioritas;
                                return newErrors;
                              });
                            }}
                            className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 hover:rounded-[12px]"
                          >
                            <span
                              className={`w-3 h-3 rounded-full ${option.color}`}
                            />
                            <span>{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Simpan Draf */}
                  <Button
                    variant="outline"
                    className="flex items-center justify-center box-border px-3 py-2 h-auto text-[14px] font-bold border border-neutral-700 rounded-[12px] text-neutral-700 gap-[10px]"
                    disabled={!formData.judul && !formData.deskripsi}
                  >
                    Simpan draf
                  </Button>

                  {/* Maximize & Close */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-1 h-auto"
                  >
                    {isMaximized ? (
                      <Minimize2 className="!w-5 !h-5 text-gray-600" />
                    ) : (
                      <Maximize2 className="!w-5 !h-5 text-gray-600" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="p-1 h-auto"
                  >
                    <X className="!w-6 !h-6 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Form Content */}
              <div className="w-full h-full flex flex-col justify-between">
                <CustomFormField error={getFieldError('judul')}>
                  <Input
                    type="text"
                    value={formData.judul}
                    onChange={(e) => handleInputChange('judul', e.target.value)}
                    placeholder="Judul Laporan"
                    maxLength={50}
                    disabled={isAdmin}
                    className="w-full h-[60px] text-[32px] leading-[40px] text-[#9DA4A8] font-bold border-none shadow-none focus-visible:ring-0 p-[10px]"
                  />
                </CustomFormField>

                <CustomFormField error={getFieldError('deskripsi')}>
                  <Textarea
                    value={formData.deskripsi}
                    onChange={(e) =>
                      handleInputChange('deskripsi', e.target.value)
                    }
                    placeholder="Deskripsi"
                    maxLength={400}
                    rows={isMaximized ? 15 : 8}
                    disabled={isAdmin}
                    className={`w-full !font-[400] !text-[24px] !leading-[32px] text-[#9DA4A8]
                      border-none shadow-none focus-visible:ring-0 p-[10px] resize-none
                      ${isMaximized ? 'h-[180px]' : 'h-[120px]'}`}
                  />
                </CustomFormField>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 right-5 flex justify-end items-center w-full">
              <Button
                onClick={handleSubmit}
                variant="dark_blue"
                disabled={isAdmin || isSubmitting}
                className="px-6 py-3 rounded-[12px] font-bold w-[150px] h-[45px] text-[17px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Membuat...
                  </>
                ) : (
                  'Buat laporan'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaporanFormDialog;