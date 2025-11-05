'use client';

// Library Import
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
// Icon Import
import { CalendarIcon } from 'lucide-react';
import type { Session } from 'next-auth';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { z } from 'zod';
// Type Import
import { type Activity } from '~/app/lembaga/kegiatan/_components/kegiatan-container';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Checkbox } from '~/components/ui/checkbox';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
// Utils Import
import { cn } from '~/lib/utils';
// TRPC Import
import { api } from '~/trpc/react';
// Upload Thing Import
import { UploadButton } from '~/utils/uploadthing';

// ✅ Schema dengan Zod
const EventInputSchema = z.object({
  name: z.string().min(1, 'Nama kegiatan wajib diisi'),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(100, 'Deskripsi maksimal 100 karakter'),
  image: z.string().url('Harus berupa URL yang valid'),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().nullable().optional(),
  status: z.enum(['Coming Soon', 'On going', 'Ended']),
  oprec_link: z
    .string()
    .url('Harus berupa URL yang valid')
    .or(z.literal(''))
    .optional(),
  location: z.string().min(3, 'Lokasi minimal 3 karakter'),
  participant_limit: z.number().int().min(1, 'Minimal 1 peserta'),
  participant_count: z.number().int().min(0, 'Minimal 0 peserta'),
  is_highlighted: z.boolean().optional(),
  is_organogram: z.boolean().optional(),
  background_image: z.string().url('Harus berupa URL yang valid').optional(),
});

// ✅ Type inference dari schema
type EventInputSchemaType = z.infer<typeof EventInputSchema>;

const TambahKegiatanForm = ({
  setIsOpen,
}: {
  session: Session | null;
  setIsOpen: (param: boolean) => void;
  setActivityList: (param: Activity[]) => void;
}) => {
  // ✅ useForm hook
  const form = useForm<EventInputSchemaType>({
    resolver: zodResolver(EventInputSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      image: '',
      start_date: new Date().toISOString(),
      end_date: undefined,
      status: 'Coming Soon',
      oprec_link: '',
      location: '',
      participant_limit: 1,
      participant_count: 0,
      is_highlighted: false,
      is_organogram: false,
      background_image: '',
    },
  });

  const mutation = api.event.create.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      location.reload();
    },
    onError: (error) => {
      console.error('Error creating event:', error);
    },
  });

  // Function submit
  const onSubmit = (values: EventInputSchemaType) => {
    const query = {
      ...values,
      is_organogram: values.is_organogram ?? false,
      is_highlighted: values.is_highlighted ?? false,
    };
    mutation.mutate(query);
  };

  const isValid = form.formState.isValid;

  const startDate = useWatch({ control: form.control, name: 'start_date' });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        {/* Nama Kegiatan */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kegiatan</FormLabel>
              <FormControl className="p-2">
                <Input
                  className="rounded-lg"
                  placeholder="Masukkan nama kegiatan"
                  {...field}
                />
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
              <FormControl className="p-2">
                <Textarea
                  className="rounded-lg"
                  placeholder="Jelaskan tentang kegiatan ini..."
                  {...field}
                />
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
                <FormControl className="p-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-between text-left font-normal rounded-lg',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="mr-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-20">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
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
                <FormControl className="p-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-between text-left font-normal rounded-lg',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="mr-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-20">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                        disabled={(date) =>
                          startDate
                            ? new Date(date) < new Date(startDate)
                            : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Layout: Status, Lokasi, dan Link Pendaftaran */}
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Status Kegiatan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="rounded-lg">
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

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Lokasi Kegiatan</FormLabel>
                <FormControl className="p-2">
                  <Input
                    className="rounded-lg "
                    placeholder="Masukkan lokasi"
                    {...field}
                  />
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
                <FormControl className="p-2">
                  <Input
                    className="rounded-lg "
                    type="url"
                    placeholder="https://contoh.com/daftar"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Layout: Batas & Jumlah Peserta */}
        <div className="flex space-x-4 ">
          <FormField
            control={form.control}
            name="participant_limit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Batas Peserta</FormLabel>
                <FormControl className="p-2">
                  <div className="relative">
                    <Input
                      type="number"
                      className="rounded-lg pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Masukkan jumlah maksimal peserta"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                      <button
                        type="button"
                        className="w-5 h-4 flex items-end justify-center rounded transition-colors"
                        onClick={() => field.onChange((field.value || 0) + 1)}
                      >
                        <Image
                          src="/icons/increase.svg"
                          alt="Increase icon"
                          width={12}
                          height={12}
                        />
                      </button>
                      <button
                        type="button"
                        className="w-5 h-4 flex items-start justify-center rounded transition-colors"
                        onClick={() =>
                          field.onChange(Math.max(1, (field.value || 0) - 1))
                        }
                      >
                        <Image
                          src="/icons/decrease.svg"
                          alt="Increase icon"
                          width={12}
                          height={12}
                        />
                      </button>
                    </div>
                  </div>
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
                <FormControl className="p-2">
                  <div className="relative">
                    <Input
                      type="number"
                      className="rounded-lg pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Masukkan jumlah peserta saat ini"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                      <button
                        type="button"
                        className="w-5 h-4 flex items-end justify-center rounded transition-colors"
                        onClick={() => field.onChange((field.value || 0) + 1)}
                      >
                        <Image
                          src="/icons/increase.svg"
                          alt="Increase icon"
                          width={12}
                          height={12}
                        />
                      </button>
                      <button
                        type="button"
                        className="w-5 h-4 flex items-start justify-center rounded transition-colors"
                        onClick={() =>
                          field.onChange(Math.max(0, (field.value || 0) - 1))
                        }
                      >
                        <Image
                          src="/icons/decrease.svg"
                          alt="Increase icon"
                          width={12}
                          height={12}
                        />
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_organogram"
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-row self-end space-x-3 items-center justify-center space-y-0">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel>Gunakan Organogram</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center items-center gap-x-6">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Gambar</FormLabel>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      // @ts-expect-error - `field` is not assignable to type `string`
                      field.onChange(res[0].url);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="background_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Banner</FormLabel>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      // @ts-expect-error - `field` is not assignable to type `string`
                      field.onChange(res[0].url);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Tombol Submit */}
        <Button
          type="submit"
          className="w-full bg-primary-400"
          disabled={!isValid}
        >
          Simpan Kegiatan
        </Button>
      </form>
    </Form>
  );
};

export default TambahKegiatanForm;
