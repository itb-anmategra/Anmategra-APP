'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image
        src="/images/loading/Property 1=Variant3.png"
        alt="Loading animation"
        width={120}
        height={120}
        className="animate-spin"
        priority
      />
    </div>
  );
}
