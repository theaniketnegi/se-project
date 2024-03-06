import { ProjectType, UserType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMatch } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';
const ProjectView = ({ user }: { user: UserType }) => {
    const match = useMatch('/projects/:id');
    const id = match?.params.id;
    const { toast } = useToast();

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

    const project: ProjectType =
        fetchProject.data && (fetchProject.data as ProjectType);

    console.log(project);
    return (
        <>
            <div className='w-[90%] p-6 md:p-8 mx-auto flex flex-col space-y-8'>
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
            </div>
        </>
    );
};
export default ProjectView;
