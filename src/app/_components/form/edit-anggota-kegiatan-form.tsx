'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { cn } from '~/lib/utils';

const EditAnggotaSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  nim: z.string().min(1, 'NIM wajib diisi'),
  division: z.string().min(1, 'Divisi wajib diisi'),
  position: z.string().min(1, 'Posisi wajib diisi'),
});

type EditAnggotaSchemaType = z.infer<typeof EditAnggotaSchema>;

export type EditComboboxDataType = {
  value: string;
  label: string;
};

type EditAnggotaProps = {
  defaultValues: {
    nama: string;
    nim: string;
    division: string;
    position: string;
    user_id: string;
    event_id: string;
  };
  divisiList: EditComboboxDataType[];
  posisiList: EditComboboxDataType[];
  setIsOpen: (param: boolean) => void;
  onUpdate?: (data: any) => void;
};

type MutationOptions = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

type MockMutation = {
  mutate: (data: any, options?: MutationOptions) => void;
  isPending: boolean;
};

const EditAnggotaKegiatanForm: React.FC<EditAnggotaProps> = ({
  defaultValues,
  divisiList,
  posisiList,
  setIsOpen,
  onUpdate,
}) => {
  const [divisiOpen, setDivisiOpen] = useState(false);
  const [posisiOpen, setPosisiOpen] = useState(false);
  const [divisiOptions, setDivisiOptions] = useState(divisiList);
  const [posisiOptions, setPosisiOptions] = useState(posisiList);
  const [customDivisi, setCustomDivisi] = useState('');
  const [customPosisi, setCustomPosisi] = useState('');

  // Fake mutation for UI testing
  const mutation: MockMutation = {
    mutate: (data: any, options?: MutationOptions) => {
      console.log('Mock mutation called with data:', data);

      // Simulate loading state
      setTimeout(() => {
        console.log('Mock mutation success!');
        if (options?.onSuccess) {
          options.onSuccess();
        }
      }, 1000); // 1 second delay to simulate network
    },
    isPending: false, // Set to true to test loading state
  };

  const form = useForm<EditAnggotaSchemaType>({
    resolver: zodResolver(EditAnggotaSchema),
    defaultValues: {
      nama: defaultValues.nama,
      nim: defaultValues.nim,
      division: defaultValues.division,
      position: defaultValues.position,
    },
  });

  useEffect(() => {
    form.reset({
      nama: defaultValues.nama,
      nim: defaultValues.nim,
      division: defaultValues.division,
      position: defaultValues.position,
    });
  }, [defaultValues, form]);

  const onSubmit = (values: EditAnggotaSchemaType) => {
    mutation.mutate(
      {
        event_id: defaultValues.event_id,
        user_id: defaultValues.user_id,
        division: values.division,
        position: values.position,
      },
      {
        onSuccess: () => {
          if (onUpdate) {
            onUpdate({
              division: values.division,
              position: values.position,
            });
          }
          setIsOpen(false);
          console.log('Form submitted successfully!');
        },
      },
    );
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-5">Edit Anggota Kegiatan</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
          autoComplete="off"
        >
          {/* Nama */}
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem className="w-full flex items-center gap-16">
                <FormLabel className="w-24 text-xl font-normal">Nama</FormLabel>
                <FormControl>
                  <Input
                    className="text-neutral-700 rounded-[12px] h-12"
                    placeholder="Masukkan nama"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NIM */}
          <FormField
            control={form.control}
            name="nim"
            render={({ field }) => (
              <FormItem className="w-full flex items-center gap-16">
                <FormLabel className="w-24 text-xl font-normal">NIM</FormLabel>
                <FormControl>
                  <Input
                    className="text-neutral-700 rounded-[12px] h-12"
                    placeholder="Masukkan NIM"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Divisi */}
          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem className="w-full flex items-center gap-16">
                <FormLabel className="w-24 text-xl font-normal">
                  Divisi
                </FormLabel>
                <FormControl>
                  <Popover open={divisiOpen} onOpenChange={setDivisiOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-neutral-700 rounded-[12px] h-12"
                      >
                        {field.value
                          ? divisiOptions.find((b) => b.value === field.value)
                              ?.label
                          : 'Pilih Divisi'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 PopoverContent">
                      <Command>
                        <CommandInput placeholder="Cari Divisi" />
                        <CommandList>
                          <CommandEmpty>Divisi Tidak Ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {divisiOptions.map((b) => (
                              <CommandItem
                                key={b.value}
                                value={b.value}
                                onSelect={() => {
                                  field.onChange(b.value);
                                  setDivisiOpen(false);
                                }}
                              >
                                {b.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value === b.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                            <CommandItem>
                              <Input
                                className="w-full focus-visible:ring-transparent bg-white"
                                value={customDivisi}
                                onChange={(e) =>
                                  setCustomDivisi(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (
                                    e.key === 'Enter' &&
                                    customDivisi.trim() !== ''
                                  ) {
                                    const newDivisi = {
                                      value: customDivisi,
                                      label: customDivisi,
                                    };
                                    if (
                                      !divisiOptions.some(
                                        (b) => b.value === customDivisi,
                                      )
                                    ) {
                                      setDivisiOptions([
                                        ...divisiOptions,
                                        newDivisi,
                                      ]);
                                    }
                                    field.onChange(customDivisi);
                                    setCustomDivisi('');
                                    setDivisiOpen(false);
                                  }
                                }}
                                placeholder="Tambah Divisi baru"
                              />
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Posisi */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full flex items-center gap-16">
                <FormLabel className="w-24 text-xl font-normal">
                  Posisi
                </FormLabel>
                <FormControl>
                  <Popover open={posisiOpen} onOpenChange={setPosisiOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-neutral-700 rounded-[12px] h-12"
                      >
                        {field.value
                          ? posisiOptions.find((p) => p.value === field.value)
                              ?.label
                          : 'Pilih Posisi'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 PopoverContent">
                      <Command>
                        <CommandInput placeholder="Cari Posisi" />
                        <CommandList>
                          <CommandEmpty>Posisi Tidak Ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {posisiOptions.map((p) => (
                              <CommandItem
                                key={p.value}
                                value={p.value}
                                onSelect={() => {
                                  field.onChange(p.value);
                                  setPosisiOpen(false);
                                }}
                              >
                                {p.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value === p.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                            <CommandItem>
                              <Input
                                className="w-full focus-visible:ring-transparent bg-white"
                                value={customPosisi}
                                onChange={(e) =>
                                  setCustomPosisi(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (
                                    e.key === 'Enter' &&
                                    customPosisi.trim() !== ''
                                  ) {
                                    const newPosisi = {
                                      value: customPosisi,
                                      label: customPosisi,
                                    };
                                    if (
                                      !posisiOptions.some(
                                        (p) => p.value === customPosisi,
                                      )
                                    ) {
                                      setPosisiOptions([
                                        ...posisiOptions,
                                        newPosisi,
                                      ]);
                                    }
                                    field.onChange(customPosisi);
                                    setCustomPosisi('');
                                    setPosisiOpen(false);
                                  }
                                }}
                                placeholder="Tambah posisi baru"
                              />
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="w-fit px-9 bg-[#F16350] hover:bg-[#FF9185] text-white hover:text-white"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="w-fit px-6 bg-[#2B6282] hover:bg-[#2B6282] text-white"
              disabled={mutation.isPending}
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditAnggotaKegiatanForm;
