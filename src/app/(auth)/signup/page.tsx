'use client';
import { useForm, } from "react-hook-form";
import axios,{AxiosError} from 'axios'
import { useState,useEffect } from "react";
import {useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/schema/signUp.schema";
import {zodResolver} from '@hookform/resolvers/zod'
import { z } from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {Loader2}  from 'lucide-react'
import Link from "next/link";



const page = () => {

  const [username,setUsername] = useState("");
  const [usernameServerMessage,setUsernameServerValue] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername,300);
  const {toast} = useToast();
  const router = useRouter();


  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver:zodResolver(SignUpSchema),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })

  useEffect(()=>{
    if(username.length === 0 ){
      setUsernameServerValue("");
    }
    const checkUsernameUnique = async ()=>{
      if(username.length>0){
        setIsCheckingUsername(true);
        setUsernameServerValue("");
        try {
         const response = await axios.get(`/api/check-username-unique?username=${username}`)
         setUsernameServerValue(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameServerValue(axiosError.response?.data.message || "Error checking username")
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique();
  },[username])

  const onSubmit = async (data:z.infer<typeof SignUpSchema>)=>{
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>("/api/signup",data)
      toast({
        title:response.data.success ? "Success" :"Error",
        description:response.data.message
      })
      if(response.data.success){
        router.replace(`/verify/${username}`)
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user",error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"signup failed",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extralight tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            name="username"
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field}
                  onChange={(e)=>{
                    field.onChange(e);
                    debounced(e.target.value.trim())
                  }}
                  />
                </FormControl>
                  {
                    isCheckingUsername && <Loader2 className="animate-spin"/>
                  }
                  <p className={`text-sm ${usernameServerMessage === "username is unique" ? "text-green-500":"text-red-500"} `}>
                    {usernameServerMessage}
                  </p>
                <FormMessage/>
              </FormItem>
            )}/>
              <FormField
            name="email"
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
              <FormField
            name="password"
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Please wait
                  </>
                ) : ("Signup")
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member ? {' '}
            <Link href={"/signin"} className="text-blue-600 hover:text-blue-800">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page