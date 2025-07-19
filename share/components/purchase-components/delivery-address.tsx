import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { AddressInput } from "./address-input"

export const DeliveryAddress: React.FC = () => {
	const { control } = useFormContext()
	return (
		<div>
			<Controller
				control={control}
				name="address"
				render={({ field, fieldState }) => (
					<>
						<AddressInput onChange={field.onChange} />
						{fieldState.error?.message && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
					</>
				)}
			></Controller>
		</div>
	)
}
