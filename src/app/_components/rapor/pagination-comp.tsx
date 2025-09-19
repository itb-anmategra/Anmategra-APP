'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '~/components/ui/pagination';

export default function CustomPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis-left');
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    if (currentPage === 1) end = 3;
    if (currentPage === totalPages) start = totalPages - 2;
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis-right');
    pages.push(totalPages);
  }

  const uniquePages: (number | string)[] = [];
  for (const p of pages) {
    if (!uniquePages.includes(p)) uniquePages.push(p);
  }

  const baseClass =
    'w-[42px] h-[42px] text-lg flex items-center justify-center rounded-[8px] border border-[#C4CACE] transition-colors [&_svg]:!size-6';

  return (
    <Pagination>
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
            className={`${baseClass} hover:bg-[#00B7B7] hover:text-white hover:border-[#00B7B7]`}
          >
            <ChevronLeft size={24} className="text-current" />
          </PaginationLink>
        </PaginationItem>

        {uniquePages.map((item, idx) =>
          typeof item === 'string' ? (
            <PaginationItem key={item + idx}>
              <span className="flex h-[42px] w-[42px] items-center justify-center select-none">
                ...
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(item);
                }}
                className={`${baseClass} ${
                  item === currentPage
                    ? 'bg-[#00B7B7] text-white border-[#00B7B7]'
                    : 'hover:bg-[#00B7B7] hover:text-white hover:border-[#00B7B7]'
                }`}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
            className={`${baseClass} hover:bg-[#00B7B7] hover:text-white hover:border-[#00B7B7]`}
          >
            <ChevronRight size={24} className="text-current" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
