import { useState, useTransition } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AdminType } from '@/types';
import { useToast } from '../ui/use-toast';

const AdminNotices = ({ admin }: { admin: AdminType }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pending, startTransition] = useTransition();
    const { toast } = useToast();

    const addNoticesMutation = useMutation({
        mutationFn: ({
            title,
            description,
        }: {
            title: string;
            description: string;
        }) =>
            axios
                .post(
                    '/api/notices',
                    { title, description },
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
        onSuccess: () => {
            toast({
                title: 'Notice sent',
                description: `Sent notice to all the students`,
            });
            setTitle('');
            setDescription('');
        },
    });
    const CreateNoticeHandler = () => {
        startTransition(() => {
            addNoticesMutation.mutate({
                title,
                description,
            });
        });
    };
    return (
        <>
            <div className='w-[90%] p-6 md:p-8 mx-auto flex flex-col space-y-16'>
                <div className='w-full space-y-4 mt-4'>
                    <h1 className='text-5xl font-bold'>Create new notice</h1>
                    <div className='border-t-2 border-zinc-700/20 w-full'></div>
                </div>
                <div className='w-[40%] mt-24'>
                    <div className='space-y-8 w-full'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type='text'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className='space-y-4 flex flex-col'>
                            <Button
                                className='w-full'
                                onClick={CreateNoticeHandler}
                                disabled={pending}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AdminNotices;
