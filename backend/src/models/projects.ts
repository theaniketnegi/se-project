import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface ProjectType extends Document {
    title: string;
    description?: string;
    done?: boolean;
    tasks: mongoose.Types.ObjectId[];
    created_by: mongoose.Types.ObjectId;
}

const projectSchema:mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
		description: {
			type: String
		},
        done: {
            type: Boolean,
            default: false,
        },
        tasks: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
        created_by: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
);

projectSchema.plugin(uniqueValidator);
export const Project = mongoose.model<ProjectType>('Project', projectSchema);
