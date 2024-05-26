import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons/lib';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoChevronBackCircle } from 'react-icons/io5';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useEffect, useRef, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import AdminSidebarContent from './AdminSidebar';
import AdminAllStudents from './AdminAllStudents';

const queryClient = new QueryClient();

const Admin = () => {
    const location = useLocation();
    const params = location.pathname.replace('/', '');
    const admin = useAdminStore((state) => state.admin);
    const setAdmin = useAdminStore((state) => state.setAdmin);
    const navigate = useNavigate();

    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const sidebarToggle = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (localStorage.getItem('adminPayload')) {
            setAdmin(
                JSON.parse(localStorage.getItem('adminPayload') as string),
            );
        } else {
            navigate('/');
        }
    }, [setAdmin, navigate]);
    useEffect(() => {
        setShowSidebar(false);
    }, [params]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node | null) &&
                sidebarToggle.current &&
                !sidebarToggle.current.contains(event.target as Node | null)
            ) {
                setShowSidebar(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (admin)
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
                                className='bg-zinc-900 opacity-[0.97] w-[300px] absolute h-[100dvh] z-10'
                                ref={sidebarRef}
                            >
                                <div className='h-full p-4 flex flex-col justify-between text-white'>
                                    <AdminSidebarContent
                                        params={params}
                                        user={admin}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className='h-full w-[350px] bg-zinc-900 p-4 text-white hidden xl:block'>
                        <div className='h-full flex flex-col justify-between'>
                            <AdminSidebarContent params={params} user={admin} />
                        </div>
                    </div>
                    <QueryClientProvider client={queryClient}>
                        <div className='w-full h-full overflow-y-auto'>
                            <Routes>
                                <Route
                                    path='/students'
                                    element={<AdminAllStudents admin={admin} />}
                                />
                                {/* <Route
                                    path='/projects/*'
                                    element={<ProjectsRoute user={user} />}
                                /> */}
                            </Routes>
                        </div>
                    </QueryClientProvider>
                </div>
            </IconContext.Provider>
        );
};
export default Admin;
