import { z } from "zod"

export const buyCarSchema = z.object({
	carId: z.string(),
	email: z.string().min(5, "Email is required"),
	phone: z.string().min(10, "Phone number is required"),
	address: z.string().min(5, "Address is required"),
})

export type buyCarSchemaType = z.infer<typeof buyCarSchema>
