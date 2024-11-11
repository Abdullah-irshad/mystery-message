import {z} from 'zod';


export const VerifySchema = z.object({
    code:z.string().min(6,{message:"code must be 6 digits"})
})