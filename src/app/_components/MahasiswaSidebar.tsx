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
    <div className="w-full flex flex-col items-center justify-center bg-white border-b-2 border-neutral-100">
      <div className="w-full max-w-7xl flex justify-between items-center py-4">
        <div className='flex items-center gap-x-8'>
          <Image 
            src={"/logo-anmategra.png"}
            alt="Logo Anmategra"
            width={150}
            height={50}
          />
        </div>
        <div>
          <Input
            placeholder="Pencarian Lembaga, Kegiatan, atau Mahasiswa"
            className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent w-[750px]"
            startAdornment={
              <MagnifyingGlassIcon className="size-4 text-gray-500" />
            }
          />
        </div>
        <nav className='flex items-center'>
          <Button className='bg-secondary-400 text-white space-x-4 transition-all hover:bg-secondary-500'>
            Masuk <LogIn />
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default MahasiswaSidebar