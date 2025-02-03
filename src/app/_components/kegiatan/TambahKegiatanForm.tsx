"use client";
// Library Import
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns"
// Components Import
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Input } from '~/components/ui/input';
// TRPC Import
import { api } from "~/trpc/react";
// Utils Import
import { cn } from '~/lib/utils';
// Icon Import
import { CalendarIcon } from 'lucide-react';

// ✅ Schema dengan Zod
const EventInputSchema = z.object({
  name: z.string().min(1, "Nama kegiatan wajib diisi"),
  org_id: z.string().optional(),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  image: z.string().url("Harus berupa URL yang valid"),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
  status: z.enum(["Coming Soon", "On going", "Ended"]),
  oprec_link: z.string().url("Harus berupa URL yang valid"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  participant_limit: z.number().int().min(1, "Minimal 1 peserta"),
  participant_count: z.number().int().min(0, "Minimal 0 peserta"),
  is_highlighted: z.boolean(),
  is_organogram: z.boolean(),
});

// ✅ Type inference dari schema
type EventInputSchemaType = z.infer<typeof EventInputSchema>;

const TambahKegiatanForm = () => {
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()


  // ✅ useForm hook
  const form = useForm<EventInputSchemaType>({
    resolver: zodResolver(EventInputSchema),
    defaultValues: {
      name: "",
      org_id: undefined,
      description: "",
      image: "",
      start_date: new Date().toISOString(),
      end_date: undefined,
      status: "Coming Soon",
      oprec_link: "https://",
      location: "",
      participant_limit: 1,
      participant_count: 0,
      is_highlighted: false,
      is_organogram: false,
    },
  });

  // Function submit
    const onSubmit = (values: EventInputSchemaType) => {
        const mutation = api.event.create.useMutation();

        mutation.mutate(values, {
            onSuccess: () => {
                console.log("Kegiatan berhasil ditambahkan");
            },
            onError: (error) => {
                console.error("Error creating event:", error);
            },
        });
    };

    return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Nama Kegiatan */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kegiatan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama kegiatan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Deskripsi */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Jelaskan tentang kegiatan ini..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Layout: Tanggal Mulai & Selesai */}
        <div className="flex space-x-4 pt-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col gap-y-[2px]">
                <FormLabel>Tanggal Mulai</FormLabel>
                <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-20">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col gap-y-[2px]">
                <FormLabel>Tanggal Selesai</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-20">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status Kegiatan */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Kegiatan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coming Soon">Segera Dimulai</SelectItem>
                  <SelectItem value="On going">Sedang Berlangsung</SelectItem>
                  <SelectItem value="Ended">Selesai</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Layout: Lokasi & Link Pendaftaran */}
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Lokasi Kegiatan</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan lokasi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oprec_link"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Link Pendaftaran</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://contoh.com/daftar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Layout: Batas & Jumlah Peserta */}
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="participant_limit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Batas Peserta</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Masukkan jumlah maksimal peserta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="participant_count"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Jumlah Peserta Saat Ini</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Masukkan jumlah peserta saat ini" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Checkbox untuk highlight & organogram */}
        <div className="flex space-x-6 items-center">
          <FormField control={form.control} name="is_highlighted" render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <FormLabel>Tampilkan Sebagai Sorotan</FormLabel>
            </FormItem>
          )} />

          <FormField control={form.control} name="is_organogram" render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <FormLabel>Gunakan Organogram</FormLabel>
            </FormItem>
          )} />
        </div>

        {/* Tombol Submit */}
        <Button type="submit" className="w-full">Simpan Kegiatan</Button>
      </form>
    </Form>
  );
};

export default TambahKegiatanForm;
