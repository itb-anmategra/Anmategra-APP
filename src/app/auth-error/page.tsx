"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "~/components/ui/button"
import Logo from 'public/logo-anmategra.png'
import MahasiswaSidebar from "~/app/_components/MahasiswaSidebar";

export default function AuthError() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    return (
        <main className="flex flex-col overflow-hidden pb-16 sm:space-y-4 md:space-y-8">
            <div className="mb-12 fixed w-full shadow-sm z-20">
                <MahasiswaSidebar/>
            </div>

            {/* Error Content */}
            <main className="flex flex-col items-center justify-center flex-1 px-4 py-16">
                <div className="flex flex-col items-center max-w-lg text-center">
                    <Image
                        src={Logo}
                        alt="Error Illustration"
                        width={200}
                        height={200}
                        className="mb-6"
                    />
                    <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
                    {error === "AccessDenied" ? (
                        <p className="mb-8 text-lg text-gray-600">Maaf, Akun anda tidak memiliki akses pada aplikasi Anmategra</p>
                    ) : (
                        <p className="mb-8 text-lg text-gray-600">Maaf, Terjadi kesalahan pada proses autentikasi</p>
                    )}
                    <Button asChild variant="secondary" className="bg-[#2D3648] text-white hover:bg-[#1E2533]">
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </div>
            </main>
        </main>
    )
}

