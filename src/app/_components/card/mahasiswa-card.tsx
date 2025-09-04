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
        <Card className='w-[400px] h-[150px] px-6 py-4 flex items-center gap-x-4 transition-all hover:shadow-md'>
            <Image
                src={profilePicture}
                alt='Profile Picture'
                width={80}
                height={80}
                className='rounded-full max-h-[100px] max-w-[100px] min-h-[100px] min-w-[100px] object-cover'
            />
            <div className='flex-1 overflow-hidden'>
                <p className='text-neutral-1000 text-lg truncate'>{nama}</p>
                <p className='text-neutral-700 text-sm truncate'>{NIM}</p>
                <p className='text-neutral-700 text-sm truncate'>{jurusan}</p>
            </div>
        </Card>
    )
}

export default MahasiswaCard
