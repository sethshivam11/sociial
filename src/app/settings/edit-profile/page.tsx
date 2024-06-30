import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import React from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useForm } from "react-hook-form";

function Page() {
  // const formSchema = z.object({
  //   bio: z.string().max(200, {
  //     message: "Bio must be less than 200 characters",
  //   }),
  //   fullName: z
  //     .string()
  //     .min(2, {
  //       message: "Name must be more than 2 characters",
  //     })
  //     .max(20, {
  //       message: "Name must be less than 20 characters",
  //     }),
  // });

  // const form = useForm<z.infer<typeof formSchema>>({
  //   defaultValues: {
  //     bio: "",
  //     fullName: "",
  //   },
  // });
  const user = {
    fullName: "Shivam Soni",
    username: "sethshivam11",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    bio: "I am a full stack developer and a tech enthusiast. I love to build things that make a difference.",
  };
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="flex flex-col gap-2 items-center justify-start w-2/3 rounded-full mt-6 px-4 py-2">
        <Avatar className="w-28 h-28 pointer-events-none select-none">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{nameFallback(user.fullName)}</AvatarFallback>
        </Avatar>
        <span className="text-blue-500 text-bold">Change photo</span>
      </div>
      <div className="w-2/3 flex flex-col items-center justify-center"></div>
    </div>
  );
}

export default Page;
