import { ProjectTaskType, ProjectType, UserType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMatch } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';
import CreateButton from '../CreateButton';
import { useState } from 'react';
import { ProjectTaskModal } from './ProjectTask/ProjectTaskModal';
import TaskByDifficulty from './ProjectTask/TaskByDifficulty';

const ProjectView = ({ user }: { user: UserType }) => {
    const match = useMatch('/projects/:id');
    const id = match?.params.id;
    const { toast } = useToast();
    const [modal, showModal] = useState(false);
    const queryClient = useQueryClient();
    const fetchProject = useQuery({
        queryKey: ['project'],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/projects/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                const data = response.data;
                return data;
            } catch (err) {
                const error = err as { response: { data: { err: string } } };
                toast({
                    variant: 'destructive',
                    title: 'Error fetching project data',
                    description: error.response.data.err
                        ? `${error.response.data.err}`
                        : 'Error connecting',
                });
                throw new Error(error.response.data.err);
            }
        },
        retry: false,
    });

    const addProjectTaskMutation = useMutation({
        mutationFn: ({
            title,
            difficulty,
        }: {
            title: string;
            difficulty: string;
        }) =>
            axios
                .post(
                    `api/projects/${id}/tasks`,
                    { title, difficulty },
                    { headers: { Authorization: `Bearer ${user.token}` } },
                )
                .then((res) => res.data),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error creating project',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (task: ProjectTaskType) => {
            const fetchProject: ProjectType = queryClient.getQueryData([
                'project',
            ]) as ProjectType;
            queryClient.setQueryData(['project'], () => {
                fetchProject.projectTasks =
                    fetchProject.projectTasks.concat(task);
                return fetchProject;
            });
        },
    });

    const project: ProjectType =
        fetchProject.data && (fetchProject.data as ProjectType);

    const filterProjectTasks = (difficulty: string) =>
        project &&
        project.projectTasks.filter((task) => task.difficulty === difficulty);

    const addProjectTask = (title: string, difficulty: string) => {
        addProjectTaskMutation.mutate({ title, difficulty });
        showModal(false);
    };

    return (
        <>
            {modal && (
                <ProjectTaskModal
                    onCloseModal={() => showModal(false)}
                    onAddTask={addProjectTask}
                />
            )}
            <div className='h-full w-[90%] p-6 md:p-8 mx-auto flex flex-col'>
                <div className='w-full space-y-4 mt-4'>
                    <h1 className='text-5xl font-bold'>
                        {!project ? (
                            <Skeleton className='h-12 w-96' />
                        ) : (
                            project.title
                        )}
                    </h1>

                    <div className='border-t-2 border-zinc-700/20 w-full'></div>
                </div>
                <div className='mt-8'>
                    <CreateButton
                        text={'New task'}
                        onClick={() => showModal(true)}
                    />
                </div>
                <div className='justify-between space-y-8  lg:flex lg:space-y-0 h-[600px] w-full mt-8'>
                    <TaskByDifficulty
                        label='Easy'
                        color='#D1FAE580'
                        tasks={filterProjectTasks('Easy')}
                        user={user}
                    />
                    <TaskByDifficulty
                        label='Medium'
                        color='#FEF3C780'
                        tasks={filterProjectTasks('Medium')}
                        user={user}
                    />
                    <TaskByDifficulty
                        label='Hard'
                        color='#FEE2E280'
                        tasks={filterProjectTasks('Hard')}
                        user={user}
                    />
                </div>
            </div>
        </>
    );
};
export default ProjectView;
