"use client"

import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { DeliveryAddress } from "../purchase-components/delivery-address"
import { zodResolver } from "@hookform/resolvers/zod"
import { buyCarSchema, buyCarSchemaType } from "@/share/constants/zodSchemas/buyCarSchema"
import { Button, Input, Label } from "@/share/ui"
import { createOrder } from "@/app/actions/purchase.actions"

interface Props {
	className?: string
}

export const CredentialsForm: React.FC<Props> = ({ className }) => {
	const methods = useForm<buyCarSchemaType>({
		resolver: zodResolver(buyCarSchema),
		defaultValues: {
			email: "",
			phone: "",
			address: "",
		},
	})

	const onSubmit = async (data: buyCarSchemaType) => {
		await createOrder(data)
	}
	return (
		<FormProvider<buyCarSchemaType> {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Label htmlFor="address" className="mb-1">
					Укажите ваш адрес:
				</Label>
				<DeliveryAddress />
				<Label className="mt-4" htmlFor="email">
					Ваш Email:
				</Label>
				<Input placeholder="alan.turing@gmail.com" {...methods.register("email")} className="mt-1 mb-1" />
				{methods.formState.errors.email && <p className="text-xs text-red-500">{methods.formState.errors.email.message}</p>}

				<Label htmlFor="phone" className="mt-4">
					Ваш телефон:
				</Label>
				<Input placeholder="+7 (921) 000-00-00" {...methods.register("phone")} className="mt-1 mb-1" />
				{methods.formState.errors.phone && <p className="text-xs text-red-500">{methods.formState.errors.phone.message}</p>}
				<Button type="submit" className="w-full mt-6 bg-green-600 hover:bg-green-500">
					Оплатить
				</Button>
			</form>
		</FormProvider>
	)
}
