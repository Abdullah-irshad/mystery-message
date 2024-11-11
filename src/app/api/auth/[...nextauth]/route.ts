import NextAuth from "next-auth/next";
import { nextOptions } from "./options";

const handler = NextAuth(nextOptions);

export {handler as POST, handler as GET}