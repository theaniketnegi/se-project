import { TaskType, UserType } from '@/types';
import TaskCard from './Task/TaskCard';
import TaskCardSkeleton from './Task/TaskCardSkeleton';

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
