import { IoAdd, IoPeople } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { GoSignOut } from 'react-icons/go';
import { AdminType } from '@/types';
import { useAdminStore } from '@/store/adminStore';
import { RiNotification2Line } from 'react-icons/ri';

const AdminSidebarContent = ({
    params,
    user,
}: {
    params: string;
    user: AdminType;
}) => {
    const navigate = useNavigate();
    const signoutUser = useAdminStore((state) => state.signout);
    console.log(params);
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
                    <Link to='/admin/students'>
                        <div
                            className={`p-4 pl-3 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center ${
                                params === 'admin/students' &&
                                'bg-zinc-700/70 rounded-md'
                            }`}
                        >
                            <IoPeople className='w-5' />
                            All Students
                        </div>
                    </Link>
                    <Link to='/admin/notices'>
                        <div
                            className={`p-4 pl-3 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center ${
                                params === 'admin/notices' &&
                                'bg-zinc-700/70 rounded-md'
                            }`}
                        >
                            <RiNotification2Line className='w-5' />
                            Notices
                        </div>
                    </Link>
                    <Link to='/admin/create-student'>
                        <div
                            className={`p-4 pl-3 cursor-pointer hover:-translate-y-1 transition duration-200 flex gap-4 items-center ${
                                params === 'admin/create-student' &&
                                'bg-zinc-700/70 rounded-md'
                            }`}
                        >
                            <IoAdd className='w-5' />
                            Create student
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
                            Organization: {user.org}
                        </div>
                        <div className='text-sm text-gray-400'>
                            Admin ID: {user.adminId}
                        </div>
                    </div>
                    <div
                        className='cursor-pointer'
                        onClick={() => {
                            signoutUser();
                            navigate('/admin');
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
export default AdminSidebarContent;
