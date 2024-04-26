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

export function ProjectTaskModal({
    onCloseModal,
    onAddTask,
}: {
    onCloseModal: () => void;
    onAddTask: (title: string, difficulty: string) => void;
}) {
    const [title, setTitle] = useState<string>('');
    const [difficulty, setDifficulty] = useState<string>('Easy');

    return (
        <div className='absolute top-0 left-0 w-screen bg-black/75 h-[100dvh] m-0 z-10 flex justify-center items-center'>
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
                                    <Label htmlFor='priority'>Difficulty</Label>
                                    <Select
                                        value={difficulty}
                                        onValueChange={(e) => setDifficulty(e)}
                                    >
                                        <SelectTrigger id='priority'>
                                            <SelectValue placeholder='Select' />
                                        </SelectTrigger>
                                        <SelectContent position='popper'>
                                            <SelectItem value='Easy'>
                                                Easy
                                            </SelectItem>
                                            <SelectItem value='Medium'>
                                                Medium
                                            </SelectItem>
                                            <SelectItem value='Hard'>
                                                Hard
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                onAddTask(title, difficulty);
                                setTitle('');
                                setDifficulty('Easy');
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
