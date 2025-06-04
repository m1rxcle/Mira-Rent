import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/share/ui/index"
import { DropzoneInputProps } from "react-dropzone"
import React from "react"

interface AiUploadProps {
	imagePreview: string | null
	loading: boolean

	setUploadedAiImage: React.Dispatch<React.SetStateAction<File | null>>
	setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
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
						<img src={imagePreview} alt="Uploaded Car" className="max-h-56 max-w-full object-contain mb-4" />

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
								Remove
							</Button>
							<Button size="sm" onClick={processWithAi} disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="animate-spin mr-2 h-4 w-4" />
										Processing...
									</>
								) : (
									<>
										<Camera className="mr-2 h-4 w-4" />
										Extract Details
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
							<p className="text-gray-600 text-sm ">Drag & drop or click to upload a car image</p>

							<p className="text-gray-500 text-xs mt-1">Supports: JPG, PNG, WebP (max 5MB)</p>
						</div>
					</div>
				)}
			</div>

			<div className="bg-gray-50 p-4 rounded-md">
				<h3 className="font-medium mb-2">How it works</h3>
				<ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
					<li>Upload a clear image of the car</li>
					<li>Click `Extract Details` to analyze with AI</li>
					<li>Review the extracted information</li>
					<li>Fill in any missing details manully</li>
					<li>Add the car to your inventory</li>
				</ol>
			</div>

			<div className="space-y-1 text-sm text-amber-700">
				<h3 className="font-medium text-amber-800 mb-1">Tips for best result</h3>
				<ul className="space-y-1 text-sm text-amber-700 list-disc marker:text-md list-inside pl-1">
					<li>Use clear, well-lit images</li>
					<li>Try to capture the entire vehicle </li>
					<li>For difficult models, use multiple views</li>
					<li>Always verify AI-extracted inforamtion</li>
				</ul>
			</div>
		</div>
	)
}
export default AiUpload
