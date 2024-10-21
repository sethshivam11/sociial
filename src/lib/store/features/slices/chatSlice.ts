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
};

export const getChats = createAsyncThunk("chats/getChats", async () => {
  const parsed = await fetch("/api/v1/chats/get");
  return parsed.json();
});

export const newChat = createAsyncThunk(
  "chats/newChat",
  async (userId: string) => {
    const parsed = await fetch("/api/v1/chats/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    return parsed.json();
  }
);

export const newGroupChat = createAsyncThunk(
  "chats/newGroupChat",
  async ({
    participants,
    name,
    description,
    image,
  }: {
    participants: string[];
    name: string;
    image?: File;
    description?: string;
  }) => {
    const formData = new FormData();
    formData.append("groupName", name);
    participants.forEach((participant) => {
      formData.append("participants", participant);
    });
    if (description) formData.append("groupDescription", description);
    if (image) formData.append("groupImage", image);
    const parsed = await fetch("/api/v1/chats/newGroup", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const addParticipants = createAsyncThunk(
  "chats/addParticipants",
  async ({
    participants,
    chatId,
  }: {
    participants: string[];
    chatId: string;
  }) => {
    const parsed = await fetch("/api/v1/chats/addParticipants", {
      method: "PATCH",
      body: JSON.stringify({ participants, chatId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return parsed.json();
  }
);

export const removeParticipants = createAsyncThunk(
  "chats/removeParticipants",
  async ({
    participants,
    chatId,
  }: {
    chatId: string;
    participants: string[];
  }) => {
    const parsed = await fetch("/api/v1/chats/removeParticipants", {
      method: "PATCH",
      body: JSON.stringify({ participants, chatId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return parsed.json();
  }
);

export const updateGroupDetails = createAsyncThunk(
  "chats/updateGroupDetails",
  async ({
    chatId,
    name,
    description,
    image,
  }: {
    chatId: string;
    name?: string;
    description?: string;
    image?: File;
  }) => {
    if (!name && !description && !image) {
      return {
        success: false,
        message: "Atleast 1 field is required",
        data: null,
        status: 400,
      };
    }

    const formData = new FormData();
    formData.append("chatId", chatId);
    if (name) formData.append("groupName", name);
    if (image) formData.append("groupImage", image);
    if (description || description === "")
      formData.append("description", description);

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
      body: JSON.stringify({ userId, chatId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return parsed.json();
  }
);

export const removeAdmin = createAsyncThunk(
  "chats/removeAdmin",
  async ({ chatId, userId }: { userId: string; chatId: string }) => {
    const parsed = await fetch("/api/v1/chats/removeAdmin", {
      method: "PATCH",
      body: JSON.stringify({ userId, chatId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return parsed.json();
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    newChatStarted: (state, action) => {
      state.chats = [action.payload.data, ...state.chats];
    },
    newGroup: (state, action) => {
      state.chats = [action.payload.chat, ...state.chats];
    },
    setCurrentChat: (state, action) => {
      state.chat = state.chats.find(
        (chat) => chat._id === action.payload
      ) as ChatI;
    },
    groupDeleted: (state, action) => {
      state.chats = state.chats.filter(
        (chat) => chat._id !== action.payload.chat._id
      );
    },
    addedToGroup: (state, action) => {
      if (state.chat._id === action.payload.chat._id) {
        state.chat.users = [
          ...state.chat.users,
          ...action.payload.participants,
        ];
      }
      state.chats.map((chat) => {
        if (chat._id === action.payload.chat._id) {
          chat.users = [...chat.users, ...action.payload.participants];
        }
        return chat;
      });
    },
    removedFromGroup: (state, action) => {
      if (state.chat._id === action.payload.chat._id) {
        state.chat.users = state.chat.users.filter(
          (user) => !action.payload.participants.includes(user._id)
        );
      }
      state.chats.map((chat) => {
        if (chat._id === action.payload.chat._id) {
          chat.users = chat.users.filter(
            (user) => !action.payload.participants.includes(user._id)
          );
        }
        return chat;
      });
    },
    groupDetailsUpdated: (state, action) => {
      if (state.chat._id === action.payload.chat._id) {
        if (state.chat.groupName !== action.payload.chat.groupName)
          state.chat.groupName = action.payload.chat.groupName;
        if (state.chat.description !== action.payload.chat.description)
          state.chat.description = action.payload.chat.description;
        if (state.chat.groupIcon !== action.payload.chat.groupIcon)
          state.chat.groupIcon = action.payload.chat.groupIcon;
      }
      state.chats.map((chat) => {
        if (chat._id === action.payload.chat._id) {
          if (chat.groupName !== action.payload.chat.groupName)
            chat.groupName = action.payload.chat.groupName;
          if (chat.description !== action.payload.chat.description)
            chat.description = action.payload.chat.description;
          if (chat.groupIcon !== action.payload.chat.groupIcon)
            chat.groupIcon = action.payload.chat.groupIcon;
        }
        return chat;
      });
    },
    leftGroup: (state, action) => {
      if (state.chat._id === action.payload.chat._id) {
        state.chat.users = state.chat.users.filter(
          (user) => user._id !== action.payload.user._id
        );
      }
      state.chats.map((chat) => {
        if (chat._id === action.payload.chat._id) {
          chat.users = chat.users.filter(
            (user) => user._id !== action.payload.user._id
          );
        }
        return chat;
      });
    },
    newAdmin: (state, action) => {
      if (state.chat._id === action.payload.chat._id) {
        state.chat.admin = [...state.chat.admin, ...action.payload.newAdmins];
      }
      state.chats.map((chat) => {
        if (chat._id === action.payload.chat._id) {
          chat.admin = [...chat.admin, ...action.payload.newAdmins];
        }
      });
    },
    removedAdmin: (state, action) => {
      if (state.chat._id === action.payload.chat._id) {
        state.chat.admin = state.chat.admin.filter(
          (user) => !action.payload.removedAdmins.includes(user)
        );
      }
      state.chats.map((chat) => {
        if (chat._id === action.payload.chat._id) {
          chat.admin = chat.admin.filter(
            (user) => !action.payload.removedAdmins.includes(user)
          );
        }
        return chat;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.chats = action.payload.data;
        }
      })
      .addCase(getChats.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(newChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(newChat.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chats = [action.payload.data, ...state.chats];
          state.chat = action.payload.data;
        }
      })
      .addCase(newChat.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(newGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(newGroupChat.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chats = [action.payload.data, ...state.chats];
          state.chat = action.payload.data;
        }
      })
      .addCase(newGroupChat.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(addParticipants.pending, (state) => {
        state.loading = true;
      })
      .addCase(addParticipants.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chat.users = [...state.chat.users, ...action.payload.data];
          state.chats.map((chat) => {
            if (chat._id === action.meta.arg.chatId) {
              chat.users = [...chat.users, ...action.payload.data];
            }
            return chat;
          });
        }
      })
      .addCase(addParticipants.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(removeParticipants.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeParticipants.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chat.users = state.chat.users.filter(
            (user) => !action.meta.arg.participants.includes(user._id)
          );
          state.chat.admin = state.chat.admin.filter(
            (user) => !action.meta.arg.participants.includes(user)
          );
          state.chats.map((chat) => {
            if (chat._id === action.meta.arg.chatId) {
              chat.users = chat.users.filter(
                (user) => !action.meta.arg.participants.includes(user._id)
              );
              chat.admin = chat.admin.filter(
                (user) => !action.meta.arg.participants.includes(user)
              );
            }
          });
        }
      })
      .addCase(removeParticipants.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateGroupDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGroupDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chat.groupIcon = action.payload.data.groupIcon;
          state.chat.groupName = action.payload.data.groupName;
          state.chat.description = action.payload.data.description;
          state.chats.map((chat) => {
            if (chat._id === action.meta.arg.chatId) {
              chat.groupIcon = action.payload.data.groupIcon;
              chat.groupName = action.payload.data.groupName;
              chat.description = action.payload.data.description;
            }
            return chat;
          });
        }
      })
      .addCase(updateGroupDetails.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(removeGroupImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeGroupImage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          const defaultIcon =
            "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1725736840/sociial/settings/feahtus4algwiixi0zmi.png";
          state.chat.groupIcon = defaultIcon;
          state.chats.map((chat) => {
            if (chat._id === action.meta.arg) {
              chat.groupIcon = defaultIcon;
            }
            return chat;
          });
        }
      })
      .addCase(removeGroupImage.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(leaveGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(leaveGroupChat.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chats = state.chats.filter(
            (chat) => chat._id !== action.meta.arg
          );
        }
      })
      .addCase(leaveGroupChat.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deleteGroupChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGroupChat.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chats = state.chats.filter(
            (chat) => chat._id !== action.meta.arg
          );
        }
      })
      .addCase(deleteGroupChat.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(makeAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(makeAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chat.admin = [...state.chat.admin, action.meta.arg.userId];
          state.chats.map((chat) => {
            if (chat._id === action.meta.arg.chatId) {
              chat.admin = [...chat.admin, action.meta.arg.userId];
            }
            return chat;
          });
        }
      })
      .addCase(makeAdmin.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(removeAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.chat.admin = state.chat.admin.filter(
            (user) => user !== action.meta.arg.userId
          );
          state.chats.map((chat) => {
            if (chat._id === action.meta.arg.chatId) {
              chat.admin = chat.admin.filter(
                (user) => user !== action.meta.arg.userId
              );
            }
            return chat;
          });
        }
      })
      .addCase(removeAdmin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  addedToGroup,
  leftGroup,
  groupDeleted,
  groupDetailsUpdated,
  newAdmin,
  removedAdmin,
  newChatStarted,
  setCurrentChat,
  newGroup,
  removedFromGroup,
} = chatSlice.actions;

export default chatSlice.reducer;
