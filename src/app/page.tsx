import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
return(
  <>
  <div className="flex flex-col justify-center text-center items-center gap-5 h-screen">
    <h1 className="text-6xl bg-gradient-to-r from-black via-gray-500 to-gray-200 text-transparent bg-clip-text leading-tight
  ">Welcome to Mystery Message</h1>
    <p className="text-2xl font-extralight tracking-tight text 
    bg-gradient-to-r from-black via-gray-500 to-gray-200 text-transparent bg-clip-text leading-tigh">
      lets start sharing real feedbacks without exposing your identity</p>
      <div className="space-x-5 mt-5">
        <Button variant={"default"} className="w-20"><Link href={"/signin"}>Login</Link></Button>
        <Button variant={"default"} className="w-20"><Link href={"/signup"}>signup</Link></Button>
      </div>
  </div>
  </>
)
}
