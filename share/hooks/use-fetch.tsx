import { useState } from "react"
import { toast } from "sonner"

function useFetch<T, Args extends any[]>(cb: (...args: Args) => Promise<T>) {
	const [data, setData] = useState<T | undefined>(undefined)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fn = async (...args: Args): Promise<void> => {
		setLoading(true)
		setError(null)
		try {
			const response = await cb(...args)
			setData(response)
		} catch (error: any) {
			setError(error.message || "Unknown error")
			toast.error(error.message || "Unknown error")
		} finally {
			setLoading(false)
		}
	}

	return { data, loading, error, fn, setData }
}

export default useFetch
