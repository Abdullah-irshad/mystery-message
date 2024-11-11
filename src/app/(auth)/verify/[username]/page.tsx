'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { VerifySchema } from '@/schema/verify.schema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const page = () => {
    const router = useRouter();
    const param = useParams<{username:string}>();
    const {toast} = useToast();
    const form = useForm<z.infer<typeof VerifySchema>>({
        resolver:zodResolver(VerifySchema),
        defaultValues:{
            code:""
        }
    })

    const onSubmit = async (data:z.infer<typeof VerifySchema>)=>{
        try {
            const response = await axios.post("/api/verify-code",{
                username:param.username,
                code:data.code
            })
            toast({
                title:"Success",
                description:response.data.message
            })
            router.replace("/signin");
        } catch (error) {
            console.log("Error in verifying code",error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title:"Signup failed",
                description:errorMessage,
                variant:"destructive"
            })
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
          <h1 className="text-4xl font-extralight tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                name='code'
                control={form.control}
                render={({field})=>(
                    <FormItem className='text-center'>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                         <div className='flex justify-center'>
                         <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                            </InputOTPGroup>
                            <InputOTPSeparator/>
                            <InputOTPGroup>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                            <InputOTPSlot index={5}/>
                            </InputOTPGroup>
                            </InputOTP>
                         </div>
                        </FormControl>
                        <FormDescription>
                        Please enter the one-time password sent to your email.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <div className='flex justify-center'>
                <Button type='submit' className='mt-6'>Submit</Button>
                </div>
            </form>
        </Form>
        </div>
    </div>
  )
}

export default page