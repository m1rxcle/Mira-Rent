import { useState } from "react"
import { toast } from "sonner"

function useFetch<T, U extends unknown[]>(cb: (...args: U) => Promise<T>) {
	const [data, setData] = useState<T | undefined>(undefined)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fn = async (...args: U): Promise<void> => {
		setLoading(true)
		setError(null)
		try {
			const response = await cb(...args)
			setData(response)
		} catch (error) {
			if (typeof error === "object" && error !== null && "message" in error) {
				setError(error.message as string)
				toast.error(error.message as string)
			} else {
				setError("Unknown error")
				toast.error("Unknown error")
			}
		} finally {
			setLoading(false)
		}
	}

	return { data, loading, error, fn, setData }
}

export default useFetch
