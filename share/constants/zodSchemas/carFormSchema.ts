import { z } from "zod"

export const carFormSchema = z.object({
	make: z.string().min(1, "Make is required"),
	model: z.string().min(1, "Model is required"),
	year: z.string().refine((val) => {
		const year = parseInt(val)

		return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1
	}, "Valid year required"),
	price: z.string().min(1, "Price is required"),
	mileage: z.string().min(1, "Mileage is required"),
	color: z.string().min(1, "Color is required"),
	fuelType: z.string().min(1, "Fuel type is required"),
	transmission: z.string().min(1, "Transmission is required"),
	bodyType: z.string().min(1, "Body type is required"),
	seats: z.string().optional(),
	description: z.string().min(10, "Description must be at least 10 characters long"),
	status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
	featured: z.boolean(),
})

export type TCarFormSchema = z.infer<typeof carFormSchema>
