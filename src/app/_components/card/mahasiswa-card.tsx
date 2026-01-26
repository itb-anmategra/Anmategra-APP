// Library Import
import React from 'react'
// Components Import
import { Card } from '~/components/ui/card'
// Asset Import
import Image, { type StaticImageData } from 'next/image'

const MahasiswaCard = ({
                           nama,
                           NIM,
                           jurusan,
                           profilePicture,
                       }: {
    nama: string
    NIM: string
    jurusan: string
    profilePicture: StaticImageData | string
}) => {
    return (
        <Card className='w-full max-w-[400px] h-[150px] px-4 sm:px-6 py-4 flex items-center gap-x-3 sm:gap-x-4 transition-all hover:shadow-md'>
            <Image
                src={profilePicture}
                alt='Profile Picture'
                width={80}
                height={80}
                className='rounded-full h-20 w-20 sm:h-[100px] sm:w-[100px] object-cover flex-shrink-0'
            />
            <div className='flex-1 overflow-hidden min-w-0'>
                <p className='text-neutral-1000 text-base sm:text-lg font-semibold truncate'>{nama}</p>
                <p className='text-neutral-700 text-xs sm:text-sm truncate'>{NIM}</p>
                <p className='text-neutral-700 text-xs sm:text-sm truncate'>{jurusan}</p>
            </div>
        </Card>
    )
}

export default MahasiswaCard
