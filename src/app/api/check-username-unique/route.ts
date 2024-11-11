import dbConnect from "@/lib/dbConnect";
import {z} from 'zod';
import UserModel from "@/model/user.model";
import { usernameSchema } from "@/schema/signUp.schema";


const UsernameQuerySchema = z.object({
    username:usernameSchema
})

export async function GET(request:Request){
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParams ={
            username:searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParams);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length > 0 
                ? usernameErrors.join(", ")
                : "invalid query parameters"
            },{status:400})
        }
        
        const {username} = result.data;

        const existingUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUsername){
            return Response.json({
                success:false,
                message:"username is already taken"
            },{status:400})
        }
        return Response.json({
            success:true,
            message:"username is unique"
        },{status:200})
        
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})
    }
}