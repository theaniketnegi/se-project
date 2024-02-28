import express from 'express';
import { CustomUserRequest } from '../utils/types';
import { Project, ProjectTask } from '../models/projects';

const projectTaskRouter = express.Router({ mergeParams: true });

const verifyProjectPermission = async (
    req: CustomUserRequest,
    res: express.Response,
    next: express.NextFunction,
) => {
    const projectId = req.params.id;
    const userId = req.user?.id;
    const project = await Project.findById(projectId);
    if (!project || project.created_by.toString() !== userId?.toString()) {
        return res.status(403).json({
            err: 'You do not have permission to access tasks for this project',
        });
    }

    next();
};

projectTaskRouter.use(verifyProjectPermission);

projectTaskRouter.get('/', async (req: CustomUserRequest, res, next) => {
    const projectId = req.params.id;
    const tasks = await ProjectTask.find({ project: projectId });
    return res.json(tasks);
});

projectTaskRouter.get('/:taskId', async (req: CustomUserRequest, res, next) => {
    const projectId = req.params.id;
    const taskId = req.params.taskId;
    const task = await ProjectTask.findOne({ project: projectId, _id: taskId });
    if (task) return res.status(200).json(task);
    return res.status(404).json({ err: 'Not found' });
});

projectTaskRouter.post('/', async (req: CustomUserRequest, res, next) => {
    const projectId = req.params.id;
    const { title, difficulty } = req.body;
    const task = new ProjectTask({ title, difficulty, project: projectId });
    await task.save();

    const project = await Project.findById(projectId);
    if (project) {
        project.projectTasks = project.projectTasks.concat(task._id);
        await project.save();
    }

    return res.status(201).json(task);
});

projectTaskRouter.delete(
    '/:taskId',
    async (req: CustomUserRequest, res, next) => {
        const projectId = req.params.id;
        const taskId = req.params.taskId;

        await ProjectTask.findByIdAndDelete(taskId);
        const project = await Project.findById(projectId);

        if (project) {
            project.projectTasks = project.projectTasks.filter(
                (task) => task.toString() !== taskId,
            );
            await project.save();
        }

        return res.status(204).end();
    },
);

projectTaskRouter.put('/:taskId', async (req: CustomUserRequest, res, next) => {
    const taskId = req.params.taskId;
    const { title, difficulty, done } = req.body;

    const projectTask = await ProjectTask.findByIdAndUpdate(
        taskId,
        { title, difficulty, done },
        { new: true, runValidators: true, context: 'query' },
    );

    return res.status(200).json(projectTask);
});

export default projectTaskRouter;
