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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const formattedDate = new Date().toISOString().split('T')[0];

export function TaskModal({
    onCloseModal,
    onAddTask,
}: {
    onCloseModal: () => void;
    onAddTask: (task_name: string, due_date: string, priority: string) => void;
}) {
    const [title, setTitle] = useState<string>('');
    const [priority, setPriority] = useState<string>('Low');
    const [dueDate, setDueDate] = useState<string>(formattedDate);

    return (
        <div className='absolute top-0 left-0 w-screen bg-black/75 h-screen m-0 z-10 flex justify-center items-center'>
            <div className='relative z-20'>
                <Card className='w-[350px]'>
                    <CardHeader>
                        <CardTitle>Create a task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className='grid w-full items-center gap-4'>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='name'>Title</Label>
                                    <Input
                                        id='name'
                                        placeholder='Title of your task'
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                </div>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='priority'>Priority</Label>
                                    <Select
                                        value={priority}
                                        onValueChange={(e) => setPriority(e)}
                                    >
                                        <SelectTrigger id='priority'>
                                            <SelectValue placeholder='Select' />
                                        </SelectTrigger>
                                        <SelectContent position='popper'>
                                            <SelectItem value='Low'>
                                                Low
                                            </SelectItem>
                                            <SelectItem value='Normal'>
                                                Normal
                                            </SelectItem>
                                            <SelectItem value='High'>
                                                High
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='dueDate'>Due date</Label>
                                    <Input
                                        type='date'
                                        value={dueDate}
                                        onChange={(e) =>
                                            setDueDate(e.target.value)
                                        }
                                        min={formattedDate}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className='flex justify-between'>
                        <Button onClick={onCloseModal} variant='outline'>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setTitle('');
                                setPriority('Low');
                                setDueDate('');
                                onAddTask(title, dueDate, priority);
                            }}
                        >
                            Add
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
