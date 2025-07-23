import { IPurchaseForAdmin } from "@/@types"
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/share/ui/index"
import { Loader2 } from "lucide-react"

interface DeleteOrderDialogProps {
	openDialog: boolean
	purchase: IPurchaseForAdmin | null
	loading: boolean

	setOpenDialog: (value: boolean) => void
	handleDeleteOrder: (id: number) => Promise<void>
}

const DeleteOrderDialog: React.FC<DeleteOrderDialogProps> = ({ openDialog, purchase, loading, setOpenDialog, handleDeleteOrder }) => {
	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Подтверждение удаления</DialogTitle>
					<DialogDescription>
						Вы действительно хотите удалить заказ на{" "}
						<span className="font-semibold text-[14px]">
							{" "}
							{purchase?.car.make} {purchase?.car.model} ({purchase?.car.year})
						</span>{" "}
						от <span className="font-semibold text-[14px]">{purchase?.user.name}</span>
						?
						<br />
						Это действие необратимо.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpenDialog(false)} loading={loading}>
						Отмена
					</Button>

					<Button
						variant="destructive"
						onClick={() => {
							if (purchase) {
								handleDeleteOrder(purchase.id)
							}
						}}
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Удаление...
							</>
						) : (
							"Удалить этот заказ"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
export default DeleteOrderDialog
