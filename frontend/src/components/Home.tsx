import { useUserStore } from '@/store/userStore';
import {
    Link,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { GoSignOut } from 'react-icons/go';
import { IconContext } from 'react-icons/lib';
import { IoTodayOutline } from 'react-icons/io5';
import { FaTasks } from 'react-icons/fa';
import { GrProjects } from 'react-icons/gr';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoChevronBackCircle } from 'react-icons/io5';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Tasks from './Task/Tasks';
import Projects from './Project/Projects';
import { useEffect, useRef, useState } from 'react';

const queryClient = new QueryClient();

const Home = () => {
    const user = useUserStore((state) => state.user);
    const signoutUser = useUserStore((state) => state.signout);
    const location = useLocation();
    const params = location.pathname.replace('/', '');
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const sidebarToggle = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (localStorage.getItem('userPayload')) {
            setUser(JSON.parse(localStorage.getItem('userPayload') as string));
        } else {
            navigate('/');
        }
    }, [setUser]);
    useEffect(() => {
        setShowSidebar(false);
    }, [params]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node|null) &&
                sidebarToggle.current &&
                !sidebarToggle.current.contains(event.target as Node|null)
            ) {
                setShowSidebar(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (user)
        return (
            <IconContext.Provider value={{ color: 'auto', size: 'auto' }}>
                <div className='h-full flex flex-col xl:flex-row relative'>
                    <div
                        className='w-16 p-4 cursor-pointer block xl:hidden'
                        onClick={() => setShowSidebar((prevVal) => !prevVal)}
                        ref={sidebarToggle}
                    >
                        <GiHamburgerMenu color='#18181b' />
                    </div>{' '}
                    {showSidebar && (
                        <>
                            <div
                                className='absolute top-0 left-[320px] cursor-pointer w-12 mt-4 opacity-[0.97]'
                                onClick={() => setShowSidebar(false)}
                            >
                                <IoChevronBackCircle />
                            </div>
                            <div
                                className='bg-zinc-900 opacity-[0.97] w-[300px] absolute h-screen z-10'
                                ref={sidebarRef}
                            >
                                <div className='h-full p-4 flex flex-col justify-between text-white'>
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
                                                        params === 'all' &&
                                                        'bg-zinc-700/70 rounded-md'
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
                                        </div>
                                    </div>
                                    <div className='space-y-4'>
                                        <div className='border-t-2 border-zinc-700/90 w-full'></div>
                                        <div className='flex justify-between'>
                                            <div className='space-y-1'>
                                                <div className='text-xl font-bold'>
                                                    {user.name}
                                                </div>
                                                <div className='text-sm text-gray-400'>
                                                    Section: {user.section}
                                                </div>
                                                <div className='text-sm text-gray-400'>
                                                    Student ID:{' '}
                                                    {user.student_id}
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
                                </div>
                            </div>
                        </>
                    )}
                    <div className='h-full w-[350px] bg-zinc-900 p-4 text-white hidden xl:block'>
                        <div className='h-full flex flex-col justify-between'>
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
                                                params === 'all' &&
                                                'bg-zinc-700/70 rounded-md'
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
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div className='border-t-2 border-zinc-700/90 w-full'></div>
                                <div className='flex justify-between'>
                                    <div className='space-y-1'>
                                        <div className='text-xl font-bold'>
                                            {user.name}
                                        </div>
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
                        </div>
                    </div>
                    <QueryClientProvider client={queryClient}>
                        <div className='w-full h-full overflow-y-auto'>
                            <Routes>
                                <Route
                                    path='/*'
                                    element={<Tasks user={user} />}
                                />
                                <Route
                                    path='/projects'
                                    element={<Projects user={user} />}
                                />
                            </Routes>
                        </div>
                    </QueryClientProvider>
                </div>
            </IconContext.Provider>
        );
};
export default Home;
