import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import {Message} from '../model/user.model'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

interface MessageCardProps{
    message:Message,
    onMessageDelete:(messageId:string)=>void
}

const MessageCard = ({
    message,
    onMessageDelete
}:MessageCardProps) => {
    const {toast} = useToast();
    const handleDeleteConfirmn  = async ()=>{
        const response = await axios.delete(`/api/delete-msg/${message._id}`)
        toast({
            title:response.data.message
        })
        onMessageDelete(message._id  as string)
    }
    const isoDate = message.createdAt;
    const dateObject = new Date(isoDate);
    const date = dateObject.toLocaleString();
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Message</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X className='w-5 h-5'/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirmn}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <CardDescription>{date}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{message.content}</p>
                </CardContent>
            </Card>

        </div>
    )
}

export default MessageCard