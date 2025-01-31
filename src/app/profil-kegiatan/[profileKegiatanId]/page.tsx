// Library Import
import React from 'react'
// Components Import
import {EventHeader} from "~/app/_components/placeholder/event-header";
import {PenyelenggaraCard} from "~/app/_components/placeholder/penyelenggara-card";
import {Input} from '~/components/ui/input';
// Icons Import
import {MagnifyingGlassIcon} from '@radix-ui/react-icons';
import {api} from "~/trpc/server";
import ProfileKegiatanComp from "~/app/profil-kegiatan/[profileKegiatanId]/profileKegiatanComp";
import {NextResponse} from "next/server";

const ProfileKegiatan = async (
    {
        params
    }: {
        params: Promise<{ profileKegiatanId: string }>
    }
) => {
    const query = (await params).profileKegiatanId
    const {kegiatan, lembaga, participant, error} = await api.profil.getKegiatan({kegiatanId: query})


    if (error) {
        return (
            <>
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold text-neutral-1000">Kegiatan</h1>
                </div>

                <div className="mb-5">
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
        <main className="min-h-screen bg-slate-50 p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-semibold text-neutral-1000">Kegiatan</h1>
            </div>

            <div className="mb-5">
                <Input
                    placeholder="Cari lembaga, kegiatan, atau mahasiswa"
                    className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
                    startAdornment={
                        <MagnifyingGlassIcon className="size-4 text-gray-500"/>
                    }
                />
            </div>

            <EventHeader
                title={kegiatan?.name ?? 'null'}
                organizer={lembaga?.name ?? 'null'}
                backgroundImage={kegiatan?.background_image ?? "/profile-kegiatan-placeholder/kegiatan-header-background.png"}
                logoImage={kegiatan?.image ?? "/profile-kegiatan-placeholder/oskm-header.png"}
            />

            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[28px] font-semibold text-slate-900">
                    Penyelenggara
                </h2>
            </div>

            <PenyelenggaraCard
                title={lembaga?.name ?? 'null'}
                category={lembaga?.type ?? 'null'}
                logo={lembaga?.image ??"/profile-kegiatan-placeholder/oskm-organizer.png"}
            />

            <ProfileKegiatanComp anggota={participant ?? []} />
        </main>
    )
}

export default ProfileKegiatan