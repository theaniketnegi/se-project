import mongoose from 'mongoose';

interface ProjectType extends Document {
    title: string;
    description?: string;
    done?: boolean;
    projectTasks: mongoose.Types.ObjectId[];
    created_by: mongoose.Types.ObjectId;
}

interface ProjectTaskType extends Document {
    title: string;
    done: boolean;
    difficulty?: string;
    project: mongoose.Types.ObjectId;
}

const projectTaskSchema: mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        done: {
            type: Boolean,
            default: false,
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Easy',
        },
        project: {
            type: mongoose.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
    },
    { timestamps: true },
);

const projectSchema: mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        projectTasks: [{ type: mongoose.Types.ObjectId, ref: 'ProjectTask' }],
        created_by: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
);

export const ProjectTask = mongoose.model<ProjectTaskType>(
    'ProjectTask',
    projectTaskSchema,
);
export const Project = mongoose.model<ProjectType>('Project', projectSchema);
