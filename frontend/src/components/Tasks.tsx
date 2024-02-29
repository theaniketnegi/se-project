import { ScrollArea } from './ui/scroll-area';
import { TaskType, UserType } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TaskModal } from './Task/TaskModal';
import CreateButton from './CreateButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';
import { Route, Routes, useLocation } from 'react-router-dom';
import TasksView from './TasksView';
import { sortTasksByPriority } from '@/lib/sort';

const formattedDate = new Date().toISOString().split('T')[0];

const Tasks = ({ user }: { user: UserType }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const newTaskMutation = useMutation({
        mutationFn: (task: {
            title: string;
            due_date: string;
            priority: string;
        }) =>
            axios
                .post('/api/tasks', task, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then((res) => res.data),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error creating task',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (newTask: TaskType) => {
            const fetchTasks: TaskType[] = queryClient.getQueryData([
                'tasks',
            ]) as TaskType[];
            queryClient.setQueryData(
                ['tasks'],
                sortTasksByPriority(fetchTasks.concat(newTask)),
            );
        },
    });

    const fetchedTasks = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            try {
                const response = await axios.get('/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                const data = response.data;
                return sortTasksByPriority(data);
            } catch (err) {
                const error = err as { response: { data: { err: string } } };
                toast({
                    variant: 'destructive',
                    title: 'Error fetching data',
                    description: error.response.data.err
                        ? `${error.response.data.err}`
                        : 'Error connecting',
                });
                throw new Error(error.response.data.err);
            }
        },
        retry: false,
    });

    const [showModal, setShowModal] = useState<boolean>(false);
    const [todaysTasks, setTodaysTasks] = useState<TaskType[]>([]);

    const onAddTask = async (
        title: string,
        due_date: string,
        priority: string,
    ) => {
        newTaskMutation.mutate({ title, due_date, priority });

        if (due_date === formattedDate) {
            // setTasks((prevTasks) =>
            //     prevTasks ? prevTasks.concat(response.data) : response.data,
            // );
        }
        setShowModal(false);
    };
    useEffect(() => {
        setTodaysTasks(
            fetchedTasks.data?.filter(
                (task) =>
                    task.due_date.toString().split('T')[0] === formattedDate,
            ) as TaskType[],
        );
    }, [fetchedTasks.data, fetchedTasks.isPending]);

    const location = useLocation();
    const params = location.pathname.replace('/', '');

    const tasks: TaskType[] = fetchedTasks.data as TaskType[];

    return (
        <>
            {showModal && (
                <TaskModal
                    onCloseModal={() => setShowModal(false)}
                    onAddTask={onAddTask}
                />
            )}
            <div className='w-[90%] p-8 mx-auto flex flex-col space-y-8'>
                <div className='w-full space-y-4 mt-4'>
                    <h1 className='text-5xl font-bold'>
                        {params === 'today' ? "Today's tasks" : 'All tasks'}
                    </h1>
                    <div className='border-t-2 border-zinc-700/20 w-full'></div>
                </div>
                <CreateButton
                    className='w-24 py-1 px-2 ml-auto flex justify-around items-center'
                    onClick={() => setShowModal(true)}
                    text='New task'
                />
                <div className='w-full h-full'>
                    <ScrollArea className='h-[600px] p-4 border-2 border-zinc-700/20 rounded-md'>
                        <div className='space-y-4'>
                            <Routes>
                                <Route
                                    path='/today'
                                    element={
                                        <TasksView
                                            user={user}
                                            tasks={todaysTasks}
                                        />
                                    }
                                />
                                <Route
                                    path='/all'
                                    element={
                                        <TasksView user={user} tasks={tasks} />
                                    }
                                />
                            </Routes>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </>
    );
};
export default Tasks;
