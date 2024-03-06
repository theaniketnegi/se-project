import { FormEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import axios from 'axios';
import { useUserStore } from '@/store/userStore';
import { UserType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { SigninModal } from './SigninModal';

const SignInPage = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const { toast } = useToast();
    const navigate = useNavigate();

    if (user) return <Navigate to='/today' />;

    const SignInButtonHandler = async (e: FormEvent) => {
        e.preventDefault();

        if (studentId.trim() === '' || password.trim() === '') return;
        setLoading(true);
        try {
            const userResponse = await axios.post('/api/login', {
                student_id: studentId,
                password,
            });

            const userPayload: UserType = userResponse.data;
            setUser(userPayload);
            console.log(userPayload);
            setStudentId('');
            setPassword('');
            localStorage.setItem('userPayload', JSON.stringify(userPayload));
            navigate('/today');
        } catch (err: unknown) {
            const error = err as { response: { data: { err: string } } };
            toast({
                variant: 'destructive',
                title: `Unauthorized`,
                description: `${
                    error.response.data.err
                        ? error.response.data.err
                        : 'Error connecting'
                }`,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {loading && (
                <div className='absolute flex justify-center items-center z-20 w-screen bg-black/75 h-[100dvh]'>
                    <div className='border border-t-4 border-gray-400 rounded-full h-12 w-12 animate-spin'></div>
                </div>
            )}
            {showModal && (
                <SigninModal
                    onCloseModal={() => setShowModal(false)}
                    onSignin={SignInButtonHandler}
                    student_id={studentId}
                    password={password}
                    setStudentId={setStudentId}
                    setPassword={setPassword}
                />
            )}
            <div className='block xl:flex xl:flex-row h-full'>
                <div className='bg-zinc-900 h-[100dvh] flex xl:flex-1 justify-center xl:justify-start items-center xl:pl-8 2xl:pl-24'>
                    <div className='flex flex-col justify-center xl:justify-start xl:items-start items-center space-y-6 '>
                        <h1 className='text-white text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-bold cursor-pointer hover:-translate-y-2 transition duration-500 xl:w-[600px] text-center xl:text-left'>
                            Task Management
                        </h1>
                        <h6 className='text-white text-center xl:text-left text-2xl'>
                            Task management application for students
                        </h6>
                        <div className='xl:hidden'>
                            <Button
                                variant={'ghost'}
                                className='border-2 px-4 py-2 outline-primary-foreground text-primary-foreground'
                                onClick={() => setShowModal(true)}
                            >
                                Sign in
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='hidden xl:flex-1 bg-white xl:flex justify-center items-center h-[100dvh]'>
                    <div className='space-y-16 flex items-center justify-center flex-col w-[300px]'>
                        <h2 className='text-5xl font-bold'>Sign in</h2>
                        <form
                            className='space-y-8 w-full'
                            onSubmit={SignInButtonHandler}
                        >
                            <div>
                                <Label>Student ID</Label>
                                <Input
                                    type='number'
                                    value={studentId}
                                    onChange={(e) =>
                                        setStudentId(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label>Password</Label>
                                <Input
                                    type='password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <Button className='w-full'>Sign in</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SignInPage;
