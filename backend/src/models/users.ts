import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface UserType extends Document {
    name: string;
    section: string;
    student_id: number;
    program: string;
    role?: string;
    passwordHash: string;
    tasks: mongoose.Types.ObjectId[];
    projects: mongoose.Types.ObjectId[];
}

const userSchema: mongoose.Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 4,
        },
        section: {
            type: String,
            validate: {
                validator: function (v: string) {
                    return /^[A-Z]$/.test(v);
                },
                message: (props: any) =>
                    `${props.value} is not a valid section name. Section names must be a single character from 'A' to 'Z'.`,
            },
            required: true,
        },
        student_id: {
            type: Number,
            required: true,
            unique: true,
        },
        program: {
            type: String,
            enum: ['B.Tech.', 'M.Tech.', 'B.B.A.', 'M.B.A.', 'B.Sc.', 'M.Sc.'],
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        tasks: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
        projects: [{ type: mongoose.Types.ObjectId, ref: 'Project' }],
        createdBy: { type: mongoose.Types.ObjectId, ref: 'Admin' },
    },
    { timestamps: true },
);

userSchema.plugin(uniqueValidator);

export const User = mongoose.model<UserType>('User', userSchema);
