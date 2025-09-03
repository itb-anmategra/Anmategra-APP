// Libray Import
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// Asset Import
import DummyFotoLembaga from 'public/images/logo/hmif-logo.png'
import DummyFotoEvent from 'public/placeholder/kegiatan-thumbnail.png'
import LogoHMIFKecil from 'public/placeholder/logo-hmif.png'
// Components Import
import { Card } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { KepanitiaanCard } from '~/app/_components/card/kepanitiaan-card'
import Navbar from "../../_components/layout/navbar";
// Icons Import
import { CalendarIcon } from 'lucide-react'
// TRPC Import
import {api} from "~/trpc/server";
// Auth
import { getServerAuthSession } from '~/server/auth';
import ProfileKegiatanComp from "~/app/_components/profil-kegiatan/profil-kegiatan-comp";

const DetailLembagaPage = async (
    {params}: {
        params: Promise<{ lembagaId: string }>
    }
) => {
    const lembagaId = (await params).lembagaId
    const {lembagaData, newestEvent , highlightedEvent, anggota} = await api.profil.getLembaga({lembagaId: lembagaId})
    const session = await getServerAuthSession();

  return (
    <>
      <div className='w-full flex justify-between fixed z-20'>
        <Navbar session={session} />
      </div>
      <div className='w-full flex min-h-screen flex-col items-center pt-14'>
        <div className="flex max-w-7xl w-full flex-col gap-4 py-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-slate-600">Beranda</h1>
            <p className='text-slate-400'>Beranda / Nama Lembaga</p>
          </div>
          <div className='w-full flex items-center justify-center gap-x-6 py-12'>
            <Image 
              src={lembagaData?.users.image ?? DummyFotoLembaga}
              alt='Foto Lembaga'
              width={200}
              height={100}
              className='rounded-full'
            />
            <div className='space-y-1'>
              <p className='text-3xl text-slate-600 font-semibold'>{lembagaData?.name}</p>
              <p className='text-xl text-slate-400'>{lembagaData?.description}</p>
            </div>
          </div>

          {highlightedEvent && (
            <Link href={`/profil-kegiatan/${highlightedEvent.id}`}>
              <div className='space-y-4 pb-12'>
                <h5 className='text-2xl font-semibold text-slate-600'>Highlighed Event</h5>
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
                        src={lembagaData?.users.image ?? LogoHMIFKecil}
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
            </Link>
          )}
  
          {/* Kepanitiaan Terbaru */}
          <div className='space-y-4 pb-12'>
            <h5 className='text-2xl font-semibold text-slate-600'>Kepanitiaan Terbaru</h5>  
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {newestEvent && newestEvent.length !== 0 ? newestEvent.map((item) => (
                <Link href={`/profil-kegiatan/${item.id}`} key={item.id}>
                  <KepanitiaanCard kepanitiaan={item} />
                </Link>
              )) : <p className='text-slate-600'>Belum ada kepanitiaan</p>}
            </div>
          </div>

        {/* Anggota Section */}
        <ProfileKegiatanComp anggota={anggota ?? []}/>
        </div>
      </div>
    </>
  )
}

export default DetailLembagaPage