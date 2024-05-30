import { NoticeType, UserType } from '@/types';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { useState } from 'react';
import { NoticeModal } from './NoticeModal';

const NoticeCard = ({
    notice,
    user,
}: {
    notice: NoticeType;
    user: UserType;
}) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [modal, setModal] = useState(false);
    const updateReadStatus = useMutation({
        mutationFn: async (noticeId: string) => {
            const response = await axios.put(
                `/api/users/${user.student_id}`,
                { noticeId },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                },
            );
            const data = response.data;
            return data;
        },
        onError: (error: { response: { data: { err: string } } }) =>
            toast({
                variant: 'destructive',
                title: 'Error updating read status',
                description: error.response.data.err
                    ? `${error.response.data.err}`
                    : 'Error connecting',
            }),
        onSuccess: (notice: NoticeType) => {
            console.log(notice);
            const notices: NoticeType[] = queryClient.getQueryData([
                'notices',
            ]) as NoticeType[];
            queryClient.setQueryData(
                ['notices'],
                notices.map((n) => (n._id === notice._id ? notice : n)),
            );
        },
    });
    return (
        <>
            {modal && (
                <NoticeModal
                    onCloseModal={() => setModal(false)}
                    notice={notice}
                    onMarkRead={() => updateReadStatus.mutate(notice._id)}
                />
            )}
            <div
                className={`p-4 cursor-pointer border-black border-2 rounded-lg shadow-sm flex justify-between items-center`}
                style={{
                    borderColor: `${notice.read ? 'black' : 'rgb(239 68 68)'}`,
                }}
                onClick={() => setModal(true)}
            >
                <div className='text-lg font-bold'>{notice.title}</div>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateReadStatus.mutate(notice._id);
                    }}
                >
                    {notice.read ? 'Mark as unread' : 'Mark as read'}
                </Button>
            </div>
        </>
    );
};
export default NoticeCard;
