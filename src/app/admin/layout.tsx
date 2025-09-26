// Library Import
import React, { type ReactNode } from 'react';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex flex-col px-[45px]">
      <div className="w-full flex flex-col">{children}</div>
    </div>
  );
};

export default AdminLayout;
