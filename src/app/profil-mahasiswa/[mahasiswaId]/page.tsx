

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
import {api} from "~/trpc/server";
import { Kepanitiaan } from '~/types/kepanitiaan'

const DetailMahasiswaPage = async ({params}: {
    params: Promise<{ mahasiswaId: string }>
}) => {
    const userId = (await params).mahasiswaId
    const {mahasiswaData, newestEvent, error} = await api.profil.getMahasiswa({mahasiswaId: userId})

    if (error) {
        return (
            <>
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-semibold text-neutral-1000">Beranda</h1>
                    <p>Beranda / Mahaisiswa</p>
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
                <p>Beranda / Mahaisiswa</p>
                <Input
                    placeholder="Cari lembaga, kegiatan, atau mahasiswa"
                    className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
                    startAdornment={
                        <MagnifyingGlassIcon className="size-4 text-gray-500"/>
                    }
                />
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
                    <p className='text-3xl text-neutral-1000 font-semibold'>{mahasiswaData?.user.name}</p>
                    <p className='text-xl text-neutral-1000'>{mahasiswaData?.mahasiswa.nim}</p>
                    <p className='text-xl text-[#8196A3]'>{mahasiswaData?.mahasiswa.jurusan} &#39;{mahasiswaData?.mahasiswa.angkatan}</p>
                </div>
            </div>

            {/* Kepanitiaan Terbaru */}
            <div className='space-y-4 pb-12'>
                <h5 className='text-xl font-semibold text-neutral-1000'>Kepanitiaan Terbaru</h5>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {newestEvent ? newestEvent.map((item: Kepanitiaan) => (
                        <KepanitiaanCard kepanitiaan={item} key={item.name}/>
                    )) : <p>Belum ada kepanitiaan</p>}
                </div>
            </div>
        </div>
  )
}

export default DetailMahasiswaPage