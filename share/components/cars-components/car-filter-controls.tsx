import { CurrentFiltersProps } from "@/@types"
import { Badge, Slider } from "@/share/ui/index"
import { Check, X } from "lucide-react"

interface CarFilterControlProps {
	filters: {
		makes: string[]
		bodyTypes: string[]
		fuelTypes: string[]
		transmissions: string[]
		priceRange: {
			min: number
			max: number
		}
	}
	currentFilters: CurrentFiltersProps
	onFilterChange: (filterName: string, value: any) => void
	onClearFilter: (filterName: string) => void
}

const CarFilterControls = ({ filters, currentFilters, onFilterChange, onClearFilter }: CarFilterControlProps) => {
	const { make, bodyType, fuelType, transmission, priceRange } = currentFilters

	const filterSection = [
		{
			id: "make",
			title: "Марка",
			options: filters.makes.map((make) => ({ value: make, label: make })),
			currentValue: make,
			onChange: (value: string) => onFilterChange("make", value),
		},
		{
			id: "bodyType",
			title: "Кузов",
			options: filters.bodyTypes.map((bodyType) => ({ value: bodyType, label: bodyType })),
			currentValue: bodyType,
			onChange: (value: string) => onFilterChange("bodyType", value),
		},
		{
			id: "fuelType",
			title: "Топливо",
			options: filters.fuelTypes.map((fuelType) => ({ value: fuelType, label: fuelType })),
			currentValue: fuelType,
			onChange: (value: string) => onFilterChange("fuelType", value),
		},
		{
			id: "transmission",
			title: "Коробка передач",
			options: filters.transmissions.map((transmission) => ({ value: transmission, label: transmission })),
			currentValue: transmission,
			onChange: (value: string) => onFilterChange("transmission", value),
		},
	]

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h3 className="font-medium">Цена</h3>
				<div className="px-2">
					<Slider
						min={filters.priceRange.min}
						max={filters.priceRange.max}
						step={100}
						value={priceRange}
						onValueChange={(value) => {
							onFilterChange("priceRange", priceRange)
						}}
					/>
				</div>
				<div className="flex items-center justify-between">
					<div className="font-medium text-sm">$ {priceRange[0]}</div>
					<div className="font-medium text-sm">$ {priceRange[1]}</div>
				</div>
			</div>

			{filterSection.map((section) => (
				<div key={section.id} className="space-y-3">
					<h4 className="text-sm font-medium flex justify-between items-center">
						<span>{section.title}</span>
						{section.currentValue && (
							<button className="text-sm text-gray-600 flex items-center cursor-pointer" onClick={() => onClearFilter(section.id)}>
								<X className="mr-1 h-3 w-3" />
								Очистить
							</button>
						)}
					</h4>

					<div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
						{section.options.map((option) => (
							<Badge
								variant={section.currentValue === option.value ? "default" : "outline"}
								key={option.value}
								className={`cursor-pointer px-2  py-1 ${
									section.currentValue === option.value
										? "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-200"
										: "bg-white hover:bg-gray-100 text-gray-700"
								}`}
								onClick={() => {
									section.onChange(section.currentValue === option.value ? "" : option.value)
								}}
							>
								{" "}
								{option.label} {section.currentValue === option.value && <Check className="h-3 w-3 inline" />}{" "}
							</Badge>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
export default CarFilterControls
