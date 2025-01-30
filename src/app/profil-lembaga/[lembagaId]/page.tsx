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
import {api} from "~/trpc/server";

const DetailLembagaPage = async (
    {params}: {
        params: Promise<{ lembagaId: string }>
    }
) => {
    const lembagaId = (await params).lembagaId
    const {lembagaData, newestEvent , highlightedEvent , error} = await api.profil.getLembaga({lembagaId: lembagaId})

    if (error) {
        return (
            <>
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-semibold text-neutral-1000">Beranda</h1>
                    <p>Beranda / Nama Lembaga</p>
                    <Input
                        placeholder="Cari lembaga, kegiatan, atau mahasiswa"
                        className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
                        startAdornment={
                            <MagnifyingGlassIcon className="size-4 text-gray-500"/>
                        }
                    />
                </div>
                <div className="flex w-full flex-col gap-4 p-6">
                    <h1 className="text-2xl font-semibold text-neutral-1000">{error}</h1>
                </div>
            </>
        )
    }

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
          src={lembagaData?.image ?? DummyFotoLembaga}
          alt='Foto Lembaga'
          width={200}
          height={100}
        />
        <div className='space-y-1'>
          <p className='text-3xl text-neutral-1000 font-semibold'>{lembagaData?.name}</p>
          <p className='text-xl text-[#8196A3]'>{lembagaData?.description}</p>
        </div>
      </div>

      {/* Highlighted Event */}
      <div className='space-y-4 pb-12'>
        <h5 className='text-xl font-semibold text-neutral-1000'>Highlighed Event</h5>
        <Card className='transition-all hover:shadow-md overflow-x-hidden flex justify-start gap-x-6 items-center'>
          <Image 
            src={highlightedEvent?.image ?? DummyFotoEvent}
            alt='Foto Kegiatan'
            className='h-full w-auto'
            width={200}
            height={100}
          />
          <div className='space-y-2'>
            <Badge className='space-x-2 rounded-full bg-Blue-Dark py-1'>
              <Image 
                src={lembagaData?.image ?? LogoHMIFKecil}
                alt='Logo HMIF Kecil'
                width={20}
                height={20}
                className='rounded-full object-cover'
              />
              <p className='text-xs'>{lembagaData?.name}</p>
            </Badge>
            <p className='text-xl text-Blue-Dark font-semibold'>{highlightedEvent?.name}</p>
            <p className='text-neutral-1000'>{highlightedEvent?.description}</p>
            <div className="flex items-center gap-2 text-sm text-Regent-Gray">
              <CalendarIcon className='h-4 w-4' />
                {highlightedEvent?.start_date.toDateString()} -{" "}
                {highlightedEvent?.end_date?.toDateString()}
            </div>
          </div>
        </Card>
      </div>

      {/* Kepanitiaan Terbaru */}
      <div className='space-y-4 pb-12'>
        <h5 className='text-xl font-semibold text-neutral-1000'>Kepanitiaan Terbaru</h5>  
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {newestEvent ? newestEvent.map((item) => (
            <KepanitiaanCard kepanitiaan={item} key={item.id} />
          )) : <p>Belum ada kepanitiaan</p>}
        </div>
      </div>
    </div>
  )
}

export default DetailLembagaPage