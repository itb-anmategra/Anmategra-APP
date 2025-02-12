// Library Import
import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
// Asset Import
import LineIcon from "public/icons/line.png"
import WhatsappIcon from "public/icons/wa.png"
// Components Import
import { KepanitiaanCard } from '~/app/_components/beranda/KepanitiaanCard'
import MahasiswaSidebar from "../../_components/MahasiswaSidebar";
import EditProfileDialog from '~/app/_components/profil-mahasiswa/EditProfileDialog';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "~/components/ui/avatar"
// Auth
import { getServerAuthSession } from '~/server/auth';
// API Import
import { api } from "~/trpc/server";
// Types Import
import { type Kepanitiaan } from '~/types/kepanitiaan'

const DetailMahasiswaPage = async ({params}: {
    params: Promise<{ mahasiswaId: string }>,
}) => {
    const userId = (await params).mahasiswaId
    const {mahasiswaData, newestEvent, error} = await api.profil.getMahasiswa({mahasiswaId: userId})

    const session = await getServerAuthSession();
    
    if (error) {
        return (
            <>
                <div className='w-full flex justify-between fixed z-20'>
                    <MahasiswaSidebar session={session} />
                </div>
                <div className='w-full flex min-h-screen flex-col items-center pt-20'>
                    <div className="max-w-7xl w-full flex flex-col">
                        <h1 className="text-2xl font-semibold text-slate-600">Beranda</h1>
                        <p className='text-slate-400'>Beranda / Mahasiswa</p>
                    </div>
                    <div className="max-w-7xl flex w-full flex-col gap-4 py-6">
                        <h1 className="text-2xl font-semibold text-neutral-1000">{error}</h1>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className='w-full flex justify-between fixed z-20'>
                <MahasiswaSidebar session={session}  />
            </div>
            <div className='w-full flex min-h-screen flex-col items-center pt-14'>
                <div className="max-w-7xl flex w-full flex-col gap-4 py-6">
                {/* Title and Search */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold text-slate-600">Beranda</h1>
                    <p className='text-slate-400'>Beranda / Mahasiswa</p>
                </div>

                {/* Profil Mahasiswa */}
                <div className='w-full flex items-center justify-center gap-x-6 py-12'>
                    <Avatar className="rounded-full size-[200px]">
                        <AvatarImage
                            // @ts-expect-error karena src ini ada null nya, gatau qiya skill issue
                            src={mahasiswaData?.user.image}
                            alt="Foto Profil" 
                            className="rounded-full min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] object-cover"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                        <p className='text-3xl text-slate-700 font-semibold'>{mahasiswaData?.user.name}</p>
                        <p className='text-[18px] text-slate-600 font-medium'>{mahasiswaData?.mahasiswa.nim}</p>
                        <p className='text-[18px] text-slate-500'>{mahasiswaData?.mahasiswa.jurusan} &#39;{mahasiswaData?.mahasiswa.angkatan}</p>
                        <div className="flex items-center justify-start gap-x-6 pt-4">
                            {mahasiswaData?.mahasiswa.lineId ?
                                <div className='flex items-center gap-x-2'>
                                    <Image
                                        src={LineIcon}
                                        alt='Line Messanger Icon'
                                        width={20}
                                        height={20}
                                    />
                                <p>{mahasiswaData?.mahasiswa.lineId}</p>
                            </div> : <>
                            </>}
                            {mahasiswaData?.mahasiswa.whatsapp ?
                                <div className='flex items-center gap-x-2'>
                                <Image
                                    src={WhatsappIcon}
                                    alt='Whatsapp Messanger Icon'
                                    width={20}
                                    height={20}
                                />
                                <p>{mahasiswaData?.mahasiswa.whatsapp}</p>
                            </div> : <>
                            </>}
                        </div>
                        {session?.user.id === userId && (
                            <div className='pt-2'>
                                <EditProfileDialog 
                                    image={mahasiswaData?.user.image}
                                    line={"ID Line Mahasiswa"}
                                    whatsapp={"Whatsapp Mahasiswa"}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Kepanitiaan Terbaru */}
                <div className='space-y-4 pb-12'>
                    <h5 className='text-2xl font-semibold text-slate-600'>Kepanitiaan Terbaru</h5>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {newestEvent && newestEvent.length !== 0 ? newestEvent.map((item: Kepanitiaan) => (
                            <Link key={item.id} href={`/profil-kegiatan/${item.id}`}>
                                <KepanitiaanCard kepanitiaan={item} key={item.name}/>
                            </Link>
                        )) : <p className='text-slate-600'>Belum ada kepanitiaan</p>}
                    </div>
                </div>
                </div>
            </div>
        </>
  )
}

export default DetailMahasiswaPage