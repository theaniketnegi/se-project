import { UserType } from '@/types';
import { Route, Routes } from 'react-router-dom';
import Projects from './Projects';
import ProjectView from './ProjectView';

const ProjectsRoute = ({ user }: { user: UserType }) => {
    return (
        <Routes>
            <Route path='/' element={<Projects user={user} />} />
            <Route path='/:id' element={<ProjectView user={user} />} />
        </Routes>
    );
};
export default ProjectsRoute;
