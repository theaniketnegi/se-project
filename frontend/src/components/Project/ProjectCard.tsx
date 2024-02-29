import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';

const ProjectCard = () => {
    return (
        <Card className='w-[400px] h-[200px] relative shadow-md hover:-translate-y-2 transition duration-200 cursor-pointer'>
            <CardHeader className='p-6 pt-12'>
                <CardTitle>Create project</CardTitle>
                <CardDescription>
                    Deploy your new project in one-click.
                </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className='relative'>
                <div>60% complete</div>
            </CardFooter>
            <div
                className={`absolute bottom-0 left-0 w-[60%] bg-zinc-900  h-1`}
            ></div>
        </Card>
    );
};
export default ProjectCard;
