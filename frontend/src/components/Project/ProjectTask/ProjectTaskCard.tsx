import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '../../ui/checkbox';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { ProjectTaskType, ProjectType, UserType } from '@/types';
import { MdOutlineDelete } from 'react-icons/md';

interface TaskCardProps {
    task: ProjectTaskType;
    user: UserType;
    handleDelete: () => void;
}

const ProjectTaskCard = ({ task, user, handleDelete }: TaskCardProps) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [taskDone, setTaskDone] = useState(task.done);

    const updateTaskMutation = useMutation({
        mutationFn: (updatedTask: {
            title: string;
            difficulty: string;
            done: boolean;
        }) =>
            axios
                .put(
                    `/api/projects/${task.project}/tasks/${task._id}`,
                    updatedTask,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    },
                )
                .then((res) => res.data),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error updating task',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (updatedTask: ProjectTaskType) => {
            const fetchProject: ProjectType = queryClient.getQueryData([
                'project',
            ]) as ProjectType;
            queryClient.setQueryData(['project'], () => {
                fetchProject.projectTasks = fetchProject.projectTasks.map(
                    (t) => {
                        if (t._id === updatedTask._id) return updatedTask;
                        else return t;
                    },
                );
                return fetchProject;
            });
        },
    });

    return (
        <div
            className={`p-4 border-1 rounded-lg shadow-sm 
bg-white/50 flex justify-between items-center ${taskDone && 'text-gray-400'}
`}
        >
            <div className='flex items-center space-x-4'>
                <Checkbox
                    checked={taskDone}
                    className={`${
                        taskDone &&
                        'border-gray-400 data-[state=checked]:bg-gray-400'
                    }`}
                    onCheckedChange={() => {
                        setTaskDone((lastVal) => !lastVal);
                        updateTaskMutation.mutate({
                            title: task.title,
                            difficulty: task.difficulty,
                            done: !task.done,
                        });
                    }}
                />
                <div
                    className={`relative  w-[100px] md:w-[200px]  lg:w-[150px] xl:w-[160px] `}
                >
                    <p
                        className={`${
                            taskDone && 'line-through'
                        } decoration-2 text-ellipsis whitespace-nowrap overflow-hidden`}
                    >
                        {task.title}
                    </p>
                </div>
            </div>
            <div
                className='w-5 h-5 text-primary cursor-pointer'
                onClick={handleDelete}
            >
                <MdOutlineDelete />
            </div>
        </div>
    );
};
export default ProjectTaskCard;
