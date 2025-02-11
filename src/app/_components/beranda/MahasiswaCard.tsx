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
}:{
  nama: string
  NIM: string
  jurusan: string
  profilePicture: StaticImageData | string
}) => {
  return (
    <Card className='px-6 py-4 flex items-center justify-start gap-x-6 transition-all hover:shadow-md'>
      <Image 
        src={profilePicture}
        alt='Profile Picture'
        width={100}
        height={100}
      />
      <div className='space-y-1'>
        <p className='text-neutral-1000 text-xl'>{nama}</p>
        <p className='text-neutral-700'>{NIM}</p>
        <p className='text-neutral-700'>{jurusan}</p>
      </div>
    </Card>
  )
}

export default MahasiswaCard