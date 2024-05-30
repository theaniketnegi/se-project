import { FaTasks } from 'react-icons/fa';
import { GrProjects } from 'react-icons/gr';
import { IoTodayOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';
import { GoSignOut } from 'react-icons/go';
import { NoticeType, UserType } from '@/types';
import { useUserStore } from '@/store/userStore';
import { RiNotification2Line } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from './ui/use-toast';

const SidebarContent = ({
    params,
    user,
}: {
    params: string;
    user: UserType;
}) => {
    const navigate = useNavigate();
    const signoutUser = useUserStore((state) => state.signout);
    const { toast } = useToast();

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

    const notices: NoticeType[] = fetchedNotices.data;
    const count = notices && notices.filter((n) => !n.read).length;
    return (
        <>
            <div className='flex flex-col space-y-16'>
                <div className='space-y-4'>
                    <div className='text-4xl font-bold select-none'>
                        Task Management
                    </div>
                    <div className='border-t-2 border-zinc-700/90 w-full'></div>
                </div>
                <div className='text-xl space-y-4'>
                    <Link to='/today'>
                        <div
                            className={`p-4 pl-3 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center ${
                                params === 'today' &&
                                'bg-zinc-700/70 rounded-md'
                            }`}
                        >
                            <IoTodayOutline className='w-5' />
                            Today's tasks
                        </div>
                    </Link>
                    <Link to='/all'>
                        <div
                            className={`p-4 pl-3 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center ${
                                params === 'all' && 'bg-zinc-700/70 rounded-md'
                            }`}
                        >
                            <FaTasks className='w-5' />
                            All tasks
                        </div>
                    </Link>
                    <Link to='/projects'>
                        <div
                            className={`p-4 pl-3 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center ${
                                params === 'projects' &&
                                'bg-zinc-700/70 rounded-md'
                            }`}
                        >
                            <GrProjects className='w-5' />
                            Projects
                        </div>
                    </Link>
                    <Link to='/notices'>
                        <div
                            className={`p-4 pl-3 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center ${
                                params === 'notices' &&
                                'bg-zinc-700/70 rounded-md'
                            } flex justify-between`}
                        >
                            <div className='flex justify-between'>
                                <RiNotification2Line className='w-5' />
                                <div className='ml-4'>Notices</div>
                            </div>
                            {count > 0 && (
                                <div className='rounded-full border-2 w-6 h-6 flex items-center justify-center'>
                                    <div className='mb-1'>{count}</div>
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            </div>
            <div className='space-y-4'>
                <div className='border-t-2 border-zinc-700/90 w-full'></div>
                <div className='flex justify-between'>
                    <div className='space-y-1'>
                        <div className='text-xl font-bold'>{user.name}</div>
                        <div className='text-sm text-gray-400'>
                            Section: {user.section}
                        </div>
                        <div className='text-sm text-gray-400'>
                            Student ID: {user.student_id}
                        </div>
                        <div className='text-sm text-gray-400'>
                            Course: {user.program}
                        </div>
                    </div>
                    <div
                        className='cursor-pointer'
                        onClick={() => {
                            signoutUser();
                            navigate('/');
                        }}
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <GoSignOut className='w-5' />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Signout</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SidebarContent;
