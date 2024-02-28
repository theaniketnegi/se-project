import { FormEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import axios from 'axios';
import { useUserStore } from '@/store/userStore';
import { UserType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useUserStore((state) => state.setUser);
    const { toast } = useToast();
	const navigate = useNavigate();

    const SignInButtonHandler = async (e: FormEvent) => {
        e.preventDefault();

        if (studentId.trim() === '' || password.trim() === '') return;
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
			navigate('/');
        } catch (err) {
			toast({
				variant: 'destructive',
				title: `Unauthorized`,
				description: `${err.response.data.err}`,
			});
        }
    };
    return (
        <div className='flex h-full'>
            <div className='bg-zinc-900 flex flex-1 items-center pl-24'>
                <div className='space-y-6 w-[600px]'>
                    <h1 className='text-white text-8xl font-bold cursor-pointer hover:-translate-y-2 transition duration-500'>
                        Task Management
                    </h1>
                    <h6 className='text-white text-2xl'>
                        Task management application for students
                    </h6>
                </div>
            </div>
            <div className='flex-1 bg-white flex justify-center items-center'>
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
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className='w-full'>Sign in</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default SignInPage;
