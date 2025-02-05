"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Session } from "next-auth";
// Components Import
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";

// ✅ Schema Validasi dengan Zod
const AnggotaSchema = z.object({
  user_id: z.string().min(1, "User ID wajib diisi"),
  position: z.string().min(1, "Posisi wajib diisi"),
  division: z.string().min(1, "Bidang wajib diisi"),
});

// ✅ Type inference dari schema
type AnggotaSchemaType = z.infer<typeof AnggotaSchema>;

// Ini Harusnya Mahasiswa (Gantilah dengan data dari API)
const mahasiswaData = [
  { value: "1", label: "Mahasiswa 1" },
  { value: "2", label: "Mahasiswa 2" },
  { value: "3", label: "Mahasiswa 3" },
];

// Dummy Posisi
const posisiData = [
  { value: "Ketua", label: "Ketua" },
  { value: "Wakil", label: "Wakil" },
  { value: "Anggota", label: "Anggota" },
];

const bidangData = [
  { value: "IT", label: "IT" },
  { value: "Marketing", label: "Marketing" },
  { value: "HRD", label: "HRD" },
];

const TambahAnggotaForm = ({ session }: { session: Session | null }) => {
  const [open, setOpen] = React.useState(false);
  const [posisiOpen, setPosisiOpen] = React.useState(false);
  const [bidangOpen, setBidangOpen] = React.useState(false);

  const mutation = api.lembaga.addAnggota.useMutation();

  const form = useForm<AnggotaSchemaType>({
    resolver: zodResolver(AnggotaSchema),
    defaultValues: {
      user_id: "",
      position: "",
      division: "",
    },
  });

  const onSubmit = (values: AnggotaSchemaType) => {
    const query = {
      ...values,
      lembagaId: session?.user.id ?? "",
    };

    mutation.mutate(query, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* User ID */}
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col">
              <FormLabel>Nama Mahasiswa</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {field.value
                        ? mahasiswaData.find((m) => m.value === field.value)?.label
                        : "Pilih Mahasiswa"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 PopoverContent">
                    <Command>
                      <CommandInput placeholder="Cari Mahasiswa" />
                      <CommandList>
                        <CommandEmpty>Mahasiswa Tidak Ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {mahasiswaData.map((m) => (
                            <CommandItem
                              key={m.value}
                              value={m.value}
                              onSelect={() => {
                                field.onChange(m.value);
                                setOpen(false);
                              }}
                            >
                              {m.label}
                              <Check className={cn("ml-auto", field.value === m.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
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

        {/* Posisi Anggota */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Posisi</FormLabel>
              <FormControl>
                <Popover open={posisiOpen} onOpenChange={setPosisiOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {field.value ? posisiData.find((p) => p.value === field.value)?.label : "Pilih Posisi"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 PopoverContent">
                    <Command>
                      <CommandInput placeholder="Cari Posisi" />
                      <CommandList>
                        <CommandEmpty>Posisi Tidak Ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {posisiData.map((p) => (
                            <CommandItem
                              key={p.value}
                              value={p.value}
                              onSelect={() => {
                                field.onChange(p.value);
                                setPosisiOpen(false);
                              }}
                            >
                              {p.label}
                              <Check className={cn("ml-auto", field.value === p.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
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

        {/* Bidang */}
        <FormField
          control={form.control}
          name="division"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Bidang</FormLabel>
              <FormControl>
                <Popover open={bidangOpen} onOpenChange={setBidangOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {field.value ? bidangData.find((b) => b.value === field.value)?.label : "Pilih Bidang"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 PopoverContent">
                    <Command>
                      <CommandInput placeholder="Cari Bidang" />
                      <CommandList>
                        <CommandEmpty>Bidang Tidak Ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {bidangData.map((b) => (
                            <CommandItem
                              key={b.value}
                              value={b.value}
                              onSelect={() => {
                                field.onChange(b.value);
                                setBidangOpen(false);
                              }}
                            >
                              {b.label}
                              <Check className={cn("ml-auto", field.value === b.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
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

        {/* Tombol Submit */}
        <Button type="submit" className="w-full">Simpan Anggota</Button>
      </form>
    </Form>
  );
};

export default TambahAnggotaForm;
