import React from "react";

function Page({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const [user, setUser] = React.useState({
    fullName: "Shad",
    username: "shadcn",
    avatar:
      "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1708096087/sociial/tpfx0gzsk7ywiptsb6vl.png",
  });
  return <div className="col-span-10 ">Page</div>;
}

export default Page;
