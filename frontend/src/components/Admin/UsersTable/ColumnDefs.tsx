import { ColumnDef } from '@tanstack/react-table';
import { MdOutlineDelete } from 'react-icons/md';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { UserType } from '@/types';
import { useAdminStore } from '@/store/adminStore';

export type Student = {
    student_id: string;
    name: string;
    program: string;
    section: string;
};

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: 'student_id',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Student ID
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
        filterFn: 'includesString',
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Name
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
    },
    {
        accessorKey: 'program',
        header: 'Program',
    },
    {
        accessorKey: 'section',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Section
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
    },
    {
        id: 'actions',
        cell: function CellComponent({ row }) {
            const student = row.original;
            const queryClient = useQueryClient();
            const { toast } = useToast();
            const admin = useAdminStore((state) => state.admin);

            const deleteTaskMutation = useMutation<
                void,
                { response: { data: { err: string } } },
                string,
                { previousStudents: UserType[] | undefined }
            >({
                mutationFn: (student_id: string) =>
                    axios
                        .delete(`/api/users/${student_id}`, {
                            headers: {
                                Authorization: `Bearer ${admin?.token}`,
                            },
                        })
                        .then((res) => {
                            return res.data;
                        }),
                onError: (
                    error: { response: { data: { err: string } } },
					_: string,
                    context: { previousStudents: UserType[] | undefined } | undefined,
                ) => {
                    toast({
                        variant: 'destructive',
                        title: 'Error deleting student',
                        description: error.response.data.err
                            ? `${error.response.data.err}`
                            : 'Error connecting',
                    });
                    if (context?.previousStudents) {
                        queryClient.setQueryData(
                            ['students'],
                            context.previousStudents,
                        );
                    }
                },
                onMutate: async (
                    student_id: string,
                ): Promise<{ previousStudents: UserType[] | undefined }> => {
                    await queryClient.cancelQueries({ queryKey: ['students'] });
                    const previousStudents = queryClient.getQueryData<
                        UserType[]
                    >(['students']);
                    queryClient.setQueryData(
                        ['students'],
                        (old: UserType[] | undefined) =>
                            old
                                ? old.filter((t) => t.student_id !== student_id)
                                : [],
                    );
                    return { previousStudents };
                },
                onSettled: () => {
                    queryClient.invalidateQueries({ queryKey: ['students'] });
                },
            });

            return (
                <div
                    className='h-5 w-5 group relative hover:-translate-y-[2px] transition duration-100'
                    onClick={() =>
                        deleteTaskMutation.mutate(student.student_id)
                    }
                >
                    <MdOutlineDelete className='cursor-pointer' />
                    <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                </div>
            );
        },
    },
];
