import { getFeaturedCars } from "../actions/home.actions"
import { checkUser } from "@/prisma/checkUser"

import Link from "next/link"
import Image from "next/image"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from "@/share/ui/index"

import { Calendar, CarIcon, ChevronRight, Shield } from "lucide-react"
import { CarCard, HomeSearch, ReadyToFind } from "@/share/components/index"
import { BODY_TYPES_OBJECTS, CAR_MAKES, FAQ_ITEMS } from "@/share/constants/data"

export default async function Home() {
	const featuredCars = await getFeaturedCars()
	const user = await checkUser()

	return (
		<div className="flex flex-col">
			{/* Hero */}
			<section className="relative py-16 md:py-28 dotted-background ">
				<div className="container max-w-4xl mx-auto text-center px-4">
					<div className="mb-8">
						<h1 className="text-5xl md:text-8xl mb-4 gradient-title">Найди машину своей мечты с Miracle Rent</h1>
						<p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
							Найди машину своей мечты с Miracle Rent. Мы предлагаем высококлассные автомобили, которые подходят именно тебе.
						</p>
					</div>
					{/* Search */}
					<HomeSearch />
				</div>
			</section>
			<section className="py-12">
				<div className="contrainer mx-auto px-4">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold">Избранные автомобили</h2>
						<Button variant="ghost" className="flex items-center" asChild>
							{user ? (
								<Link href="/cars">
									Посмотреть все <ChevronRight calcMode="ml-1 h-4 w-4" />
								</Link>
							) : (
								<Link href="/sign-in">
									Войдите, чтобы увидеть все <ChevronRight calcMode="ml-1 h-4 w-4" />
								</Link>
							)}
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{featuredCars.map((car) => (
							<CarCard key={car.id} car={car} />
						))}
					</div>
				</div>
			</section>

			<section className="py-12 bg-gray-50">
				<div className="contrainer mx-auto px-4">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold">Поиск по маркам</h2>
						<Button variant="ghost" className="flex items-center" asChild>
							{user ? (
								<Link href="/cars">
									Посмотреть все <ChevronRight calcMode="ml-1 h-4 w-4" />
								</Link>
							) : (
								<Link href="/sign-in">
									Войдите, чтобы увидеть все <ChevronRight calcMode="ml-1 h-4 w-4" />
								</Link>
							)}
						</Button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{CAR_MAKES.map((make) => (
							<Link
								className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
								key={make.name}
								href={`/cars?make=${make.name}`}
							>
								<div className="h-16 w-auto mx-auto mb-2 relative">
									<Image
										src={make.image}
										alt={make.name}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										style={{ objectFit: "contain" }}
									/>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="py-16">
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-bold text-center mb-12">Почему выбирают нас</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<CarIcon className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-bold mb-2">Большой выбор</h3>
							<p className="text-gray-600">Сотни автомобилей в наличии, чтобы удовлетворить любые потребности.</p>
						</div>

						<div className="text-center">
							<div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<Shield className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-bold mb-2">Безопастность</h3>
							<p className="text-gray-600">Мы предлагаем автомобили, которые соответствуют современным стандартам безопасности.</p>
						</div>

						<div className="text-center">
							<div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<Calendar className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-bold mb-2">Легкий тест-драйв</h3>
							<p className="text-gray-600">Мы предлагаем автомобили, которые легко подходят к тест-драйву.</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-12 bg-gray-50">
				<div className="contrainer mx-auto px-4">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold">Поиск по кузову</h2>
						<Button variant="ghost" className="flex items-center" asChild>
							{user ? (
								<Link href="/cars">
									Посмотреть все <ChevronRight calcMode="ml-1 h-4 w-4" />
								</Link>
							) : (
								<Link href="/sign-in">
									Войдите, чтобы увидеть все <ChevronRight calcMode="ml-1 h-4 w-4" />
								</Link>
							)}
						</Button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4  gap-4">
						{BODY_TYPES_OBJECTS.map((type) => (
							<Link className="relative group cursor-pointer" key={type.name} href={`/cars?bodyType=${type.name}`}>
								<div className="overflow-hidden rounded-lg flex justify-end h-18 md:h-28 mb-4 relative">
									<Image
										src={type.image}
										alt={type.name}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-contain group-hover:scale-105 transition duration-300"
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
									<h3 className="text-white text-xl font-bold pl-4">{type.name}</h3>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="py-12 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>

					<Accordion type="single" collapsible className="w-full">
						{FAQ_ITEMS.map((faq, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger>{faq.question}</AccordionTrigger>
								<AccordionContent>{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>

			<section className="py-16 dotted-background text-white">
				<ReadyToFind />
			</section>
		</div>
	)
}
