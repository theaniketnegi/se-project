import { TaskType } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { useEffect, useState } from 'react';

const TaskCard = ({ task }: { task: TaskType }) => {
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (task.status === 'Done') setDone(true);
    }, []);
    return (
        <div
            className={`border-l-8  p-4 border-2 rounded-lg shadow-sm ${
                done
                    ? ''
                    : task.priority === 'Low'
                    ? 'border-green-300'
                    : task.priority == 'Medium'
                    ? 'border-yellow-300'
                    : 'border-red-500'
            } ${done && 'border-gray-400'}
		flex justify-between
	`}
            key={task.id}
        >
            <div className='flex items-center space-x-4'>
                <Checkbox
                    className={`${
                        task.priority === 'Low'
                            ? 'border-green-300'
                            : task.priority == 'Medium'
                            ? 'border-yellow-300'
                            : 'border-red-500'
                    } ${
                        done &&
                        'border-gray-400 data-[state=checked]:bg-gray-400'
                    }`}
                    checked={done}
                    onCheckedChange={setDone}
                />
                <div className={`relative ${done && 'text-gray-400'}`}>
                    {task.task_name}{' '}
                    {done && (
                        <div className='w-full absolute top-1/2 border-t-2 border-gray-400'></div>
                    )}
                </div>
            </div>
            <div className={`${done && 'text-gray-400'}`}>{task.due_date}</div>
        </div>
    );
};
export default TaskCard;
