import Link from 'next/link'
import React from 'react'
import { Button } from '~/components/ui/button'

const LogInPage = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center gap-x-4'>
      <Link href={"/lembaga"}>
        <Button>
          Lembaga
        </Button>
      </Link>
      <Link href={"/mahasiswa"}>
        <Button>
          Mahasiswa
        </Button>
      </Link>
      <Link href={"/admin"}>
        <Button>
          Admin
        </Button>
      </Link>
    </div>
  )
}

export default LogInPage