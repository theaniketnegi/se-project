import { Skeleton } from '../ui/skeleton';

const TaskCardSkeleton = () => {
    return (
        <>
            <Skeleton className='p-4 border-l-8 rounded-lg shadow-sm h-[130px] md:h-24 lg:h-14 flex justify-between' />
            <Skeleton className='p-4 border-l-8 rounded-lg shadow-sm h-[130px] md:h-24 lg:h-14 flex justify-between' />
            <Skeleton className='p-4 border-l-8 rounded-lg shadow-sm h-[130px] md:h-24 lg:h-14 flex justify-between' />
            <Skeleton className='p-4 border-l-8 rounded-lg shadow-sm h-[130px] md:h-24 lg:h-14 flex justify-between' />
            <Skeleton className='p-4 border-l-8 rounded-lg shadow-sm h-[130px] md:h-24 lg:h-14 flex justify-between' />
            <Skeleton className='p-4 border-l-8 rounded-lg shadow-sm h-[130px] md:h-24 lg:h-14 flex justify-between' />
        </>
    );
};
export default TaskCardSkeleton;
