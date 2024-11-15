import { AnonymousMessageSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AnonymousMessageSliceI = {
  messages: [],
  loading: false,
  skeletonLoading: true,
};

export const sendAnonymousMessage = createAsyncThunk(
  "anonymousMessage/sendAnonymousMessage",
  async ({
    content,
    reciever,
    attachment,
  }: {
    content: string;
    reciever: string;
    attachment: File | null;
  }) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("reciever", reciever);
    if (attachment) {
      // check if the file is greater than 50MB
      if (attachment.size > 52428800) {
        return {
          success: false,
          message: "Invalid file size",
          data: null,
          statusCode: 400,
        };
      }
      formData.append("attachment", attachment);
    }
    const parsed = await fetch("/api/v1/anonymousMessages/send", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const getAnonymousMessages = createAsyncThunk(
  "anonymousMessage/getAnonymousMessages",
  async () => {
    const parsed = await fetch("/api/v1/anonymousMessages/get");
    return parsed.json();
  }
);

export const deleteAnonymousMessage = createAsyncThunk(
  "anonymousMessage/deleteAnonymousMessage",
  async (messageId: string) => {
    const parsed = await fetch(`/api/v1/anonymousMessages/${messageId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

const anonymousMessageSlice = createSlice({
  name: "anonymousMessage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendAnonymousMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendAnonymousMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = [...state.messages, action.payload.data];
        }
      })
      .addCase(sendAnonymousMessage.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getAnonymousMessages.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getAnonymousMessages.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.messages = action.payload.data;
        }
      })
      .addCase(getAnonymousMessages.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(deleteAnonymousMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAnonymousMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.messages = state.messages.filter(
            (message) => message._id !== action.meta.arg
          );
        }
      })
      .addCase(deleteAnonymousMessage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default anonymousMessageSlice.reducer;
