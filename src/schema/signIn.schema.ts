import {z} from 'zod';


export const SignInSchema = z.object({
    identifier:z.string().min(4,"Username must contain at least 4 character(s) or a valid Email").refine((val)=>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const specialRegex = /[^\w\s_]/
        if(val.match(specialRegex)){
            return val.match(emailRegex);
        }
        return val.length >=4;
    },{
        message:"Identifier must be either a valid email or a username with at least 4 characters."
    }),
    password: z.string().min(6, "Password must be at least 6 characters long."),
})