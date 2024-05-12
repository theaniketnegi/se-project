import mongoose from 'mongoose';

interface TaskType extends Document {
    title: string;
    due_date: Date;
    done?: boolean;
    priority: string;
    created_by: mongoose.Types.ObjectId;
}


const taskSchema: mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        due_date: {
            type: Date,

        },
        done: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High'],
            default: 'Low',
            required: true,
        },
        created_by: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
);

export const Task = mongoose.model<TaskType>('Task', taskSchema);
