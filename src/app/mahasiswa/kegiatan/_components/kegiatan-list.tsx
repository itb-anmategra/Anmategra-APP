'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import { KepanitiaanCard } from '~/app/_components/card/kepanitiaan-card';
import { api } from '~/trpc/react';

const LIMIT = 8;

type EventStatus = 'Coming Soon' | 'On going' | 'Ended' | 'Open Recruitment';
type SortOption = 'newest' | 'oldest' | 'most_participants';

const KegiatanList = ({
  selectedStatus,
  sortBy,
}: {
  selectedStatus: EventStatus[];
  sortBy: SortOption;
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = api.landing.getAllEvents.useInfiniteQuery(
    { limit: LIMIT, status: selectedStatus, sort: sortBy },
    {
      getNextPageParam: (last) => last.nextCursor ?? undefined,
    },
  );

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.events) ?? [],
    [data],
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-slate-500">Memuat kegiatan...</div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-slate-500">
        Gagal memuat kegiatan.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-slate-500">
        Belum ada kegiatan yang tersedia.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((kepanitiaan) => (
          <Link
            key={kepanitiaan.id}
            href={`/mahasiswa/profile-kegiatan/${kepanitiaan.id}`}
          >
            <KepanitiaanCard kepanitiaan={kepanitiaan} orientation="vertical" />
          </Link>
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="py-4 text-center text-slate-500">
          Memuat lebih banyak...
        </div>
      )}
    </>
  );
};

export default KegiatanList;
