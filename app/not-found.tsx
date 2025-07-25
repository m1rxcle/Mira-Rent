import { Button } from "@/share/ui/index"
import Image from "next/image"
import Link from "next/link"

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
			<h1 className="text-6xl font-bold gradient-title mb-4">404</h1>

			<h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
			<p className="text-gray-600 mb-8">Упс! Страница, которую вы ищете, не существует.</p>

			<Link href="/">
				<Button>Вернуться на главную</Button>
			</Link>

			<Image src="/empty.png" alt="Empty" width={200} height={200} className="pointer-events-none cursor-none" />
		</div>
	)
}
export default NotFound
