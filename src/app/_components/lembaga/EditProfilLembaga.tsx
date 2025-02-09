'use client'
import React from 'react'
// Components Import
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from '~/components/ui/input';
import { UploadButton } from '~/utils/uploadthing';
import { Button } from '~/components/ui/button';
// Form Import
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const profileLembagaSchema = z.object({
  nama: z.string(),
  deskripsi: z.string(),
  gambar: z.string().url()
})
type profileLembagaSchemaType = z.infer<typeof profileLembagaSchema>

const EditProfilLembaga = () => {
      const form = useForm<profileLembagaSchemaType>({
        resolver: zodResolver(profileLembagaSchema),
        defaultValues: {
          nama: "",
          deskripsi: "",
          gambar: ""
        }
      })
  
      function onSubmit(values: profileLembagaSchemaType) {
        console.log(values)
      }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
      <FormField
        control={form.control}
        name="nama"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Kegiatan</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan nama lembaga" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="deskripsi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Kegiatan</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan deskripsi lembaga" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gambar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Profil Lembaha</FormLabel>
            <UploadButton
              endpoint="imageUploader"
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
            <FormMessage />
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