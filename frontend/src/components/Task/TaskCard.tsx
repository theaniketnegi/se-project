import { TaskType, UserType } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { useState } from 'react';
import { IconContext } from 'react-icons/lib';
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
import EditTools from '../EditTools';
import { format } from 'date-fns';

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
            console.log(
                fetchTasks.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task,
                ),
            );
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

    const [done, setDone] = useState<boolean>(task.done);
    const [edit, setEdit] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(task.title);
    const [date, setDate] = useState<string>(
        task.due_date.toString().split('T')[0],
    );
    const [priority, setPriority] = useState<string>(task.priority);

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
		space-y-4 lg:space-y-0 lg:flex justify-between
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
                <div
                    className={`relative ${done && 'text-gray-400'} 
                    	w-[220px] sm:w-[450px] md:w-[550px] lg:w-[375px] xl:w-[325px] 2xl:w-[560px] `}
                >
                    {edit ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    ) : (
                        <p
                            className={`${
                                done && 'line-through'
                            } decoration-2 text-ellipsis whitespace-nowrap overflow-hidden`}
                        >
                            {task.title}
                        </p>
                    )}
                </div>
            </div>
            <IconContext.Provider
                value={{
                    size: '25',
                }}
            >
                <div className='space-y-4 md:space-y-0 md:flex md:space-x-6 items-center ml-[40px]'>
                    <div className={`${done && 'text-gray-400'}`}>
                        {edit && (
                            <div className='flex md:space-x-6'>
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
                        {!edit && format(new Date(task.due_date), 'dd/MM/yy')}
                    </div>
                    <EditTools
                        edit={edit}
                        toggleEdit={() => setEdit((prevVal) => !prevVal)}
                        onClickUpdate={() => {
                            updateTaskMutation.mutate({
                                title,
                                priority,
                                due_date: date,
                                done: task.done,
                            });
                            setEdit((prevVal) => !prevVal);
                        }}
                        onClickDelete={() => deleteTaskMutation.mutate()}
                    />
                </div>
            </IconContext.Provider>
        </div>
    );
};
export default TaskCard;
