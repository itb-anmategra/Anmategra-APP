import { type Metadata } from 'next';
import { type ReactNode } from 'react';
import { getServerAuthSession } from '~/server/auth';

import { Sidebar } from '../_components/layout/sidebar';
import Navbar from '../_components/layout/navbar';

// Metadata
export const metadata: Metadata = {
  title: 'Lembaga',
  description: 'Anmategra by KM ITB',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const LembagaLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerAuthSession();
  return (
    <div className="flex">
      <Navbar session={session} />
      <Sidebar session={session} />
      <div className="flex-1 pt-16 sm:pt-0">{children}</div>
    </div>
  );
};

export default LembagaLayout;
