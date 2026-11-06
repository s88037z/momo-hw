import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const worker = setupWorker(...handlers);
let startPromise: Promise<unknown> | undefined;

export function startMocking() {
  // Both development and the static take-home demo depend on these mocks.
  // Reuse the promise when React Strict Mode re-runs the mounting effect.
  startPromise ??= worker.start({
    quiet: true,
    onUnhandledRequest(request, print) {
      const url = new URL(request.url);
      if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) {
        print.error();
      }
    },
  });
  return startPromise;
}
