import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailTemplates/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email:string,
    username:string,
    otp:string
):Promise<ApiResponse>{
    try{

        const { data, error } = await resend.emails.send({
            from: 'Ai <onboarding@resend.dev>',
            to: email,
            subject: 'verification code ',
            react:VerificationEmail({username,otp}),
          });

        return {
            success:true,
            message:"verification email send successfully"
        }
    }catch(error){
        console.log(error);
        return {
            success:false,
            message:"something went wrong"
        }
    }
}