'use client'
import React from 'react'
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

const profileLembagaSchema = z.object({
    nama: z.string().min(1, "Nama wajib diisi").max(30, "Nama maksimal 30 karakter"),
    deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter").max(100, "Deskripsi maksimal 100 krakater"),
    gambar: z.string().url()
})
type profileLembagaSchemaType = z.infer<typeof profileLembagaSchema>

const EditProfilLembaga = () => {
    const mutation = api.lembaga.editProfil.useMutation()
    const toast = useToast()
    const form = useForm<profileLembagaSchemaType>({
        resolver: zodResolver(profileLembagaSchema),
        defaultValues: {
            nama: "",
            deskripsi: "",
            gambar: ""
        }
    })

    function onSubmit(values: profileLembagaSchemaType) {
        mutation.mutate(values, {
            onSuccess: () => {
                toast.toast({
                    variant: "default",
                    title: "Berhasil mengubah profil"
                })
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                <FormField
                    control={form.control}
                    name="nama"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nama Kegiatan</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan nama lembaga" {...field} />
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
                            <FormLabel>Nama Kegiatan</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan deskripsi lembaga" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gambar"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Upload Profil Lembaha</FormLabel>
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
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type='submit'>
                    Edit Profil
                </Button>
            </form>
        </Form>
    )
}

export default EditProfilLembaga