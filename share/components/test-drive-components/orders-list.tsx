import { TOrdersProps } from "@/@types"
import UserOrdersCard from "./user-orders-card"

const OrdersList = ({ userOrders }: { userOrders: TOrdersProps }) => {
	return (
		<div className="space-y-6">
			<div>
				<div className="space-y-3 ">
					<UserOrdersCard orders={userOrders} />
				</div>
			</div>
		</div>
	)
}
export default OrdersList
