"use client";
// Minimal data-fetch hook: runs an async fn on mount (+ deps), tracks loading/error.
// fn is held in a ref so a fresh closure each render doesn't retrigger; `deps` alone
// drives re-fetching (callers list what the fetch reads).
import { useEffect, useState, useCallback, useRef } from "react";

export function useApi<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; });

  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    return fnRef.current()
      .then((d) => setData(d))
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    run();
  }, deps);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  return { data, loading, error, reload: run };
}
