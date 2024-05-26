import { Types } from 'mongoose';
import { Request } from 'express';

export type UserPayloadType = {
    id: Types.ObjectId;
	role: String;
};

export interface CustomUserRequest extends Request {
    user?: UserPayloadType;
}
