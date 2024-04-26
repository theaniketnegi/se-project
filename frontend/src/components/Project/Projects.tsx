import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CreateButton from '../CreateButton';
import ProjectCard from './ProjectCard';

import axios from 'axios';
import { ProjectType, UserType } from '@/types';
import { useToast } from '../ui/use-toast';
import { useState } from 'react';
import { ProjectModal } from './ProjectModal';
import ProjectCardSkeleton from './ProjectCardSkeleton';

const Projects = ({ user }: { user: UserType }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const fetchedProjects = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            try {
                const response = await axios.get('/api/projects', {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                return response.data;
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

    const addProjectMutation = useMutation({
        mutationFn: ({
            title,
            description,
        }: {
            title: string;
            description: string;
        }) =>
            axios
                .post(
                    '/api/projects',
                    { title, description },
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
        onSuccess: (newProject: ProjectType) => {
            const fetchProjects: ProjectType[] = queryClient.getQueryData([
                'projects',
            ]) as ProjectType[];
            queryClient.setQueryData(
                ['projects'],
                fetchProjects.concat(newProject),
            );
        },
    });

    const [modal, setModal] = useState<boolean>(false);
    const projects: ProjectType[] = fetchedProjects.data;

    const addProject = (title: string, description: string) => {
        addProjectMutation.mutate({ title, description });
        setModal(false);
    };

    return (
        <>
            {modal && (
                <ProjectModal
                    onCloseModal={() => setModal(false)}
                    onAddProject={addProject}
                />
            )}
            <div className='w-[90%] p-6 md:p-8 mx-auto flex flex-col space-y-8'>
                <div className='w-full space-y-4 mt-4'>
                    <h1 className='text-5xl font-bold'>Projects</h1>
                    <div className='border-t-2 border-zinc-700/20 w-full'></div>
                </div>
                <CreateButton
                    onClick={() => setModal(true)}
                    text='New Project'
                />
                <div className='w-full h-full'>
                    <div className='block space-x-8 md:mt-6 lg:space-x-0 lg:mt-0 lg:grid lg:grid-cols-2 2xl:grid-cols-3 gap-24 gap-y-20'>
                        {projects ? (
                            projects.map((project) => (
                                <ProjectCard
                                    user={user}
                                    key={project._id}
                                    project={project}
                                />
                            ))
                        ) : (
                            <ProjectCardSkeleton />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Projects;
