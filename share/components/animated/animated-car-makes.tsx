import { CAR_MAKES } from "@/share/constants/data"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface Props {
	className?: string
}

export const AnimatedCarMakes: React.FC<Props> = ({ className }) => {
	return (
		<div className="overflow-hidden mask">
			<div className="flex gap-10 infinite-scroll will-change-transform">
				{[...CAR_MAKES, ...CAR_MAKES].map((make, index) => (
					<Link
						className="min-w-[200px] bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
						key={make.name + index}
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
	)
}
