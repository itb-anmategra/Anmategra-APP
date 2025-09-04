import React, { type ReactNode } from 'react'
import Navbar from '../_components/layout/navbar'
import {getServerAuthSession} from "~/server/auth";

const HalamanMahasiswaLayout = async ({ children }: { children: ReactNode }) => {
    const session = await getServerAuthSession()
  return (
    <div className='w-full flex flex-col items-center'>
      <div className='w-full max-w-7xl'>
        <Navbar session={session} />
        {children}
      </div>
    </div>
  )
}

export default HalamanMahasiswaLayout