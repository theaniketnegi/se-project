import mongoose from 'mongoose';

interface NoticeType extends Document {
    title: string;
    description: string;
    createdBy: mongoose.Types.ObjectId;
}

const noticeSchema: mongoose.Schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: String,
        },
        description: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
        },
    },
    { timestamps: true },
);

export const Notice = mongoose.model<NoticeType>('Notice', noticeSchema);
