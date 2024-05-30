import { Types } from 'mongoose';
import { Request } from 'express';

export type UserPayloadType = {
    id: Types.ObjectId;
    role: 'Student' | 'Admin';
    created_by?: Types.ObjectId;
};

export interface CustomUserRequest extends Request {
    user?: UserPayloadType;
}
