import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { NoticeType } from '@/types';

export function NoticeModal({
    notice,
    onCloseModal,
    onMarkRead,
}: {
    notice: NoticeType;
    onCloseModal: () => void;
    onMarkRead: () => void;
}) {
    return (
        <div className='fixed top-0 left-0 w-screen bg-black/75 h-[100dvh] m-0 z-10 flex justify-center items-center'>
            <div className='relative z-20'>
                <Card className='w-[350px]'>
                    <CardHeader>
                        <CardTitle>{notice.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-lg'>{notice.description}</div>
                    </CardContent>
                    <CardFooter className='flex justify-between'>
                        <Button onClick={onCloseModal} variant='outline'>
                            Close
                        </Button>
                        <Button onClick={() => onMarkRead()}>
                            {!notice.read ? 'Mark as read' : 'Mark as unread'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
