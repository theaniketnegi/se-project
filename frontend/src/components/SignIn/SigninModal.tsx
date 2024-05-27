import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export function SigninModal({
    onCloseModal,
    onSignin,
    user_id,
    password,
    setUserId,
    setPassword,
    admin = false,
}: {
    onCloseModal: () => void;
    onSignin: (e: FormEvent) => void;
    user_id: string;
    password: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    admin?: boolean;
}) {
    const navigate = useNavigate();
    return (
        <div className='absolute top-0 left-0 w-screen bg-black/75 h-[100dvh] m-0 z-10 flex justify-center items-center'>
            <div className='relative z-20'>
                <Card className='w-[350px]'>
                    <form onSubmit={onSignin}>
                        <CardHeader>
                            <CardTitle>Sign in</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid w-full items-center gap-4'>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label
                                        htmlFor={`${
                                            !admin ? 'student_id' : 'admin_id'
                                        }`}
                                    >
                                        {!admin ? 'Student ID' : 'Admin ID'}
                                    </Label>
                                    <Input
                                        id={`${
                                            !admin ? 'student_id' : 'admin_id'
                                        }`}
                                        placeholder={`Enter ${
                                            !admin ? 'Student ID' : 'Admin ID'
                                        }`}
                                        value={user_id}
                                        onChange={(e) =>
                                            setUserId(e.target.value)
                                        }
                                    />
                                </div>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='password'>Password</Label>
                                    <Input
                                        id='password'
                                        type='password'
                                        placeholder='Enter password'
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <Button
                                        variant={'link'}
                                        className='self-end'
                                        type='button'
                                        onClick={() =>
                                            navigate(
                                                `${admin ? '/' : '/admin'}`,
                                            )
                                        }
                                    >
                                        {admin
                                            ? 'Student login?'
                                            : 'Admin login?'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className='flex justify-between'>
                            <Button
                                type='button'
                                onClick={onCloseModal}
                                variant={'outline'}
                            >
                                Cancel
                            </Button>
                            <Button type='submit'>Sign in</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
