import { ColumnDef } from '@tanstack/react-table';
import { MdOutlineDelete } from 'react-icons/md';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        cell: ({ row }) => {
            const student = row.original;

            return (
                <div
                    className='h-5 w-5 group relative hover:-translate-y-[2px] transition duration-100'
                    onClick={() => console.log(student.student_id)}
                >
                    <MdOutlineDelete className='cursor-pointer' />
                    <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                </div>
            );
        },
    },
];
