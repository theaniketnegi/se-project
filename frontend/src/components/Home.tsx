import { useUserStore } from '@/store/userStore';
import { Navigate, Routes } from 'react-router-dom';
import { GoSignOut } from 'react-icons/go';
import { IconContext } from 'react-icons/lib';
import { IoTodayOutline } from 'react-icons/io5';
import { FaTasks } from 'react-icons/fa';
import { GrProjects } from 'react-icons/gr';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScrollArea } from './ui/scroll-area';
import { TaskType } from '@/types';
import TaskCard from './Task/TaskCard';
import { Button } from './ui/button';
import { TaskModal } from './Task/TaskModal';

const Home = () => {
    const user = useUserStore((state) => state.user);
    const [showModal, setShowModal] = useState<boolean>(false);
    const signoutUser = useUserStore((state) => state.signout);
    const [tasks, setTasks] = useState<TaskType[] | null>(null);
    const getTodaysTask = async () => {
        const response = await axios.get('/api/tasks/today', {
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        });

        setTasks(response.data);
    };

    useEffect(() => {
        async function getTasks() {
            await getTodaysTask();
        }
        getTasks();
    }, []);

    const onAddTask = async (
        title: string,
        due_date: string,
        priority: string,
    ) => {
        const response = await axios.post(
            '/api/tasks',
            {
                title,
                due_date,
                priority,
            },
            {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            },
        );
        setTasks((prevTasks) =>
            prevTasks ? prevTasks.concat(response.data) : response.data,
        );
        setShowModal(false);
    };
    if (user === null) return <Navigate to={'/login'} />;

    return (
        <IconContext.Provider value={{ color: 'white', size: 'auto' }}>
            {showModal && (
                <TaskModal
                    onCloseModal={() => setShowModal(false)}
                    onAddTask={onAddTask}
                />
            )}
            <div className='h-full flex'>
                <div className='h-full w-[300px] bg-zinc-900 p-4 text-white'>
                    <div className='h-full flex flex-col justify-between'>
                        <div className='flex flex-col space-y-16'>
                            <div className='space-y-4'>
                                <div className='text-4xl font-bold select-none'>
                                    Task Management
                                </div>
                                <div className='border-t-2 border-zinc-700/90 w-full'></div>
                            </div>
                            <div className='text-xl space-y-4'>
                                <div className='p-4 pl-1 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center'>
                                    <IoTodayOutline className='w-5' />
                                    Today's tasks
                                </div>
                                <div className='p-4 pl-1 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center'>
                                    <FaTasks className='w-5' />
                                    All tasks
                                </div>
                                <div className='p-4 pl-1 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center'>
                                    <GrProjects className='w-5' />
                                    Projects
                                </div>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className='border-t-2 border-zinc-700/90 w-full'></div>
                            <div className='flex justify-between'>
                                <div className='space-y-1'>
                                    <div className='text-xl font-bold'>
                                        {user.name}
                                    </div>
                                    <div className='text-sm text-gray-400'>
                                        Section: {user.section}
                                    </div>
                                    <div className='text-sm text-gray-400'>
                                        Student ID: {user.student_id}
                                    </div>
                                    <div className='text-sm text-gray-400'>
                                        Course: {user.program}
                                    </div>
                                </div>
                                <div
                                    className='cursor-pointer'
                                    onClick={signoutUser}
                                >
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <GoSignOut className='w-5' />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Signout</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <div className='w-[90%] p-8 mx-auto flex flex-col space-y-8'>
                        <div className='w-full space-y-4 mt-4'>
                            <h1 className='text-5xl font-bold'>
                                Today's tasks
                            </h1>
                            <div className='border-t-2 border-zinc-700/20 w-full'></div>
                        </div>
                        <Button
                            className='w-24 py-2 px-4 ml-auto'
                            onClick={() => setShowModal(true)}
                        >
                            New task
                        </Button>
                        <div className='w-full h-full'>
                            <ScrollArea className='h-[600px] p-4 border-2 border-zinc-700/20 rounded-md'>
                                <div className='space-y-4'>
                                    {tasks
                                        ? tasks.map((task) => (
                                              <TaskCard
                                                  task={task}
                                                  key={task._id}
                                              />
                                          ))
                                        : ''}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </IconContext.Provider>
    );
};
export default Home;
