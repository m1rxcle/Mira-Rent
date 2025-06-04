import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { CarPropsForSubmit } from "@/@types"
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone"
import { FieldErrors, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { TCarFormSchema } from "@/share/constants/zodSchemas/carFormSchema"
import { Button, Checkbox, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/share/ui"
import { bodyType, carStatuses, fuelType, transmissions } from "@/share/constants/data"

interface ManualEntryProps {
	addCarLoading: boolean
	errors: FieldErrors<TCarFormSchema>
	uploadedImages: string[]
	imageError: string

	handleSubmit: UseFormHandleSubmit<TCarFormSchema>
	register: UseFormRegister<TCarFormSchema>
	setValue: UseFormSetValue<TCarFormSchema>
	getValues: UseFormGetValues<TCarFormSchema>
	watch: UseFormWatch<TCarFormSchema>
	removeImage: (index: number) => void
	onSubmit: (data: CarPropsForSubmit) => Promise<void>
	getMultiImageRootProps: <T extends DropzoneRootProps>(props?: T) => T
	getMultiImageInputProps: <T extends DropzoneInputProps>(props?: T) => T
}

const ManualEntry: React.FC<ManualEntryProps> = ({
	addCarLoading,
	errors,
	uploadedImages,
	imageError,
	handleSubmit,
	register,
	setValue,
	getValues,
	watch,
	removeImage,
	onSubmit,
	getMultiImageRootProps,
	getMultiImageInputProps,
}) => {
	return (
		<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="space-y-2">
					<Label htmlFor="make">Марка</Label>
					<Input id="make" {...register("make")} placeholder="Toyota" className={errors.make ? "border-red-500" : ""} />
					{errors.make && <p className="text-xs text-red-500">{errors.make.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="model">Модель</Label>
					<Input id="model" {...register("model")} placeholder="Supra" className={errors.model ? "border-red-500" : ""} />
					{errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="year">Год</Label>
					<Input id="year" {...register("year")} placeholder="2019" className={errors.year ? "border-red-500" : ""} />
					{errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="price">Цена</Label>
					<Input id="price" {...register("price")} placeholder="100.000" className={errors.price ? "border-red-500" : ""} />
					{errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="mileage">Пробег</Label>
					<Input id="mileage" {...register("mileage")} placeholder="50" className={errors.mileage ? "border-red-500" : ""} />
					{errors.mileage && <p className="text-xs text-red-500">{errors.mileage.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="color">Цвет</Label>
					<Input id="color" {...register("color")} placeholder="Черный" className={errors.color ? "border-red-500" : ""} />
					{errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
				</div>
				<div className="space-y-2 ">
					<Label>Тип топлива</Label>
					<Select onValueChange={(value) => setValue("fuelType", value)} defaultValue={getValues("fuelType")}>
						<SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
							<SelectValue placeholder="Выберите тип топлива" />
						</SelectTrigger>
						<SelectContent>
							{fuelType.map((fuel, index) => (
								<SelectItem key={index} value={fuel}>
									{fuel}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.fuelType && <p className="text-xs text-red-500">{errors.fuelType.message}</p>}
				</div>
				<div className="space-y-2">
					<Label>Коробка передач</Label>
					<Select onValueChange={(value) => setValue("transmission", value)} defaultValue={getValues("transmission")}>
						<SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
							<SelectValue placeholder="Выберите тип коробки передач" />
						</SelectTrigger>
						<SelectContent>
							{transmissions.map((t, index) => (
								<SelectItem key={index} value={t}>
									{t}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.transmission && <p className="text-xs text-red-500">{errors.transmission.message}</p>}
				</div>
				<div className="space-y-2">
					<Label>Кузов </Label>
					<Select onValueChange={(value: string) => setValue("bodyType", value)} defaultValue={getValues("bodyType")}>
						<SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
							<SelectValue placeholder="Выберите тип кузова" />
						</SelectTrigger>
						<SelectContent>
							{bodyType.map((b) => (
								<SelectItem key={b} value={b}>
									{b}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.bodyType && <p className="text-xs text-red-500">{errors.bodyType.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="seats">
						Количество мест<span>(По желанию)</span>{" "}
					</Label>
					<Input id="seats" {...register("seats")} placeholder="4" />
				</div>

				<div className="space-y-2">
					<Label>Статус </Label>
					<Select onValueChange={(value: "AVAILABLE" | "UNAVAILABLE" | "SOLD") => setValue("status", value)} defaultValue={getValues("status")}>
						<SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
							<SelectValue placeholder="Выберите статус" />
						</SelectTrigger>
						<SelectContent>
							{carStatuses.map((s, index) => (
								<SelectItem key={index} value={s}>
									{s.charAt(0) + s.slice(1).toLowerCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Описание </Label>
				<Textarea
					id="description"
					{...register("description")}
					placeholder="Напишите описание..."
					className={`min-h-32 ${errors.description ? "border-red-500" : ""}`}
				/>
				{errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
			</div>

			<div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ">
				<Checkbox
					className="cursor-pointer"
					id="featured"
					checked={watch("featured")}
					onCheckedChange={(checked: boolean) => setValue("featured", checked)}
				/>

				<div className="space-y-1 leading-none ">
					<Label className="cursor-pointer" htmlFor="featured">
						Добавить в избранное
					</Label>
					<p className="text-sm text-gray-500">Избранное отображается на главной странице</p>
				</div>
			</div>

			<div>
				<Label className={imageError ? "text-red-500" : ""}>
					Изображения
					{imageError && <span className="text-red-500">*</span>}
				</Label>
				<div>
					<div
						{...getMultiImageRootProps()}
						className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition mt-2 ${
							imageError ? "border-red-500" : ""
						}`}
					>
						<input {...getMultiImageInputProps()} />
						<div className="flex flex-col items-center justify-center">
							<Upload className="h-12 w-12 text-gray-400 mb-3" />
							<p className="text-gray-600 text-sm">Перетащите файлы сюда или нажмите для загрузки</p>

							<p className="text-gray-500 mt-1 text-xs">(JPG,PNG,WebP, max 5MB each)</p>
						</div>
					</div>
					{imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
				</div>
			</div>

			{uploadedImages.length > 0 && (
				<div className="mt-4">
					<h3 className="text-sm font-medium mb-2">Загруженные изображения ({uploadedImages.length})</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{uploadedImages.map((image, index) => (
							<div key={index} className="relative group">
								<Image src={image} alt={`Car image ${index + 1}`} width={50} height={50} className="h-28 w-full object-contain rounded-md" priority />
								<Button
									type="button"
									size="icon"
									variant="destructive"
									className="absolute top-1 right-1 h-6 w-6 opacity-6 group-hover:opacity-100 transition-opacity"
									onClick={() => removeImage(index)}
								>
									<X className="w-3 h-3" />
								</Button>
							</div>
						))}
					</div>
				</div>
			)}

			<Button type="submit" disabled={addCarLoading} className="w-full md:w-auto">
				{addCarLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						<span>Добавление машины...</span>
					</>
				) : (
					"Добавить машину"
				)}
			</Button>
		</form>
	)
}
export default ManualEntry
