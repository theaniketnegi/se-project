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

export function SigninModal({
    onCloseModal,
    onSignin,
    student_id,
    password,
    setStudentId,
    setPassword,
}: {
    onCloseModal: () => void;
    onSignin: (e:FormEvent) => void;
    student_id: string;
    password: string;
    setStudentId: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}) {
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
                                    <Label htmlFor='student_id'>
                                        Student ID
                                    </Label>
                                    <Input
                                        id='student_id'
                                        placeholder='Enter student ID'
                                        value={student_id}
                                        onChange={(e) =>
                                            setStudentId(e.target.value)
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
                            </div>
                        </CardContent>
                        <CardFooter className='flex justify-between'>
                            <Button type='button' onClick={onCloseModal} variant={'outline'}>
                                Cancel
                            </Button>
                            <Button type='submit'>
                                Sign in
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
