import { Button } from "@/share/ui/index"
import Link from "next/link"

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
			<h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
			<h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
			<p className="text-gray-600 mb-8">Oops! The page you are looking for does not exist.</p>
			<Link href="/">
				<Button>Return Home</Button>
			</Link>
		</div>
	)
}
export default NotFound
