import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Session } from "next-auth";

export default function ComingSoonContent({ session }: { session?: Session | null }) {
  return (
    <div className="min-h-screen bg-gray-50 z-5">
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          {session?.user.role === 'lembaga' ? (
            <div>
              <div className="absolute left-0 top-[115px] opacity-20 -translate-y-1/2">
                <Image 
                  src="/images/placeholder/coming-soon1.png"
                  alt="Coming Soon decoration"
                  width={192}
                  height={384}
                />
              </div>
              <div className="absolute right-0 top-[115px] opacity-20 -translate-y-1/2">
                <Image 
                  src="/images/placeholder/coming-soon2.png"
                  alt="Coming Soon decoration"
                  width={192}
                  height={384}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="absolute left-0 top-[100px] opacity-20 -translate-y-1/2">
                <Image 
                  src="/images/placeholder/coming-soon1.png"
                  alt="Coming Soon decoration"
                  width={192}
                  height={384}
                />
              </div>
              <div className="absolute right-0 top-[100px] opacity-20 -translate-y-1/2">
                <Image 
                  src="/images/placeholder/coming-soon2.png"
                  alt="Coming Soon decoration"
                  width={192}
                  height={384}
                />
              </div>
            </div>
          )}
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