"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

enum LaporanCategory {
  BESOK_MINGGU = "BESOK_MINGGU",
  BESOK_SENIN = "BESOK_SENIN",
  BESOK_JUMAT = "BESOK_JUMAT",
}

// Define file schema
const attachmentSchema = z.object({
  name: z.string().min(1, { message: "File name should not be empty" }),
  size: z
    .number()
    .max(5 * 1024 * 1024, { message: "File size must be less than 5MB" }),
  type: z.enum(["image/jpeg", "image/png", "application/pdf"], {
    message: "Invalid file type",
  }),
});

// Define form schema
const laporanSchema = z.object({
  title: z.string().min(1, { message: "Title shouldn't be empty" }),
  category: z.nativeEnum(LaporanCategory),
  description: z.string().optional(),
  attachments: z
    .array(attachmentSchema)
    .optional()
});

// Infer the TypeScript type
type LaporanFormData = z.infer<typeof laporanSchema>;

export const LaporanForm = () => {
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const form = useForm<LaporanFormData>({
    resolver: zodResolver(laporanSchema),
    defaultValues: {
      title: "",
      category: undefined,
      description: "",
      attachments: [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const parsedFiles = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    const validation = attachmentSchema.array().safeParse(parsedFiles);

    if (!validation.success) {
      setFileErrors(validation.error.errors.map((err) => err.message));
      form.setValue("attachments", []); // Clear invalid files
    } else {
      setFileErrors([]);
      form.setValue("attachments", validation.data); // Save valid files
    }
  };

  const onSubmit = (data: LaporanFormData) => {
    console.log("Form Data:", data);
    alert("Form berhasil dibuat")
    window.location.reload(); // Refresh the page after submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Judul Laporan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value as LaporanCategory)
                }
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategory laporan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(LaporanCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attachments */}
        <FormField
          control={form.control}
          name="attachments"
          render={() => (
            <FormItem>
              <FormLabel>Attachments</FormLabel>
              <FormControl>
                <Input type="file" multiple onChange={handleFileChange} />
              </FormControl>
              {fileErrors.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
              {form.watch("attachments")?.map((file: any, index: number) => (
                <p key={index} className="text-sm text-green-500">
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {file.name} - {file.size} bytes
                </p>
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button className="bg-primary-400" type="submit">Buat Laporan</Button>
      </form>
    </Form>
  );
};
