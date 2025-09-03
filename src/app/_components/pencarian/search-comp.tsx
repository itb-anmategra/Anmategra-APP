"use client"
// Library Import
import React, {useState} from 'react'
import {usePathname, useRouter} from 'next/navigation'
import Link from 'next/link'
// Component Import
import Navbar from '../layout/navbar'
import MahasiswaCard from '~/app/_components/card/mahasiswa-card'
import LembagaCard from '~/app/_components/card/lembaga-card'
import {KepanitiaanCard} from '~/app/_components/card/kepanitiaan-card'
import {Input} from '~/components/ui/input'
// Dummy Asset Import
import dummyProfile from "public/placeholder/profile-pic.png";
import dummyLembaga from "public/images/logo/hmif-logo.png";
// Types Import
import {type Kepanitiaan} from "~/types/kepanitiaan";
// Image Import
import Image from 'next/image'
import NotFound from "public/images/miscellaneous/not-found-general.png"
// Session Import
import {type Session} from 'next-auth'
// Icon Import
import {MagnifyingGlassIcon} from '@radix-ui/react-icons'
import {cn} from '~/lib/utils'

const PencarianPage = (
    {
        session,
        data
    }: {
        session: Session | null,
        data: {
            mahasiswa: {
                userId: string,
                nama: string | null,
                nim: number,
                jurusan: string,
                image: string | null
            }[],
            lembaga: Kepanitiaan[],
            kegiatan: Kepanitiaan[]
        }
    }
) => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const path = usePathname();
    const isLembaga = path.includes("/lembaga");

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (isLembaga) {
                void router.push(`/lembaga/pencarian/${searchQuery}`);
            } else {
                void router.push(`/pencarian/${searchQuery}`);
            }
        }
    };

    return (
        <div className={cn(
            'flex w-full flex-col overflow-hidden pt-0 pb-16 gap-4',
            session?.user.role === "lembaga" && "p-6"
        )}>
            {session?.user.role === "mahasiswa" ? (
                <div className='mb-20 fixed w-full shadow-sm z-20'>
                    <Navbar session={session}/>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-semibold text-slate-600">Hasil Pencarian</h1>
                    <Input
                        placeholder="Cari lembaga, kegiatan, atau mahasiswa"
                        className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
                        startAdornment={
                            <MagnifyingGlassIcon className="size-4 text-gray-500"/>
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            )}
            <div className={cn(
                'flex flex-col items-center w-full',
                session?.user.role === "mahasiswa" && "mt-24"
            )}>
                <div className='w-full space-y-8 max-w-7xl'>

                    {data?.mahasiswa.length !== 0 && (
                        <div className="space-y-2 w-full">
                            <h5 className="text-xl font-semibold text-slate-600">
                                Mahasiswa
                            </h5>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {data?.mahasiswa.map((item) => (
                                    <Link key={item.userId} href={
                                        isLembaga ?
                                            "/lembaga/profil-mahasiswa/" + item.userId :
                                            "/profil-mahasiswa/" + item.userId
                                    }>
                                        <MahasiswaCard
                                            nama={item.nama ?? ''}
                                            NIM={item.nim.toString()}
                                            jurusan={item.jurusan}
                                            profilePicture={item.image ?? dummyProfile}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {data?.lembaga.length !== 0 && (
                        <div className="space-y-2 w-full">
                            <h5 className="text-xl font-semibold text-slate-600">Lembaga</h5>
                            <div className="flex w-full flex-col gap-y-4">
                                {data?.lembaga.map((item) => (
                                    <Link key={item.lembaga.id} href={
                                        isLembaga ?
                                            `/lembaga/profil-lembaga/${item.lembaga.id}` :
                                            `/profil-lembaga/${item.lembaga.id}`
                                        }>
                                        <LembagaCard
                                            nama={item.name}
                                            kategori={item.lembaga.type ?? ''}
                                            deskripsi={item.description ?? ''}
                                            lembagaPicture={item.image ?? dummyLembaga}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {data?.kegiatan.length !== 0 && (
                        <div className="space-y-2 w-full">
                            <h5 className="text-xl font-semibold text-slate-600">
                                Kegiatan
                            </h5>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {data?.kegiatan.map((item) => (
                                    <Link key={item.name} href={
                                        isLembaga ?
                                            `/lembaga/profil-kegiatan/${item.id}` :
                                            `/profil-kegiatan/${item.id}`
                                        }>
                                        <KepanitiaanCard kepanitiaan={item}/>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {data?.mahasiswa.length === 0 && data?.lembaga.length === 0 && data?.kegiatan.length === 0 && (
                        <div className='w-full flex flex-col justify-center items-center gap-6 p-12 mt-20'>
                            <Image
                                src={NotFound}
                                alt='Not Found Icon'
                                width={128}
                                height={128}
                            />
                            <div className='space-y-2'>
                                <p className='text-slate-600 font-semibold text-2xl text-center'>Pencarian Tidak
                                    Ditemukan</p>
                                <p className='text-slate-400 text-center'>Kami tidak dapat menemukan hal yang Anda
                                    cari. <br/> Cobalah menggunakan kata kunci lainnya</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PencarianPage