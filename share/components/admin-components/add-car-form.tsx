"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@/share/ui/index"
import { useEffect, useState } from "react"

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

const AddCarForm = () => {
	const [activeTab, setActiveTab] = useState("ai")
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [uploadedAiImage, setUploadedAiImage] = useState<File | null>(null)

	const [uploadedImages, setUploadedImages] = useState<string[]>([])
	const [imageError, setImageError] = useState("")

	const { loading, fn, data, error } = useFetch(processCarImageWithAi)

	const router = useRouter()

	const { data: addCarResult, loading: addCarLoading, fn: addCarFn } = useFetch(addCar)

	useEffect(() => {
		if (addCarResult?.success) {
			toast.success("Car added successfully")
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
			setImageError("Please upload at least one image")
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
		setUploadedImages((prev) => prev.filter((_, i) => i !== index))
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
					setImageError("")
					toast.success(`Successfully uploaded ${validFiles.length} images`)
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
			toast.success("Image uploaded successfully")
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
			toast.error("Please upload an image first")
			return
		}

		await fn(uploadedAiImage)
	}

	useEffect(() => {
		if (error) {
			toast.error(error || "Failed to upload image")
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
			toast.success("Successfully extracted car details ", {
				description: `Detected ${data?.data.year} ${data?.data.make} ${data?.data.model} with ${Math.round(
					(data?.data.confidence as number) * 100
				)}% confidence`,
			})

			setActiveTab("manual")
		}
	}, [data, uploadedAiImage, setValue])

	return (
		<div className="z-50 mb-20 md:mb-0 ">
			<Tabs defaultValue="ai" className="mt-6 " value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2 ">
					<TabsTrigger value="manual" className="cursor-pointer">
						Manual Entry
					</TabsTrigger>
					<TabsTrigger value="ai" className="cursor-pointer">
						AI Upload
					</TabsTrigger>
				</TabsList>
				<TabsContent value="manual" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Car Details</CardTitle>
							<CardDescription>Enter the details of the car</CardDescription>
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
							<CardTitle>AI-Powered Car Details Extraction</CardTitle>
							<CardDescription>Upload an image of the car and let AI extract its details</CardDescription>
						</CardHeader>
						<CardContent>
							<AiUpload
								getAiInputProps={getAiInputProps}
								getAiRootProps={getAiRootProps}
								imagePreview={imagePreview}
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
