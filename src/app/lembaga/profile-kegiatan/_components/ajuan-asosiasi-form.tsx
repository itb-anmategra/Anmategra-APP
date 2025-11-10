'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

// Asumsi kamu punya komponen form ini

// ✅ Schema dengan Zod
const AjuanAsosiasiSchema = z.object({
  posisi: z.string().min(1, 'Posisi harus dipilih'),
  divisi: z.string().min(1, 'Divisi harus dipilih'),
});

type AjuanAsosiasiSchemaType = z.infer<typeof AjuanAsosiasiSchema>;

interface AjuanAsosiasiFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: string;
  eventName: string;
  eventLogo: string;
  organizationName: string;
  onSubmissionSuccess?: () => void;
  resetTrigger?: number;
}

const AjuanAsosiasiForm = ({
  isOpen,
  setIsOpen,
  eventId,
  eventName,
  eventLogo,
  organizationName,
  onSubmissionSuccess,
  resetTrigger,
}: AjuanAsosiasiFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ useForm hook
  const form = useForm<AjuanAsosiasiSchemaType>({
    resolver: zodResolver(AjuanAsosiasiSchema),
    mode: 'onChange',
    defaultValues: {
      posisi: '',
      divisi: '',
    },
  });

  const resetForm = useCallback(() => {
    setIsSubmitted(false);
    form.reset();
  }, [form]);

  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      resetForm();
    }
  }, [resetTrigger, resetForm]);

  // ✅ Simulasi submit
  const simulateSubmit = (values: AjuanAsosiasiSchemaType) => {
    setIsSubmitting(true);

    const payload = {
      ...values,
      eventId,
    };
    console.log('Simulated submit payload:', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmissionSuccess?.();
      setIsOpen(false);
      alert('Pengajuan berhasil dikirim (simulasi).');
    }, 900);
  };

  const handleCancelSubmission = () => {
    setIsSubmitted(false);
    form.reset();
    alert('Ajuan berhasil dibatalkan (simulasi).');
  };

  const onSubmit = (values: AjuanAsosiasiSchemaType) => {
    try {
      if (isSubmitted) {
        handleCancelSubmission();
        return;
      }
      simulateSubmit(values);
    } catch (err) {
      console.error('Simulated submit error:', err);
      setIsSubmitting(false);
      alert('Terjadi error saat pengiriman (simulasi).');
    }
  };

  const isValid = form.formState.isValid;

  const posisiOptions = [
    { value: 'ketua', label: 'Ketua' },
    { value: 'wakil-ketua', label: 'Wakil Ketua' },
    { value: 'sekretaris', label: 'Sekretaris' },
    { value: 'bendahara', label: 'Bendahara' },
    { value: 'koordinator', label: 'Koordinator' },
    { value: 'anggota', label: 'Anggota' },
  ];

  const divisiOptions = [
    { value: 'acara', label: 'Acara' },
    { value: 'humas', label: 'Humas' },
    { value: 'publikasi', label: 'Publikasi' },
    { value: 'perlengkapan', label: 'Perlengkapan' },
    { value: 'konsumsi', label: 'Konsumsi' },
    { value: 'keamanan', label: 'Keamanan' },
    { value: 'dokumentasi', label: 'Dokumentasi' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="w-[880px] h-fit max-w-none mx-auto p-0 bg-white rounded-xl overflow-hidden [&>button]:right-6 [&>button]:top-7"
        aria-describedby={undefined}
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Pengajuan Asosiasi
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Event Info */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={eventLogo}
                alt={eventName}
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-700">
                {eventName}
              </h3>
              <p className="text-gray-400 text-xl">{organizationName}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Posisi Field */}
              <FormField
                control={form.control}
                name="posisi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-lg font-medium">
                      Posisi
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10 border-[#D0D5DD] rounded-lg text-base">
                          <SelectValue placeholder="Pilih posisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {posisiOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Divisi Field */}
              <FormField
                control={form.control}
                name="divisi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-lg font-medium">
                      Divisi
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10 border-[#D0D5DD] rounded-lg text-base">
                          <SelectValue placeholder="Pilih divisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {divisiOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  disabled={(!isValid && !isSubmitted) || isSubmitting}
                  className={`w-32 h-10 font-medium rounded-xl transition-colors duration-200 ${
                    isSubmitted
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[#2B6282] hover:bg-[#2B6282] text-white'
                  }`}
                >
                  {isSubmitted ? 'Batalkan Ajuan' : 'KIRIM'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AjuanAsosiasiForm;
