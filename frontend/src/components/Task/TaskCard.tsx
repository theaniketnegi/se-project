import { TaskType, UserType } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { useEffect, useState } from 'react';
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import { IconContext } from 'react-icons/lib';
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from '../ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../ui/use-toast';
import axios from 'axios';
import { sortTasksByPriority } from '@/lib/sort';

const formattedDate = new Date().toISOString().split('T')[0];

const TaskCard = ({ task, user }: { task: TaskType; user: UserType }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const updateTaskMutation = useMutation({
        mutationFn: (updatedTask: {
            title: string;
            due_date: string;
            priority: string;
            done: boolean;
        }) =>
            axios
                .put(`/api/tasks/${task._id}`, updatedTask, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then((res) => res.data),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error updating task',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (updatedTask: TaskType) => {
            const fetchTasks: TaskType[] = queryClient.getQueryData([
                'tasks',
            ]) as TaskType[];
            queryClient.setQueryData(
                ['tasks'],
                sortTasksByPriority(
                    fetchTasks.map((task) =>
                        task._id === updatedTask._id ? updatedTask : task,
                    ),
                ),
            );
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: () =>
            axios
                .delete(`/api/tasks/${task._id}`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then((res) => res.data),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error updating task',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: () => {
            const fetchTasks: TaskType[] = queryClient.getQueryData([
                'tasks',
            ]) as TaskType[];
            queryClient.setQueryData(
                ['tasks'],
                fetchTasks.filter((t) => t._id !== task._id),
            );
        },
    });

    const [done, setDone] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(task.title);
    const [date, setDate] = useState<string>(
        task.due_date.toString().split('T')[0],
    );
    const [priority, setPriority] = useState<string>(task.priority);

    useEffect(() => {
        if (task.done) setDone(true);
    }, [task.done]);

    return (
        <div
            className={`border-l-8  p-4 border-2 rounded-lg shadow-sm ${
                done
                    ? ''
                    : task.priority === 'Low'
                    ? 'border-green-300'
                    : task.priority == 'Normal'
                    ? 'border-yellow-300'
                    : 'border-red-500'
            } ${done && 'border-gray-400'}
		flex justify-between
	`}
        >
            <div className='flex items-center space-x-4'>
                <Checkbox
                    className={`${
                        task.priority === 'Low'
                            ? 'border-green-300'
                            : task.priority == 'Normal'
                            ? 'border-yellow-300'
                            : 'border-red-500'
                    } ${
                        done &&
                        'border-gray-400 data-[state=checked]:bg-gray-400'
                    } hover:cursor-pointer`}
                    checked={done}
                    onCheckedChange={() => {
                        updateTaskMutation.mutate({
                            title: task.title,
                            priority: task.priority,
                            due_date: task.due_date.toString().split('T')[0],
                            done: !task.done,
                        });
                        setDone((lastVal) => !lastVal);
                    }}
                />
                <div className={`relative ${done && 'text-gray-400'}`}>
                    {edit ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    ) : (
                        task.title
                    )}
                    {done && (
                        <div className='w-full absolute top-1/2 border-t-2 border-gray-400'></div>
                    )}
                </div>
            </div>
            <IconContext.Provider
                value={{
                    size: '25',
                }}
            >
                <div className='flex space-x-6 items-center'>
                    <div className={`${done && 'text-gray-400'}`}>
                        {edit && (
                            <div className='flex space-x-6'>
                                <Select
                                    value={priority}
                                    onValueChange={(e) => setPriority(e)}
                                >
                                    <SelectTrigger id='priority'>
                                        <SelectValue placeholder='Select' />
                                    </SelectTrigger>
                                    <SelectContent position='popper'>
                                        <SelectItem value='Low'>Low</SelectItem>
                                        <SelectItem value='Normal'>
                                            Normal
                                        </SelectItem>
                                        <SelectItem value='High'>
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type='date'
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={formattedDate}
                                />
                            </div>
                        )}
                        {!edit && task.due_date.toString().split('T')[0]}
                    </div>
                    <div className='flex space-x-6'>
                        {!edit ? (
                            <div
                                className='group relative hover:-translate-y-[2px] transition duration-100'
                                onClick={() => setEdit((prevVal) => !prevVal)}
                            >
                                <MdOutlineEdit className='cursor-pointer' />
                                <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                            </div>
                        ) : (
                            <div className='flex space-x-4'>
                                <div
                                    className='group relative hover:-translate-y-[2px] transition duration-100'
                                    onClick={() => {
                                        updateTaskMutation.mutate({
                                            title,
                                            priority,
                                            due_date: date,
                                            done: task.done,
                                        });
                                        setEdit((prevVal) => !prevVal);
                                    }}
                                >
                                    <IoMdCheckmark className='cursor-pointer' />
                                    <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                                </div>
                                <div
                                    className='group relative hover:-translate-y-[2px] transition duration-100'
                                    onClick={() =>
                                        setEdit((prevVal) => !prevVal)
                                    }
                                >
                                    <IoMdClose className='cursor-pointer' />
                                    <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                                </div>
                            </div>
                        )}

                        <div
                            className='group relative hover:-translate-y-[2px] transition duration-100'
                            onClick={() => deleteTaskMutation.mutate()}
                        >
                            <MdOutlineDelete className='cursor-pointer' />
                            <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                        </div>
                    </div>
                </div>
            </IconContext.Provider>
        </div>
    );
};
export default TaskCard;
