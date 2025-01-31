"use client"

// Library Import
import React, {useEffect} from 'react'
import Link from 'next/link'
// Component Import
import MahasiswaSidebar from '../../_components/MahasiswaSidebar'
import MahasiswaCard from '~/app/_components/beranda/MahasiswaCard'
import LembagaCard from '~/app/_components/beranda/LembagaCard'
import { KepanitiaanCard } from '~/app/_components/beranda/KepanitiaanCard'
// Dummy Asset Import
import dummyProfile from "public/placeholder/profilepic.png";
import dummyLembaga from "public/logo-hmif.png";
import {useSearchParams} from "next/navigation";
import { api } from "~/trpc/react";
import {Kepanitiaan} from "~/types/kepanitiaan";

const PencarianPage = (
    {
        session,
        data
    }: {
        session: string | undefined,
        data: {
            mahasiswa: {
                userId: string,
                nama: string    | null,
                nim: number,
                jurusan: string,
                image: string | null
            }[],
            lembaga: Kepanitiaan[],
            kegiatan: Kepanitiaan[]
        }
    }
) => {

    return (
        <div className='flex flex-col overflow-hidden pb-16 sm:space-y-3 md:space-y-8'>
            <div className="mb-20 fixed w-full shadow-sm z-20">
                <MahasiswaSidebar session={session ?? ''} />
            </div>
            <div className='py-4' />
            <div className="flex flex-col items-center w-full">
                <div className='w-full space-y-8 max-w-7xl'>
                    <div className="space-y-2 w-full">
                        <h5 className="text-2xl font-semibold text-slate-600">
                            Mahasiswa
                        </h5>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {data?.mahasiswa.map((item) => (
                                <Link key={item.userId} href={`/profil-mahasiswa/${item.userId}`}>
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
                    <div className="space-y-2 w-full">
                        <h5 className="text-2xl font-semibold text-slate-600">Lembaga</h5>
                        <div className="flex w-full flex-col gap-y-4">
                            {data?.lembaga.map((item) => (
                                <Link key={item.lembaga.id} href={`/profil-lembaga/${item.lembaga.id}`}>
                                    <LembagaCard
                                        nama={item.name}
                                        kategori={item.lembaga.type ?? ''}
                                        deskripsi={item.description ?? ''}
                                        lembagaPicture={dummyLembaga}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 w-full">
                        <h5 className="text-2xl font-semibold text-slate-600">
                            Kegiatan
                        </h5>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {data?.kegiatan.map((item) => (
                                <Link key={item.name} href={`/profile-kegiatan/${item.id}`}>
                                    <KepanitiaanCard kepanitiaan={item} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PencarianPage