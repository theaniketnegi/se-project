import { Skeleton } from "../ui/skeleton"

const ProjectCardSkeleton = () => {
  return (
	<>
		<Skeleton className="w-full h-[200px]" />
		<Skeleton className="w-full h-[200px]" />
		<Skeleton className="w-full h-[200px]" />
		<Skeleton className="w-full h-[200px]" />
	</>
  )
}
export default ProjectCardSkeleton