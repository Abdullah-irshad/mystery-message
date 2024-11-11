"use client";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { SignInSchema } from '@/schema/signIn.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {useForm } from 'react-hook-form';
import { z } from 'zod';

const page = () => {
  const router = useRouter();
  const [isSubmitting,setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver:zodResolver(SignInSchema),
    defaultValues:{
      identifier:"",
      password:""
    }
  })
  const onSubmit = async (data:z.infer<typeof SignInSchema>)=>{
    const result = await signIn("credentials",{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
    })

    if(result?.error){

      if(result.error === "CredentialsSignin"){
        toast({
          title:"Login failed",
          description:"Incorrect credentials",
          variant:"destructive"
        })
      }
      else{
        toast({
          title:"Error",
          description:result.error,
          variant:"destructive"
        })
      }
    }
    console.log(result)
    if(result?.url){
      router.replace("/dashboard")
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extralight tracking-tight lg:text-5xl mb-6">Login</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <FormField
          name='identifier'
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>Email or Username</FormLabel>
              <FormControl>
                <Input placeholder='email or username' type='text' {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            )}
          />
          <FormField
          name='password'
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='password' type='password' {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
            )}
          />
          <Button type='submit' disabled={isSubmitting}>
            {
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Please wait
                </>
              ): ("Sigin")
            }
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
          <p>
            Not have an account ? {' '}
            <Link href={"/signup"} className="text-blue-600 hover:text-blue-800">Sign up now</Link>
          </p>
        </div>
      </div>
      </div>
  )
}

export default page