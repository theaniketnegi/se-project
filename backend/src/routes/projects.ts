import express from 'express';
import { CustomUserRequest } from '../utils/types';
import { Project } from '../models/projects';
import { User } from '../models/users';
import projectTaskRouter from './projectTasks';

const projectRouter = express.Router();

projectRouter.get('/', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const projects = await Project.find({ created_by: user?.id });
    return res.json(projects);
});

projectRouter.get('/:id', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const id = req.params.id;
    const project = await Project.findOne({ created_by: user?.id, _id: id });
    if (!project) return res.status(404).json({ err: 'Not found' });
    return res.status(200).json(project);
});

projectRouter.post('/', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const { title, description } = req.body;
    const project = new Project({ title, description, created_by: user?.id });
    const newProject = await project.save();
    const userFromDB = await User.findById(user?.id);
    if (userFromDB) {
        userFromDB.projects = userFromDB.projects.concat(newProject._id);
        await userFromDB.save();
    }
    return res.status(201).json(newProject);
});

projectRouter.put('/:id', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const id = req.params.id;
    const { title, description } = req.body;
    const project = await Project.findOneAndUpdate(
        { _id: id, created_by: user?.id },
        { title, description },
        { new: true, runValidators: true, context: 'query' },
    );

    return res.status(200).json(project);
});

projectRouter.delete('/:id', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const id = req.params.id;

    const userFromDB = await User.findById(user?.id);
    if (userFromDB) {
        userFromDB.projects = userFromDB.projects.filter(
            (project) => project.toString() !== id,
        );
        await userFromDB.save();
    }
    await Project.deleteOne({ created_by: user?.id, _id: id });
    return res.status(204).end();
});

projectRouter.use('/:id/tasks', projectTaskRouter);

export default projectRouter;
