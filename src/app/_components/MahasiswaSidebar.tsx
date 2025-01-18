// Library Import
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// Components Import
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
// Icon Import
import { LogIn } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const MahasiswaSidebar = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-white border-b-2 border-neutral-100 mb-4">
      <div className="w-full max-w-7xl flex justify-between items-center py-4">
        <div className='flex items-center gap-x-8'>
          <Image 
            src={"/logo-anmategra.png"}
            alt="Logo Anmategra"
            width={150}
            height={50}
          />
          <Input
            placeholder="Pencarian Lembaga, Kegiatan, atau Mahasiswa"
            className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent w-[750px] placeholder:text-neutral-700"
            startAdornment={
              <MagnifyingGlassIcon className="size-4 text-gray-500" />
            }
          />
        </div>
        <nav className='flex gap-x-12 items-center'>
          <Link href={"/halaman-mahasiswa"} className='text-neutral-700'>
            Beranda
          </Link>
          <Link href={"/halaman-mahasiswa/laporan"} className='text-neutral-700'>
            Laporan
          </Link>
          <Button className='bg-secondary-400 text-white space-x-4 transition-all hover:bg-secondary-500'>
            Login <LogIn />
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default MahasiswaSidebar