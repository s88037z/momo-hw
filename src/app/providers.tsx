"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { MockProvider } from "@/mocks/provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity, retry: false, refetchOnWindowFocus: false },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <MockProvider>{children}</MockProvider>
    </QueryClientProvider>
  );
}
