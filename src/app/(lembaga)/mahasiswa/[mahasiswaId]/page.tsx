// Library Import
import React from 'react'
import Image from 'next/image'
// Asset Import
import FotoProfil from "public/placeholder/profilepic.png"
// Constants Import
import { SearchResultKegiatan } from '~/lib/constants'
// COmponents Import
import { KepanitiaanCard } from '~/app/_components/beranda/KepanitiaanCard'
import { Input } from '~/components/ui/input'
// Icon Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

const DetailMahasiswaPage = () => {
  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* Title and Search */}
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-semibold text-neutral-1000">Beranda</h1>
        <p>Beranda / Mahaisiswa</p>
        <Input
          placeholder="Cari lembaga, kegiatan, atau mahasiswa"
          className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
        />
      </div>

      {/* Profil Mahasiswa */}
      <div className='w-full flex items-center justify-center gap-x-6 py-12'>
        <Image 
          src={FotoProfil}
          alt='Foto Mahasiswa'
          width={200}
          height={100}
        />
        <div className='space-y-1'>
          <p className='text-3xl text-neutral-1000 font-semibold'>Nama Mahasiswa</p>
          <p className='text-xl text-neutral-1000'>NIM Mahasiswa</p>
          <p className='text-xl text-[#8196A3]'>Jurusan 'Angkatan</p>
        </div>
      </div>

      {/* Kepanitiaan Terbaru */}
      <div className='space-y-4 pb-12'>
          <h5 className='text-xl font-semibold text-neutral-1000'>Kepanitiaan Terbaru</h5>  
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {SearchResultKegiatan.map((item) => (
              <KepanitiaanCard kepanitiaan={item} key={item.name} />
            ))}
          </div>
        </div>
    </div>
  )
}

export default DetailMahasiswaPage