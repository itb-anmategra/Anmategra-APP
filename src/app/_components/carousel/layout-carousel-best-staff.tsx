'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '~/components/ui/button';

export default function LayoutCarouselBestStaff({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-row items-center gap-[17px]">
      <Button
        variant="light_blue"
        size="icon"
        onClick={scrollLeft}
        className="flex flex-shrink-0 rounded-[8px]"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <div
        ref={containerRef}
        className="flex gap-4 scroll-smooth overflow-x-hidden"
      >
        {children}
      </div>
      <Button
        variant="light_blue"
        size="icon"
        onClick={scrollRight}
        className="flex flex-shrink-0 rounded-[8px]"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
