import { ProjectType, UserType } from '@/types';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { calcPercentage } from '@/lib/calculatePercentage';
import EditTools from '../EditTools';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { Input } from '../ui/input';
import { Link } from 'react-router-dom';

const ProjectCard = ({
    project,
    user,
}: {
    project: ProjectType;
    user: UserType;
}) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(project.title);
    const [description, setDescription] = useState<string>(project.description);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const updateProjectMutation = useMutation({
        mutationFn: (updatedProject: { title: string; description: string }) =>
            axios
                .put(`/api/projects/${project._id}`, updatedProject, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then((res) => res.data),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error updating project',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (updatedProject: ProjectType) => {
            const fetchProjects: ProjectType[] = queryClient.getQueryData([
                'projects',
            ]) as ProjectType[];
            queryClient.setQueryData(
                ['projects'],
                fetchProjects.map((project) =>
                    project._id === updatedProject._id
                        ? updatedProject
                        : project,
                ),
            );
        },
    });

    const deleteProjectMutation = useMutation({
        mutationFn: () =>
            axios
                .delete(`/api/projects/${project._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                })
                .then((res) => res.data),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error deleting project',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: () => {
            const fetchProjects: ProjectType[] = queryClient.getQueryData([
                'projects',
            ]) as ProjectType[];
            queryClient.setQueryData(
                ['projects'],
                fetchProjects.filter((p) => p._id !== project._id),
            );
        },
    });

    return (
        <Link
            to={`/projects/${project._id}`}
            onClick={() => {
                queryClient.resetQueries({ queryKey: ['project'] });
                console.log('Clicked');
            }}
        >
            <Card className='w-full h-[200px] aspe relative shadow-md hover:-translate-y-1 transition duration-200 cursor-pointer'>
                <CardHeader className='p-6 pt-8 flex justify-between'>
                    <div className='space-y-2'>
                        <div className='h-8 flex gap-4 items-center justify-between'>
                            {edit ? (
                                <Input
                                    type='text'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                />
                            ) : (
                                <CardTitle className='h-full text-ellipsis overflow-hidden whitespace-nowrap'>
                                    {project.title}
                                </CardTitle>
                            )}
                            <EditTools
                                edit={edit}
                                toggleEdit={() =>
                                    setEdit((prevVal) => !prevVal)
                                }
                                onClickDelete={() => {
                                    deleteProjectMutation.mutate();
                                }}
                                onClickUpdate={() => {
                                    updateProjectMutation.mutate({
                                        title,
                                        description,
                                    });
                                    setEdit((prevVal) => !prevVal);
                                }}
                            />
                        </div>

                        <CardDescription className='h-10 text-ellipsis overflow-hidden whitespace-nowrap'>
                            {edit ? (
                                <Input
                                    type='text'
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder='Enter description'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                />
                            ) : (
                                project.description && project.description
                            )}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardFooter className='flex flex-col items-start gap-2'>
                    {project.projectTasks.length > 0
                        ? calcPercentage(project.projectTasks)
                        : 0}
                    % complete
                    <Progress
                        value={
                            project.projectTasks.length > 0
                                ? calcPercentage(project.projectTasks)
                                : 0
                        }
                        className='h-2'
                    />
                </CardFooter>
            </Card>
        </Link>
    );
};
export default ProjectCard;
