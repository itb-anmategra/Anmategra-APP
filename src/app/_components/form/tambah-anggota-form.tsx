'use client';

// Library Import
import { zodResolver } from '@hookform/resolvers/zod';
// Icons Import
import { Check, ChevronsUpDown } from 'lucide-react';
import { type Session } from 'next-auth';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
// Components Import
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
// Utils Import
import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';

// ✅ Schema Validasi dengan Zod
const AnggotaSchema = z.object({
  user_id: z.string().min(1, 'User ID wajib diisi'),
  nim: z.string().min(1, 'NIM wajib diisi'),
  position: z.string().min(1, 'Posisi wajib diisi'),
  division: z.string().min(1, 'Bidang wajib diisi'),
});

// ✅ Type inference dari schema
type AnggotaSchemaType = z.infer<typeof AnggotaSchema>;

export type comboboxDataType = {
  value: string;
  label: string;
};

const TambahAnggotaForm = ({
  session,
  data,
  setIsOpen,
  manualMode,
  setManualMode,
}: {
  session: Session | null;
  data: {
    mahasiswa: comboboxDataType[];
    nim: comboboxDataType[];
    posisi: comboboxDataType[];
    bidang: comboboxDataType[];
  };
  setIsOpen: (param: boolean) => void;
  manualMode: boolean;
  setManualMode: (param: boolean) => void;
}) => {
  const [mahasiswaOpen, setMahasiswaOpen] = useState(false);
  const [nimOpen, setNimOpen] = useState(false);
  const [posisiOpen, setPosisiOpen] = useState(false);
  const [bidangOpen, setBidangOpen] = useState(false);

  const mutation = api.lembaga.addAnggota.useMutation();
  const form = useForm<AnggotaSchemaType>({
    resolver: zodResolver(AnggotaSchema),
    defaultValues: {
      user_id: '',
      nim: '',
      position: '',
      division: '',
    },
  });
  const [mahasiswaList] = useState<comboboxDataType[]>(data.mahasiswa);
  const [nimList] = useState<comboboxDataType[]>(data.nim ?? []);
  const [posisiList] = useState<comboboxDataType[]>(data.posisi);
  const [bidangList] = useState<comboboxDataType[]>(data.bidang);

  const onSubmit = (values: AnggotaSchemaType) => {
    const query = {
      ...values,
      lembagaId: session?.user.id ?? '',
    };
    setIsOpen(false);
    mutation.mutate(query, {
      onSuccess: () => {
        form.reset();
        location.reload();
      },
    });
  };

  const manualInputClass =
    'h-10 w-full rounded-[5px] border-[#DDE3EA] placeholder:text-[#98A2B3]';

  return (
    <Form {...form}>
      {manualMode && (
        <p className="text-base text-center text-[#98A2B3] -mt-4">
          Masukkan informasi anggota baru untuk kegiatan
        </p>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        {/* User ID */}
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col">
              <FormLabel>Nama Mahasiswa</FormLabel>
              <FormControl>
                {manualMode ? (
                  <Input
                    className={manualInputClass}
                    placeholder="Masukkan nama lengkap mahasiswa..."
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                ) : (
                  <Popover open={mahasiswaOpen} onOpenChange={setMahasiswaOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span className={cn(!field.value && 'text-[#98A2B3]')}>
                          {field.value
                            ? mahasiswaList.find((b) => b.value === field.value)
                                ?.label
                            : 'Masukkan nama lengkap mahasiswa...'}
                        </span>
                        <ChevronsUpDown
                          className={cn(!field.value && 'text-[#636A6D]')}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 PopoverContent">
                      <Command>
                        <CommandInput placeholder="Cari Mahasiswa" />
                        <CommandList>
                          <CommandEmpty>Mahasiswa tidak ditemukan</CommandEmpty>
                          <CommandGroup>
                            {mahasiswaList.map((m) => (
                              <CommandItem
                                key={m.label}
                                value={m.label}
                                onSelect={() => {
                                  field.onChange(m.value);
                                  setMahasiswaOpen(false);
                                }}
                              >
                                {m.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value === m.label
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
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
            <FormItem className="w-full flex flex-col">
              <FormLabel>NIM</FormLabel>
              <FormControl>
                {manualMode ? (
                  <Input
                    className={manualInputClass}
                    placeholder="Masukkan NIM..."
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    inputMode="numeric"
                  />
                ) : (
                  <Popover open={nimOpen} onOpenChange={setNimOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span className={cn(!field.value && 'text-[#98A2B3]')}>
                          {field.value
                            ? nimList.find((b) => b.value === field.value)
                                ?.label
                            : 'Masukkan NIM...'}
                        </span>
                        <ChevronsUpDown
                          className={cn(!field.value && 'text-[#636A6D]')}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 PopoverContent">
                      <Command>
                        <CommandInput placeholder="Cari NIM" />
                        <CommandList>
                          <CommandEmpty>NIM tidak ditemukan</CommandEmpty>
                          <CommandGroup>
                            {(nimList ?? []).map((n) => (
                              <CommandItem
                                key={n.value}
                                value={n.value}
                                onSelect={() => {
                                  field.onChange(n.value);
                                  setNimOpen(false);
                                }}
                              >
                                {n.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value === n.label
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Posisi Anggota */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Posisi</FormLabel>
              <FormControl>
                {manualMode ? (
                  <Input
                    className={manualInputClass}
                    placeholder="Masukkan posisi..."
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                ) : (
                  <Popover open={posisiOpen} onOpenChange={setPosisiOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span className={cn(!field.value && 'text-[#98A2B3]')}>
                          {field.value
                            ? posisiList.find((b) => b.value === field.value)
                                ?.label
                            : 'Masukkan posisi...'}
                        </span>
                        <ChevronsUpDown
                          className={cn(!field.value && 'text-[#636A6D]')}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 PopoverContent">
                      <Command>
                        <CommandInput placeholder="Cari Posisi" />
                        <CommandList>
                          <CommandEmpty>Posisi tidak ditemukan</CommandEmpty>
                          <CommandGroup>
                            {(posisiList ?? []).map((p) => (
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
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bidang */}
        <FormField
          control={form.control}
          name="division"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Bidang</FormLabel>
              <FormControl>
                {manualMode ? (
                  <Input
                    className={manualInputClass}
                    placeholder="Masukkan bidang..."
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                ) : (
                  <Popover open={bidangOpen} onOpenChange={setBidangOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span className={cn(!field.value && 'text-[#98A2B3]')}>
                          {field.value
                            ? bidangList.find((b) => b.value === field.value)
                                ?.label
                            : 'Masukkan bidang...'}
                        </span>
                        <ChevronsUpDown
                          className={cn(!field.value && 'text-[#636A6D]')}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 PopoverContent">
                      <Command>
                        <CommandInput placeholder="Cari Bidang" />
                        <CommandList>
                          <CommandEmpty>Bidang tidak ditemukan</CommandEmpty>
                          <CommandGroup>
                            {bidangList.map((b) => (
                              <CommandItem
                                key={b.value}
                                value={b.value}
                                onSelect={() => {
                                  field.onChange(b.value);
                                  setBidangOpen(false);
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
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tombol Submit */}
        <Button
          type="submit"
          className="w-full bg-[#00B7B7] hover:bg-[#00B7B7]/85 text-white text-base font-semibold
                     rounded-[10px] shadow-none items-center h-12"
        >
          Simpan Anggota
        </Button>

        {!manualMode && (
          <div className="mt-3">
            {/* Separator */}
            <div className="flex items-center gap-4 text-[#B1B4B6]">
              <div className="h-px flex-1 bg-[#E6E9ED]" />
              <span className="text-sm font-light text-[#B1B4B6]">atau</span>
              <div className="h-px flex-1 bg-[#E6E9ED]" />
            </div>

            {/* Manual Option */}
            <div className="mt-3 flex w-full text-sm justify-between flex-nowrap gap-3">
              <span className="text-black/80 font-light whitespace-nowrap">
                Nama mahasiswa tidak ada dalam daftar?
              </span>
              <button
                type="button"
                className="text-[#00B7B7] font-semibold hover:underline whitespace-nowrap"
                onClick={() => {
                  setManualMode(true);
                  form.reset({
                    user_id: '',
                    nim: '',
                    position: '',
                    division: '',
                  });
                }}
              >
                Tambah Anggota Secara Manual
              </button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TambahAnggotaForm;
