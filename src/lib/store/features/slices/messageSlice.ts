import { MessageSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: MessageSliceI = {
  messages: [],
  reactions: [],
  loading: false,
  typing: false,
  skeletonLoading: false,
  loadingMore: false,
  editingMessage: false,
  page: 1,
};

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (message: {
    content: string;
    chatId: string;
    reply?: string;
    kind?: "message" | "location" | "call" | "media" | "audio" | "document";
    attachment?: Blob[];
  }) => {
    const formData = new FormData();
    formData.append("message", message.content);
    formData.append("chatId", message.chatId);
    if (message.reply) formData.append("reply", message.reply);
    if (message.attachment) {
      message.attachment.forEach((file) => {
        formData.append("attachments", file);
      });
    }
    if(message.kind) formData.append("kind", message.kind);
    const parsed = await fetch("/api/v1/messages/send", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (chatId: string) => {
    const parsed = await fetch(`/api/v1/messages/get?chatId=${chatId}`);
    return parsed.json();
  }
);

export const getMoreMessages = createAsyncThunk(
  "messages/getMoreMessages",
  async ({ chatId, page }: { chatId: string; page: number }) => {
    const parsed = await fetch(
      `/api/v1/messages/getMore?chatId=${chatId}&page=${page}`
    );
    return parsed.json();
  }
);

export const reactMessage = createAsyncThunk(
  "messages/react",
  async ({ content, messageId }: { messageId: string; content: string }) => {
    const parsed = await fetch(`/api/v1/messages/react/${messageId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return parsed.json();
  }
);

export const unreactMessage = createAsyncThunk(
  "messages/unreact",
  async ({ messageId, userId }: { messageId: string; userId: string }) => {
    const parsed = await fetch(`/api/v1/messages/unreact/${messageId}`, {
      method: "PATCH",
    });
    return parsed.json();
  }
);

export const getReactions = createAsyncThunk(
  "messages/getReactions",
  async (messageId: string) => {
    const parsed = await fetch(`/api/v1/messages/getReacts/${messageId}`);
    return parsed.json();
  }
);

export const editMessage = createAsyncThunk(
  "messages/edit",
  async (data: { messageId: string; content: string }) => {
    const parsed = await fetch(`/api/v1/messages/editMessage`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return parsed.json();
  }
);

export const unsendMessage = createAsyncThunk(
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
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = [...state.messages, action.payload.data];
        }
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getMessages.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.messages = action.payload.data.messages;
        } else if (action.payload?.message === "No messages found") {
          state.messages = [];
        }
      })
      .addCase(getMessages.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(getMoreMessages.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(getMoreMessages.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (action.payload?.success) {
          state.messages = [...state.messages, ...action.payload.data];
        }
      })
      .addCase(getMoreMessages.rejected, (state) => {
        state.loadingMore = false;
      });

    builder
      .addCase(reactMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(reactMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = state.messages.map((message) => {
            if (message._id === action.meta.arg.messageId) {
              if (
                message.reacts.some(
                  (react) => react.user === action.payload.data.user
                )
              ) {
                message.reacts = message.reacts.map((react) => {
                  if (react.user === action.payload.data.user) {
                    react.content = action.payload.data.content;
                  }
                  return react;
                });
              } else {
                message.reacts = [action.payload.data, ...message.reacts];
              }
            }
            return message;
          });
        }
      })
      .addCase(reactMessage.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(unreactMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(unreactMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = state.messages.map((message) => {
            if (message._id === action.meta.arg.messageId) {
              message.reacts = message.reacts.filter(
                (react) => react.user !== action.meta.arg.userId
              );
            }
            return message;
          });
        }
      })
      .addCase(unreactMessage.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getReactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReactions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.reactions = action.payload.data;
        } else if (action.payload?.message === "No reactions found") {
          state.reactions = [];
        }
      })
      .addCase(getReactions.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(editMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = state.messages.map((message) => {
            if (message._id === action.payload.data._id) {
              message.content = action.payload.data.content;
            }
            return message;
          });
        }
      })
      .addCase(editMessage.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(unsendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(unsendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = state.messages.filter(
            (message) => message._id !== action.meta.arg
          );
        }
      })
      .addCase(unsendMessage.rejected, (state) => {
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
