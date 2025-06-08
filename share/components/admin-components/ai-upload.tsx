import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/share/ui/index"
import { DropzoneInputProps } from "react-dropzone"
import React from "react"
import { cn } from "@/lib/utils"

interface AiUploadProps {
	imagePreview: string | null
	loading: boolean

	setUploadedAiImage: (value: File | null) => void
	setImagePreview: (value: string | null) => void
	processWithAi: () => Promise<void>
	getAiRootProps: <T extends DropzoneInputProps>(props?: T) => T
	getAiInputProps: <T extends DropzoneInputProps>(props?: T) => T
}

const AiUpload: React.FC<AiUploadProps> = ({
	imagePreview,
	loading,
	setUploadedAiImage,
	setImagePreview,
	processWithAi,
	getAiRootProps,
	getAiInputProps,
}) => {
	return (
		<div className="space-y-6">
			<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
				{imagePreview ? (
					<div className="flex flex-col items-center">
						<img src={imagePreview} alt="Uploaded Car" className={cn("max-h-56 max-w-full object-contain mb-4", loading ? "opacity-50" : "")} />

						<div className="flex gap-2">
							<Button
								disabled={loading}
								variant="outline"
								size="sm"
								onClick={() => {
									setImagePreview(null)
									setUploadedAiImage(null)
								}}
							>
								Удалить
							</Button>
							<Button size="sm" onClick={processWithAi} disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="animate-spin mr-2 h-4 w-4" />
										Обработка...
									</>
								) : (
									<>
										<Camera className="mr-2 h-4 w-4" />
										Загрузить данные
									</>
								)}
							</Button>
						</div>
					</div>
				) : (
					<div {...getAiRootProps()} className="cursor-pointer ">
						<input {...getAiInputProps()} />
						<div className="flex flex-col items-center justify-center">
							<Camera className="h-12 w-12 text-gray-400 mb-2" />
							<p className="text-gray-600 text-sm ">Перетащите или нажмите для загрузки изображения</p>

							<p className="text-gray-500 text-xs mt-1">Поддерживает: JPG, PNG, WebP (max 5MB)</p>
						</div>
					</div>
				)}
			</div>

			<div className="bg-gray-50 p-4 rounded-md">
				<h3 className="font-medium mb-2">Как это работает</h3>
				<ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
					<li>Загрузите чистое изображение без лишних деталей</li>
					<li>Нажмите `Загрузить данные` что бы ИИ извлек информацию</li>
					<li>Проверьте извлеченную информацию</li>
					<li>Заполните недостающие поля</li>
					<li>Добавьте машину в ваш список</li>
				</ol>
			</div>

			<div className="space-y-1 text-sm text-amber-700">
				<h3 className="font-medium text-amber-800 mb-1">Подказки для лучшего результата:</h3>
				<ul className="space-y-1 text-sm text-amber-700 list-disc marker:text-md list-inside pl-1">
					<li>Используйте чистое изображение, без лишних деталей</li>
					<li>Пробуйте захватить все машину</li>
					<li>Для сложных моделей используйте несколько видов.</li>
					<li>Всегда проверяйте информацию, полученную с помощью ИИ</li>
				</ul>
			</div>
		</div>
	)
}
export default AiUpload
