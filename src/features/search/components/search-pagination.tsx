interface SearchPaginationProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
}

export function SearchPagination({ page, pageCount, onPageChange }: SearchPaginationProps) {
  return (
    <nav aria-label="搜尋結果分頁" className="flex items-center justify-end gap-2 text-sm">
      <span className="mr-1 text-[#777]">頁數 {pageCount === 0 ? 0 : page}/{pageCount}</span>
      {page > 1 && <button type="button" disabled={!onPageChange} onClick={() => onPageChange?.(page - 1)} className="border border-[#ddd] px-3 py-2 disabled:cursor-not-allowed">上一頁</button>}
      <button type="button" disabled={!onPageChange || page >= pageCount} onClick={() => onPageChange?.(page + 1)} className="bg-[#4b9de2] px-3 py-2 text-white disabled:cursor-not-allowed disabled:bg-[#92bce0]">下一頁</button>
    </nav>
  );
}
