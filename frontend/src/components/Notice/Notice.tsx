import { NoticeType, UserType } from '@/types';
import { Button } from '../ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../ui/use-toast';
import axios from 'axios';
import NoticeCard from './NoticeCard';

const Notices = ({ user }: { user: UserType }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const fetchedNotices = useQuery({
        queryKey: ['notices'],
        queryFn: async () => {
            try {
                const response = await axios.get('/api/notices', {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                return response.data;
            } catch (err) {
                const error = err as { response: { data: { err: string } } };
                toast({
                    variant: 'destructive',
                    title: 'Error fetching notices',
                    description: error.response.data.err
                        ? `${error.response.data.err}`
                        : 'Error connecting',
                });
                throw new Error(error.response.data.err);
            }
        },
        retry: false,
    });

    const updateReadStatus = useMutation({
        mutationFn: async (all: boolean) => {
            const response = await axios.put(
                `/api/users/${user.student_id}`,
                { all },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                },
            );
            const data = response.data;
            return data;
        },
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error updating read status',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (notices: NoticeType[]) => {
			queryClient.invalidateQueries({ queryKey: ['notices'] });
            queryClient.setQueryData(['notices'], notices);
        },
    });

    const notices: NoticeType[] = fetchedNotices.data;

    return (
        <>
            <div className='w-[90%] p-6 md:p-8 mx-auto flex flex-col space-y-8'>
                <div className='w-full space-y-4 mt-4'>
                    <h1 className='text-5xl font-bold'>Notices</h1>
                    <div className='border-t-2 border-zinc-700/20 w-full'></div>
                </div>
                <Button
                    className='w-full lg:w-32 space-x-4 lg:space-x-2 text-lg lg:text-sm px-8 py-8 lg:py-1 lg:px-2 lg:ml-auto flex lg:justify-center items-center'
                    onClick={() => updateReadStatus.mutate(true)}
                >
                    <div className='text-xl lg:text-xs'>Mark all as read</div>
                </Button>
                <div className='w-full h-fucll'>
                    <div className='hidden xl:block h-[600px] overflow-y-auto overflow-x-hidden p-4 border-2 border-zinc-700/20 rounded-md'>
                        <div className='space-y-4 w-full'>
                            {notices &&
                                notices.map((n) => {
                                    return (
                                        <NoticeCard
                                            user={user}
                                            notice={n}
                                            key={n._id}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                    <div className='xl:hidden block space-y-4 w-full'></div>
                </div>
            </div>
        </>
    );
};
export default Notices;
