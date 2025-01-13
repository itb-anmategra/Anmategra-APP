import React, { ReactNode } from 'react'
import MahasiswaSidebar from '../_components/MahasiswaSidebar'

const HalamanMahasiswaLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full flex flex-col items-center'>
      <div className='w-full max-w-7xl'>
        <MahasiswaSidebar />
        {children}
      </div>
    </div>
  )
}

export default HalamanMahasiswaLayout