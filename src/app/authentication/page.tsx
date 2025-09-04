"use client"

// Library Import
import React from 'react'
import Image from 'next/image'
// Components Import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
// Asset Import
import Logo from '../../../public/images/logo/anmategra-logo-full.png'
import Google from 'public/icons/google-icon.webp'
import Microsoft from 'public/icons/microsoft-icon.webp'

import { signIn } from "next-auth/react";

const LogInPage = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center gap-x-4 bg-slate-100 px-4'>
      <Card className='max-w-[450px]'>
        <CardHeader>
          <CardTitle className='text-2xl flex flex-col gap-y-2'>
            <Image 
              src={Logo}
              width={125}
              height={250}
              alt='Logo Anmategra'
            />
            <p>Selamat Datang di <span className='bg-clip-text text-transparent bg-gradient-to-br from-primary-400 to-secondary-400 font-bold'>Anmategra</span></p>
          </CardTitle>
          <CardDescription>
            Silahkan masuk dengan akun <span className='font-semibold text-gray-500'>microsoft untuk mahasiswa</span> dan <span className='font-semibold text-gray-500'>akun google untuk lembaga</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-y-2'>
          <Button onClick={() => signIn("azure-ad")} variant={"outline"} className='flex items-center gap-x-2 transition-all hover:gap-x-4'>
            <Image
              src={Microsoft}
              alt='Logo Microst'
              width={16}
              height={16} 
            /> 
            <p className='text-slate-600'>Masuk dengan Microsoft  |  @mahasiswa.itb.ac.id</p>
          </Button>
          <Button onClick={() => signIn("google")} variant={"outline"} className='flex items-center gap-x-2 transition-all hover:gap-x-4'>
            <Image 
              src={Google}
              alt='Logo Microsoft'
              width={14}
              height={14}
            />
            <p className='text-slate-600'>Masuk dengan Google  |  @km.itb.ac.id</p>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default LogInPage