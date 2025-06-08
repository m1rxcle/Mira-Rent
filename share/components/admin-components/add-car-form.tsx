"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@/share/ui/index"
import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import useFetch from "@/share/hooks/use-fetch"
import { processCarImageWithAi } from "@/app/actions/cars.actions"

import { CarPropsForSubmit } from "@/@types"
import React from "react"
import { addCar } from "@/app/actions/cars.actions"
import { useRouter } from "next/navigation"
import { carFormSchema, TCarFormSchema } from "@/share/constants/zodSchemas/carFormSchema"
import ManualEntry from "./manual-entry"
import AiUpload from "./ai-upload"
import { useAdminStore } from "@/share/store/admin.store"

const AddCarForm = () => {
	const activeTab = useAdminStore((state) => state.activeTab)
	const imagePreivew = useAdminStore((state) => state.imagePreivew)
	const uploadedAiImage = useAdminStore((state) => state.uploadedAiImage)
	const uploadedImages = useAdminStore((state) => state.uploadedImages)
	const imageError = useAdminStore((state) => state.imageError)

	const setActiveTab = useAdminStore((state) => state.setActiveTab)
	const setImagePreview = useAdminStore((state) => state.setImagePreview)
	const setUploadedImages = useAdminStore((state) => state.setUploadedImages)
	const setUploadedAiImage = useAdminStore((state) => state.setUploadedAiImage)
	const setImageError = useAdminStore((state) => state.setImageError)

	const { loading, fn, data, error } = useFetch(processCarImageWithAi)

	const router = useRouter()

	const { data: addCarResult, loading: addCarLoading, fn: addCarFn } = useFetch(addCar)

	useEffect(() => {
		if (addCarResult?.success) {
			toast.success("Машина добавлена успешно")
			router.push("/admin/cars")
		}
	}, [addCarResult, addCarLoading])

	const {
		register,
		setValue,
		getValues,
		formState: { errors },
		handleSubmit,
		watch,
	} = useForm<TCarFormSchema>({
		resolver: zodResolver(carFormSchema),
		defaultValues: {
			make: "",
			model: "",
			year: "",
			price: "",
			mileage: "",
			color: "",
			fuelType: "",
			transmission: "",
			bodyType: "",
			seats: "",
			description: "",
			status: "AVAILABLE",
			featured: false,
		},
	})

	const onSubmit = async (data: CarPropsForSubmit) => {
		if (uploadedImages.length === 0) {
			toast.error("Пожалуйста загрузите хотя бы одну картинку")
			return
		}

		const carData = {
			...data,
			year: parseInt(data.year),
			price: parseFloat(data.price),
			mileage: parseInt(data.mileage),
			seats: data.seats ? parseInt(data.seats) : null,
		}

		await addCarFn({ carData, images: uploadedImages })
	}

	const removeImage = (index: number) => {
		setUploadedImages((prev: string[]) => prev.filter((_, i) => i !== index))
		toast.success("Картинка удалена успешно")
	}

	const onMultiImagesDrop = (acceptedFiles: File[]) => {
		const validFiles = acceptedFiles.filter((file) => {
			if (file.size > 5 * 1024 * 1024) {
				toast.error(`${file.name} exceeds 5MB size limit and will be skipped.`)
				return false
			}
			return true
		})

		if (validFiles.length === 0) return

		const newImages: string[] = []
		validFiles.forEach((file) => {
			const reader = new FileReader()
			reader.onload = (e: ProgressEvent<FileReader>) => {
				if (!e.target) return

				newImages.push(e.target.result as string)

				if (newImages.length === validFiles.length) {
					setUploadedImages((prev) => [...prev, ...newImages])
					toast.success(`Успешно загружено ${validFiles.length} картинок`)
				}
			}

			reader.readAsDataURL(file)
		})
	}

	const { getRootProps: getMultiImageRootProps, getInputProps: getMultiImageInputProps } = useDropzone({
		onDrop: onMultiImagesDrop,
		accept: {
			"image/*": [".jpg", ".jpeg", ".png", ".webp"],
		},
		multiple: true,
	})

	const onAiDrop = (acceptedFiles: File[]) => {
		const file = acceptedFiles[0]

		console.log("[onAiDrop] acceptedFiles[0]:", file)
		console.log("[onAiDrop] typeof file:", typeof file)

		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size should be less than 5MB")
				return
			}
		}

		setUploadedAiImage(file)

		const reader = new FileReader()
		reader.onload = (e: ProgressEvent<FileReader>) => {
			setImagePreview(e.target?.result as string)
			toast.success("Картинка загружена успешно")
		}

		reader.readAsDataURL(file)
	}

	const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } = useDropzone({
		onDrop: onAiDrop,
		accept: {
			"image/*": [".jpg", ".jpeg", ".png", ".webp"],
		},
		maxFiles: 1,
		multiple: false,
	})

	const processWithAi = async () => {
		if (!uploadedAiImage) {
			setImageError("Пожалуйста загрузите картинку")
			return
		}

		await fn(uploadedAiImage)
	}

	useEffect(() => {
		if (error) {
			toast.error(error || "Ошибка загрузки картинки")
		}
	}, [error])

	useEffect(() => {
		if (data?.success) {
			const carDetails = data.data
			setValue("make", carDetails.make)
			setValue("model", carDetails.model)
			setValue("year", carDetails.year.toString())
			setValue("color", carDetails.color)
			setValue("bodyType", carDetails.bodyType)
			setValue("fuelType", carDetails.fuelType)
			setValue("price", carDetails.price.toString())
			setValue("mileage", carDetails.mileage.toString())
			setValue("transmission", carDetails.transmission)
			setValue("description", carDetails.description || "")

			if (uploadedAiImage instanceof Blob) {
				const reader = new FileReader()
				reader.onload = (e) => {
					setUploadedImages((prev) => [...prev, e.target?.result as string])
				}
				reader.readAsDataURL(uploadedAiImage)
			}
			toast.success("Успешно обработаны детали ", {
				description: `Detected ${data?.data.year} ${data?.data.make} ${data?.data.model} с ${Math.round(
					(data?.data.confidence as number) * 100
				)}% уверенности`,
			})

			setActiveTab("manual")
		}
	}, [data, uploadedAiImage, setValue])

	return (
		<div className="z-50 mb-20 md:mb-0 ">
			<Tabs defaultValue="ai" className="mt-6 " value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2 ">
					<TabsTrigger value="manual" className="cursor-pointer">
						Ручная загрузка
					</TabsTrigger>
					<TabsTrigger value="ai" className="cursor-pointer">
						Загрузка при помощи ИИ
					</TabsTrigger>
				</TabsList>
				<TabsContent value="manual" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Детали машины</CardTitle>
							<CardDescription>Введите детали машины</CardDescription>
						</CardHeader>
						<CardContent>
							<ManualEntry
								addCarLoading={addCarLoading}
								errors={errors}
								getMultiImageInputProps={getMultiImageInputProps}
								getMultiImageRootProps={getMultiImageRootProps}
								imageError={imageError}
								removeImage={removeImage}
								setValue={setValue}
								uploadedImages={uploadedImages}
								watch={watch}
								getValues={getValues}
								handleSubmit={handleSubmit}
								register={register}
								onSubmit={onSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="ai" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Обработать детали при помощи ИИ</CardTitle>
							<CardDescription>Загрузите картинку машины чтобы ИИ обработал ее</CardDescription>
						</CardHeader>
						<CardContent>
							<AiUpload
								getAiInputProps={getAiInputProps}
								getAiRootProps={getAiRootProps}
								imagePreview={imagePreivew}
								loading={loading}
								processWithAi={processWithAi}
								setUploadedAiImage={setUploadedAiImage}
								setImagePreview={setImagePreview}
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
export default AddCarForm
