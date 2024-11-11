'use client';
import { Navbar } from '@/components/Navbar'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { MessageSchema } from '@/schema/message.schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInput, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
const page = () => {

  const [isSubmitting,setIsSubmitting] = useState(false);
  const [suggestionLoading,setSuggestionLoading] = useState(false);
  const [suggestions,serSuggestions] = useState<string[]>([]);
  const params = useParams<{username:string}>();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver:zodResolver(MessageSchema),
    defaultValues:{
      content:""
    }
  })
  const onSubmit = async (data:z.infer<typeof MessageSchema>)=>{
    try {
      setIsSubmitting(true);
      const content = form.getValues("content");
      const username = params.username;
      const response = await axios.post<ApiResponse>("/api/send-msg",{content,username});
      toast({
        title:"Message sent",
        description:response.data.message
      })
      form.setValue("content","");
    } catch (error) {
      console.log(error)
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title:axiosError.response?.data.message,
        variant:"destructive"
      })
    }
    finally{
      setIsSubmitting(false);
    }
  }

  const getSuggestions = async ()=>{
    try {
      const response = await axios.get("/api/suggest-msg");
      console.log("Response",response);
    } catch (error) {
      console.log("Suggestion error",error)
    }
  }


  return (
    <div>
      <Navbar/>
      <div className='ml-10 mr-10'>
        <h1 className='text-center mt-5 text-3xl font-normal'>Say what you think</h1>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
              name='content'
              control={form.control}
              render={({field})=>(
               <FormItem>
                <FormLabel className='text-xl'>Type you message to {params.username}</FormLabel>
                <FormControl>
                 <Input type='text' placeholder='Message' {...field}/>
                </FormControl>
                <FormMessage/>
               </FormItem>
              )}
              />
              <Button className='mt-3' type='submit' disabled={isSubmitting}>
                {
                  isSubmitting ? (
                   <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                   </>
                  ):(
                    "Send"
                  )
                }
              </Button>
            </form>
          </Form>
        </div>
        <Separator className='h-1 m-5'/>
        <div>
          <h2 className='text-xl text-center'>Suggestions</h2>

        </div>
      </div>
    </div>
  )
}

export default page