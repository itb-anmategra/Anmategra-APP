// Library Import
import React from 'react'
import Image, { type StaticImageData } from 'next/image'
// Components Import
import { Card } from '~/components/ui/card'

const LembagaCard = ({
  nama,
  kategori,
  deskripsi,
  lembagaPicture,
}:{
  nama: string
  kategori: string
  deskripsi: string
  lembagaPicture: StaticImageData | string
}) => {
  return (
    <Card className="px-6 py-4 flex items-center justify-start gap-x-6 transition-all hover:shadow-md">
      <Image 
        src={lembagaPicture}
        alt='Foto Lembaga'
        width={100}
        height={100}
        className='rounded-xl'
      />
      <div className='space-y-1'>
        <p className='text-xl font-medium text-Blue-Dark'>{nama}</p>
        <p className='text-neutral-600'>{kategori}</p>
        <p className='text-neutral-1000'>{deskripsi}</p>
      </div>
    </Card>
  )
}

export default LembagaCard