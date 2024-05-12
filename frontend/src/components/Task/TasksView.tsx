import { TaskType, UserType } from '@/types';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';
import { useEffect, useState } from 'react';

const TasksView = ({ tasks, user }: { tasks: TaskType[]; user: UserType }) => {
    const [otherTasks, setOtherTasks] = useState<TaskType[]>([]);
    const [dueTasks, setDueTasks] = useState<TaskType[]>([]);
    const [doneTasks, setDoneTasks] = useState<TaskType[]>([]);
    useEffect(() => {
        if (tasks) {
            const today = new Date().setUTCHours(0, 0, 0, 0);

            const filteredTasks: (TaskType & { isDue?: boolean })[] = tasks.map(
                (task) => {
                    return new Date(task.due_date).setUTCHours(0, 0, 0, 0) <
                        today
                        ? { ...task, isDue: true }
                        : task;
                },
            );

            setDueTasks(
                filteredTasks.filter((task) => task.isDue && !task.done),
            );
            setOtherTasks(
                filteredTasks.filter((task) => !task.done && !task.isDue),
            );
            setDoneTasks(filteredTasks.filter((task) => task.done));
        }
    }, [tasks]);
    return (
        <>
            {dueTasks &&
                dueTasks.map((task) => (
                    <TaskCard user={user} task={task} key={task._id} pending={true} />
                ))}
            {otherTasks ? (
                otherTasks.map((task) => (
                    <TaskCard user={user} task={task} key={task._id} />
                ))
            ) : (
                <TaskCardSkeleton />
            )}
            {doneTasks &&
                doneTasks.map((task) => (
                    <TaskCard user={user} task={task} key={task._id} />
                ))}
        </>
    );
};
export default TasksView;
