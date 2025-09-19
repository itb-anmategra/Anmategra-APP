'use client';

// Library
import { zodResolver } from '@hookform/resolvers/zod';
// Icon Import
import { Camera, Pencil, PencilLine } from 'lucide-react';
import Image from 'next/image';
import LineIcon from 'public/icons/line-icon-2.png';
import WhatsappIcon from 'public/icons/wa-icon.png';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// Components Import
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
// Upload Thing Import
import { UploadButton } from '~/utils/uploadthing';

const mahasiswaProfilSchema = z.object({
  fotoProfil: z.string().url('Harus berupa URL yang valid').optional(),
  nama: z.string().min(1, 'Nama tidak boleh kosong'),
  nim: z.string(),
  jurusanAngkatan: z.string().min(1, 'Jurusan dan Angkatan tidak boleh kosong'),
  idLine: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 3 && val.length <= 30), {
      message: 'ID Line harus antara 3 hingga 30 karakter',
    }),
  noWhatsapp: z
    .string()
    .optional()
    .refine((val) => !val || /^0\d{10,12}$/.test(val), {
      message: 'Nomor WhatsApp harus 11-13 digit dan dimulai dengan 0',
    }),
});

type mahasiswaProfilSchemaType = z.infer<typeof mahasiswaProfilSchema>;

const EditProfileDialog = ({
  image,
  nama,
  nim,
  jurusan,
  angkatan,
  line,
  whatsapp,
  isEdit,
  setIsEdit,
}: {
  image: string | null | undefined;
  nama: string;
  nim: string;
  jurusan: string;
  angkatan: string;
  line: string;
  whatsapp: string;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
}) => {
  const toast = useToast();

  const mutation = api.users.editProfilMahasiswa.useMutation();
  const form = useForm<mahasiswaProfilSchemaType>({
    resolver: zodResolver(mahasiswaProfilSchema),
    defaultValues: {
      fotoProfil: image ?? undefined,
      nama: nama ?? '',
      nim: nim ?? '',
      jurusanAngkatan: `${jurusan ?? ''}'${angkatan ?? ''}`,
      idLine: line ?? '',
      noWhatsapp: whatsapp ?? '',
    },
  });

  // dummy
  const setIsOpen = (value: boolean) => {
    if (!value) {
      form.reset();
    }
    setIsEdit(value);
  };
  async function onSubmit(values: mahasiswaProfilSchemaType) {
    // Split jurusanAngkatan back into separate fields
    const [jurusan, angkatan] = values.jurusanAngkatan.split("'");

    mutation.mutate(
      {
        image: values.fotoProfil,
        idLine: values.idLine,
        noWhatsapp: values.noWhatsapp,
      },
      {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
          location.reload();
        },
        onError: (error) => {
          toast.toast({
            variant: 'destructive',
            title: 'Gagal mengubah profil',
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <div className="w-full px-18 min-h-screen">
      {!isEdit && (
        <Button
          className="w-full bg-secondary-400 hover:bg-secondary-500 space-x-6 -translate-y-0 px-6 py-6 text-xl rounded-3xl"
          onClick={() => setIsEdit(true)}
        >
          <Pencil /> Edit Profile Info
        </Button>
      )}
      {isEdit && (
        <div className="w-full items-center px-18 pb-2">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-neutral-1000">
              Edit Profile
            </h2>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              {/* Profile Section with Avatar and Personal Info */}
              <div className="flex items-start gap-x-[52px]">
                {/* Avatar with Upload Button */}
                <div className="flex flex-col items-start">
                  <FormField
                    control={form.control}
                    name="fotoProfil"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative w-64 h-64 rounded-full overflow-hidden bg-gray-200 cursor-pointer group">
                            {/* Display the image */}
                            {field.value ? (
                              <Image
                                src={field.value}
                                alt="Profile Picture"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <Camera className="w-8 h-8 mb-2" />
                                <span className="text-xs text-center">
                                  Click to upload
                                </span>
                              </div>
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col items-center justify-center opacity-100 transition-opacity">
                              <Image
                                src={'/icons/photo-camera.svg'}
                                alt="Camera Icon"
                                height={24}
                                width={24}
                              />
                              <span className="text-neutral-300 text-xs text-center font-semibold ">
                                {field.value
                                  ? 'Click to change photo'
                                  : 'Click to upload'}
                              </span>
                            </div>

                            {/* Hidden upload button that covers the entire area */}
                            <div className="absolute inset-0">
                              <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                  if (res && res.length > 0) {
                                    // @ts-expect-error URL is a valid string
                                    field.onChange(res[0].url);
                                  }
                                }}
                                onUploadError={(error: Error) => {
                                  alert(`ERROR! ${error.message}`);
                                }}
                                appearance={{
                                  button:
                                    'w-full h-full bg-transparent border-none cursor-pointer p-0 m-0',
                                  container: 'w-full h-full',
                                  allowedContent: 'hidden',
                                }}
                                content={{
                                  button: () => (
                                    <div className="w-full h-full bg-transparent" />
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Personal Information */}
                <div className="flex-1 space-y-4">
                  {/* Nama */}
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-neutral-1000 text-lg">
                          Nama
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nama lengkap"
                            {...field}
                            className="border border-neutral-400 bg-neutral-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* NIM - Read Only */}
                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-neutral-1000 text-lg">
                          NIM
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NIM"
                            {...field}
                            readOnly
                            disabled
                            className="bg-gray-100 cursor-not-allowed text-gray-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Jurusan'Angkatan in one field */}
                  <FormField
                    control={form.control}
                    name="jurusanAngkatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-neutral-1000 text-lg">
                          Jurusan&apos;Angkatan
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Teknik Informatika'2022"
                            {...field}
                            className="border border-neutral-400 bg-neutral-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-[28px] font-semibold text-neutral-1000">
                  Contact Info
                </h3>
                <div className="flex gap-x-4">
                  {/* ID Line */}
                  <FormField
                    control={form.control}
                    name="idLine"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex flex-row items-center space-x-3">
                          <Image
                            src={LineIcon}
                            alt="Line Icon"
                            width={20}
                            height={20}
                          />
                          <p className="font-normal text-xl">ID Line</p>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. @johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* WhatsApp */}
                  <FormField
                    control={form.control}
                    name="noWhatsapp"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex flex-row items-center space-x-3">
                          <Image
                            src={WhatsappIcon}
                            alt="Whatsapp Icon"
                            width={20}
                            height={20}
                          />
                          <p className="font-normal text-xl">Nomor WhatsApp</p>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 08123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="w-full gap-x-4 flex justify-end items-end pt-4">
                <Button
                  variant={'outline'}
                  className="border-Blue-Dark text-Blue-Dark"
                  onClick={() => setIsEdit(false)}
                  type="button"
                >
                  Batal Edit
                </Button>
                <Button
                  type="submit"
                  className="bg-Blue-Dark text-white px-6 py-3"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default EditProfileDialog;
