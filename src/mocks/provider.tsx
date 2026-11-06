"use client";

import { useEffect, useState } from "react";

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"starting" | "ready" | "error">("starting");

  useEffect(() => {
    let active = true;
    import("./browser")
      .then(({ startMocking }) => startMocking())
      .then(() => { if (active) setStatus("ready"); })
      .catch((error: unknown) => {
        console.error("Mock service could not start", error);
        if (active) setStatus("error");
      });
    return () => { active = false; };
  }, []);

  if (status === "error") return (
    <main className="mx-auto max-w-6xl px-6 py-10" role="alert">
      服務暫時無法使用。
      <button className="ml-2 text-momo underline" onClick={() => window.location.reload()}>重新載入</button>
    </main>
  );
  if (status === "starting") return <p className="px-6 py-10" role="status">載入中…</p>;
  return children;
}
