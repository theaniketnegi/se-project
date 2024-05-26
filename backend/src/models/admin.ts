import mongoose from 'mongoose';

interface AdminType extends Document {
    name: string;
    passwordHash: string;
    organization: string;
    students: mongoose.Types.ObjectId[];
}

const adminSchema: mongoose.Schema = new mongoose.Schema(
    {
        adminId: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            minlength: 4,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        organization: {
            type: String,
            required: true,
        },
        students: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true },
);

export const Admin = mongoose.model<AdminType>('Admin', adminSchema);
