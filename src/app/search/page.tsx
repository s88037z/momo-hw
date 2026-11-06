import { SearchResults } from "@/features/search/search-results";
import { Suspense } from "react";

export default function SearchPage() {
  return <Suspense fallback={<p role="status" className="page-container py-10">載入搜尋條件中…</p>}><SearchResults /></Suspense>;
}
