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
import { useState } from 'react';

export function ProjectModal({
    onCloseModal,
    onAddProject,
}: {
    onCloseModal: () => void;
    onAddProject: (title: string, description: string) => void;
}) {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    return (
        <div className='absolute top-0 left-0 w-screen bg-black/75 h-screen m-0 z-10 flex justify-center items-center'>
            <div className='relative z-20'>
                <Card className='w-[350px]'>
                    <CardHeader>
                        <CardTitle>Create a project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className='grid w-full items-center gap-4'>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='name'>Title</Label>
                                    <Input
                                        id='name'
                                        placeholder='Title of your project'
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                </div>
                                <div className='flex flex-col space-y-1.5'>
                                    <Label htmlFor='description'>
                                        Description
                                    </Label>
                                    <Input
                                        id='description'
                                        placeholder='Description of your project'
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
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
                            onClick={() => onAddProject(title, description)}
                        >
                            Add
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
