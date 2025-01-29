// Library Import
import React, { ReactNode } from 'react'

const AdminLayout = ({ 
  children 
}:{
  children: ReactNode
} ) => {
  return (
    <div className='w-full flex flex-col items-center'>
      <div className='max-w-7xl w-full flex flex-col items-center'>
        {children}
      </div>
    </div>
  )
}

export default AdminLayout