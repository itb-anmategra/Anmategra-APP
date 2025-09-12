import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-4 mt-[18px]">
      <Button
        variant="outline"
        className="border rounded-[8px] px-3 py-1 w-[42px] h-[42px]"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <ChevronLeft size={24} />
      </Button>
      {(() => {
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
        return uniquePages.map((item, idx) =>
          typeof item === 'string' ? (
            <span key={item + idx} className="px-2 select-none">
              ...
            </span>
          ) : (
            <Button
              key={item}
              variant={item === currentPage ? 'default' : 'outline'}
              className={`border rounded-[8px] px-3 py-1 w-[42px] h-[42px] ${item === currentPage ? 'bg-[#00B7B7] hover:bg-[#00B7B7] text-white' : ''}`}
              onClick={() => setCurrentPage(item)}
            >
              {item}
            </Button>
          ),
        );
      })()}
      <Button
        variant="outline"
        className="border rounded-[8px] px-3 py-1 w-[42px] h-[42px]"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
}
