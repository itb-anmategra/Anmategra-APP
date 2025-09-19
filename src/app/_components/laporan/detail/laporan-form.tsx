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

const fileSchema = z
  .any()
  .optional()
  .refine((file): file is File => !file || file instanceof File, {
    message: 'File tidak valid',
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'Ukuran file maksimal 5MB',
  })
  .refine(
    (file) =>
      ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(
        file.type,
      ),
    {
      message: 'Format harus JPG, PNG, JPG, atau PDF',
    },
  );

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
  file: fileSchema.optional(), // file opsional
  prioritas: z.enum(['rendah', 'sedang', 'tinggi'], {
    required_error: 'Prioritas urgensi wajib dipilih',
  }),
});

type LaporanSchema = z.infer<typeof laporanSchema>;

// Custom Form Field
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

// Main Component
const LaporanFormDialog: React.FC = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFieldError = (field: string): string | undefined => errors[field];

  const handleInputChange = (
    field: keyof LaporanSchema,
    value: string | File | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];

      if (field === 'judul' && typeof value === 'string') {
        if (value.length >= 50) newErrors[field] = 'Judul maksimal 50 karakter';
      }

      if (field == 'deskripsi' && typeof value === 'string') {
        if (value.length >= 400)
          newErrors[field] = 'Deskripsi maksimal 400 karakter';
      }

      return newErrors;
    });
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

    setIsSubmitting(true);
    setErrors({});
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormData({
        judul: '',
        deskripsi: '',
        file: undefined,
        prioritas: undefined as any,
      });
      setIsOpen(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
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
        >
          <div
            className={`flex flex-col pt-8 pr-6 pb-4 pl-6 gap-[${isMaximized ? '400px' : '120px'}]`}
          >
            {/* Header */}
            <div
              className={`flex flex-col gap-${isMaximized ? '4' : '3'} w-full`}
            >
              <div className="flex items-center justify-between w-full h-[36px]">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="p-1 h-auto"
                  >
                    <ChevronRight className="w-5 h-5 text-[#000000]" />
                  </Button>
                  <span className="text-[#636A6D] font-bold text-[16px] leading-[24px]">
                    Laporan baru
                  </span>
                </div>

                {/* Upload File */}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) =>
                      handleInputChange('file', e.target.files?.[0])
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-auto"
                    onClick={() =>
                      document.getElementById('file-upload')?.click()
                    }
                  >
                    <Paperclip className="!w-6 !h-6 text-gray-600 rotate-45" />
                  </Button>

                  {formData.file && (
                    <div className="flex flex-col text-sm text-gray-600 max-w-[200px]">
                      <span className="truncate">{formData.file.name}</span>
                      {getFieldError('file') && (
                        <p className="text-sm text-red-600">
                          {getFieldError('file')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Prioritas Urgensi */}
                  <div className="relative inline-block">
                    <Button
                      variant="outline"
                      onClick={() => setShowPrioritas(!showPrioritas)}
                      className="items-center box-border px-3 py-2 w-[172px] h-auto text-[14px] font-bold border border-neutral-700 rounded-[12px] text-neutral-700 gap-[3px]"
                    >
                      {formData.prioritas
                        ? `Prioritas: ${formData.prioritas.charAt(0).toUpperCase() + formData.prioritas.slice(1)}`
                        : 'Prioritas Urgensi'}
                      <ChevronDown className="!w-5 !h-6" />
                    </Button>

                    {getFieldError('prioritas') && (
                      <p className="absolute left-0 top-full mt-1 text-[13px] text-red-600">
                        {getFieldError('prioritas')}
                      </p>
                    )}

                    {showPrioritas && (
                      <div className="absolute left-0 top-full mt-1 w-[172px] bg-white border border-neutral-700 rounded-[12px] shadow-lg z-10">
                        {[
                          {
                            label: 'Rendah',
                            value: 'rendah',
                            color: 'bg-green-500',
                          },
                          {
                            label: 'Sedang',
                            value: 'sedang',
                            color: 'bg-yellow-400',
                          },
                          {
                            label: 'Tinggi',
                            value: 'tinggi',
                            color: 'bg-red-500',
                          },
                        ].map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                prioritas:
                                  option.value as LaporanSchema['prioritas'],
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

                  {/* Maximize / Minimize */}
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

                  {/* Close */}
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

              {/* Content Form Fields */}
              <div className="w-full h-full flex flex-col justify-between">
                <CustomFormField error={getFieldError('judul')}>
                  <Input
                    type="text"
                    value={formData.judul}
                    onChange={(e) => handleInputChange('judul', e.target.value)}
                    placeholder="Judul Laporan"
                    maxLength={50}
                    className="w-full h-[60px] text-[32px] leading-[40px] text-[#9DA4A8] font-bold border-none shadow-none focus-visible:ring-0 p-[10px] gap-[10px]"
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
                    className={`
                      w-full !font-[400] !text-[24px] !leading-[32px] text-[#9DA4A8] 
                      border-none shadow-none focus-visible:ring-0 p-[10px] gap-[10px] resize-none
                      ${isMaximized ? 'h-[180px]' : 'h-[120px]'}
                    `}
                  />
                </CustomFormField>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 right-5 flex justify-end items-center w-full h-[56px] gap-[464px]">
              <Button
                onClick={handleSubmit}
                variant="dark_blue"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-[12px] font-bold w-[150px] h-[45px] text-[17px] leading-[32px]"
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
