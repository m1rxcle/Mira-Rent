import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowLeft, CarFront, Heart, Layout } from "lucide-react"
import { checkUser } from "@/prisma/checkUser"

const Header = async ({ isAdminPage = false }: { isAdminPage: boolean }) => {
	const user = await checkUser()

	const isAdmin = user?.role === "ADMIN"

	return (
		<header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
			<nav className="mx-auto p-4 flex items-center justify-between ">
				<Link href={isAdminPage ? "/admin" : "/"} className="flex">
					<Image src={"/newLogo.png"} width={200} height={60} alt="logo" className="w-34 md:w-auto h-12 object-contain md:pl-10" />
					{isAdminPage && <span className="text-xs font-light text-blue-500">Админ</span>}
				</Link>
				<div className="flex items-center space-x-4">
					{isAdminPage ? (
						<Link href="/">
							<Button variant="outline" className="flex items-center gap-2">
								<ArrowLeft size={18} />
								<span>В приложение</span>
							</Button>
						</Link>
					) : (
						<SignedIn>
							<Link href="/saved-cars">
								<Button>
									<Heart size={18} />
									<span className="hidden md:inline">Избранные автомобили</span>
								</Button>
							</Link>

							{isAdmin ? (
								<Link href="/admin">
									<Button variant="outline">
										<Layout size={18} />
										<span className="hidden md:inline">Админ панель</span>
									</Button>
								</Link>
							) : (
								<Link href="/reservations">
									<Button variant="outline">
										<CarFront size={18} />
										<span className="hidden md:inline">Мои бронирования</span>
									</Button>
								</Link>
							)}
						</SignedIn>
					)}

					<SignedOut>
						<SignInButton forceRedirectUrl="/">
							<Button variant="outline">Войти</Button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						<UserButton
							appearance={{
								elements: {
									avatarBox: "w-10 h-10",
								},
							}}
						/>
					</SignedIn>
				</div>
			</nav>
		</header>
	)
}
export default Header
