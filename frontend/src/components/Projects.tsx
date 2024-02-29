import CreateButton from './CreateButton';
import ProjectCard from './Project/ProjectCard';

const Projects = ({ user }: { user: UserType }) => {
    return (
        <>
            <div className='w-[90%] p-8 mx-auto flex flex-col space-y-8'>
                <div className='w-full space-y-4 mt-4'>
                    <h1 className='text-5xl font-bold'>Projects</h1>
                    <div className='border-t-2 border-zinc-700/20 w-full'></div>
                </div>
                <CreateButton
                    className='w-32 py-1 px-2 ml-auto flex justify-around items-center'
                    onClick={() => console.log('test')}
                    text='New Project'
                />
                <div className='w-full h-full'>
                    <div className='grid grid-cols-3 gap-24'>
                        <ProjectCard />
                        <ProjectCard />
                        <ProjectCard />
                        <ProjectCard />
                        <ProjectCard />
                    </div>
                </div>
            </div>
        </>
    );
};
export default Projects;
