import { ChatSliceI } from "@/types/sliceTypes";
import { ChatI } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: ChatSliceI = {
  chats: [],
  chat: {
    _id: "",
    users: [],
    admin: [],
    isGroupChat: false,
    groupName: "",
    groupIcon: "",
    lastMessage: {
      _id: "",
      kind: "message",
      content: "",
      createdAt: "",
    },
    createdAt: "",
  },
  skeletonLoading: false,
  loadingMore: false,
  loading: false,
  page: 1,
};

export const getChats = createAsyncThunk("chats/getChats", async () => {
  const parsed = await fetch("/api/v1/chats/get");
  return parsed.json();
});

export const getMoreChats = createAsyncThunk(
  "chats/getMoreChats",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/chats/get?page=${page}`);
    return parsed.json();
  }
);

export const newChat = createAsyncThunk("chats/newChat", async (userId: string) => {
  const parsed = await fetch("/api/v1/chats/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  return parsed.json();
});

export const newGroupChat = createAsyncThunk(
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

export const addParticipants = createAsyncThunk(
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

export const removeParticipants = createAsyncThunk(
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

export const updateGroupChat = createAsyncThunk(
  "chats/updateGroupChat",
  async ({
    chatId,
    groupName,
    groupImage,
  }: {
    chatId: string;
    groupName: string;
    groupImage: File;
  }) => {
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("groupName", groupName);
    formData.append("groupImage", groupImage);
    const parsed = await fetch("/api/v1/chats/updateGroup", {
      method: "PUT",
      body: formData,
    });
    return parsed.json();
  }
);

export const removeGroupImage = createAsyncThunk(
  "chats/removeGroupImage",
  async (chatId: string) => {
    const parsed = await fetch(`/api/v1/chats/removeGroupImage/${chatId}`, {
      method: "PATCH",
    });
    return parsed.json();
  }
);

export const leaveGroupChat = createAsyncThunk(
  "chats/leaveGroupChat",
  async (chatId: string) => {
    const parsed = await fetch(`/api/v1/chats/leaveGroup/${chatId}`);
    return parsed.json();
  }
);

export const deleteGroupChat = createAsyncThunk(
  "chats/deleteGroupChat",
  async (chatId: string) => {
    const parsed = await fetch(`/api/v1/chats/deleteGroup/${chatId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

export const makeAdmin = createAsyncThunk(
  "chats/makeAdmin",
  async ({ chatId, userId }: { userId: string; chatId: string }) => {
    const parsed = await fetch("/api/v1/chats/makeAdmin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, chatId }),
    });
    return parsed.json();
  }
);

export const removeAdmin = createAsyncThunk(
  "chats/removeAdmin",
  async ({ chatId, userId }: { userId: string; chatId: string }) => {
    const parsed = await fetch("/api/v1/chats/removeAdmin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, chatId }),
    });
    return parsed.json();
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    addedToGroup: (state, action) => {
      state.chats = [action.payload.data, ...state.chats];
    },
    leftGroup: (state, action) => {
      state.chat.users = state.chat.users.filter(
        (user) => user.username !== action.payload.data.username
      );
    },
    groupDeleted: (state, action) => {
      state.chats = state.chats.filter(
        (chat) => chat._id !== action.payload.data._id
      );
    },
    groupDetailsUpdated: (state, action) => {
      state.chat.groupName = action.payload.data.groupName;
      state.chat.groupIcon = action.payload.data.groupIcon;
    },
    newAdmin: (state, action) => {
      state.chat.admin = action.payload.data.admin;
    },
    removedAdmin: (state, action) => {
      state.chat.admin = action.payload.data.admin;
    },
    newChatStarted: (state, action) => {
      state.chats = [action.payload.data, ...state.chats];
    },
    newMessage: (state, action) => {
      state.chats = [
        action.payload,
        state.chats.filter((chat) => chat._id !== action.payload.data._id),
      ];
    },
    setCurrentChat: (state, action) => {
      state.chat = state.chats.find((chat) => chat._id === action.payload) as ChatI;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getChats.pending, (state) => {
      state.skeletonLoading = true;
    });
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.skeletonLoading = false;
      if (action.payload?.success) {
        state.chats = action.payload.data;
      }
    });
    builder.addCase(getChats.rejected, (state) => {
      state.skeletonLoading = false;
    });

    builder.addCase(getMoreChats.pending, (state) => {
      state.loadingMore = true;
    });
    builder.addCase(getMoreChats.fulfilled, (state, action) => {
      state.loadingMore = false;
      if (action.payload?.success) {
        state.chats = [...state.chats, ...action.payload.data];
      }
    });
    builder.addCase(getMoreChats.rejected, (state) => {
      state.loadingMore = false;
    });

    builder.addCase(newChat.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(newChat.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chats = [action.payload.data, ...state.chats];
      }
    });
    builder.addCase(newChat.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(newGroupChat.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(newGroupChat.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chats = [action.payload.data, ...state.chats];
      }
    });
    builder.addCase(newGroupChat.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(addParticipants.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addParticipants.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chat.users = action.payload.data.users;
      }
    });
    builder.addCase(addParticipants.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(removeParticipants.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeParticipants.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chat.users = action.payload.data.users;
      }
    });
    builder.addCase(removeParticipants.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateGroupChat.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateGroupChat.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chat.groupIcon = action.payload.data.groupIcon;
        state.chat.groupName = action.payload.data.groupName;
      }
    });
    builder.addCase(updateGroupChat.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(removeGroupImage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeGroupImage.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chat.groupIcon = action.payload.data.groupIcon;
      }
    });
    builder.addCase(removeGroupImage.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(leaveGroupChat.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(leaveGroupChat.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chats = state.chats.filter(
          (chat) => chat._id !== action.payload.data
        );
      }
    });
    builder.addCase(leaveGroupChat.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteGroupChat.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteGroupChat.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chats = state.chats.filter(
          (chat) => chat._id !== action.payload.data
        );
      }
    });
    builder.addCase(deleteGroupChat.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(makeAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(makeAdmin.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chat.admin = action.payload.data.admin;
      }
    });
    builder.addCase(makeAdmin.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(removeAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeAdmin.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.chat.admin = action.payload.data.admin;
      }
    });
    builder.addCase(removeAdmin.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  setPage,
  addedToGroup,
  leftGroup,
  groupDeleted,
  groupDetailsUpdated,
  newAdmin,
  removedAdmin,
  newChatStarted,
  newMessage,
  setCurrentChat
} = chatSlice.actions;

export default chatSlice.reducer;
