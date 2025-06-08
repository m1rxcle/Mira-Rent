import { CarProps } from "@/@types"
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/share/ui/index"
import { Loader2 } from "lucide-react"

interface DeleteCarDialogProps {
	deleteDialogOpen: boolean
	carToDelete: CarProps | null
	isDeletingCars: boolean

	setDeleteDialogOpen: (value: boolean) => void
	handleDeleteCar: () => Promise<void>
}

const DeleteCarDialog: React.FC<DeleteCarDialogProps> = ({ deleteDialogOpen, carToDelete, isDeletingCars, setDeleteDialogOpen, handleDeleteCar }) => {
	return (
		<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Подтверждение удаления</DialogTitle>
					<DialogDescription>
						Вы действительно хотите удалить машину{" "}
						<span className="font-semibold text-[14px]">
							{" "}
							{carToDelete?.make} {carToDelete?.model} ({carToDelete?.year})
						</span>{" "}
						?
						<br />
						Это действие необратимо.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeletingCars}>
						Отмена
					</Button>

					<Button variant="destructive" onClick={handleDeleteCar} disabled={isDeletingCars}>
						{isDeletingCars ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Удаление...
							</>
						) : (
							"Удалить эту машину"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
export default DeleteCarDialog
