import { MessageSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState: MessageSliceI = {
  messages: [],
  reactions: [],
  loading: false,
  skeletonLoading: false,
  editingMessage: false,
};

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({
    content,
    chatId,
    reply,
    kind,
    attachment,
  }: {
    content?: string;
    chatId: string;
    reply?: string;
    kind?:
      | "message"
      | "location"
      | "image"
      | "video"
      | "audio"
      | "document"
      | "post";
    attachment?: File;
  }) => {
    if (!content && !attachment)
      return {
        success: false,
        message: "message or attachment is required",
        data: null,
        status: 404,
      };
    const formData = new FormData();
    if (content) formData.append("message", content);
    formData.append("chatId", chatId);
    if (reply) formData.append("reply", reply);
    if (attachment) formData.append("attachment", attachment);
    if (kind) formData.append("kind", kind);
    const parsed = await fetch("/api/v1/messages/send", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const sendPost = createAsyncThunk(
  "messages/sharePost",
  async (data: { postId: string; people: string[] }) => {
    const parsed = await fetch(`/api/v1/messages/sharePost`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
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
    setEditingMessage: (state, action) => {
      state.editingMessage = action.payload;
    },
    messageReceived: (state, action) => {
      state.messages = [...state.messages, action.payload].filter(
        (message, index, self) =>
          index === self.findIndex((msg) => msg._id === message._id)
      );
    },
    messageDeleted: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload._id
      );
    },
    messageUpdated: (state, action) => {
      state.messages = state.messages.map((message) => {
        if (message._id === action.payload.message._id) {
          message.content = action.payload.message.content;
        }
        return message;
      });
    },
    reacted: (state, action) => {
      state.messages = state.messages.map((message) => {
        if (message._id === action.payload.messageId) {
          message.reacts = [
            {
              _id: nanoid(),
              user: action.payload.user,
              content: action.payload.content,
            },
            ...message.reacts,
          ];
        }
        return message;
      });
    },
    unreacted: (state, action) => {
      state.messages = state.messages.map((message) => {
        if (message._id === action.payload.messageId) {
          message.reacts = message.reacts.filter(
            (react) => react.user !== action.payload.user
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
      .addCase(sendPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendPost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getMessages.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.messages = [...action.payload.data, ...state.messages].filter(
            (message, index, self) =>
              index === self.findIndex((msg) => msg._id === message._id) &&
              message.chat === action.meta.arg
          );
        } else if (action.payload?.message === "No messages found") {
          state.messages = [];
        }
      })
      .addCase(getMessages.rejected, (state) => {
        state.skeletonLoading = false;
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
        state.editingMessage = false;
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
        state.editingMessage = false;
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
  reacted,
  unreacted,
} = messageSlice.actions;

export default messageSlice.reducer;
