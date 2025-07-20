import React from "react"

interface Props {
	orderId: number
}

export function CancelledOrderTemplate({ orderId }: Props) {
	return (
		<div>
			<h1>Ваш платеж по заказу №{orderId} был отменен. Попробуйте снова или обратитесь в службу поддержки.</h1>
			<hr />
			<p>
				С уважением <span className="font-bold">© Mira Motors Team</span>
			</p>
		</div>
	)
}
