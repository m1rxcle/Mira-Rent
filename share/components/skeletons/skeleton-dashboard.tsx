import { Skeleton } from "@/share/ui"

const SkeletonDashboard = () => {
	return (
		<div>
			<div>
				<Skeleton className="w-40 h-8 mb-5" />
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:gird-cols-4 mb-10">
				<div>
					<Skeleton className="h-44 w-full md:w-[800px]" />
				</div>
				<div>
					<Skeleton className="h-44 w-full  md:w-[800px]" />
				</div>
				<div>
					<Skeleton className="h-44 w-full  md:w-[800px]" />
				</div>
				<div>
					<Skeleton className="h-44 w-full  md:w-[800px]" />
				</div>
			</div>
			<div>
				<div>
					<Skeleton className="h-52 w-full" />
				</div>
			</div>
		</div>
	)
}
export default SkeletonDashboard
