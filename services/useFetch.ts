import { useCallback, useEffect, useState } from "react";

// This hook is designed to fetch data from an API or any asynchronous source.
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await fetchFunction();
			setData(result);
		} catch (err) {
			const errorObj = err instanceof Error ? err : new Error("Unknown error occurred");
			setError(errorObj);
		} finally {
			setLoading(false);
		}
	}, []);

	const reset = useCallback(() => {
		setData(null);
		setLoading(false);
		setError(null);
	}, []);

	useEffect(() => {
		if (autoFetch) {
			fetchData();
		}
	}, [autoFetch, fetchData]);

	return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
