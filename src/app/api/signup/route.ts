import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/util/sendVerificationEmail";

export async function POST(req:Request){
    await dbConnect();
    try {
        const {username,email,password} = await req.json();
        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserByUsername){
            return Response.json({
                success:false,
                message:"username is already taken"
            },{status:400})
        }
        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000+Math.random()*900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"user already exist with this email"
                })
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
                await existingUserByEmail.save({validateModifiedOnly:true});
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser =new  UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCodeExpiry:expiryDate,
                verifyCode,
                messages:[]
            })
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            })
        }

        return Response.json({
            success:true,
            message:"User registered success... please verify email"
        })

    } catch (error) {
        console.error("Error registering user",error);
        return Response.json({
            success:false,
            message:"Error registering user"
        },{
            status:500,
        })
    }
}