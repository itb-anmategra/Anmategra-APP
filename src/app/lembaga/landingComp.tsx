"use client";
// Library Import
import React, { useState } from "react";
import Link from "next/link";
// Components Import
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { KepanitiaanCard } from "../_components/beranda/KepanitiaanCard";
import LembagaCard from "../_components/beranda/LembagaCard";
// Icons Import
import { ChevronRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
// Constants Import
import {
    SearchResultKegiatan,
    SearchResultLembaga,
    SearchResultMahasiswa,
} from "~/lib/constants";
import MahasiswaCard from "../_components/beranda/MahasiswaCard";
// Asset Import
import dummyProfile from "public/placeholder/profilepic.png";
import dummyLembaga from "public/logo-hmif.png";
import {Kepanitiaan} from "~/types/kepanitiaan";
import {Session} from "next-auth";
import { useRouter } from "next/navigation";

export default function LandingComp(
    {
        data,
        session
    }: {
        data: {
            kepanitiaanTerbaru: Kepanitiaan[];
            kegiatanTerbaru: Kepanitiaan[];
            kepanitiaanTerbesar: Kepanitiaan[];
        }
        session: Session | null
    }
) {
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        void router.push(`/pencarian/${searchQuery}`);
    }
    };

    return (
        <div className="flex w-full flex-col gap-4 p-6">
            {/* Title and Search */}
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold text-neutral-1000">Beranda</h1>
                <Input
                    placeholder="Cari lembaga, kegiatan, atau mahasiswa"
                    className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
                    startAdornment={
                        <MagnifyingGlassIcon className="size-4 text-gray-500" />
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* List of Kepanitiaan */}

            <div className="flex flex-col gap-x-2">
                {/* <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">Kepanitiaan Terbaru</h2>
                    <Button variant="ghost" className="flex items-center gap-2">
                        Lihat Semua
                        <ChevronRightIcon />
                    </Button>
                </div> */}
                <h3 className="text-left text-xl font-semibold mb-2">Kepanitiaan</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-4">
                    {data.kepanitiaanTerbaru.map((kepanitiaan) => (
                        <Link 
                            key={kepanitiaan.name} 
                            href={`/profil-lembaga/${kepanitiaan.lembaga.id}`}
                        >
                            <KepanitiaanCard
                                kepanitiaan={kepanitiaan}
                            />
                        </Link>
                    ))}
                </div>
                {/* <div className="mt-10 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">Event Terbaru</h2>
                    <Button variant="ghost" className="flex items-center gap-2">
                        Lihat Semua
                        <ChevronRightIcon />
                    </Button>
                </div> */}
                <h3 className="text-left text-xl font-semibold mb-2">Kegiatan</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-4">
                    {data.kegiatanTerbaru.map((kepanitiaan) => (
                        <Link key={kepanitiaan.name} href={`/profil-kegiatan/${kepanitiaan.id}`}>
                            <KepanitiaanCard
                                kepanitiaan={kepanitiaan}
                            />
                        </Link>
                    ))}
                </div>
                {/* <div className="mt-10 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">Event Terbesar</h2>
                    <Button variant="ghost" className="flex items-center gap-2">
                        Lihat Semua
                        <ChevronRightIcon />
                    </Button>
                </div> */}
                <h3 className="text-left text-xl font-semibold mb-2">Kepanitiaan?</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-4">
                    {data.kepanitiaanTerbaru.map((kepanitiaan) => (
                        <Link key={kepanitiaan.name} href={`/profil-kegiatan/${kepanitiaan.id}`}>
                            <KepanitiaanCard
                                kepanitiaan={kepanitiaan}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
