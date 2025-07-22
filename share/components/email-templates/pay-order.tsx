import { formatCarPrice } from "@/share/constants/data"
import React from "react"

interface Props {
	orderId: number
	totalAmount: number
	paymentUrl: string
}

export function PayOrderTemplate({ orderId, totalAmount, paymentUrl }: Props) {
	return (
		<div>
			<h1>Заказ №{orderId}</h1>

			<h3>
				Оплатите заказ на сумму {formatCarPrice(totalAmount)}. Перейдите <a href={paymentUrl}>по этой ссылке</a> для оплаты заказа.
			</h3>
		</div>
	)
}
