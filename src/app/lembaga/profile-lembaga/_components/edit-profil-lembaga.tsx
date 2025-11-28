'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Pencil } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
// Form Import
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
// Components Import
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { UploadButton } from '~/utils/uploadthing';

const profileLembagaSchema = z.object({
  nama: z
    .string()
    .min(1, 'Nama wajib diisi')
    .max(30, 'Nama maksimal 30 karakter'),
  deskripsi: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(100, 'Deskripsi maksimal 100 krakater'),
  gambar: z.string().url(),
});
type profileLembagaSchemaType = z.infer<typeof profileLembagaSchema>;

const EditProfileLembaga = ({
  lembagaData,
  isEdit,
  setIsEdit,
}: {
  lembagaData: {
    id: string;
    name: string;
    description: string | null;
    users: {
      image: string | null;
    };
  };
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const mutation = api.lembaga.editProfil.useMutation();
  const toast = useToast();
  const form = useForm<profileLembagaSchemaType>({
    resolver: zodResolver(profileLembagaSchema),
    defaultValues: {
      nama: lembagaData.name ?? '',
      deskripsi: lembagaData.description ?? '',
      gambar: lembagaData.users.image ?? '',
    },
  });

  function onSubmit(values: profileLembagaSchemaType) {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.toast({
          variant: 'default',
          title: 'Berhasil mengubah profil',
        });
        window.location.reload();
      },
      onError: (error) => {
        toast.toast({
          variant: 'destructive',
          title: 'Gagal mengubah profil',
          description: error.message,
        });
      },
    });
  }

  return (
    <div className="w-full px-18">
      {!isEdit && (
        <Button
          className="w-full bg-secondary-500 hover:bg-secondary-600 space-x-6 -translate-y-0 px-6 py-6 text-base sm:text-lg md:text-xl rounded-3xl text-white hover:text-white shadow-none"
          onClick={() => setIsEdit(true)}
        >
          <Pencil /> Edit Profile Lembaga
        </Button>
      )}
      {isEdit && (
        <div className="w-full items-center pb-2">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl md:text-[32px] font-semibold text-slate-600">
              Edit Profile Lembaga
            </h2>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-x-[52px]">
                <div className="flex flex-col items-start">
                  <FormField
                    control={form.control}
                    name="gambar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative w-30 h-30 sm:w-40 sm:h-40 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-200 cursor-pointer group">
                            {field.value ? (
                              <Image
                                src={field.value}
                                alt="Profile Picture Lembaga"
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

                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-100 transition-opacity">
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

                            <div className="absolute inset-0">
                              <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                  if (res && res.length > 0 && res[0]) {
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

                <div className="flex-1 space-y-4 gap-3 w-full">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-neutral-1000 text-sm md:text-lg">
                          Nama Lembaga
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nama lembaga"
                            {...field}
                            className="border rounded-xl border-neutral-400 bg-neutral-200 text-sm md:text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deskripsi Lembaga */}
                  <FormField
                    control={form.control}
                    name="deskripsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-neutral-1000 text-sm md:text-lg">
                          Deskripsi Lembaga
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Masukkan deskripsi lembaga"
                            {...field}
                            className="border rounded-xl border-neutral-400 bg-neutral-200 text-sm resize-none md:text-base min-h-40 sm:min-h-60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="w-full gap-x-4 flex justify-center items-center sm:justify-end sm:items-end pt-4">
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

export default EditProfileLembaga;
