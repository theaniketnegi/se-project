import { AdminType, UserType } from '@/types';
import { useNavigate } from 'react-router-dom';
import CreateButton from '../CreateButton';
import { useQuery /*useQueryClient*/ } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { DataTable } from './UsersTable/DataTable';
import { columns } from './UsersTable/ColumnDefs';

const AdminAllStudents = ({ admin }: { admin: AdminType }) => {
    const navigate = useNavigate();
    // const queryClient = useQueryClient();
    const { toast } = useToast();

    const fetchedStudents = useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            try {
                const response = await axios.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${admin?.token}`,
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

    const students = fetchedStudents.data as UserType[];

    return (
        <>
            <div className='w-[90%] p-6 md:p-8 mx-auto flex flex-col space-y-6'>
                <div className='w-full space-y-4 mt-4'>
                    <h1 className='text-5xl font-bold'>All Students</h1>
                    <div className='border-t-2 border-zinc-700/20 w-full'></div>
                </div>
                <div>
                    <CreateButton
                        onClick={() => navigate('/admin/create-student')}
                        text='New Student'
                    />
                    <div className='w-full h-full'>
                        {students && (
                            <DataTable columns={columns} data={students} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default AdminAllStudents;
