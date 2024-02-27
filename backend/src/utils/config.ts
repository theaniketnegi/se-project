import dotenv from 'dotenv';
dotenv.config();
export const MONGODB_URI:string = process.env.MONGODB_URI as string;
export const SECRET:string = process.env.SECRET as string;