import React from "react"

interface Props {
	orderId: number
}

export function CancelledOrderTemplate({ orderId }: Props) {
	return (
		<div>
			<h1>Ваш платеж по заказу №{orderId} был отменен.</h1>
			<h1>Попробуйте снова или обратитесь в службу поддержки.</h1>
			<hr />
			<h3>
				С уважением <span className="font-bold">© Mira Motors Team</span>
			</h3>
		</div>
	)
}
