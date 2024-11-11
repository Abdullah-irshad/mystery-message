import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { nextOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/user.model";

export async function DELETE(req:Request,{params}:{params:{messageId:string}}){
    const messageId  = params.messageId;
    await dbConnect();
    const session = await getServerSession(nextOptions);
    const user:User = session?.user as User;

    if(!session || !user){
        return Response.json({
            success:false,
            message:"unauthorized request"
        },{status:401})
    }

    try {
        const updatedMessage = await UserModel.updateOne(
            {
                _id:user._id
            },
            {
                $pull:{
                    messages:{_id:messageId}
                }
            }
        )

        if(updatedMessage.modifiedCount == 0){
            return Response.json({
                success:false,
                message:"Message not found or already deleted"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:"Message Deleted"
        },{status:200})

        
    } catch (error) {
        console.log("Error deleting message",error);
        return  Response.json({
            success:false,
            message:"error deleting message"
        },{status:500})
    }
}