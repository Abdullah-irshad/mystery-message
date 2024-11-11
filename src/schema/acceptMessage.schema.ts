import {z} from 'zod';


export const AcceptMessagesSchema = z.object({
    acceptMessage:z.boolean()
})