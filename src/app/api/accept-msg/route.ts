import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { nextOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(request:Request){
    const session = await getServerSession(nextOptions);
    const user:User = session?.user as User;

    if(!session || !user){
        return Response.json({
            success:false,
            message:"unauthorized request"
        },{status:401})
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    await dbConnect()
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            {
                _id:userId,
                isVerified:true
            },
            {
                isAcceptingMessage:acceptMessages,
            }
        ).select("-password -verifyCode -verifyCodeExpiry")
        
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"falied to update user status to accept message"
            },{status:401})
        }

        return Response.json({
            success:true,
            message:"message acceptance status is updated",
            updatedUser
        },{status:200})
        
    } catch (error) {
        console.log("falied to update user status to accept message",error)
        return Response.json({
            success:false,
            message:"falied to update user status to accept message"
        },{status:500})
    }

}

export async function GET(request:Request){
    const session = await getServerSession(nextOptions);
    const user:User = session?.user as User;
    if(!session || !user){
        return Response.json({
            success:false,
            message:"unauthorized request"
        },{status:401})
    }
    const userId = user._id;
    try {
        await dbConnect();
        const foundUser = await UserModel.findOne({_id:userId,isVerified:true})        
        if(!foundUser){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }
        return Response.json({
            success:true,
            isAcceptingMessages :foundUser.isAcceptingMessage
        },{status:200})
    } catch (error) {
        console.error("error getting user {accept message status} ",error)
        return Response.json({
            success:false,
            message:"error getting user {accept message status"
        },{status:500})
    }
}
