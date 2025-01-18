// Libray Import
import React from 'react'
import Image from 'next/image'
// Asset Import
import DummyFotoLembaga from 'public/logo-hmif.png'
import DummyFotoEvent from 'public/placeholder/kegiatan thumbnail.png'
import LogoHMIFKecil from 'public/placeholder/logo if.png'
// Components Import
import { Card } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { SearchResultKegiatan } from '~/lib/constants'
import { KepanitiaanCard } from '~/app/_components/beranda/KepanitiaanCard'
import { Input } from '~/components/ui/input'
// Icons Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { CalendarIcon } from 'lucide-react'

const DetailLembagaPage = () => {
  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* Title and Search */}
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-semibold text-neutral-1000">Beranda</h1>
        <p>Beranda / Nama Lembaga</p>
        <Input
          placeholder="Cari lembaga, kegiatan, atau mahasiswa"
          className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
        />
      </div>

      {/* Lembaga */}
      <div className='w-full flex items-center justify-center gap-x-6 py-12'>
        <Image 
          src={DummyFotoLembaga}
          alt='Foto Lembaga'
          width={200}
          height={100}
        />
        <div className='space-y-1'>
          <p className='text-3xl text-neutral-1000 font-semibold'>Nama Lembaga/UKM</p>
          <p className='text-xl text-[#8196A3]'>Detail Lain</p>
        </div>
      </div>

      {/* Highlighted Event */}
      <div className='space-y-4 pb-12'>
        <h5 className='text-xl font-semibold text-neutral-1000'>Highlighed Event</h5>
        <Card className='transition-all hover:shadow-md overflow-x-hidden flex justify-start gap-x-6 items-center'>
          <Image 
            src={DummyFotoEvent}
            alt='Foto Kegiatan'
            className='h-full w-auto'
          />
          <div className='space-y-2'>
            <Badge className='space-x-2 rounded-full bg-Blue-Dark py-1'>
              <Image 
                src={LogoHMIFKecil}
                alt='Logo HMIF Kecil'
                width={20}
                height={20}
                className='rounded-full object-cover'
              />
              <p className='text-xs'>Lembaga ITB</p>
            </Badge>
            <p className='text-xl text-Blue-Dark font-semibold'>Judul Event</p>
            <p className='text-neutral-1000'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
            <div className="flex items-center gap-2 text-sm text-Regent-Gray">
              <CalendarIcon className='h-4 w-4' />
              January 2025 -{" "}
              January 2025
            </div>
          </div>
        </Card>
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

export default DetailLembagaPage