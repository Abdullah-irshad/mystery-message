import {z} from 'zod'

export const usernameSchema = z.string()
.trim()
.min(4,"username required minimum 4 char...")
.max(10)
.regex(/^[a-zA-Z0-9_]+$/,"username must not contain speacial char...")

export const SignUpSchema = z.object({
    username:usernameSchema,
    email:z.string().email({message:"invalid email address"}),
    password:z.string().min(6,"password must be atleat 6 char...")
})