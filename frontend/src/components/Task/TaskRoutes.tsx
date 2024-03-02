import { Route, Routes } from 'react-router-dom';
import TasksView from './TasksView';
import { TaskType, UserType } from '@/types';

const TaskRoutes = ({
    user,
    todaysTasks,
    tasks,
}: {
    user: UserType;
    todaysTasks: TaskType[];
    tasks: TaskType[];
}) => {
    return (
        <Routes>
            <Route
                path='/today'
                element={<TasksView user={user} tasks={todaysTasks} />}
            />
            <Route
                path='/all'
                element={<TasksView user={user} tasks={tasks} />}
            />
        </Routes>
    );
};
export default TaskRoutes;
