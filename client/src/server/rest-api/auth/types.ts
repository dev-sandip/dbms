import z from "zod"

export const  formSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email" })
    .nonempty({ message: "Email is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});
export type FormSchema = z.infer<typeof formSchema>;

//  the above code will be in login page,
export type { FormSchema as EmailAndPasswordLoginProps } 