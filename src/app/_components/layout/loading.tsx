'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const LoadingFrames = [
  '/Property 1=Default.png',
  '/Property 1=Variant2.png',
  '/Property 1=Variant3.png',
  '/Property 1=Variant4.png',
];

export default function Loading() {
  const [Index, SetIndex] = useState(0);

  useEffect(() => {
    const Interval = setInterval(() => {
      SetIndex((prev) => (prev + 1) % frames.length);
    }, 200);
    return () => clearInterval(Interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Image
        src={LoadingFrames[Index]!}
        alt="Loading animation"
        width={120}
        height={120}
        priority
      />
    </div>
  );
}
