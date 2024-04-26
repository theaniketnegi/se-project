import { ProjectType, UserType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMatch } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';
import CreateButton from '../CreateButton';
import { useState } from 'react';
import { ProjectTaskModal } from './ProjectTask/ProjectTaskModal';

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
        onSuccess: (task) => {
            const fetchProject: ProjectType = queryClient.getQueryData([
                'project',
            ]) as ProjectType;
            queryClient.setQueryData(['project'], () => {
                fetchProject.projectTasks = fetchProject.projectTasks.concat(task);
                return fetchProject;
            });
        },
    });

    const project: ProjectType =
        fetchProject.data && (fetchProject.data as ProjectType);

    const addProjectTask = (title: string, difficulty: string) => {
        addProjectTaskMutation.mutate({ title, difficulty });
        showModal(false);
    };
    console.log(project);

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
                <div className='gap-16 flex h-[600px] w-full mt-8'>
                    <div className='rounded-md bg-green-100/50 text-card-foreground w-[450px] shadow-md'>
                        <div className='p-4'>
                            <h1 className='text-2xl font-bold text-center text-black/70'>
                                Easy
                            </h1>
                        </div>
                    </div>
                    <div className='rounded-md bg-yellow-100/50 text-card-foreground w-[450px] shadow-md'>
                        <div className='p-4'>
                            <h1 className='text-2xl font-bold text-center text-black/70'>
                                Medium
                            </h1>
                        </div>
                    </div>
                    <div className='rounded-md bg-red-100/50 text-card-foreground w-[450px] shadow-md'>
                        <div className='p-4'>
                            <h1 className='text-2xl font-bold text-center text-black/70'>
                                Hard
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ProjectView;
