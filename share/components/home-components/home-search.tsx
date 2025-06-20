"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { useClickAway, useDebounce } from "react-use"

import { useHomeStore } from "@/share/store/home.store"
import useFetch from "@/share/hooks/use-fetch"

import { useEffect, useRef } from "react"

import { useDropzone } from "react-dropzone"

import { Camera, Loader2, Upload } from "lucide-react"

import { toast } from "sonner"

import { processImageSearch } from "@/app/actions/home.actions"

import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { cn } from "@/lib/utils"

const HomeSearch = () => {
	const getCars = useHomeStore((state) => state.getCars)
	const searchTerm = useHomeStore((state) => state.searchTerm)
	const isImageSearchActive = useHomeStore((state) => state.isImageSearchActive)
	const imagePreview = useHomeStore((state) => state.imagePreview)
	const searchImage = useHomeStore((state) => state.searchImage)
	const isUploading = useHomeStore((state) => state.isUploading)
	const focused = useHomeStore((state) => state.focused)
	const loading = useHomeStore((state) => state.loading)

	const setSearchTerm = useHomeStore((state) => state.setSearchTerm)
	const setIsImageSearchActive = useHomeStore((state) => state.setIsImageSearchActive)
	const setImagePreview = useHomeStore((state) => state.setImagePreview)
	const setSearchImage = useHomeStore((state) => state.setSearchImage)
	const setIsUpLoading = useHomeStore((state) => state.setIsUpLoading)
	const setGetCars = useHomeStore((state) => state.setGetCars)
	const setFocused = useHomeStore((state) => state.setFocused)

	const ref = useRef(null)
	const router = useRouter()

	const { loading: isProcessing, data: processResult, error: processError, fn: processImageFn } = useFetch(processImageSearch)

	useDebounce(
		async () => {
			try {
				setGetCars(searchTerm, 5)
			} catch (error) {
				console.log(error)
				toast.error(error as string)
			}
		},
		400,
		[searchTerm]
	)

	useClickAway(ref, () => {
		setFocused(false)
	})

	const handleTextSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!searchTerm.trim()) {
			toast.error("Пожалуйста, введите поисковую фразу")
			return
		}
		router.push(`/cars?search=${encodeURIComponent(searchTerm)}`)
	}

	const handleImageSearch = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!searchImage) {
			toast.error("Загрузите картинку")
			return
		}

		await processImageFn(searchImage)
	}

	useEffect(() => {
		if (processError) {
			toast.error("Ошибка анализа картинки: " + (processError || "Unknown error"))
		}
	}, [processError])

	useEffect(() => {
		if (processResult?.success) {
			const params = new URLSearchParams()

			if (processResult.data.make) params.set("make", processResult.data.make)
			if (processResult.data.bodyType) params.set("bodyType", processResult.data.bodyType)
			if (processResult.data.color) params.set("color", processResult.data.color)

			router.push(`/cars?${params.toString()}`)
		}
	}, [processResult])

	const onDrop = (acceptedFiles: File[]) => {
		const file = acceptedFiles[0]

		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size should be less than 5MB")
				return
			}

			setIsUpLoading(true)
			setSearchImage(file)

			const reader = new FileReader()
			reader.onloadend = () => {
				setImagePreview(reader.result as string)
				setIsUpLoading(false)
				toast.success("Картинка загружена успешно")
			}

			reader.onerror = () => {
				setIsUpLoading(false)
				toast.error("Ошибка загрузки картинки")
			}

			reader.readAsDataURL(file)
		}
	}

	const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpg", ".jpeg", ".png"],
		},
		maxFiles: 1,
	})

	const onClickTerm = () => {
		setSearchTerm("")
		setGetCars("")
		setFocused(false)
	}

	return (
		<div ref={ref}>
			<form onSubmit={handleTextSubmit}>
				<div className="relative flex items-center">
					<Input
						onFocus={() => setFocused(true)}
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
						className="pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm placeholder:text-gray-300 md:placeholder:text-gray-600"
						type="text"
						placeholder="Введите марку, модель, год или загрузите картинку при помощи ИИ..."
					/>
					<div
						className={cn(
							"absolute w-full bg-white rounded-md pt-2 top-14 mt-1 shadow-md transition-all duration-300 invisible opacity-0 z-30",
							focused && "visible opacity-100 top-13 "
						)}
					>
						{loading && (
							<div className="flex items-center justify-center my-4">
								<Loader2 className="animate-spin w-5 h-5" />
							</div>
						)}
						{!loading &&
							getCars?.map((car) => (
								<div key={car.id}>
									<Link
										onClick={onClickTerm}
										href={`/cars/${car.id}`}
										className="flex items-center gap-2 px-5 mb-2 mt-2 text-center hover:bg-blue-100 h-[40px]  "
									>
										<Image src={car.images[0]} alt={`${car.make} ${car.model}`} width={50} height={60} className="object-cover" />
										<span className="font-medium ">
											{car.make} {car.model} {car.year}
										</span>
									</Link>
									<div className="h-[1px] bg-gray-200"></div>
								</div>
							))}

						{!loading && getCars?.length === 0 && (
							<div className="flex items-center justify-center my-4">
								<div className="text-center text-gray-500">
									<p>По вашему запросу ничего не найдено.</p>
								</div>
							</div>
						)}
					</div>

					<div className="absolute right-[100px] z-30">
						<Camera
							size={35}
							onClick={() => setIsImageSearchActive(!isImageSearchActive)}
							className="cursor-pointer rounded-xl p-1.5 transition-all duration-200 hover:scale-110"
							style={{
								background: isImageSearchActive ? "black" : "",
								color: isImageSearchActive ? " white" : "",
							}}
						/>
					</div>
					<Button type="submit" className="absolute right-2 rounded-full">
						Поиск
					</Button>
				</div>
			</form>
			<div></div>

			{isImageSearchActive && (
				<div className="mt-4">
					<form onSubmit={handleImageSearch}>
						<div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center">
							{imagePreview ? (
								<div className="flex flex-col items-center ">
									<img src={imagePreview} alt="Car preview" className="h-40 object-contain mb-4" />
									<Button
										variant="outline"
										onClick={() => {
											setSearchImage(null)
											setImagePreview("")
											toast.info("Image removed")
										}}
									>
										Удалить изображение
									</Button>
								</div>
							) : (
								<div {...getRootProps()} className="cursor-pointer">
									<input {...getInputProps()} />
									<div className="flex flex-col items-center">
										<Upload className="h-12 w-12 text-gray-400 mb-2" />
										<p className="text-gray-500 mb-2">
											{isDragActive && !isDragReject ? "Leave the file here to upload" : "Перетащите файл сюда или нажмите что бы выбрать файлы"}
										</p>
										{isDragReject && <p className="text-red-500 mb-2">Invalid image type</p>}
										<p className="text-gray-500 text-sm">Supports: JPG, PNG (max 5MB)</p>
									</div>
								</div>
							)}
						</div>

						{imagePreview && (
							<Button type="submit" className="w-full mt-4" disabled={isUploading || isProcessing}>
								{isUploading ? "Загрузка..." : isProcessing ? "Анализ..." : "Поиск с картинки"}
							</Button>
						)}
					</form>
				</div>
			)}
		</div>
	)
}
export default HomeSearch
