'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PencilLine } from 'lucide-react';
import React, { useState } from 'react';
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
}: {
  lembagaData: {
    id: string;
    name: string;
    description: string | null;
    users: {
      image: string | null;
    };
  };
}) => {
  const [isEdit, setIsEdit] = useState(false);
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
    <div>
      {!isEdit && (
        <Button
          className="bg-secondary-500 hover:bg-secondary-600 text-white hover:text-white shadow-none h-8 md:h-10 text-sm md:text-base px-3 md:px-4"
          onClick={() => setIsEdit(true)}
        >
          <span className="hidden md:inline">Edit Profil Lembaga</span>
          <span className="md:hidden">Edit Profil</span>
          <PencilLine className="w-4 h-4 ml-1" />
        </Button>
      )}
      {isEdit && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 min-w-full sm:min-w-[400px] md:min-w-[500px] w-full"
          >
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Nama Lembaga</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama lembaga"
                      {...field}
                      className="border-neutral-400 focus-visible:ring-transparent h-8 md:h-10 text-sm md:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Deskripsi Lembaga</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi lembaga"
                      {...field}
                      className="border-neutral-400 focus-visible:ring-transparent min-h-16 md:min-h-20 text-sm md:text-base resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gambar"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-start">
                  <FormLabel className="text-sm md:text-base">Upload Profil Lembaga</FormLabel>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        // @ts-expect-error because the type of field is not compatible with the type of res
                        field.onChange(res[0].url);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                    appearance={{
                      button:
                        'bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-2 px-4 rounded-md',
                    }}
                    className="w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-center md:justify-end gap-2 md:gap-x-4 pt-4">
              <Button
                variant={'outline'}
                className="border-Blue-Dark text-Blue-Dark w-full md:w-auto h-8 md:h-10 text-sm md:text-base"
                onClick={() => setIsEdit(false)}
              >
                Batal Edit
              </Button>
              <Button
                type="submit"
                className="bg-Blue-Dark hover:bg-Blue-Dark/80 text-white w-full md:w-auto h-8 md:h-10 text-sm md:text-base"
              >
                Simpan <PencilLine />
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EditProfileLembaga;
