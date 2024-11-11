import {z} from 'zod';

export const MessageSchema = z.object({
    content:z.string().trim().min(10,{message:"content must be at least of 10 chars long"})
        .max(300,{message:"content must be no longer than 300 chars"})
})