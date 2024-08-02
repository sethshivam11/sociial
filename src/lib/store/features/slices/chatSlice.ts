import { createAsyncThunk } from "@reduxjs/toolkit";

const getChats = createAsyncThunk("chats/getChats", async () => {
  const parsed = await fetch("/api/v1/chats/get");
  return parsed.json();
});

const getMoreChats = createAsyncThunk(
  "chats/getMoreChats",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/chats/get?page=${page}`);
    return parsed.json();
  }
);

const newChat = createAsyncThunk("chats/newChat", async (userId: string) => {
  const parsed = await fetch("/api/v1/chats/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  return parsed.json();
});

const newGroupChat = createAsyncThunk(
  "chats/newGroupChat",
  async ({
    participants,
    groupName,
    groupImage,
  }: {
    participants: string[];
    groupName: string;
    groupImage?: File;
  }) => {
    const formData = new FormData();
    formData.append("groupName", groupName);
    if (groupImage) formData.append("groupImage", groupImage);
    participants.forEach((participant) => {
      formData.append("participants", participant);
    });
    const parsed = await fetch("/api/v1/chats/newGroup", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

const addParticipants = createAsyncThunk(
  "chats/addParticipants",
  async (participants: string[]) => {
    const parsed = await fetch("/api/v1/addParticipants", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participants }),
    });
    return parsed.json();
  }
);

const removeParticipants = createAsyncThunk(
  "chats/removeParticipants",
  async (participants: string[]) => {
    const parsed = await fetch("/api/v1/removeParticipants", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participants }),
    });
    return parsed.json();
  }
);

