"use client";

import { useCallback, useEffect, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductSearchQuery } from "@/features/products/types";
import { parseSearchParams, serializeSearchQuery, updateSearchQuery } from "@/features/products/search-params";

export function useSearchState() {
  const router = useRouter();
  const pathname = usePathname();
  const rawParams = useSearchParams().toString();
  const query = useMemo(() => parseSearchParams(new URLSearchParams(rawParams)), [rawParams]);
  const queryString = serializeSearchQuery(query);
  const [isNavigating, startTransition] = useTransition();

  const href = useCallback((params: string) => params ? `${pathname}?${params}` : pathname, [pathname]);

  useEffect(() => {
    if (rawParams !== queryString) router.replace(href(queryString), { scroll: false });
  }, [rawParams, queryString, router, href]);

  const updateQuery = useCallback((patch: Partial<ProductSearchQuery>) => {
    const next = serializeSearchQuery(updateSearchQuery(query, patch));
    if (next === queryString) return;
    startTransition(() => router.push(href(next), { scroll: false }));
  }, [query, queryString, router, href]);

  const replacePage = useCallback((page: number) => {
    if (page !== query.page) {
      router.replace(href(serializeSearchQuery({ ...query, page })), { scroll: false });
    }
  }, [query, router, href]);

  return { query, queryString, updateQuery, replacePage, isNavigating };
}
