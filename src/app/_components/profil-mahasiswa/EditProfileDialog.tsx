'use client'
// Library
import React, {useState} from 'react'
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod'
// Components Import
import {Button} from '~/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '~/components/ui/form';
import {Input} from '~/components/ui/input';
import {useToast} from "~/hooks/use-toast"
// Icon Import
import {Pencil, PencilLine} from 'lucide-react';
// Upload Thing Import
import {UploadButton} from '~/utils/uploadthing';
import {api} from "~/trpc/react";

const mahasiswaProfilSchema = z.object({
    fotoProfil: z.string().url("Harus berupa URL yang valid").optional(),
    idLine: z.string().optional().refine((val) => !val || (val.length >= 3 && val.length <= 30), {
        message: "ID Line harus antara 3 hingga 30 karakter",
    }),
    noWhatsapp: z.string().optional().refine((val) => !val || /^0\d{10,12}$/.test(val), {
        message: "Nomor WhatsApp harus 11-13 digit dan dimulai dengan 0",
    })
});


type mahasiswaProfilSchemaType = z.infer<typeof mahasiswaProfilSchema>

const EditProfileDialog = ({
                               image,
                               line,
                               whatsapp
                           }: {
    image: string | null | undefined;
    line: string;
    whatsapp: string;
}) => {
    const toast = useToast()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState(false)

    const mutation = api.users.gantiProfile.useMutation()
    const form = useForm<mahasiswaProfilSchemaType>({
        resolver: zodResolver(mahasiswaProfilSchema),
        defaultValues: {
            fotoProfil: image ?? undefined,
            idLine: line ?? "",
            noWhatsapp: whatsapp ?? ""
        }
    })

    async function onSubmit(values: mahasiswaProfilSchemaType) {
        mutation.mutate({
            image: values.fotoProfil,
            idLine: values.idLine,
            noWhatsapp: values.noWhatsapp
        }, {
            onSuccess: () => {
                form.reset()
                setIsOpen(false)
                location.reload()
            },
            onError: (error) => {
                toast.toast({
                    variant: "destructive",
                    title: "Gagal mengubah profil",
                    description: error.message,
                })
            }
        })
    }

    return (
        <div>
            {!isEdit && (
                <Button 
                    className='bg-secondary-400 hover:bg-secondary-500 space-x-6 -translate-y-28'
                    onClick={() => setIsEdit(true)}
                >
                    Edit Profil <Pencil/>
                </Button>
            )}
            {isEdit && (
                <div className='-translate-y-12 min-w-[700px] w-full'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full flex flex-col gap-x-4">
                            <div className='w-full flex gap-x-4'>
                                <FormField
                                    control={form.control}
                                    name="fotoProfil"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-col items-start">
                                            <FormLabel>Foto Profil</FormLabel>
                                            <FormControl className="w-full">
                                                <UploadButton
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        if (res && res.length > 0) {
                                                            // @ts-expect-error URL is a valid string
                                                            field.onChange(res[0].url);
                                                        }
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        alert(`ERROR! ${error.message}`);
                                                    }}
                                                    appearance={{
                                                        button: "w-full bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-2 px-4 rounded-md h-9 translate-y-2",
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="idLine"
                                    render={({field}) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>ID Line</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan ID Line" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {/* ID Line */}
                                <FormField
                                    control={form.control}
                                    name="noWhatsapp"
                                    render={({field}) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Nomor Whatsapp</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan Nomor Whatsapp" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Submit Button */}
                            <div className='py-2'/>
                            <div className='w-full gap-x-4 flex justify-end items-end'>
                                <Button 
                                    variant={"outline"} 
                                    className='border-Blue-Dark text-Blue-Dark'
                                    onClick={() => setIsEdit(false)}
                                >
                                    Batal Edit
                                </Button>
                                <Button type="submit" className='bg-Blue-Dark text-white'>
                                    Simpan <PencilLine/>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    )
}

export default EditProfileDialog