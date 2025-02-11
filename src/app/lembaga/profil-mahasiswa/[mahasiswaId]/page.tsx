// Library Import
import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
// Asset Import
import FotoProfil from "public/placeholder/profilepic.png"
// Components Import
import { KepanitiaanCard } from '~/app/_components/beranda/KepanitiaanCard'
import EditProfileDialog from '~/app/_components/profil-mahasiswa/EditProfileDialog';
// Auth
import { getServerAuthSession } from '~/server/auth';
// API Import
import { api } from "~/trpc/server";
// Types Import
import { type Kepanitiaan } from '~/types/kepanitiaan'

const DetailMahasiswaPage = async ({params}: {
    params: Promise<{ mahasiswaId: string }>
}) => {
    const userId = (await params).mahasiswaId
    const {mahasiswaData, newestEvent, error} = await api.profil.getMahasiswa({mahasiswaId: userId})

    const session = await getServerAuthSession();
    
    if (error) {
        return (
            <>
                <div className='w-full flex min-h-screen flex-col items-center p-6'>
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
        <div className='w-full flex min-h-screen flex-col items-center px-6'>
            <div className="max-w-7xl flex w-full flex-col gap-4 py-6">
            {/* Title and Search */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-slate-600">Beranda</h1>
                <p className='text-slate-400'>Beranda / Mahasiswa</p>
            </div>

            {/* Profil Mahasiswa */}
            <div className='w-full flex items-center justify-center gap-x-6 py-12'>
                <Image
                    src={mahasiswaData?.user.image ?? FotoProfil}
                    alt='Foto Mahasiswa'
                    width={200}
                    height={100}
                />
                <div className='space-y-1'>
                    <p className='text-3xl text-slate-700 font-semibold'>{mahasiswaData?.user.name}</p>
                    <p className='text-[18px] text-slate-600 font-medium'>{mahasiswaData?.mahasiswa.nim}</p>
                    <p className='text-[18px] text-slate-500'>{mahasiswaData?.mahasiswa.jurusan} &#39;{mahasiswaData?.mahasiswa.angkatan}</p>
                    {session?.user.id === userId && (
                        <div className='pt-2'>
                            <EditProfileDialog name={mahasiswaData?.user.name} image={mahasiswaData?.user.image} />
                        </div>
                    )}
                </div>
            </div>

            {/* Kepanitiaan Terbaru */}
            <div className='space-y-2 pb-12'>
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
  )
}

export default DetailMahasiswaPage