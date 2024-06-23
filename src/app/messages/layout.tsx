"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { History, Search, SearchX, Users, X } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { usePathname, useRouter } from "next/navigation";

function Messages({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const location = usePathname();
  const [chats, setChats] = React.useState([
    {
      id: "1",
      fullName: "John Doe",
      username: "johndoe",
      message: "Hello",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "2",
      fullName: "Jane Smith",
      username: "janesmith",
      message:
        "Hi there! This is a very long message and I also don't know what I am writing",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "3",
      fullName: "Alex Johnson",
      username: "alexjohnson",
      message: "Good day!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "4",
      fullName: "Sam Brown",
      username: "sambrown",
      message: "How's it going?",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "5",
      fullName: "Emily White",
      username: "emilywhite",
      message: "Cheers!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "6",
      fullName: "Michael Green",
      username: "michaelgreen",
      message: "Looking forward to it!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "7",
      fullName: "Linda Brown",
      username: "lindabrown",
      message: "Thank you!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "8",
      fullName: "David Wilson",
      username: "davidwilson",
      message: "See you soon!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "9",
      fullName: "Carol Harris",
      username: "carolharris",
      message: "Can't wait!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "10",
      fullName: "Mark Smith",
      username: "marksmith",
      message: "Let's do this!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "11",
      fullName: "Laura Jones",
      username: "laurajones",
      message: "Absolutely!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "12",
      fullName: "Gary White",
      username: "garywhite",
      message: "Sounds great!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "13",
      fullName: "Sarah Brown",
      username: "sarahbrown",
      message: "On my way!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "14",
      fullName: "Brian Davis",
      username: "briandavis",
      message: "What's up?",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "15",
      fullName: "Nancy Wilson",
      username: "nancywilson",
      message: "Good luck!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "16",
      fullName: "Steven Moore",
      username: "stevenmoore",
      message: "Happy Birthday!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "17",
      fullName: "Jessica Taylor",
      username: "jessicataylor",
      message: "Congratulations!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "18",
      fullName: "Daniel Anderson",
      username: "danielanderson",
      message: "Interesting...",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "19",
      fullName: "Susan Wilson",
      username: "susanwilson",
      message: "That's awesome!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      id: "20",
      fullName: "James Johnson",
      username: "jamesjohnson",
      message: "See you later!",
      avatar:
        "https://res.cloudinary.com/dv3qbj0bn/image/upload/q_auto/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
    },
    {
      id: "21",
      fullName: "Patricia Miller",
      username: "patriciamiller",
      message: "Good morning!",
      avatar: "https://github.com/shadcn.png",
    },
  ]);
  const [search, setSearch] = React.useState("");
  const [savedChats, setSavedChats] = React.useState(chats);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const debounced = useDebounceCallback(setSearch, 500);

  React.useEffect(() => {
    if (search) {
      setChats(
        savedChats.filter((chat) =>
          chat.fullName.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setChats(savedChats);
    }
  }, [search]);

  return (
    <div className="grid min-h-screen xl:col-span-8 sm:col-span-9 col-span-10 sm:grid-cols-10 sm:container">
      <div
        className={`lg:col-span-3 md:col-span-4 col-span-10 md:flex flex-col items-start justify-start gap-2 py-6 h-full max-h-screen min-h-80 md:px-0 sm:px-4 px-5 ${
          location === "/messages" ? "flex" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between w-full mb-4 pr-2">
          <h1 className="text-2xl tracking-tight font-bold text-left py-2.5">
            Messages
          </h1>
          <button className="">
            <Users />
          </button>
        </div>

        <div className="w-full ring-2 flex items-center justify-center rounded-lg space-y-0 gap-1 ring-stone-500 focus-within:dark:ring-stone-200 focus-within:ring-stone-800 px-2 py-0.5 mb-2">
          <Search />
          <Input
            className="w-full ring-0 border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
            name="search"
            defaultValue={search}
            ref={searchRef}
            onChange={(e) => {
              debounced(e.target.value);
            }}
            placeholder="Search for messages"
            autoComplete="off"
            inputMode="text"
            autoFocus
          />
          <button
            className={`${search ? "visible" : "invisible"}`}
            onClick={() => {
              debounced("");
              (searchRef.current as HTMLInputElement).value = "";
            }}
          >
            <X size="20" />
          </button>
        </div>
        <div className="space-y-1 py-3 w-full md:overflow-y-auto md:h-screen sm:pb-2 pb-20">
          {chats.length ? (
            chats.map((chat, index) => (
              <button
                className="flex items-center justify-center rounded-md dark:hover:bg-stone-800 w-full gap-2 p-2"
                key={index}
                title={chat.username}
                onClick={() => {
                  router.push(`/messages/${chat.id}`);
                }}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={chat.avatar}
                    alt=""
                    className="pointer-events-none select-none"
                  />
                  <AvatarFallback>{nameFallback(chat.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center w-full">
                  <p className="">{chat.fullName}</p>
                  <p className="text-sm md:w-40 sm:w-80 w-40 text-left text-stone-500 text-ellipsis whitespace-nowrap overflow-x-hidden">
                    {chat.message}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4 text-center h-full">
              {search.length ? (
                <>
                  <SearchX size="60" />
                  <div>
                    <h2 className="text-2xl tracking-tight font-bold">
                      Nothing found
                    </h2>
                    <p className="text-stone-500">Try something else</p>
                  </div>
                </>
              ) : (
                <>
                  <History size="60" />
                  <div>
                    <h2 className="text-2xl tracking-tight font-bold">
                      No Chats yet
                    </h2>
                    <p className="text-stone-500">
                      Start a conversation with someone!
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default Messages;
