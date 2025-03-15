'use client'
import React, { useState } from 'react'
// Components Import
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from '~/components/ui/input';
import {UploadButton} from '~/utils/uploadthing';
import {Button} from '~/components/ui/button';
// Form Import
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {api} from "~/trpc/react";
import {useToast} from "~/hooks/use-toast";
import { PencilLine } from 'lucide-react';
import { Textarea } from '~/components/ui/textarea';

const profileLembagaSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi").max(30, "Nama maksimal 30 karakter"),
    deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter").max(100, "Deskripsi maksimal 100 krakater"),
    gambar: z.string().url()
})
type profileLembagaSchemaType = z.infer<typeof profileLembagaSchema>

const EditProfilLembaga = (
    {
        lembagaData
    }:
    {
        lembagaData: {
            id: string,
            name: string,
            description: string | null,
            users: {
                image: string | null
            }
        }
    }
) => {
    const [isEdit, setIsEdit] = useState(false)
    const mutation = api.lembaga.editProfil.useMutation()
    const toast = useToast()
    const form = useForm<profileLembagaSchemaType>({
        resolver: zodResolver(profileLembagaSchema),
        defaultValues: {
            nama: lembagaData.name ?? "",
            deskripsi: lembagaData.description ?? "",
            gambar: lembagaData.users.image ?? ""
        }
    })

    function onSubmit(values: profileLembagaSchemaType) {
        mutation.mutate(values, {
            onSuccess: () => {
                toast.toast({
                    variant: "default",
                    title: "Berhasil mengubah profil"
                })
                window.location.reload()
            },
            onError: (error) => {
                toast.toast({
                    variant: "destructive",
                    title: "Gagal mengubah profil",
                    description: error.message
                })
            }
        })
    }

    return (
        <div>
            {!isEdit && (
                <Button 
                    className="bg-secondary-500 hover:bg-secondary-600 text-white hover:text-white shadow-none"
                    onClick={() => setIsEdit(true)}
                >
                    Edit Profil Lembaga <PencilLine/>
                </Button>
            )}
            {isEdit && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 min-w-[500px]'>
                        <FormField
                            control={form.control}
                            name="nama"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Nama Lembaga</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Masukkan nama lembaga" {...field}  className='border-neutral-400 focus-visible:ring-transparent'/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deskripsi"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Deskripsi Lembaga</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Masukkan deskripsi lembaga" {...field} className='border-neutral-400 focus-visible:ring-transparent' />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gambar"
                            render={({field}) => (
                                <FormItem className='flex flex-col items-start justify-start'>
                                    <FormLabel>Upload Profil Lembaga</FormLabel>
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
                                            button: "bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-2 px-4 rounded-md",
                                        }}
                                        className="w-full"
                                    />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className='w-full flex items-end justify-end'>
                            <Button type='submit' className='bg-Blue-Dark hover:bg-Blue-Dark/80 text-white'>
                                Edit Profil <PencilLine/>
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default EditProfilLembaga