import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { VerifySchema } from "@/schema/verify.schema";



export async function POST(request:Request){
    dbConnect();
    try {
        const {username,code} = await request.json();
        const verifiedSchema = VerifySchema.safeParse({code})
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername,isVerified:false})
        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }
        const isCodeValid = user.verifyCode === verifiedSchema.data?.code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(!isCodeValid){
            return Response.json({
                success:false,
                message:"code is not valid"
            },{status:400})
        }
        if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"code is expired please signup again"
            },{status:419})
        }

        user.isVerified = true;
        await user.save();

        return Response.json({
            success:true,
            message:"user verified successfully"
        },{status:200})
        
    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{status:500})
    }
}