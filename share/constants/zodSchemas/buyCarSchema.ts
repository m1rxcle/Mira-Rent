import { z } from "zod"

export const buyCarSchema = z.object({
	email: z.string().min(2, "Email is required"),
	phone: z.string().min(1, "Phone number is required"),
	address: z.string().min(1, "Address is required"),
})

export type buyCarSchemaType = z.infer<typeof buyCarSchema>
