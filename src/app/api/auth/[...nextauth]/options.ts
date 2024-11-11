import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt, { compare } from 'bcryptjs';
import mongoose from "mongoose";

export const nextOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{
                identifier:{label:"Email or Password",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials, req):Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne(
                        {
                            $or:[
                                {username:credentials?.identifier},
                                {email:credentials?.identifier}
                            ]
                        }
                    )
                    if(!user){
                        throw new Error("no user found");
                    }
                    if(!user.isVerified){
                        throw new Error("verify before login")
                    }
                    const comparePassword = await bcrypt.compare(credentials?.password as string,user.password);
                    if(!comparePassword){
                        throw new Error("credentials are not matched")
                    }
                    return user;
                } catch (err:any) {
                    throw new Error(err)
                }
            },
        })
    ],
    callbacks:{
        async session({session,token}){
            if (token) {
                session.user._id = token._id?.toString();
                session.user.username = token.username as string; 
                session.user.isAcceptingMessage = token.isAcceptingMessages as boolean; 
                session.user.isVerified = token.isVerified as boolean; 
            }
            return session;
        },
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.username = user.username
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessage;
            }
            return token;
        }
    },
    pages:{
        signIn:"/signin",
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}