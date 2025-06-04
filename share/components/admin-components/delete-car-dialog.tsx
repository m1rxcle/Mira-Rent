import { CarProps } from "@/@types"
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/share/ui/index"
import { Loader2 } from "lucide-react"
import { SetStateAction } from "react"

interface DeleteCarDialogProps {
	deleteDialogOpen: boolean
	carToDelete: CarProps | null
	isDeletingCars: boolean

	setDeleteDialogOpen: React.Dispatch<SetStateAction<boolean>>
	handleDeleteCar: () => Promise<void>
}

const DeleteCarDialog: React.FC<DeleteCarDialogProps> = ({ deleteDialogOpen, carToDelete, isDeletingCars, setDeleteDialogOpen, handleDeleteCar }) => {
	return (
		<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm Deletion</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete{" "}
						<span className="font-semibold text-[14px]">
							{" "}
							{carToDelete?.make} {carToDelete?.model} ({carToDelete?.year})
						</span>{" "}
						?
						<br />
						This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeletingCars}>
						Cancel
					</Button>

					<Button variant="destructive" onClick={handleDeleteCar} disabled={isDeletingCars}>
						{isDeletingCars ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							"Delete this Car"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
export default DeleteCarDialog
