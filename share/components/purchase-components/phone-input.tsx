"use client"

import { cn } from "@/lib/utils"
import { formatPhoneNumber } from "@/share/constants/data"
import React, { useCallback, useRef } from "react"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	register?: any // принимаем register из React Hook Form
}

export const PhoneInput: React.FC<Props> = ({ className, type, register, ...props }) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const formattedValue = formatPhoneNumber(e.target.value)
			if (inputRef.current) {
				inputRef.current.value = formattedValue
			}
			props.onChange?.(e) // передаем оригинальное событие дальше
		},
		[props]
	)
	return (
		<input
			ref={inputRef}
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className
			)}
			{...props}
			{...register}
			onChange={handleChange}
		/>
	)
}

export default PhoneInput
