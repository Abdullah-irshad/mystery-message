'use client';
import MessageCard from '@/components/MessageCard';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/user.model';
import { AcceptMessagesSchema } from '@/schema/acceptMessage.schema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const dashboard = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingLoading, setIsSwitchingLaoding] = useState(false);
  const [isAcceptingMessages,setIsAcceptingMessages] = useState(true);

  const { toast } = useToast();

  const onHandleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(message => message._id !== messageId));
  }
  const { data: session } = useSession();
  const { register, setValue, watch } = useForm<z.infer<typeof AcceptMessagesSchema>>({
    resolver: zodResolver(AcceptMessagesSchema),
    defaultValues: {
      acceptMessage: true
    }
  })

  const acceptMessage = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    try {
      setIsSwitchingLaoding(true);
      const response = await axios.get<ApiResponse>("/api/accept-msg");
      setIsAcceptingMessages(response.data.isAcceptingMessages || true);
      setValue("acceptMessage", response.data.isAcceptingMessages as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "failed to fetch message setting",
        variant: "destructive"
      })
    }
    finally {
      setIsSwitchingLaoding(false)
    }
  }, [setValue])

  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchingLaoding(false);
    try {
      const response = await axios.get<ApiResponse>("/api/get-msg", { withCredentials: true });
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "failed to fetch messages",
        variant: "destructive"
      })
    }
    finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessage])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-msg", {
        acceptMessages: !acceptMessage
      })
      setValue("acceptMessage", !acceptMessage)
      toast({
        title: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "failed to switch message setting",
        variant: "destructive"
      })
    }
  }
  if (!session || !session.user) {
    return <>Please Login</>
  }

  const profileUrl = location.origin.toString() + `/u/${session.user.username}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile url copied"
    })
  }
  return (
    <div>
      <Navbar />
      <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
        <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
        <div className='mb-4'>
          <h2 className='text-lg font-bold mb-4'> copy your unique link</h2>
          <div className='flex items-center'>
            <input type="text"
              disabled
              value={profileUrl}
              className='input input-bordered w-full p-2 mr-2'
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
          <div className='mb-4'>
            <Switch
              {...register("acceptMessage")}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchingLoading}
              checked={isAcceptingMessages}
            />
            <span className='ml-2'>
              Accept Messages : {acceptMessage ? "On" : "Off"}
            </span>
          </div>
          <Separator />
          <Button className='mt-4'
          variant={"outline"}
          onClick={(e)=>{
            e.preventDefault();
            fetchMessage(true);
          }}
          >
            {
              isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin'/>
              ) : (
                <RefreshCcw className='h-4 w-4'/>
              )
            }
          </Button>
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
            {
             messages.length > 0 ? (
              messages.map((message,index)=>(
                <MessageCard 
                key={message._id as string}
                message={message}
                onMessageDelete={onHandleDelete}
                />
              ))
             ) : (
              <p>No message to display</p>
             )
            }
          </div>
      </div>
    </div>
    </div >
  )
}

export default dashboard