import { ProjectTaskType, ProjectType, UserType } from '@/types';
import ProjectTaskCard from './ProjectTaskCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';

interface TaskDifficultyProps {
    label: string;
    color: string;
    tasks: ProjectTaskType[] | null;
    user: UserType;
}

const TaskByDifficulty = ({
    label,
    color,
    tasks,
    user,
}: TaskDifficultyProps) => {
    const { toast } = useToast();
    const [projectTasks, setProjectTasks] = useState<ProjectTaskType[]>([]);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (tasks) setProjectTasks(tasks);
    }, [tasks]);

    const deleteTaskMutation = useMutation({
        mutationFn: (task: { project: string; _id: string }) =>
            axios
                .delete(`/api/projects/${task.project}/tasks/${task._id}`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then((res) => {
                    return res.data;
                }),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error updating task',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (id: string) => {
            const fetchProject: ProjectType = queryClient.getQueryData([
                'project',
            ]) as ProjectType;
            queryClient.setQueryData(['project'], () => {
                fetchProject.projectTasks = fetchProject.projectTasks.filter(
                    (t) => t._id !== id,
                );
                return fetchProject;
            });
        },
    });

    const onDelete = (task: ProjectTaskType) => {
        setProjectTasks(projectTasks.filter((t) => t._id !== task._id));
        deleteTaskMutation.mutate({ _id: task._id, project: task.project });
    };
    return (
        <div
            className='rounded-xl text-card-foreground shadow-md  h-full flex flex-col'
            style={{ backgroundColor: color }}
        >
            <div className='p-4'>
                <h1 className='text-2xl font-bold text-center text-black/70'>
                    {label}
                </h1>
            </div>
            <div className='p-4 pt-0  lg:w-[300px] xl:w-[300px] 2xl:w-[350px] space-y-2 overflow-x-hidden'>
                {projectTasks && (
                    <>
                        {projectTasks?.map((t) => (
                            <ProjectTaskCard
                                key={t._id}
                                task={t}
                                user={user}
                                handleDelete={() => onDelete(t)}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};
export default TaskByDifficulty;
