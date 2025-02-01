"use client";
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/trpc/react";

// ✅ Schema Validasi dengan Zod
const AnggotaSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  user_id: z.string().min(1, "User ID wajib diisi"),
  position_id: z.string().min(1, "Posisi wajib diisi"),
  bidang_id: z.string().min(1, "Bidang wajib diisi"),
  description: z.string().optional(),
});

// ✅ Type inference dari schema
type AnggotaSchemaType = z.infer<typeof AnggotaSchema>;

const TambahAnggotaForm = () => {
    const form = useForm<AnggotaSchemaType>({
        resolver: zodResolver(AnggotaSchema),
        defaultValues: {
            name: "",
            user_id: "",
            position_id: "",
            bidang_id: "",
            description: "",
        },
    });

    const onSubmit = (values: AnggotaSchemaType) => {
        
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                {/* Nama Anggota */}
                <FormField
                    control={form.control}
                    name="name"
                    // @ts-ignore
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Anggota</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan nama anggota" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* User ID */}
                <FormField
                    control={form.control}
                    name="user_id"
                    // @ts-ignore
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User ID</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan User ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Posisi Anggota */}
                <FormField
                    control={form.control}
                    name="position_id"
                    // @ts-ignore
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Posisi</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Posisi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ketua">Ketua</SelectItem>
                                    <SelectItem value="Wakil">Wakil</SelectItem>
                                    <SelectItem value="Anggota">Anggota</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Bidang */}
                <FormField
                    control={form.control}
                    name="bidang_id"
                    // @ts-ignore
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bidang</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bidang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="HRD">HRD</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Deskripsi (opsional) */}
                <FormField
                    control={form.control}
                    name="description"
                    // @ts-ignore
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                                <Input placeholder="Opsional" {...field} />
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
