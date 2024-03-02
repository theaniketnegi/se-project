import { FormEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import axios from 'axios';
import { useUserStore } from '@/store/userStore';
import { UserType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
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
                <div className='absolute flex justify-center items-center z-10 w-screen bg-black/75 h-screen'>
                    <div className='border border-t-4 border-gray-400 rounded-full h-12 w-12 animate-spin'></div>
                </div>
            )}
            <div className='block xl:flex xl:flex-row h-full'>
                <div className='bg-zinc-900 h-screen flex xl:flex-1 justify-center xl:justify-start items-center xl:pl-8 2xl:pl-24'>
                    <div className='space-y-6 xl:w-[300px] 2xl:w-[600px]'>
                        <h1 className='text-white text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-bold cursor-pointer hover:-translate-y-2 transition duration-500 xl:text-left text-center'>
                            Task Management
                        </h1>
                        <h6 className='text-white text-2xl xl:text-left text-center'>
                            Task management application for students
                        </h6>
                    </div>
                </div>
                <div className='xl:flex-1 bg-white flex justify-center items-center h-screen'>
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
