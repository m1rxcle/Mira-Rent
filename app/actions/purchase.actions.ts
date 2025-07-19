"use server"

import { buyCarSchemaType } from "@/share/constants/zodSchemas/buyCarSchema"

export async function createOrder(data: buyCarSchemaType) {
	console.log(data)
}
