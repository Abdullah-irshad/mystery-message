import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { nextOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(req:Request){

    const session = await getServerSession(nextOptions)
    const sessionUser:User =  session?.user as User;

    if(!session || !sessionUser){
        return Response.json({
            success:false,
            message:"unauthorized request"
        },{status:401})
    }
    try {
        await dbConnect();
        const userId = new mongoose.Types.ObjectId(sessionUser._id)
        const user = await UserModel.aggregate([
          { $match:{_id:userId}},
          {$unwind:"$messages"},
          {$sort:{"messages.createdAt":-1}},
          {$group:{_id:"$_id",messages:{$push:"$messages"}}}
        ]);
        
        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message:"messsage not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            messages:user[0].messages
        },{status:200})

    } catch (error) {
        console.log("Error getting message",error);
        return Response.json({
            success:false,
            message:"internal sever error"
        },{status:500})
    }
}