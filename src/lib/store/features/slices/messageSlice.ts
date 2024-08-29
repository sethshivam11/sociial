import { MessageSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: MessageSliceI = {
  messages: [],
  loading: false,
  typing: false,
  skeletonLoading: false,
  loadingMore: false,
  editingMessage: false,
  page: 1,
};

const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (message: {
    content: string;
    chatId: string;
    reply: string;
    attachment?: Blob[];
  }) => {
    const formData = new FormData();
    formData.append("content", message.content);
    formData.append("chatId", message.chatId);
    formData.append("reply", message.reply);
    if (message.attachment) {
      message.attachment.forEach((file) => {
        formData.append("attachments", file);
      });
    }
    const parsed = await fetch("/api/v1/messages/send", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (chatId: string) => {
    const parsed = await fetch(`/api/v1/messages/get?chatId=${chatId}`);
    return parsed.json();
  }
);

const getMoreMessages = createAsyncThunk(
  "messages/getMoreMessages",
  async ({ chatId, page }: { chatId: string; page: number }) => {
    const parsed = await fetch(
      `/api/v1/messages/getMore?chatId=${chatId}&page=${page}`
    );
    return parsed.json();
  }
);

const reactMessage = createAsyncThunk(
  "messages/react",
  async (data: { messageId: string; content: string }) => {
    const parsed = await fetch(`/api/v1/messages/react`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return parsed.json();
  }
);

const unreactMessage = createAsyncThunk(
  "messages/unreact",
  async (messageId: string) => {
    const parsed = await fetch(`/api/v1/messages/unreact`, {
      method: "PATCH",
      body: JSON.stringify({ messageId }),
    });
    return parsed.json();
  }
);

const editMessage = createAsyncThunk(
  "messages/edit",
  async (data: { messageId: string; content: string }) => {
    const parsed = await fetch(`/api/v1/messages/editMessage`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return parsed.json();
  }
);

const deleteMessage = createAsyncThunk(
  "messages/delete",
  async (messageId: string) => {
    const parsed = await fetch(`/api/v1/messages/delete/${messageId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setEditingMessage: (state, action) => {
      state.editingMessage = action.payload;
    },
    messageReceived: (state, action) => {
      state.messages = action.payload.data;
    },
    messageDeleted: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload.data._id
      );
    },
    messageUpdated: (state, action) => {
      state.messages = state.messages.map((message) => {
        if (message._id === action.payload.data._id) {
          message.content = action.payload.data.content;
        }
        return message;
      });
    },
    setTyping: (state, action) => {
      state.typing = action.payload;
    },
    reacted: (state, action) => {
      state.messages = state.messages.map((message) => {
        if (message._id === action.payload.data.messageId) {
          message.reacts = [action.payload.data.reacts, ...message.reacts];
        }
        return message;
      });
    },
    unreacted: (state, action) => {
      state.messages = state.messages.map((message) => {
        if (message._id === action.payload.data._id) {
          message.reacts = message.reacts.filter(
            (react) => react._id !== action.payload.data.reacts._id
          );
        }
        return message;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.messages = [...state.messages, action.payload.data];
      }
    });
    builder.addCase(sendMessage.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getMessages.pending, (state) => {
      state.skeletonLoading = true;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.skeletonLoading = false;
      if (action.payload?.success) {
        state.messages = action.payload.data;
      }
    });
    builder.addCase(getMessages.rejected, (state) => {
      state.skeletonLoading = false;
    });

    builder.addCase(getMoreMessages.pending, (state) => {
      state.loadingMore = true;
    });
    builder.addCase(getMoreMessages.fulfilled, (state, action) => {
      state.loadingMore = false;
      if (action.payload?.success) {
        state.messages = [...state.messages, ...action.payload.data];
      }
    });
    builder.addCase(getMoreMessages.rejected, (state) => {
      state.loadingMore = false;
    });

    builder.addCase(reactMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(reactMessage.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.messages = state.messages.map((message) => {
          if (message._id === action.payload.data._id) {
            message.reacts = [action.payload.data.reacts, ...message.reacts];
          }
          return message;
        });
      }
    });
    builder.addCase(reactMessage.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(unreactMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(unreactMessage.fulfilled, (state, action) => {
      if (action.payload?.success) {
        state.messages = state.messages.map((message) => {
          if (message._id === action.payload.data._id) {
            message.reacts = message.reacts.filter(
              (react) => react._id !== action.payload.data.reacts._id
            );
          }
          return message;
        });
      }
    });
    builder.addCase(unreactMessage.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(editMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editMessage.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.messages = state.messages.map((message) => {
          if (message._id === action.payload.data._id) {
            message.content = action.payload.data.content;
          }
          return message;
        });
      }
    });
    builder.addCase(editMessage.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.messages = state.messages.filter(
          (message) => message._id !== action.payload.data._id
        );
      }
    });
    builder.addCase(deleteMessage.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  setEditingMessage,
  messageReceived,
  messageDeleted,
  messageUpdated,
  setTyping,
  reacted,
  unreacted,
} = messageSlice.actions;
export default messageSlice.reducer;
