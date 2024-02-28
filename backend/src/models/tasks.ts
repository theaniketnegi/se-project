import mongoose from 'mongoose';

interface TaskType extends Document {
    title: string;
    due_date: Date;
    done?: boolean;
    priority: string;
    created_by: mongoose.Types.ObjectId;
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const taskSchema: mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        due_date: {
            type: Date,
            validate: {
                validator: function (v: Date) {
                    return v >= today;
                },
				message: `Due date should be either today or later`,
            },
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
