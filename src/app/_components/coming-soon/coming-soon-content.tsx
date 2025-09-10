import Image from "next/image";
import Link from "next/link";
import ComingSoonLeft from "public/images/placeholder/coming-soon1.png"
import ComingSoonRight from "public/images/placeholder/coming-soon2.png"
import { Button } from "~/components/ui/button";
import { Session } from "next-auth";

export default function ComingSoonContent({ session }: { session?: Session | null }) {
  return (
    <div className="min-h-screen bg-gray-50 z-10">
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="relative w-full min-h-screen flex justify-center items-center text-center">
          <div className="absolute left-0 top-5 opacity-20">
            <Image 
              src={ComingSoonLeft}
              alt="Coming Soon decoration - left"
              width={192}
              height={384}
              className="object-contain"
            />
          </div>
          <div className="absolute right-0 top-5 opacity-20">
            <Image 
              src={ComingSoonRight}
              alt="Coming Soon decoration - right"
              width={192}
              height={384}
              className="object-contain"
            />
          </div>
          <div className="text-center relative z-10"> 
            <h1 className="text-6xl font-bold text-[#2B6777] mb-6">
                Coming Soon
            </h1>
            <p className="text-2xl text-gray-400 mb-12">
              Kami sedang membangun sesuatu yang menarik untuk Anda
            </p>
            {session?.user.role === 'lembaga' ? (
              <Link href="/lembaga">
                <Button className="bg-[#2B6777] hover:bg-[#2B6777]/90 text-white px-8 py-6 text-lg">
                  Kembali ke Beranda
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button className="bg-[#2B6777] hover:bg-[#2B6777]/90 text-white px-8 py-6 text-lg">
                  Kembali ke Beranda
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}