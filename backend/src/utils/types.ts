import { Types } from 'mongoose';
import { Request } from 'express';

export type UserPayloadType = {
    student_id: Number;
    id: Types.ObjectId;
};

export interface CustomUserRequest extends Request {
    user?: UserPayloadType;
}
