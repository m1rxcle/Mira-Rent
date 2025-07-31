import { IExceptCars } from "@/@types"
import React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/share/ui/carousel"
import CarCard from "./car-card"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
interface Props {
	exceptCars: IExceptCars[]
	loading: boolean
}

export const CarouseAlikeCars: React.FC<Props> = ({ exceptCars, loading }) => {
	return (
		<div className="mt-8 py-4 px-2 md:p-6  bg-white rounded-lg shadow-sm border">
			<h5 className="text-2xl font-bold">Похожие автомобили</h5>
			<div className="w-full mt-10 ">
				{loading ? (
					<div className="flex justify-center items-center h-40">
						<div className="rounded-full ">
							<Loader2 className="animate-spin text-blue-500 w-16 h-16" />
						</div>
					</div>
				) : (
					<Carousel className="mx-8 md:mx-10 mb-10 cursor-grab">
						<CarouselContent>
							{exceptCars?.map((car) => (
								<CarouselItem
									className={cn(
										"",
										exceptCars.length === 1
											? "basis-full md:basis-1/3"
											: exceptCars.length === 2
												? "basis-full md:basis-1/2"
												: "basis-full md:basis-1/3"
									)}
									key={car.id}
								>
									<CarCard car={car} />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				)}
			</div>
		</div>
	)
}
