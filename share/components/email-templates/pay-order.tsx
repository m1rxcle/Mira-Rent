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

			<p>
				Оплатите заказ на сумму ${totalAmount}. Перейдите <a href={paymentUrl}>по этой ссылке</a> для оплаты заказа.
			</p>
		</div>
	)
}
