'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '~/components/debounceHook';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/react';

type MobileSearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  role?: 'mahasiswa' | 'lembaga' | 'admin' | null;
};

export const MobileSearchOverlay = ({
  isOpen,
  onClose,
  role,
}: MobileSearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);
  const router = useRouter();

  // Fetch preview results
  const { data: previewData, isLoading } = api.landing.searchPreview.useQuery(
    { query: debouncedQuery },
    {
      enabled: debouncedQuery.trim().length >= 2,
      refetchOnWindowFocus: false,
    },
  );

  const navigateToSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const encoded = encodeURIComponent(trimmed);

    if (role === 'lembaga') {
      void router.push(`/lembaga/pencarian/${encoded}`);
    } else {
      void router.push(`/mahasiswa/pencarian/${encoded}`);
    }

    handleClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigateToSearch();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const handleLinkClick = () => {
    handleClose();
  };

  const hasResults =
    previewData &&
    (previewData.mahasiswa.length > 0 ||
      previewData.lembaga.length > 0 ||
      previewData.kegiatan.length > 0);

  const showPreview = debouncedQuery.trim().length >= 2;

  if (!isOpen) return null;

  return (
    <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      {/* Search Header */}
      <div className="flex items-center px-4 py-3 border-b border-neutral-50">
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          className="w-8 h-8 mr-3"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex-1 relative">
          <Input
            placeholder="Cari lembaga, kegiatan, atau mahasiswa"
            className="w-full pr-10 border-0 bg-gray-50 rounded-full placeholder:text-neutral-700 focus-visible:ring-1 focus-visible:ring-[#00B7B7]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Button
            onClick={navigateToSearch}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8"
          >
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Preview Results */}
      {showPreview && (
        <div className="max-h-screen overflow-y-auto border-b border-neutral-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">Mencari...</div>
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {/* Mahasiswa Results */}
              {previewData.mahasiswa.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Mahasiswa
                  </div>
                  {previewData.mahasiswa.map((mahasiswa) => (
                    <Link
                      key={mahasiswa.userId}
                      href={`/mahasiswa/profile-mahasiswa/${mahasiswa.userId}`}
                      onClick={handleLinkClick}
                      className="block px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {mahasiswa.nama}
                          </div>
                          <div className="text-sm text-gray-500">
                            {mahasiswa.nim}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Lembaga Results */}
              {previewData.lembaga.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Lembaga
                  </div>
                  {previewData.lembaga.map((lembaga) => (
                    <Link
                      key={lembaga.lembagaId}
                      href={`/profile-lembaga/${lembaga.lembagaId}`}
                      onClick={handleLinkClick}
                      className="block px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {lembaga.name}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Kegiatan Results */}
              {previewData.kegiatan.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Kegiatan
                  </div>
                  {previewData.kegiatan.map((kegiatan) => (
                    <Link
                      key={kegiatan.id}
                      href={`/profile-kegiatan/${kegiatan.id}`}
                      onClick={handleLinkClick}
                      className="block px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {kegiatan.name}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* See All Results Link */}
              <div className="border-t border-gray-200 mt-2">
                <button
                  onClick={navigateToSearch}
                  className="w-full px-4 py-3 text-center text-sm font-medium text-[#00B7B7] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  Lihat Semua Hasil
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Tidak ada hasil ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
};
