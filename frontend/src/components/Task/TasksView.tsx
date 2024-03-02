import { TaskType, UserType } from '@/types';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';

const TasksView = ({ tasks, user }: { tasks: TaskType[]; user: UserType }) => {
    return (
        <>
            {tasks ? (
                tasks.map((task) => <TaskCard user={user} task={task} key={task._id} />)
            ) : (
                <TaskCardSkeleton />
            )}
        </>
    );
};
export default TasksView;
