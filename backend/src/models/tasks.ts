import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


interface TaskType extends Document {
    title: string;
    due_date: Date;
    done?: boolean;
    priority?: string;
    created_by: mongoose.Types.ObjectId;
}

const taskSchema:mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        due_date: {
            type: Date,
            required: true,
        },
        done: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ['Low', 'Normal', 'High'],
            default: 'Low',
        },
        created_by: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
);

taskSchema.plugin(uniqueValidator);
export const Task = mongoose.model<TaskType>('Task', taskSchema);
