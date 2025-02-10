'use client'
// Library
import React from 'react'
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
// Icon Import
import { Pencil } from 'lucide-react';
// Upload Thing Import
import { UploadButton } from '~/utils/uploadthing';

const mahasiswaProfilSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  fotoProfil: z.string().url("Harus berupa URL yang valid"),
});
type mahasiswaProfilSchemaType = z.infer<typeof mahasiswaProfilSchema>

const EditProfileDialog = ({
  name
}:{
  name: string | undefined
}) => {
  const form = useForm<mahasiswaProfilSchemaType>({
    resolver: zodResolver(mahasiswaProfilSchema),
    defaultValues: {
        nama: name,
        fotoProfil: ""
    }
  })

  function onSubmit(values: mahasiswaProfilSchemaType) {
      console.log(values)
      handleSubmit(values)
  }

  // fungsi ke back end
  async function handleSubmit(values: mahasiswaProfilSchemaType) {

  }

  return (
    <Dialog>
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
                  {/* Nama */}
                  <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Nama</FormLabel>
                              <FormControl>
                                  <Input placeholder="Masukkan Nama" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
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
                                    // @ts-ignore
                                    onClientUploadComplete={(res) => {
                                      if (res && res.length > 0) {
                                        // @ts-ignore
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