import UserModel, { Message } from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req:Request){
    await dbConnect();
    const {username,content} = await req.json();

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user is not accepting messages"
            },{status:403})
        }

        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({
            success:true,
            message:"message sent success...."
        },{status:200})

    } catch (error) {
        console.log("Error sending message",error);
        return Response.json({
            success:false,
            message:"internal server error"
        },{status:500})
    }
}