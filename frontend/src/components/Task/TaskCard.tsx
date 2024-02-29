import { TaskType } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { useEffect, useState } from 'react';
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import { IconContext } from 'react-icons/lib';
import { IoMdClose } from 'react-icons/io';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from '../ui/select';

const formattedDate = new Date().toISOString().split('T')[0];

const TaskCard = ({ task }: { task: TaskType }) => {
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
                    onCheckedChange={() => setDone((lastVal) => !lastVal)}
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
                    color: `${task.done ? '#9ca3af' : 'black'}`,
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
                        <div
                            className='group relative hover:-translate-y-[2px] transition duration-100'
                            onClick={() => setEdit((prevVal) => !prevVal)}
                        >
                            {!edit ? (
                                <MdOutlineEdit className='cursor-pointer' />
                            ) : (
                                <IoMdClose className='cursor-pointer' />
                            )}
                            <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                        </div>
                        <div className='group relative hover:-translate-y-[2px] transition duration-100'>
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
