'use client';

import Link from 'next/link';
import { Button } from '~/components/ui/button';

const CariKepanitiaanButton = () => {
  return (
    <Link href={`/`}>
      <Button className="bg-Blue-Dark hover:bg-Midnight-Blue text-white font-semibold rounded-lg px-8 py-2">
        Cari Kepanitiaan
      </Button>
    </Link>
  );
};

export default CariKepanitiaanButton;
