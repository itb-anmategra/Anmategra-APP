import React, { type ReactNode } from 'react'
import MahasiswaSidebar from '../_components/MahasiswaSidebar'
import {getServerAuthSession} from "~/server/auth";

const HalamanMahasiswaLayout = async ({ children }: { children: ReactNode }) => {
    const session = await getServerAuthSession()
  return (
    <div className='w-full flex flex-col items-center'>
      <div className='w-full max-w-7xl'>
        <MahasiswaSidebar session={session} />
        {children}
      </div>
    </div>
  )
}

export default HalamanMahasiswaLayout