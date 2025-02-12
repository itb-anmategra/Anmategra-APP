'use client'
// Library
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
// Components Import
import { Button } from '~/components/ui/button';
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
import { Input } from '~/components/ui/input';
import { useToast } from "~/hooks/use-toast"
// Icon Import
import { Pencil } from 'lucide-react';
// Upload Thing Import
import { UploadButton } from '~/utils/uploadthing';
import {api} from "~/trpc/react";

const mahasiswaProfilSchema = z.object({
  fotoProfil: z.string().url("Harus berupa URL yang valid").optional(),
  idLine: z.string().min(3, "ID Line minimal 3 karakter").max(30, "Nama maksimal 30 karakter"),
  noWhatsapp: z.string()
    .regex(/^0\d{10,12}$/, "Nomor WhatsApp harus 11-13 digit dan dimulai dengan 0"),
});
type mahasiswaProfilSchemaType = z.infer<typeof mahasiswaProfilSchema>

const EditProfileDialog = ({
  image,
  line,
  whatsapp
}:{
  image: string | null | undefined;
  line: string;
  whatsapp: string;
}) => {
  const toast = useToast()
  const [isOpen, setIsOpen] = useState<boolean>(false)

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
          <Button className='bg-secondary-400 hover:bg-secondary-500 space-x-6'>
              Edit Profil <Pencil />
          </Button>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader>
              <DialogTitle>
                  Edit Profil
              </DialogTitle>
          </DialogHeader>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                  {/* Foto Profil */}
                  <FormField
                      control={form.control}
                      name="fotoProfil"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Foto Profil</FormLabel>
                              <FormControl>
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
                                  />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <div className='flex w-full items-center gap-x-4'>
                    {/* ID Line */}
                    <FormField
                      control={form.control}
                      name="idLine"
                      render={({ field }) => (
                          <FormItem className='w-full'>
                              <FormLabel>ID Line</FormLabel>
                              <FormControl>
                                  <Input placeholder="Masukkan ID Line" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    {/* ID Line */}
                    <FormField
                      control={form.control}
                      name="noWhatsapp"
                      render={({ field }) => (
                          <FormItem className='w-full'>
                              <FormLabel>Nomor Whatsapp</FormLabel>
                              <FormControl>
                                  <Input placeholder="Masukkan Nomor Whatsapp" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                  </div>
                  {/* Submit Button */}
                  <div className='py-2' />
                  <Button type="submit" className='w-full'>
                    Submit
                  </Button>
              </form>
          </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog