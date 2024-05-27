import { AdminType, UserType } from '@/types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState, useTransition } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../ui/use-toast';

const AdminCreateStudent = ({ admin }: { admin: AdminType }) => {
    const [student_id, setId] = useState('');
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [program, setProgram] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { toast } = useToast();

    const [pending, startTransition] = useTransition();

    const addStudentMutation = useMutation({
        mutationFn: ({
            name,
            section,
            student_id,
            program,
            password,
        }: {
            name: string;
            section: string;
            student_id: string;
            program: string;
            password: string;
        }) =>
            axios
                .post(
                    '/api/users',
                    { name, section, student_id, program, password },
                    { headers: { Authorization: `Bearer ${admin.token}` } },
                )
                .then((res) => res.data),
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error creating student',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (newUser: UserType) => {
            toast({
                title: 'Created student',
                description: `Created new student ${newUser.student_id}`,
            });
            setName('');
            setPassword('');
            setProgram('');
            setSection('');
            setId('');
            navigate('/admin/students');
        },
    });

    const CreateStudentHandler = () => {
        startTransition(() => {
            addStudentMutation.mutate({
                name,
                password,
                program,
                section,
                student_id,
            });
        });
    };

    return (
        <>
            <div className='w-[90%] p-6 md:p-8 mx-auto flex flex-col space-y-16'>
                <div className='w-full space-y-4 mt-4'>
                    <h1 className='text-5xl font-bold'>Create new student</h1>
                    <div className='border-t-2 border-zinc-700/20 w-full'></div>
                </div>
                <div className='w-[40%] mt-24'>
                    <div className='space-y-8 w-full'>
                        <div>
                            <Label>Student ID</Label>
                            <Input
                                type='number'
                                value={student_id}
                                onChange={(e) => setId(e.target.value)}
                                disabled={pending}
                            />
                        </div>
                        <div>
                            <Label>Name</Label>
                            <Input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={pending}
                            />
                        </div>
                        <div>
                            <Label>Section</Label>
                            <Input
                                type='text'
                                maxLength={1}
                                minLength={1}
                                value={section}
                                disabled={pending}
                                onChange={(e) => setSection(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Program</Label>
                            <Select
                                value={program}
                                onValueChange={(e) => setProgram(e)}
                                disabled={pending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select program' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='B.Tech.'>
                                        B.Tech.
                                    </SelectItem>
                                    <SelectItem value='M.Tech.'>
                                        M.Tech.
                                    </SelectItem>
                                    <SelectItem value='B.B.A.'>
                                        B.B.A.
                                    </SelectItem>
                                    <SelectItem value='M.B.A.'>
                                        M.B.A.
                                    </SelectItem>
                                    <SelectItem value='B.Sc.'>B.Sc.</SelectItem>
                                    <SelectItem value='M.Sc.'>M.Sc.</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={pending}
                            />
                        </div>
                        <div className='space-y-4 flex flex-col'>
                            <Button
                                className='w-full'
                                onClick={CreateStudentHandler}
                                disabled={pending}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AdminCreateStudent;
