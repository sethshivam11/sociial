import { Mail } from "lucide-react";

function Page() {
  return (
    <div className="md:border-l-2 border-stone-200 dark:border-stone-800 md:flex hidden flex-col items-center justify-center lg:col-span-7 md:col-span-6 col-span-10 gap-2">
        <Mail size="80" />
        <div>
            <h1 className="text-2xl font-bold">Your Messages</h1>
            <p className="text-stone-500">Start a conversation now! </p>
        </div>
    </div>
  );
}

export default Page;
