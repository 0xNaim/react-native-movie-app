import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchOptions {
  autoFetch?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  const { autoFetch = true, retryAttempts = 0, retryDelay = 1000 } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Use ref to store the latest fetchFunction to avoid stale closures
  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  const fetchData = useCallback(async (attempt = 0): Promise<void> => {
    try {
      if (!isMountedRef.current) return;

      setLoading(true);
      setError(null);

      const result = await fetchFunctionRef.current();

      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      const errorObj = err instanceof Error ? err : new Error("An unknown error occurred");

      // Retry logic
      if (attempt < retryAttempts) {
        setTimeout(() => {
          if (isMountedRef.current) {
            fetchData(attempt + 1);
          }
        }, retryDelay);
        return;
      }

      setError(errorObj);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [retryAttempts, retryDelay]);

  const reset = useCallback(() => {
    if (!isMountedRef.current) return;

    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
