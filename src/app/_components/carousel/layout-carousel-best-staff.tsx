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
    <div className="flex items-center gap-3">
      <Button variant="light_blue" size="icon" onClick={scrollLeft}>
        <ChevronLeft width={12} height={21} />
      </Button>
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-hidden scroll-smooth no-scrollbar"
      >
        {children}
      </div>
      <Button variant="light_blue" size="icon" onClick={scrollRight}>
        <ChevronRight width={12} height={21} />
      </Button>
    </div>
  );
}
