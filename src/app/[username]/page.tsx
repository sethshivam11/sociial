import React from "react";

interface Props {
  params: {
    username: string;
  };
}

function Page({ params }: Props) {
  const username = params.username;
  return (
    <div className="min-h-screen xl:col-span-8 sm:col-span-9 col-span-10 container py-2 max-md:px-16 max-sm:px-2">
      Dear {username}, This page is under construction.
    </div>
  );
}

export default Page;
