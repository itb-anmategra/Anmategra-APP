'use client'
// Library Import
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// Assets Import
import KMLogo from 'public/images/KMITBLogo.png'
import PSDMLogo from 'public/images/PSDMLogo.png'
import AnmategraLogo from 'public/images/AnmategraLogo.png'
import InstagramLogo from 'public/images/InstagramLogo.png'
import LineLogo from 'public/images/LineLogo.png'
import TwitterLogo from 'public/images/TwitterLogo.png'

const Footer = () => {
  const pathname = usePathname()

  if (pathname.startsWith("/lembaga")) {
    return;
  }

  return (
    <div className='w-full h-full px-16 py-8 flex flex-col items-center justify-start border-t-2 border-slate-100 bg-white'>
      <div className='h-full w-full flex items-start justify-between gap-x-8'>
        <div className='w-full flex flex-col gap-y-2 flex-[2]'>
          <div className='w-full h-full flex items-center gap-x-2'>
            <Image 
              src={KMLogo}
              alt='Logo KM ITB 2024/2025'
              width={72}
              height={72}
              className='min-w-[72px] min-h-[72px]'
            />
            <Image 
              src={PSDMLogo}
              alt='Logo PSDM 2024/2025'
              width={72}
              height={72}
              className='min-w-[72px] min-h-[72px]'
            />
            <Image 
              src={AnmategraLogo}
              alt='Logo Anmategra 2024/2025'
              width={72}
              height={72}
              className='min-w-[72px] min-h-[72px]'
            />
          </div>
          <div>
            <h3 className='text-2xl text-Blue-Dark font-semibold'>Kementerian Riset dan Pengabdian Masyarakat</h3>
            <p className='text-Blue-Dark leading-5'>Kemenkoan Pengembangan Sumber Daya Manusia <br /> Kabinet “Restorasi marwah” KM ITB 2024/2025</p>
          </div>
          <div className='py-2'>
            <p className='text-Blue-Dark text-[16px]'>Copyright © Anmategra 2024</p>
          </div>
        </div>
        <div className='flex flex-col items-start justify-start w-full gap-y-2 flex-1'>
          <h5 className='text-Blue-Dark text-xl font-medium'>Narahubung</h5>
          <div>
            <p className='font-semibold text-Blue-Dark'>Mohammad Ari Alexander Aziz</p>
            <div className='flex items-center gap-x-2'>
              <Image 
                src={LineLogo}
                alt='Logo Line'
                width={16}
                height={16}
              />
              <p className='text-Blue-Dark text-sm'>arialexander2</p>
            </div>
          </div>
          <div className='py-[1px]' />
          <div>
            <p className='font-semibold text-Blue-Dark'>Rizqi Andhika Pratama</p>
            <div className='flex items-center gap-x-2'>
              <Image 
                src={LineLogo}
                alt='Logo Line'
                width={16}
                height={16}
              />
              <p className='text-Blue-Dark text-sm'>rizqi_rap</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-start justify-start w-full gap-y-2 flex-1'>
          <h5 className='text-Blue-Dark text-xl font-medium'>Ikuti Kami</h5>
          <Link href="https://instagram.com/anmategra.itb" className='flex items-center gap-x-2'>
            <Image 
              src={InstagramLogo}
              alt='Logo Instagram'
              width={16}
              height={16}
            />
            <p className='text-Blue-Dark text-sm'>anmategra.itb</p>
          </Link>
          <Link href="https://x.com/anmategra_itb?s=21" className='flex items-center gap-x-2'>
            <Image 
              src={TwitterLogo}
              alt='Logo Twitter'
              width={16}
              height={16}
            />
            <p className='text-Blue-Dark text-sm'>anmategra_itb</p>
          </Link>
          <div className='py-2' />
          <h5 className='text-Blue-Dark text-xl font-medium'>Kontak Kami</h5>
          <p className='text-Blue-Dark text-sm'>anmategra@km.itb.ac.id</p>
        </div>
      </div>
    </div>
  )
}

export default Footer