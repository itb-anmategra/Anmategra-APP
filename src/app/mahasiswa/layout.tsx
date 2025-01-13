import React, { ReactNode } from 'react'

const HalamanMahasiswaLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full max-w-7xl bg-red-100'>
      {children}
    </div>
  )
}

export default HalamanMahasiswaLayout