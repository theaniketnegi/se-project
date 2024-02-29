import { TaskType } from "@/types";
import TaskCard from "./Task/TaskCard";
import TaskCardSkeleton from "./Task/TaskCardSkeleton";

const TasksView = ({tasks}:{tasks:TaskType[]}) => {
    return (
        <>
            {tasks ? (
                tasks.map((task) => <TaskCard task={task} key={task._id} />)
            ) : (
                <TaskCardSkeleton />
            )}
        </>
    );
};
export default TasksView;
