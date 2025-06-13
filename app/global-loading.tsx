import { Loader2 } from "lucide-react"
import React from "react"

interface Props {
	className?: string
}

export const GlobalLoading: React.FC<Props> = ({ className }) => {
	return (
		<div className={`h-dvh flex items-center justify-center ${className}`}>
			<Loader2 className="animate-spin text-blue-500 w-16 h-16" />
		</div>
	)
}
